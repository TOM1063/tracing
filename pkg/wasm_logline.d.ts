/* tslint:disable */
/* eslint-disable */
/**
*/
export class Color {
  free(): void;
/**
* @returns {number}
*/
  r(): number;
/**
* @returns {number}
*/
  g(): number;
/**
* @returns {number}
*/
  b(): number;
}
/**
*/
export class LogLine {
  free(): void;
/**
* @param {number} id
*/
  constructor(id: number);
/**
* @param {number} x
* @param {number} y
* @param {number} frame
*/
  add_point(x: number, y: number, frame: number): void;
/**
* @param {number} mouse_x
* @param {number} mouse_y
* @param {number} size_x
* @param {number} size_y
* @returns {boolean}
*/
  is_intersection(mouse_x: number, mouse_y: number, size_x: number, size_y: number): boolean;
/**
* @returns {number}
*/
  points_length(): number;
/**
* @param {number} index
* @returns {Point}
*/
  get_point(index: number): Point;
/**
* @returns {Color}
*/
  get_color(): Color;
}
/**
*/
export class Point {
  free(): void;
/**
* @returns {number}
*/
  x(): number;
/**
* @returns {number}
*/
  y(): number;
/**
* @returns {number}
*/
  frame(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_point_free: (a: number) => void;
  readonly point_x: (a: number) => number;
  readonly point_y: (a: number) => number;
  readonly point_frame: (a: number) => number;
  readonly __wbg_color_free: (a: number) => void;
  readonly color_r: (a: number) => number;
  readonly color_g: (a: number) => number;
  readonly color_b: (a: number) => number;
  readonly __wbg_logline_free: (a: number) => void;
  readonly logline_new: (a: number) => number;
  readonly logline_add_point: (a: number, b: number, c: number, d: number) => void;
  readonly logline_is_intersection: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly logline_points_length: (a: number) => number;
  readonly logline_get_point: (a: number, b: number) => number;
  readonly logline_get_color: (a: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
