// Button "Run benchmark"
// Load the app, wait for maps loading
// Move closer
// Move to the surface (100 m)
// Move on the surface
// Travel to the horizon
// Move back to the 100m
// Travel
// Move to the surface
// Travel
// Move to initial position

import { getReference } from "@luciad/ria/reference/ReferenceProvider";
import { createBounds } from "@luciad/ria/shape/ShapeFactory";
import { CRSEnum } from "enum/CRS.enum";
import { CameraService } from "services/luciad-helpers/camera.service";

export async function* parformanceMesurementScenario(map) {
  const cameraService = new CameraService(map);

  yield console.log('parformanceMesurementScenario Started');
  yield document.querySelector('.Map.luciad').requestFullscreen();

  // Initial position
  yield cameraService.defaultCameraPosition({ duration: 2000 });
  yield new Promise(resolve => setTimeout(resolve, 1000));

  // Look around
  yield cameraService.defaultCameraPosition({ duration: 3000, targetPitch: -45, targetYaw: 45 });
  yield cameraService.defaultCameraPosition({ duration: 3000, targetPitch: -45, targetYaw: -45 });
  yield cameraService.defaultCameraPosition({ duration: 2000, targetPitch: -10, targetYaw: 0 });
  yield new Promise(resolve => setTimeout(resolve, 1000));

  // Move to the surface (1000 m)
  const testBounds1 = createBounds(getReference(CRSEnum.CRS_84), [7.87, 0.05, 54.16, 0.05]);

  yield cameraService.moveCameracreatePointo(testBounds1, { duration: 3000, targetPitch: -45, targetYaw: -45 });
  yield cameraService.moveCameraTo(testBounds1, { duration: 2000, targetPitch: -10, targetYaw: 0 });
  // Look left and right
  yield cameraService.moveCameraTo(null, { duration: 2000, targetPitch: -10, targetYaw: 45 });
  yield cameraService.moveCameraTo(null, { duration: 2000, targetPitch: -10, targetYaw: -45 });
  yield cameraService.moveCameraTo(null, { duration: 1000, targetPitch: -10, targetYaw: 0 });
  yield new Promise(resolve => setTimeout(resolve, 1000));

  // Move to the surface and look around
  const testBounds2 = createBounds(getReference(CRSEnum.CRS_84), [7.88976637, 0.001, 54.17899276, 0.001]);

  yield cameraService.moveCameraTo(testBounds1, { duration: 2000, targetPitch: -89 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -45 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -10, targetYaw: 0 });
  yield new Promise(resolve => setTimeout(resolve, 1000));
  // Look left and right
  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -10, targetYaw: 45 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -10, targetYaw: -45 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 1000, targetPitch: -10, targetYaw: 0 });
  yield new Promise(resolve => setTimeout(resolve, 1000));

  // Move to the horizon
  const testBounds3 = createBounds(getReference(CRSEnum.CRS_84), [7.9, 0.001, 54.2, 0.01]);
  yield cameraService.moveCameraTo(testBounds3, { duration: 8000, targetYaw: 180 });
  // Look left and right
  yield cameraService.moveCameraTo(testBounds2, { duration: 4000, targetPitch: -10, targetYaw: 45 + 90 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -10, targetYaw: -45 + 90 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 1000, targetPitch: -10, targetYaw: 0 });
  yield new Promise(resolve => setTimeout(resolve, 1000));

  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -45, targetYaw: 0 });
  yield cameraService.defaultCameraPosition({ duration: 6000 });

  yield document.exitFullscreen();
  yield console.log('parformanceMesurementScenario Finished');
}
