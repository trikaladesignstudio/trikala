"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mat4, quat, vec2, vec3 } from "gl-matrix";

import {
  GLOBE_HINT_TEXT,
  INTRO_CAMERA_DEFAULT,
  INTRO_CAMERA_ZOOM_OUT,
  INTRO_READY_DURATION_MS,
  INTRO_ROTATION_VELOCITY,
  INTRO_SETTLE_DURATION_MS,
  INTRO_SPIN_AXIS,
  INTRO_SPIN_DURATION_MS,
  INTRO_SPIN_ROTATIONS,
  MOBILE_GLOBE_MAX_WIDTH,
} from "@/lib/featuredGlobeIntro";
import { FALLBACK_MENU_ITEMS } from "@/lib/heroFeaturedUtils";
import { cn } from "@/lib/utils";
import { useScrollContainer } from "@/context/ScrollContainerContext";

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
  introPrepareRequested?: boolean;
  introRequested?: boolean;
  introPlaying?: boolean;
  introComplete?: boolean;
  onIntroComplete?: () => void;
};

type IntroMode = "idle" | "ready" | "spin" | "settle" | "done";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

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

const PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function loadMenuImage(src: string, ms = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (img: HTMLImageElement) => {
      if (settled) return;
      settled = true;
      resolve(img);
    };
    const timer = setTimeout(() => {
      const img = new Image();
      img.src = PLACEHOLDER;
      finish(img);
    }, ms);
    const tryLoad = (url: string, cors: boolean) => {
      const img = new Image();
      if (cors) img.crossOrigin = "anonymous";
      img.onload = () => {
        clearTimeout(timer);
        finish(img);
      };
      img.onerror = () => {
        if (url !== "/static/logo.webp") tryLoad("/static/logo.webp", false);
        else {
          clearTimeout(timer);
          const fallback = new Image();
          fallback.src = PLACEHOLDER;
          finish(fallback);
        }
      };
      img.src = url;
    };
    const cors =
      src.startsWith("http") &&
      (typeof window === "undefined" ||
        new URL(src).origin !== window.location.origin);
    tryLoad(src, cors);
  });
}

function drawCoverSquare(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const side = Math.min(iw, ih);
  const sx = (iw - side) / 2;
  const sy = (ih - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, x, y, size, size);
}

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
      const newFaces = new Array<Face>(f.length * 4);

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
    const t = (Math.sqrt(5) * 0.5 + 0.5);
    this.addVertex(
      -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t,
      0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1
    ).addFace(
      0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11,
      10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
      4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
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
      if (i > 0) this.addFace(0, i, i + 1);
    }
    this.addFace(0, steps, 1);
  }
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaderSources: string[],
  attribLocations: Record<string, number>
) {
  const program = gl.createProgram();
  if (!program) return null;

  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });

  for (const attrib in attribLocations) {
    gl.bindAttribLocation(program, attribLocations[attrib], attrib);
  }

  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocNumElmPairs: [WebGLBuffer | null, number, number][],
  indices?: Uint16Array
) {
  const va = gl.createVertexArray();
  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1 || !buffer) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
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
  data: ArrayBufferView,
  usage: number
) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, usage);
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
  static DRAG_COMMIT_PX = 12;
  static SCROLL_VERTICAL_BIAS = 1.15;

  pointerEnabled = true;
  scrollFriendly =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  isPointerDown = false;
  activePointerId: number | null = null;
  pointerStart = vec2.create();
  orientation = quat.create();
  pointerRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection: vec3 | null = null;
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
    updateCallback: (deltaTime: number) => void
  ) {
    this.canvas = canvas;
    this.updateCallback = updateCallback;
    canvas.style.touchAction = this.scrollFriendly ? "pan-y" : "none";

    const endPointer = (e: PointerEvent) => {
      if (this.activePointerId !== null && e.pointerId !== this.activePointerId) {
        return;
      }
      this.releasePointer();
    };

    canvas.addEventListener("pointerdown", (e) => {
      if (!this.pointerEnabled) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      this.activePointerId = e.pointerId;
      vec2.set(this.pointerStart, e.clientX, e.clientY);
      vec2.set(this.pointerPos, e.clientX, e.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);

      if (!this.scrollFriendly) {
        this.isPointerDown = true;
        canvas.setPointerCapture(e.pointerId);
      }
    });
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);
    canvas.addEventListener("pointerleave", endPointer);
    canvas.addEventListener("pointermove", (e) => {
      if (!this.pointerEnabled) return;
      if (this.activePointerId === null || e.pointerId !== this.activePointerId) {
        return;
      }

      if (this.scrollFriendly && !this.isPointerDown) {
        const dx = e.clientX - this.pointerStart[0];
        const dy = e.clientY - this.pointerStart[1];
        const distance = Math.hypot(dx, dy);
        if (distance < ArcballControl.DRAG_COMMIT_PX) return;

        if (Math.abs(dy) > Math.abs(dx) * ArcballControl.SCROLL_VERTICAL_BIAS) {
          this.releasePointer();
          return;
        }

        this.isPointerDown = true;
        vec2.set(this.pointerPos, e.clientX, e.clientY);
        vec2.copy(this.previousPointerPos, this.pointerPos);
        canvas.setPointerCapture(e.pointerId);
        return;
      }

      if (this.isPointerDown) {
        vec2.set(this.pointerPos, e.clientX, e.clientY);
      }
    });
  }

  releasePointer() {
    if (this.activePointerId !== null) {
      try {
        this.canvas.releasePointerCapture(this.activePointerId);
      } catch {
        /* pointer may not be captured */
      }
    }
    this.activePointerId = null;
    this.isPointerDown = false;
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
        const p = this.project(midPointerPos);
        const q = this.project(this.previousPointerPos);
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
        const SNAPPING_INTENSITY = 0.2;
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

    const RA_INTENSITY = 0.8 * timeScale;
    quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, RA_INTENSITY);
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

    const RV_INTENSITY = 0.5 * timeScale;
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
    quat.setAxisAngle(out, axis, Math.acos(d) * angleFactor);
  }

  project(pos: vec2) {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;
    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;
    z = xySq <= rSq / 2.0 ? Math.sqrt(rSq - xySq) : rSq / Math.sqrt(xySq);
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
  discLocations!: Record<string, WebGLUniformLocation | number>;
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
  tex: WebGLTexture | null = null;
  atlasSize = 1;
  control!: ArcballControl;
  nearestVertexIndex: number | null = null;
  smoothRotationVelocity = 0;
  movementActive = false;
  introMode: IntroMode = "idle";
  introSpinAxis = vec3.create();
  introElapsed = 0;
  introSettleElapsed = 0;
  introReadyElapsed = 0;
  introReadyDone = false;
  spinQueued = false;
  introPrevAngle = 0;
  introCompleteCallback: (() => void) | null = null;

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

  constructor(
    canvas: HTMLCanvasElement,
    items: InfiniteMenuItem[],
    onActiveItemChange: (index: number) => void,
    onMovementChange: (isMoving: boolean) => void,
    onInit: ((sk: InfiniteGridMenu) => void) | null = null,
    scale = 1.0
  ) {
    this.canvas = canvas;
    this.items = items.length ? items : FALLBACK_MENU_ITEMS;
    this.onActiveItemChange = onActiveItemChange;
    this.onMovementChange = onMovementChange;
    this.scaleFactor = scale;
    this.camera.position[2] = INTRO_CAMERA_DEFAULT * scale;
    vec3.normalize(this.introSpinAxis, vec3.fromValues(...INTRO_SPIN_AXIS));
    this.init(onInit);
  }

  prepareIntro() {
    if (this.introMode !== "idle") return;
    this.introMode = "ready";
    this.introReadyElapsed = 0;
    this.introReadyDone = false;
    this.control.pointerEnabled = false;
    this.control.isPointerDown = false;
    this.control.snapTargetDirection = null;
    this.movementActive = true;
    this.onMovementChange(true);
  }

  queueSpin(onComplete?: () => void) {
    this.introCompleteCallback = onComplete ?? null;
    this.spinQueued = true;
    if (this.introMode === "ready" && this.introReadyDone) {
      this.beginSpin();
    } else if (this.introMode === "idle") {
      this.prepareIntro();
    }
  }

  beginSpin() {
    if (this.introMode === "spin" || this.introMode === "settle" || this.introMode === "done") {
      return;
    }
    this.introMode = "spin";
    this.introElapsed = 0;
    this.introSettleElapsed = 0;
    this.introPrevAngle = 0;
    this.control.pointerEnabled = false;
    this.control.isPointerDown = false;
    this.control.snapTargetDirection = null;
    this.camera.position[2] = INTRO_CAMERA_ZOOM_OUT * this.scaleFactor;
    this.updateCameraMatrix();
    this.movementActive = true;
    this.onMovementChange(true);
  }

  startIntro(onComplete?: () => void) {
    this.queueSpin(onComplete);
  }

  completeIntro() {
    this.introMode = "done";
    this.control.pointerEnabled = true;
    this.control.rotationVelocity = 0;
    this.smoothRotationVelocity = 0;
    this.camera.position[2] = INTRO_CAMERA_DEFAULT * this.scaleFactor;
    this.updateCameraMatrix();
    this.movementActive = false;
    this.onMovementChange(false);
    const cb = this.introCompleteCallback;
    this.introCompleteCallback = null;
    cb?.();
  }

  updateIntro(deltaTime: number) {
    if (this.introMode === "ready") {
      this.introReadyElapsed += deltaTime;
      const t = Math.min(1, this.introReadyElapsed / INTRO_READY_DURATION_MS);
      const zoomOutZ = INTRO_CAMERA_ZOOM_OUT * this.scaleFactor;
      const defaultZ = INTRO_CAMERA_DEFAULT * this.scaleFactor;
      const targetZ = defaultZ + (zoomOutZ - defaultZ) * easeOutCubic(t);
      this.camera.position[2] += (targetZ - this.camera.position[2]) / 6;
      this.updateCameraMatrix();

      if (t >= 1) {
        this.introReadyDone = true;
        this.camera.position[2] = zoomOutZ;
        this.updateCameraMatrix();
        if (this.spinQueued) this.beginSpin();
      }
      return;
    }

    if (this.introMode === "spin") {
      this.introElapsed += deltaTime;
      const t = Math.min(1, this.introElapsed / INTRO_SPIN_DURATION_MS);
      const eased = easeInOutCubic(t);
      const targetAngle = eased * Math.PI * 2 * INTRO_SPIN_ROTATIONS;
      const deltaAngle = targetAngle - this.introPrevAngle;
      this.introPrevAngle = targetAngle;

      const spinQuat = quat.create();
      quat.setAxisAngle(spinQuat, this.introSpinAxis, deltaAngle);
      this.control.orientation = quat.multiply(
        quat.create(),
        spinQuat,
        this.control.orientation
      );
      quat.normalize(this.control.orientation, this.control.orientation);

      vec3.copy(this.control.rotationAxis, this.introSpinAxis);
      const spinIntensity = 1 - Math.abs(2 * t - 1);
      this.control.rotationVelocity = INTRO_ROTATION_VELOCITY * spinIntensity;
      this.smoothRotationVelocity = this.control.rotationVelocity;

      this.onControlUpdate(deltaTime);

      if (t >= 1) {
        this.introMode = "settle";
        this.introSettleElapsed = 0;
        const nearestVertexIndex = this.findNearestVertexIndex();
        const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
        this.onActiveItemChange(itemIndex);
        this.control.snapTargetDirection = vec3.normalize(
          vec3.create(),
          this.getVertexWorldPosition(nearestVertexIndex)
        );
      }
      return;
    }

    if (this.introMode === "settle") {
      this.introSettleElapsed += deltaTime;
      const t = Math.min(1, this.introSettleElapsed / INTRO_SETTLE_DURATION_MS);
      this.control.update(deltaTime, this.TARGET_FRAME_DURATION);

      this.control.rotationVelocity *= 0.92;
      this.smoothRotationVelocity *= 0.9;

      if (t >= 1) {
        this.completeIntro();
      }
    }
  }

  destroy() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  resize() {
    this.viewportSize = vec2.set(
      this.viewportSize,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );
    const needsResize = resizeCanvasToDisplaySize(this.canvas);
    if (needsResize) {
      this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    }
    this.updateProjectionMatrix();
  }

  run(time = 0) {
    this._deltaTime = Math.min(32, time - this._time);
    this._time = time;
    this._deltaFrames = this._deltaTime / this.TARGET_FRAME_DURATION;
    this._frames += this._deltaFrames;
    this.animate(this._deltaTime);
    this.render();
    this._rafId = requestAnimationFrame((t) => this.run(t));
  }

  init(onInit: ((sk: InfiniteGridMenu) => void) | null) {
    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
    });
    if (!gl) throw new Error("No WebGL 2 context!");
    this.gl = gl;

    this.viewportSize = vec2.fromValues(
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );
    this.drawBufferSize = vec2.clone(this.viewportSize);

    const program = createProgram(gl, [discVertShaderSource, discFragShaderSource], {
      aModelPosition: 0,
      aModelNormal: 1,
      aModelUvs: 2,
      aInstanceMatrix: 3,
    });
    if (!program) throw new Error("Failed to create WebGL program");
    this.discProgram = program;

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram, "aModelPosition"),
      aModelUvs: gl.getAttribLocation(this.discProgram, "aModelUvs"),
      aInstanceMatrix: gl.getAttribLocation(this.discProgram, "aInstanceMatrix"),
      uWorldMatrix: gl.getUniformLocation(this.discProgram, "uWorldMatrix")!,
      uViewMatrix: gl.getUniformLocation(this.discProgram, "uViewMatrix")!,
      uProjectionMatrix: gl.getUniformLocation(this.discProgram, "uProjectionMatrix")!,
      uCameraPosition: gl.getUniformLocation(this.discProgram, "uCameraPosition")!,
      uRotationAxisVelocity: gl.getUniformLocation(this.discProgram, "uRotationAxisVelocity")!,
      uTex: gl.getUniformLocation(this.discProgram, "uTex")!,
      uItemCount: gl.getUniformLocation(this.discProgram, "uItemCount")!,
      uAtlasSize: gl.getUniformLocation(this.discProgram, "uAtlasSize")!,
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition as number, 3],
        [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs as number, 2],
      ],
      this.discBuffers.indices
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this.initDiscInstances(this.DISC_INSTANCE_COUNT);
    this.initTexture();
    this.control = new ArcballControl(this.canvas, (dt) => this.onControlUpdate(dt));
    this.updateCameraMatrix();
    this.updateProjectionMatrix();
    this.resize();
    if (onInit) onInit(this);
  }

  initTexture() {
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
    const atlasCanvas = document.createElement("canvas");
    const ctx = atlasCanvas.getContext("2d");
    if (!ctx) return;

    const cellSize = 512;
    atlasCanvas.width = this.atlasSize * cellSize;
    atlasCanvas.height = this.atlasSize * cellSize;

    const urls = this.items.map((item) => item.image);
    void Promise.all(urls.map((url) => loadMenuImage(url)))
      .then((images) => {
        images.forEach((img, i) => {
          const x = (i % this.atlasSize) * cellSize;
          const y = Math.floor(i / this.atlasSize) * cellSize;
          drawCoverSquare(ctx, img, x, y, cellSize);
        });
        if (this.tex) {
          gl.bindTexture(gl.TEXTURE_2D, this.tex);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            atlasCanvas
          );
          gl.generateMipmap(gl.TEXTURE_2D);
        }
      })
      .catch(() => {});
  }

  initDiscInstances(count: number) {
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

  animate(deltaTime: number) {
    const gl = this.gl;
    if (this.introMode === "spin" || this.introMode === "settle" || this.introMode === "ready") {
      this.updateIntro(deltaTime);
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
        mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale])
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

  render() {
    const gl = this.gl;
    gl.useProgram(this.discProgram);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view);
    gl.uniformMatrix4fv(
      this.discLocations.uProjectionMatrix,
      false,
      this.camera.matrices.projection
    );
    gl.uniform3f(
      this.discLocations.uCameraPosition,
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1
    );
    gl.uniform1i(this.discLocations.uItemCount, Math.max(1, this.items.length));
    gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);
    gl.uniform1i(this.discLocations.uTex, 0);
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

  updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  updateProjectionMatrix() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position[2];
    this.camera.fov =
      this.camera.aspect > 1
        ? 2 * Math.atan(height / distance)
        : 2 * Math.atan(height / this.camera.aspect / distance);
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

  onControlUpdate(deltaTime: number) {
    if (this.introMode === "ready") {
      if (!this.movementActive) {
        this.movementActive = true;
        this.onMovementChange(true);
      }
      return;
    }

    if (this.introMode === "spin") {
      const zoomOutZ = INTRO_CAMERA_ZOOM_OUT * this.scaleFactor;
      this.camera.position[2] += (zoomOutZ - this.camera.position[2]) / 6;
      this.updateCameraMatrix();
      if (!this.movementActive) {
        this.movementActive = true;
        this.onMovementChange(true);
      }
      return;
    }

    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = INTRO_CAMERA_DEFAULT * this.scaleFactor;

    if (this.introMode === "settle") {
      const t = Math.min(1, this.introSettleElapsed / INTRO_SETTLE_DURATION_MS);
      const zoomOutZ = INTRO_CAMERA_ZOOM_OUT * this.scaleFactor;
      const defaultZ = INTRO_CAMERA_DEFAULT * this.scaleFactor;
      cameraTargetZ = defaultZ + (zoomOutZ - defaultZ) * (1 - easeOutCubic(t));
      damping = 6 / timeScale;
    }

    const isMoving =
      this.introMode === "settle" ||
      this.control.isPointerDown ||
      Math.abs(this.smoothRotationVelocity) > 0.01;

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      this.control.snapTargetDirection = vec3.normalize(
        vec3.create(),
        this.getVertexWorldPosition(nearestVertexIndex)
      );
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }

    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this.updateCameraMatrix();
  }

  findNearestVertexIndex() {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
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

  getVertexWorldPosition(index: number) {
    return vec3.transformQuat(
      vec3.create(),
      this.instancePositions[index],
      this.control.orientation
    );
  }
}

export default function InfiniteMenu({
  items = [],
  scale = 1.0,
  showOverlay = false,
  introPrepareRequested = false,
  introRequested = false,
  introPlaying = false,
  introComplete = false,
  onIntroComplete,
}: InfiniteMenuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sketchRef = useRef<InfiniteGridMenu | null>(null);
  const scrollContainer = useScrollContainer();
  const introPrepareStartedRef = useRef(false);
  const introStartedRef = useRef(false);
  const [activeItem, setActiveItem] = useState<InfiniteMenuItem | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobileOverlay, setIsMobileOverlay] = useState(false);

  useEffect(() => {
    const root = scrollContainer?.current;
    if (!root) return;

    let timeout = 0;
    const onScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setIsScrolling(false), 180);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.clearTimeout(timeout);
    };
  }, [scrollContainer]);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_GLOBE_MAX_WIDTH - 1}px)`);
    const update = () => setIsMobileOverlay(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const menuItems = items.length ? items : FALLBACK_MENU_ITEMS;

    const handleActiveItem = (index: number) => {
      setActiveItem(menuItems[index % menuItems.length] ?? null);
    };

    const sketch = new InfiniteGridMenu(
      canvas,
      menuItems,
      handleActiveItem,
      setIsMoving,
      (sk) => sk.run(),
      scale
    );
    sketchRef.current = sketch;

    const handleResize = () => sketch.resize();
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sketch.destroy();
      sketchRef.current = null;
      introPrepareStartedRef.current = false;
      introStartedRef.current = false;
    };
  }, [items, scale]);

  useEffect(() => {
    if (!introPrepareRequested || introPrepareStartedRef.current) return;

    let raf = 0;
    const tryPrepare = () => {
      const sketch = sketchRef.current;
      if (!sketch) {
        raf = requestAnimationFrame(tryPrepare);
        return;
      }
      introPrepareStartedRef.current = true;
      sketch.prepareIntro();
    };

    tryPrepare();
    return () => cancelAnimationFrame(raf);
  }, [introPrepareRequested]);

  useEffect(() => {
    if (!introRequested || introStartedRef.current) return;

    let raf = 0;
    const tryStart = () => {
      const sketch = sketchRef.current;
      if (!sketch) {
        raf = requestAnimationFrame(tryStart);
        return;
      }
      introStartedRef.current = true;
      sketch.queueSpin(() => {
        onIntroComplete?.();
      });
    };

    tryStart();
    return () => cancelAnimationFrame(raf);
  }, [introRequested, onIntroComplete]);

  const projectLink = activeItem?.link?.trim() ?? "";
  const isExternalLink = projectLink.startsWith("http");
  const overlayVisible = !introPlaying && !isMoving && !isScrolling;
  const overlayHidden = introPlaying;
  const showLinkButton = Boolean(projectLink) && overlayVisible;

  const linkButtonClass = cn(
    "action-button active globe-reveal-item globe-reveal-item--button",
    isMobileOverlay && "action-button--mobile"
  );

  const linkButton =
    showLinkButton &&
    (isExternalLink ? (
      <a
        href={projectLink}
        target="_blank"
        rel="noopener noreferrer"
        className={linkButtonClass}
        aria-label={`Open ${activeItem?.title ?? "project"}`}
      >
        <span className="action-button-icon">&#x2197;</span>
      </a>
    ) : (
      <Link
        href={projectLink}
        className={linkButtonClass}
        aria-label={`View ${activeItem?.title ?? "project"}`}
      >
        <span className="action-button-icon">&#x2197;</span>
      </Link>
    ));

  return (
    <div className="relative h-full w-full">
      <canvas id="infinite-grid-menu-canvas" ref={canvasRef} />

      {showOverlay && activeItem && (
        <div
          className={cn(
            "globe-overlay",
            overlayHidden && "hidden",
            introComplete && "globe-overlay--revealed"
          )}
        >
          {overlayVisible && activeItem.title ? (
            <h2
              className={cn(
                "face-title font-silver font-medium tracking-[-0.03em] max-lg:font-semibold max-lg:tracking-[-0.025em]",
                "globe-reveal-item globe-reveal-item--title",
                "max-lg:hidden active"
              )}
            >
              {activeItem.title}
            </h2>
          ) : null}

          {overlayVisible && activeItem.description ? (
            <p
              className={cn(
                "face-description globe-reveal-item globe-reveal-item--description active"
              )}
            >
              {activeItem.description}
            </p>
          ) : null}

          {!isMobileOverlay && linkButton}
        </div>
      )}

      {isMobileOverlay && showOverlay && activeItem && (
        <div
          className={cn(
            "globe-overlay globe-overlay--mobile-title",
            overlayHidden && "hidden",
            introComplete && "globe-overlay--revealed"
          )}
        >
          {overlayVisible && activeItem.title ? (
            <h2
              className={cn(
                "face-title font-silver font-semibold tracking-[-0.025em]",
                "globe-reveal-item globe-reveal-item--title",
                "active"
              )}
            >
              {activeItem.title}
            </h2>
          ) : null}
        </div>
      )}

      {isMobileOverlay && showOverlay && linkButton}

      {introComplete && !isMobileOverlay && (
        <p
          className="globe-hint globe-reveal-item globe-reveal-item--hint visible"
          aria-hidden
        >
          {GLOBE_HINT_TEXT}
        </p>
      )}
    </div>
  );
}
