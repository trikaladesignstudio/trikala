"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mat4, quat, vec2, vec3 } from "gl-matrix";

import { useScrollContainer } from "@/context/ScrollContainerContext";
import { cn } from "@/lib/utils";

import "./InfiniteMenu.css";

export type InfiniteMenuItem = {
  image: string;
  link?: string;
  title: string;
  description: string;
};

type InfiniteMenuProps = {
  items?: InfiniteMenuItem[];
  scale?: number;
  showOverlay?: boolean;
  onActiveItemChange?: (item: InfiniteMenuItem | null) => void;
  onMovementChange?: (isMoving: boolean) => void;
  onIntroActiveChange?: (isIntroActive: boolean) => void;
};

type IntroPhase = "idle" | "zoomOut" | "hold" | "spin" | "focusIn" | "complete";

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;

    float scale = max(imageAspect / containerAspect,
                     containerAspect / imageAspect);

    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;
    st = clamp(st, 0.0, 1.0);
    st = st * cellSize + cellOffset;

    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

class Face {
  a: number;
  b: number;
  c: number;

  constructor(a: number, b: number, c: number) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  position: vec3;
  normal: vec3;
  uv: vec2;

  constructor(x: number, y: number, z: number) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  vertices: Vertex[] = [];
  faces: Face[] = [];

  addVertex(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  addFace(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  get lastVertex() {
    return this.vertices[this.vertices.length - 1];
  }

  subdivide(divisions = 1) {
    const midPointCache: Record<string, number> = {};
    let f = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array(f.length * 4);

      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      f = newFaces;
    }

    this.faces = f;
    return this;
  }

  spherize(radius = 1) {
    this.vertices.forEach((vertex) => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  get data() {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData,
    };
  }

  get vertexData() {
    return new Float32Array(
      this.vertices.flatMap((v) => Array.from(v.position))
    );
  }

  get normalData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.normal)));
  }

  get uvData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.uv)));
  }

  get indexData() {
    return new Uint16Array(this.faces.flatMap((f) => [f.a, f.b, f.c]));
  }

  getMidPoint(ndxA: number, ndxB: number, cache: Record<string, number>) {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex(
      (a[0] + b[0]) * 0.5,
      (a[1] + b[1]) * 0.5,
      (a[2] + b[2]) * 0.5
    );
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0,
      1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1
    ).addFace(
      0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11,
      10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4,
      9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    steps = Math.max(4, steps);

    const alpha = (2 * Math.PI) / steps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;

    for (let i = 0; i < steps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }
    this.addFace(0, steps, 1);
  }
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaderSources: string[],
  transformFeedbackVaryings: string[] | null,
  attribLocations: Record<string, number> | null
) {
  const program = gl.createProgram();
  if (!program) return null;

  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(
      program,
      transformFeedbackVaryings,
      gl.SEPARATE_ATTRIBS
    );
  }

  if (attribLocations) {
    for (const attrib in attribLocations) {
      gl.bindAttribLocation(program, attribLocations[attrib], attrib);
    }
  }

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocNumElmPairs: [WebGLBuffer, number, number][],
  indices: Uint16Array | null
) {
  const va = gl.createVertexArray();
  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }

  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

function makeBuffer(
  gl: WebGL2RenderingContext,
  sizeOrData: ArrayBufferView,
  usage: number
) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(
  gl: WebGL2RenderingContext,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number
) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

class ArcballControl {
  isPointerDown = false;
  orientation = quat.create();
  pointerRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection: vec3 | undefined;
  EPSILON = 0.1;
  IDENTITY_QUAT = quat.create();

  canvas: HTMLCanvasElement;
  updateCallback: (deltaTime: number) => void;
  pointerPos = vec2.create();
  previousPointerPos = vec2.create();
  _rotationVelocity = 0;
  _combinedQuat = quat.create();

  constructor(
    canvas: HTMLCanvasElement,
    updateCallback?: (deltaTime: number) => void
  ) {
    this.canvas = canvas;
    this.updateCallback = updateCallback || (() => null);

    canvas.addEventListener("pointerdown", (e) => {
      vec2.set(this.pointerPos, e.clientX, e.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
    });
    canvas.addEventListener("pointerup", () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener("pointerleave", () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener("pointermove", (e) => {
      if (this.isPointerDown) {
        vec2.set(this.pointerPos, e.clientX, e.clientY);
      }
    });

    canvas.style.touchAction = "pan-y";
  }

  update(deltaTime: number, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = quat.create();

    if (this.isPointerDown) {
      const INTENSITY = 0.3 * timeScale;
      const ANGLE_AMPLIFICATION = 5 / timeScale;

      const midPointerPos = vec2.sub(
        vec2.create(),
        this.pointerPos,
        this.previousPointerPos
      );
      vec2.scale(midPointerPos, midPointerPos, INTENSITY);

      if (vec2.sqrLen(midPointerPos) > this.EPSILON) {
        vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);

        const p = this.projectOnSphere(midPointerPos);
        const q = this.projectOnSphere(this.previousPointerPos);
        const a = vec3.normalize(vec3.create(), p);
        const b = vec3.normalize(vec3.create(), q);

        vec2.copy(this.previousPointerPos, midPointerPos);

        angleFactor *= ANGLE_AMPLIFICATION;

        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(
          this.pointerRotation,
          this.pointerRotation,
          this.IDENTITY_QUAT,
          INTENSITY
        );
      }
    } else {
      const INTENSITY = 0.1 * timeScale;
      quat.slerp(
        this.pointerRotation,
        this.pointerRotation,
        this.IDENTITY_QUAT,
        INTENSITY
      );

      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.28;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = vec3.squaredDistance(a, b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = quat.multiply(
      quat.create(),
      snapRotation,
      this.pointerRotation
    );
    this.orientation = quat.multiply(
      quat.create(),
      combinedQuat,
      this.orientation
    );
    quat.normalize(this.orientation, this.orientation);

    const RA_INTENSITY = 0.65 * timeScale;
    quat.slerp(
      this._combinedQuat,
      this._combinedQuat,
      combinedQuat,
      RA_INTENSITY
    );
    quat.normalize(this._combinedQuat, this._combinedQuat);

    const rad = Math.acos(this._combinedQuat[3]) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this._combinedQuat[0] / s;
      this.rotationAxis[1] = this._combinedQuat[1] / s;
      this.rotationAxis[2] = this._combinedQuat[2] / s;
    }

    const RV_INTENSITY = 0.65 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  quatFromVectors(
    a: vec3,
    b: vec3,
    out: quat,
    angleFactor = 1
  ) {
    const axis = vec3.cross(vec3.create(), a, b);
    vec3.normalize(axis, axis);
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  projectOnSphere(pos: vec2) {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;

    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;

    if (xySq <= rSq / 2.0) {
      z = Math.sqrt(rSq - xySq);
    } else {
      z = rSq / Math.sqrt(xySq);
    }
    return vec3.fromValues(-x, y, z);
  }
}

class InfiniteGridMenu {
  TARGET_FRAME_DURATION = 1000 / 60;
  SPHERE_RADIUS = 2;

  _time = 0;
  _deltaTime = 0;
  _deltaFrames = 0;
  _frames = 0;
  _rafId = 0;

  canvas: HTMLCanvasElement;
  items: InfiniteMenuItem[];
  onActiveItemChange: (index: number) => void;
  onMovementChange: (isMoving: boolean) => void;
  scaleFactor: number;

  gl!: WebGL2RenderingContext;
  viewportSize = vec2.create();
  drawBufferSize = vec2.create();
  discProgram!: WebGLProgram;
  discLocations!: Record<string, WebGLUniformLocation | GLint | null>;
  discGeo!: DiscGeometry;
  discBuffers!: {
    vertices: Float32Array;
    indices: Uint16Array;
    normals: Float32Array;
    uvs: Float32Array;
  };
  discVAO!: WebGLVertexArrayObject | null;
  icoGeo!: IcosahedronGeometry;
  instancePositions!: vec3[];
  DISC_INSTANCE_COUNT!: number;
  discInstances!: {
    matricesArray: Float32Array;
    matrices: Float32Array[];
    buffer: WebGLBuffer | null;
  };
  worldMatrix = mat4.create();
  tex!: WebGLTexture | null;
  atlasSize = 1;
  control!: ArcballControl;

  camera = {
    matrix: mat4.create(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: vec3.fromValues(0, 0, 3),
    up: vec3.fromValues(0, 1, 0),
    matrices: {
      view: mat4.create(),
      projection: mat4.create(),
      inversProjection: mat4.create(),
    },
  };

  nearestVertexIndex: number | null = null;
  smoothRotationVelocity = 0;
  movementActive = false;
  introPhase: IntroPhase = "idle";
  introElapsed = 0;
  introPlayed = false;
  introCameraZ = 3;
  introProjectionHeight = 0.7;
  onIntroActiveChange?: (isIntroActive: boolean) => void;
  onTexturesReady?: () => void;
  interactionLocked = false;

  constructor(
    canvas: HTMLCanvasElement,
    items: InfiniteMenuItem[],
    onActiveItemChange: (index: number) => void,
    onMovementChange: (isMoving: boolean) => void,
    onInit: ((sk: InfiniteGridMenu) => void) | null = null,
    scale = 1.0,
    onIntroActiveChange?: (isIntroActive: boolean) => void,
    onTexturesReady?: () => void
  ) {
    this.canvas = canvas;
    this.items = items.length ? items : defaultItems;
    this.onActiveItemChange = onActiveItemChange;
    this.onMovementChange = onMovementChange;
    this.onIntroActiveChange = onIntroActiveChange;
    this.onTexturesReady = onTexturesReady;
    this.scaleFactor = scale;
    this.camera.position[2] = 3 * scale;
    this.introCameraZ = 3 * scale;
    this.introProjectionHeight = this.SPHERE_RADIUS * 0.35;
    this._init(onInit);
  }

  destroy() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
    }
  }

  playIntroSequence() {
    if (this.introPlayed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.introPlayed = true;
      this.introPhase = "complete";
      return;
    }
    this.introPlayed = true;
    this.introPhase = "zoomOut";
    this.introElapsed = 0;
    this._setInteractionLocked(true);
    this.onIntroActiveChange?.(true);
  }

  _setInteractionLocked(locked: boolean) {
    this.interactionLocked = locked;
    this.canvas.style.pointerEvents = locked ? "none" : "auto";
  }

  _updateIntro(deltaTime: number) {
    if (this.introPhase === "idle" || this.introPhase === "complete") return;

    this.introElapsed += deltaTime;
    const idleZ = 3 * this.scaleFactor;
    const introPeakZ = 11 * this.scaleFactor;
    const idleHeight = this.SPHERE_RADIUS * 0.35;
    const introPeakHeight = this.SPHERE_RADIUS * 1.35;

    if (this.introPhase === "zoomOut") {
      const duration = 1400;
      const t = Math.min(1, this.introElapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      this.introCameraZ = idleZ + (introPeakZ - idleZ) * eased;
      this.introProjectionHeight =
        idleHeight + (introPeakHeight - idleHeight) * eased;
      if (t >= 1) {
        this.introPhase = "hold";
        this.introElapsed = 0;
      }
      return;
    }

    if (this.introPhase === "hold") {
      this.introCameraZ = introPeakZ;
      this.introProjectionHeight = introPeakHeight;
      const duration = 550;
      if (this.introElapsed >= duration) {
        this.introPhase = "spin";
        this.introElapsed = 0;
      }
      return;
    }

    if (this.introPhase === "spin") {
      this.introCameraZ = introPeakZ;
      this.introProjectionHeight = introPeakHeight;
      const duration = 2600;
      const t = Math.min(1, this.introElapsed / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      const spinAngle = eased * Math.PI * 3;
      quat.setAxisAngle(this.control.orientation, [0, 1, 0], spinAngle);
      if (t >= 1) {
        this.introPhase = "focusIn";
        this.introElapsed = 0;
      }
      return;
    }

    if (this.introPhase === "focusIn") {
      const duration = 1700;
      const t = Math.min(1, this.introElapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      this.introCameraZ = introPeakZ + (idleZ - introPeakZ) * eased;
      this.introProjectionHeight =
        introPeakHeight + (idleHeight - introPeakHeight) * eased;
      if (t >= 1) {
        this.introPhase = "complete";
        this.introCameraZ = idleZ;
        this.introProjectionHeight = idleHeight;
        this._setInteractionLocked(false);
        this.onIntroActiveChange?.(false);
      }
    }
  }

  resize() {
    this.viewportSize = vec2.set(
      this.viewportSize,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );

    const gl = this.gl;
    const needsResize = resizeCanvasToDisplaySize(
      gl.canvas as HTMLCanvasElement
    );
    if (needsResize) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    this._updateProjectionMatrix(gl);
  }

  run(time = 0) {
    this._deltaTime = Math.min(32, time - this._time);
    this._time = time;
    this._deltaFrames = this._deltaTime / this.TARGET_FRAME_DURATION;
    this._frames += this._deltaFrames;

    this._animate(this._deltaTime);
    this._render();

    this._rafId = requestAnimationFrame((t) => this.run(t));
  }

  _init(onInit: ((sk: InfiniteGridMenu) => void) | null) {
    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
    });
    if (!gl) {
      throw new Error("No WebGL 2 context!");
    }
    this.gl = gl;

    this.viewportSize = vec2.fromValues(
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );
    this.drawBufferSize = vec2.clone(this.viewportSize);

    const program = createProgram(
      gl,
      [discVertShaderSource, discFragShaderSource],
      null,
      {
        aModelPosition: 0,
        aModelNormal: 1,
        aModelUvs: 2,
        aInstanceMatrix: 3,
      }
    );
    if (!program) {
      throw new Error("Failed to create WebGL program");
    }
    this.discProgram = program;

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram, "aModelPosition"),
      aModelUvs: gl.getAttribLocation(this.discProgram, "aModelUvs"),
      aInstanceMatrix: gl.getAttribLocation(
        this.discProgram,
        "aInstanceMatrix"
      ),
      uWorldMatrix: gl.getUniformLocation(this.discProgram, "uWorldMatrix"),
      uViewMatrix: gl.getUniformLocation(this.discProgram, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(
        this.discProgram,
        "uProjectionMatrix"
      ),
      uCameraPosition: gl.getUniformLocation(
        this.discProgram,
        "uCameraPosition"
      ),
      uScaleFactor: gl.getUniformLocation(this.discProgram, "uScaleFactor"),
      uRotationAxisVelocity: gl.getUniformLocation(
        this.discProgram,
        "uRotationAxisVelocity"
      ),
      uTex: gl.getUniformLocation(this.discProgram, "uTex"),
      uFrames: gl.getUniformLocation(this.discProgram, "uFrames"),
      uItemCount: gl.getUniformLocation(this.discProgram, "uItemCount"),
      uAtlasSize: gl.getUniformLocation(this.discProgram, "uAtlasSize"),
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    const posBuffer = makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW);
    const uvBuffer = makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW);
    this.discVAO = makeVertexArray(
      gl,
      [
        [posBuffer, this.discLocations.aModelPosition as number, 3],
        [uvBuffer, this.discLocations.aModelUvs as number, 2],
      ],
      this.discBuffers.indices
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this._initDiscInstances(this.DISC_INSTANCE_COUNT);

    this._initTexture();

    this.control = new ArcballControl(this.canvas, (deltaTime) =>
      this._onControlUpdate(deltaTime)
    );

    this._updateCameraMatrix();
    this._updateProjectionMatrix(gl);
    this.resize();

    if (onInit) onInit(this);
  }

  _initTexture() {
    const gl = this.gl;
    this.tex = createAndSetupTexture(
      gl,
      gl.LINEAR,
      gl.LINEAR,
      gl.CLAMP_TO_EDGE,
      gl.CLAMP_TO_EDGE
    );

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = 256;

    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    Promise.all(
      this.items.map(
        (item) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => {
              const fallback = new Image();
              fallback.onload = () => resolve(fallback);
              fallback.src = "/static/logo.webp";
            };
            img.src = item.image;
          })
      )
    ).then((images) => {
      images.forEach((img, i) => {
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;
        ctx.drawImage(img, x, y, cellSize, cellSize);
      });

      if (this.tex) {
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          canvas
        );
        gl.generateMipmap(gl.TEXTURE_2D);
      }

      this.onTexturesReady?.();
    });
  }

  _initDiscInstances(count: number) {
    const gl = this.gl;
    this.discInstances = {
      matricesArray: new Float32Array(count * 16),
      matrices: [],
      buffer: gl.createBuffer(),
    };
    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(
        this.discInstances.matricesArray.buffer,
        i * 16 * 4,
        16
      );
      instanceMatrixArray.set(mat4.create());
      this.discInstances.matrices.push(instanceMatrixArray);
    }
    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.discInstances.matricesArray.byteLength,
      gl.DYNAMIC_DRAW
    );
    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = (this.discLocations.aInstanceMatrix as number) + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  _animate(deltaTime: number) {
    const gl = this.gl;

    this._updateIntro(deltaTime);

    const introActive =
      this.introPhase !== "idle" && this.introPhase !== "complete";

    if (introActive) {
      this.camera.position[2] +=
        (this.introCameraZ - this.camera.position[2]) / 9;
      this._updateCameraMatrix();
      this._updateProjectionMatrix(gl);

      const nearestVertexIndex = this._findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
    } else {
      this.control.update(deltaTime, this.TARGET_FRAME_DURATION);
    }

    const positions = this.instancePositions.map((p) =>
      vec3.transformQuat(vec3.create(), p, this.control.orientation)
    );
    const scale = 0.25;
    const SCALE_INTENSITY = 0.6;
    positions.forEach((p, ndx) => {
      const s =
        (Math.abs(p[2]) / this.SPHERE_RADIUS) * SCALE_INTENSITY +
        (1 - SCALE_INTENSITY);
      const finalScale = s * scale;
      const matrix = mat4.create();
      mat4.multiply(
        matrix,
        matrix,
        mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p))
      );
      mat4.multiply(
        matrix,
        matrix,
        mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0])
      );
      mat4.multiply(
        matrix,
        matrix,
        mat4.fromScaling(mat4.create(), [
          finalScale,
          finalScale,
          finalScale,
        ])
      );
      mat4.multiply(
        matrix,
        matrix,
        mat4.fromTranslation(mat4.create(), [0, 0, -this.SPHERE_RADIUS])
      );

      mat4.copy(this.discInstances.matrices[ndx], matrix);
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  _render() {
    const gl = this.gl;
    gl.useProgram(this.discProgram);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(26 / 255, 26 / 255, 26 / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(
      this.discLocations.uWorldMatrix as WebGLUniformLocation,
      false,
      this.worldMatrix
    );
    gl.uniformMatrix4fv(
      this.discLocations.uViewMatrix as WebGLUniformLocation,
      false,
      this.camera.matrices.view
    );
    gl.uniformMatrix4fv(
      this.discLocations.uProjectionMatrix as WebGLUniformLocation,
      false,
      this.camera.matrices.projection
    );
    gl.uniform3f(
      this.discLocations.uCameraPosition as WebGLUniformLocation,
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity as WebGLUniformLocation,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1
    );

    gl.uniform1i(
      this.discLocations.uItemCount as WebGLUniformLocation,
      this.items.length
    );
    gl.uniform1i(
      this.discLocations.uAtlasSize as WebGLUniformLocation,
      this.atlasSize
    );

    gl.uniform1f(
      this.discLocations.uFrames as WebGLUniformLocation,
      this._frames
    );
    gl.uniform1f(
      this.discLocations.uScaleFactor as WebGLUniformLocation,
      this.scaleFactor
    );
    gl.uniform1i(this.discLocations.uTex as WebGLUniformLocation, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT
    );
  }

  _updateCameraMatrix() {
    mat4.targetTo(
      this.camera.matrix,
      this.camera.position,
      [0, 0, 0],
      this.camera.up
    );
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  _updateProjectionMatrix(gl: WebGL2RenderingContext) {
    const canvas = gl.canvas as HTMLCanvasElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    const introActive =
      this.introPhase !== "idle" && this.introPhase !== "complete";
    const height = introActive
      ? this.introProjectionHeight
      : this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position[2];
    if (this.camera.aspect > 1) {
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      this.camera.fov =
        2 * Math.atan(height / this.camera.aspect / distance);
    }
    mat4.perspective(
      this.camera.matrices.projection,
      this.camera.fov,
      this.camera.aspect,
      this.camera.near,
      this.camera.far
    );
    mat4.invert(
      this.camera.matrices.inversProjection,
      this.camera.matrices.projection
    );
  }

  _onControlUpdate(deltaTime: number) {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 3.5 / timeScale;
    let cameraTargetZ = 3 * this.scaleFactor;

    const introActive =
      this.introPhase !== "idle" && this.introPhase !== "complete";

    const isMoving =
      !introActive &&
      !this.interactionLocked &&
      (this.control.isPointerDown ||
        Math.abs(this.smoothRotationVelocity) > 0.01);

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (introActive) {
      cameraTargetZ = this.introCameraZ;
      damping = 5 / timeScale;

      const nearestVertexIndex = this._findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
    } else if (!this.control.isPointerDown) {
      const nearestVertexIndex = this._findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      const snapDirection = vec3.normalize(
        vec3.create(),
        this._getVertexWorldPosition(nearestVertexIndex)
      );
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 4.5 / timeScale;
    }

    this.camera.position[2] +=
      (cameraTargetZ - this.camera.position[2]) / damping;
    this._updateCameraMatrix();
    this._updateProjectionMatrix(this.gl);
  }

  _findNearestVertexIndex() {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(
      quat.create(),
      this.control.orientation
    );
    const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);

    let maxD = -1;
    let nearestVertexIndex = 0;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }
    return nearestVertexIndex;
  }

  _getVertexWorldPosition(index: number) {
    const nearestVertexPos = this.instancePositions[index];
    return vec3.transformQuat(
      vec3.create(),
      nearestVertexPos,
      this.control.orientation
    );
  }
}

const defaultItems: InfiniteMenuItem[] = [
  {
    image: "/static/logo.webp",
    link: "/projects",
    title: "Featured Work",
    description: "Explore our portfolio.",
  },
];

export default function InfiniteMenu({
  items = [],
  scale = 1.0,
  showOverlay = false,
  onActiveItemChange,
  onMovementChange,
  onIntroActiveChange,
}: InfiniteMenuProps) {
  const scrollContainer = useScrollContainer();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sketchRef = useRef<InfiniteGridMenu | null>(null);
  const [activeItem, setActiveItem] = useState<InfiniteMenuItem | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(false);
  const [texturesReady, setTexturesReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setTexturesReady(false);

    const menuItems = items.length ? items : defaultItems;

    const handleActiveItem = (index: number) => {
      const itemIndex = index % menuItems.length;
      const item = menuItems[itemIndex];
      setActiveItem(item);
      onActiveItemChange?.(item);
    };

    const handleMovementChange = (moving: boolean) => {
      setIsMoving(moving);
      onMovementChange?.(moving);
    };

    const handleIntroActive = (introActive: boolean) => {
      setIsIntroActive(introActive);
      onIntroActiveChange?.(introActive);
    };

    const handleTexturesReady = () => {
      setTexturesReady(true);
    };

    const sketch = new InfiniteGridMenu(
      canvas,
      menuItems,
      handleActiveItem,
      handleMovementChange,
      (sk) => sk.run(),
      scale,
      handleIntroActive,
      handleTexturesReady
    );
    sketchRef.current = sketch;

    const handleResize = () => sketch.resize();
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sketch.destroy();
      sketchRef.current = null;
    };
  }, [items, scale, onActiveItemChange, onMovementChange, onIntroActiveChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio >= 0.72) {
          sketchRef.current?.playIntroSequence();
        }
      },
      {
        root: scrollContainer?.current ?? null,
        threshold: [0.72, 0.85, 1],
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [scrollContainer]);

  const hasProjectLink = Boolean(activeItem?.link?.trim());
  const textVisible = !isMoving;
  const arrowVisible = !isMoving && hasProjectLink;
  const projectLink = activeItem?.link?.trim() ?? "";
  const isExternalLink = projectLink.startsWith("http");

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        id="infinite-grid-menu-canvas"
        ref={canvasRef}
        className={cn(
          "transition-opacity duration-500",
          texturesReady ? "opacity-100" : "opacity-0"
        )}
      />

      {showOverlay && activeItem && !isIntroActive && (
        <>
          {activeItem.title ? (
            <h2
              className={cn("face-title", textVisible ? "active" : "inactive")}
            >
              {activeItem.title}
            </h2>
          ) : null}

          {activeItem.description ? (
            <p
              className={cn(
                "face-description",
                textVisible ? "active" : "inactive"
              )}
            >
              {activeItem.description}
            </p>
          ) : null}

          {arrowVisible && (
            isExternalLink ? (
              <a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "action-button",
                  "active",
                  isIntroActive && "action-button--hero"
                )}
                aria-label={
                  activeItem.title
                    ? `View ${activeItem.title}`
                    : "View project"
                }
              >
                <span className="action-button-icon" aria-hidden="true">
                  &#x2197;
                </span>
              </a>
            ) : (
              <Link
                href={projectLink}
                className={cn(
                  "action-button",
                  "active",
                  isIntroActive && "action-button--hero"
                )}
                aria-label={
                  activeItem.title
                    ? `View ${activeItem.title}`
                    : "View project"
                }
              >
                <span className="action-button-icon" aria-hidden="true">
                  &#x2197;
                </span>
              </Link>
            )
          )}
        </>
      )}
    </div>
  );
}
