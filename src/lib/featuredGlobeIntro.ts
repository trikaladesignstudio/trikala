export const FEATURED_SECTION_ID = "featured-work";

export const INTRO_PREPARE_THRESHOLD = 0.35;
export const INTRO_SPIN_THRESHOLD = 0.85;

export const INTRO_READY_DURATION_MS = 450;
export const INTRO_SPIN_DURATION_MS = 2200;
export const INTRO_SETTLE_DURATION_MS = 900;

export const INTRO_CAMERA_ZOOM_OUT = 5.5;
export const INTRO_CAMERA_DEFAULT = 3;

/** Tilted axis for the 360° spin (normalized in WebGL code) */
export const INTRO_SPIN_AXIS: [number, number, number] = [0.15, 1, 0.08];

export const INTRO_SPIN_ROTATIONS = 1;
export const INTRO_ROTATION_VELOCITY = 0.14;

export const GLOBE_HINT_TEXT = "Drag to explore";

/** Closer camera on mobile so the globe fills the viewport */
export const MOBILE_GLOBE_SCALE = 0.84;
export const MOBILE_GLOBE_MAX_WIDTH = 1024;

export const REVEAL_DURATION_MS = 650;

export const REVEAL_STAGGER_MS = {
  label: 0,
  title: 110,
  description: 230,
  button: 350,
  hint: 470,
} as const;
