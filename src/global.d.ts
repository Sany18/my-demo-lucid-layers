import { WebGLMap } from "@luciad/ria/view/WebGLMap";

export {};

declare global {
  interface Document {
    map: WebGLMap | null;
  }
}
