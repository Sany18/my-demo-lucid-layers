import { Point } from '@luciad/ria/shape/Point';
import { Bounds } from '@luciad/ria/shape/Bounds';
import { Feature } from '@luciad/ria/model/feature/Feature';
import { SelectedObjectInfo } from '@luciad/ria/view/Map';
import { OrientedBox } from '@luciad/ria/shape/OrientedBox';

//////////////////
//
//     Y
//     |
//     |____ X
//    /
//   Z
//
// The camera looks to Z axis.
// Pitch (X) - look up/down (90 -- up, -90 -- down)
// Yaw (Y) - look left/right (90 -- right, -90 -- left)
// Roll (Z) - rotation right/left (90 -- "drilling" right, -90 -- "drilling" left)
export interface MoveToParams {
  targetYaw?: number; // Y rotation
  targetPitch?: number; // X rotation
  targetRoll?: number; // Z rotation
  duration?: number;
  fitMargin?: string; // 15%
}

export interface Camera3DSettings {
  epsg?: string;
  point: XYZ;
  rotation: {
    roll: number;
    yaw: number;
    pitch: number;
  };
}

export type MapEntityType = Point | Bounds | Feature | OrientedBox | SelectedObjectInfo[];

export interface XYZ {
  x: number;
  y: number;
  z: number;
}

