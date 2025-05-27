import { Point } from '@luciad/ria/shape/Point';
import { Bounds } from '@luciad/ria/shape/Bounds';
import { Feature } from '@luciad/ria/model/feature/Feature';
import { OrientedBox } from '@luciad/ria/shape/OrientedBox';
import { createPoint } from '@luciad/ria/shape/ShapeFactory';
import { getReference } from '@luciad/ria/reference/ReferenceProvider';
import { AnimationManager } from '@luciad/ria/view/animation/AnimationManager';
import { PerspectiveCamera } from '@luciad/ria/view/camera/PerspectiveCamera';
import { SelectedObjectInfo } from '@luciad/ria/view/Map';
import { createTransformation } from '@luciad/ria/transformation/TransformationFactory';
import { MapEntityType, MoveToParams } from './camera.types';
import { Handle } from '@luciad/ria/util/Evented';
import { cameraSettings } from './camera.consts';
import { WebGLMap } from '@luciad/ria/view/WebGLMap';
import { CRSEnum } from 'enum/CRS.enum';
import { fallbackBounds } from 'consts/fallback-bounds.const';
import { Move3DCameraAnimation } from 'utils/luciad/Move3DCameraAnimation';
import { joinBounds } from 'utils/joinBounds';

export class CameraService {
  mapChangeHandler: Handle;

  constructor(private map: WebGLMap) {}

  get camera() {
    return this.map.camera as PerspectiveCamera;
  }

  set camera(camera: PerspectiveCamera) {
    this.map.camera = camera;
  }

  public async moveCameraTo(mapEnitity: MapEntityType, params?: MoveToParams) {
    const formattedParams = this.setDefaultParams(params);
    const bounds = this.getBoundsFromEntity(mapEnitity);

    if (this.is2DMap()) {
      return await this.move2DCameraToBounds(bounds, formattedParams);
    }

    return await this.move3DCameraToBounds(bounds, formattedParams);
  }

  public async defaultCameraPosition(params?: MoveToParams) {
    params = this.setDefaultParams(params);
    params = {
      targetYaw: 0,
      fitMargin: '10%',
      targetRoll: cameraSettings.lookDown.roll,
      targetPitch: cameraSettings.lookDown.pitch,
      ...params,
    };

    const bounds = fallbackBounds; // Use a fallback bounds if no specific bounds are provided
    return await this.move3DCameraToBounds(bounds, params);
  }

  // Fallback if the camera is not looking straight down
  public enable2DMode() {
    if (this.camera instanceof PerspectiveCamera) {
      const lookFrom = this.camera.asLookFrom();
      this.camera = this.camera.lookFrom({
        ...lookFrom,
        ...cameraSettings.lookDown,
      });

      // Add event listener to prevent pitch changes
      this.mapChangeHandler?.remove();
      this.mapChangeHandler = this.map.on('MapChange', () => {
        const currentLookFrom = this.camera.asLookFrom();

        if (
          currentLookFrom.pitch !== cameraSettings.lookDown.pitch ||
          currentLookFrom.roll !== cameraSettings.lookDown.roll
        ) {
          this.camera = this.camera.lookFrom({
            ...currentLookFrom,
            ...cameraSettings.lookDown,
          });
        }
      });
    }
  }

  public disable2DMode() {
    this.mapChangeHandler?.remove();
    this.mapChangeHandler = null;
  }

  private is2DMap() {
    return this.mapChangeHandler;
  }

  ///////////////////////////////
  // Private methods
  ///////////////////////////////
  private move2DCameraToBounds(bounds: Bounds, params: MoveToParams) {
    params.targetPitch = cameraSettings.lookDown.pitch;
    params.targetRoll = cameraSettings.lookDown.roll;

    return this.move3DCameraToBounds(bounds, params);
  }

  private async move3DCameraToBounds(bounds: Bounds, params: MoveToParams) {
    const lookFromPoint = this.calculateLookFromPoint(bounds, params);
    const lookFrom = this.camera.asLookFrom();
    const animation = new Move3DCameraAnimation(
      this.map,
      lookFromPoint || this.camera.eyePoint,
      params.targetYaw ?? lookFrom.yaw,
      params.targetPitch ?? lookFrom.pitch,
      params.targetRoll ?? lookFrom.roll,
      this.camera.fovY,
      params.duration,
    );

    if (params?.duration) {
      return AnimationManager.putAnimation(this.map.cameraAnimationKey, animation, false).catch(
        this.catchAnimationError,
      );
    } else {
      animation.update(1);
    }
  }

  private getBoundsFromEntity(mapEnitity: MapEntityType): Bounds | null {
    if (mapEnitity instanceof OrientedBox) {
      return mapEnitity.bounds;
    } else if (mapEnitity instanceof Point) {
      return mapEnitity.bounds;
    } else if (mapEnitity instanceof Feature) {
      return mapEnitity.shape.bounds;
    } else if (mapEnitity instanceof Bounds) {
      return mapEnitity;
    } else if ((mapEnitity?.[0] as SelectedObjectInfo)?.layer && (mapEnitity?.[0]?.selected as Feature[])?.length) {
      const features = mapEnitity.map((item) => item.selected).flat() as Feature[];
      const bounds = features.map((feature) => feature.shape.bounds);
      return joinBounds(bounds);
    } else {
      return null;
    }
  }

  private setDefaultParams(params: MoveToParams) {
    return {
      ...params,
      duration: params?.duration ?? 0,
      fitMargin: params?.fitMargin ?? '0%',
    };
  }

  private catchAnimationError(e) {
    console.info('CameraService: Animation interrupted', e);
  }

  // The main idea is to calculate the camera position based on the bounds of the object
  // 1. Get the bounds of the object
  // 2. Find the center of the bounds
  // 3. Calculate the sphere around the bounds
  // 4. Calculate the distance from the center to the camera
  // 5. Calculate the camera shift based on yaw and pitch (angles of view in 2 projections)
  // 6. Calculate the camera position based on the distance and shift
  private calculateLookFromPoint(bounds: Bounds, params: MoveToParams): Point {
    if (!bounds) return null;

    const MIN_DISTANCE = 1; // 1 meter
    const toRadians = (deg) => (deg * Math.PI) / 180;

    // This ref is critical for the camera position
    // All calculations are valid only in a flat world
    const ref = getReference(CRSEnum.EPSG_3857);
    const transformator = createTransformation(bounds.reference, ref);
    const localBounds = transformator.transformBounds(bounds);
    const { width, height, depth } = localBounds;
    const radius = Math.max(width, height, depth, 0.001) / 2;

    // Parse value like: 15% -> 0.15
    const margin = 1 + parseInt(params.fitMargin) / 100;
    const lookFrom = this.camera.asLookFrom();
    const fov = toRadians(this.camera.fovY);
    const yaw = toRadians(params.targetYaw ?? lookFrom.yaw);
    const pitch = toRadians(params.targetPitch ?? lookFrom.pitch);

    // As scale is linear, we can add margin to the distance
    // Formulas https://en.wikipedia.org/wiki/Trigonometric_functions
    // 1.3 uses here instead of 2 to make the camera position closer to the object
    const distance = Math.max((radius / Math.tan(fov / 1.3)) * margin, MIN_DISTANCE);
    const { x, y, z } = localBounds.focusPoint;
    const cameraPosition = [
      x - distance * Math.cos(pitch) * Math.sin(yaw) * Math.sqrt(3),
      y - distance * Math.cos(pitch) * Math.cos(yaw) * Math.sqrt(3),
      z - distance * Math.sin(pitch),
    ];

    return createPoint(ref, cameraPosition);
  }
}
