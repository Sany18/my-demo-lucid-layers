// Zoom to the initial position
// Move to the surface (~1000 m)
// Move on the surface
// Travel to the horizon
// Move back
// Move to the surface
// Move to initial position

import { getReference } from "@luciad/ria/reference/ReferenceProvider";
import { createBounds } from "@luciad/ria/shape/ShapeFactory";
import { CRSEnum } from "enum/CRS.enum";
import { CameraService } from "services/camera/camera.service";

export const DEFAULT_MAP_GLOBE_COLOR = '#aabbcc';

// Time in seconds to wait before starting the scenario
const pleaseStandBy = (mapEl, time) => {
  const standBy = document.createElement('div');
  standBy.id = 'stand-by';
  standBy.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 20px;
    border-radius: 10px;
    font-size: 20px;
    z-index: 1000;
  `;

  const standByText = document.createElement('span');
  standByText.innerText = 'Stand by...';

  const countDown = document.createElement('span');
  countDown.id = 'count-down';

  standBy.appendChild(standByText);
  standBy.appendChild(countDown);
  mapEl.appendChild(standBy);

  const startTime = Date.now();
  const interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = time - elapsed;
    countDown.innerText = ` ${remaining} seconds`;

    if (remaining <= 0) {
      clearInterval(interval);
      mapEl.removeChild(standBy);
    }
  }, 200);

  setTimeout(() => {
    clearInterval(interval);
    mapEl.removeChild(standBy);
  }, time * 1000);
}

export async function* parformanceMesurementScenario(map) {
  const cameraService = new CameraService(map);

  console.info('parformanceMesurementScenario Started');
  const mapEl = document.querySelector('.Map.luciad') as HTMLElement;
  mapEl.requestFullscreen();
  mapEl.style.pointerEvents = 'none';
  pleaseStandBy(mapEl, 60); // 1 minute countdown

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

  yield cameraService.moveCameraTo(testBounds1, { duration: 3000, targetPitch: -45, targetYaw: -45 });
  yield cameraService.moveCameraTo(testBounds1, { duration: 2000, targetPitch: -10, targetYaw: 0 });
  // Look left and right
  yield cameraService.moveCameraTo(null, { duration: 2000, targetPitch: -10, targetYaw: 45 });
  yield cameraService.moveCameraTo(null, { duration: 2000, targetPitch: -10, targetYaw: -45 });
  yield cameraService.moveCameraTo(null, { duration: 1000, targetPitch: -10, targetYaw: 0 });
  yield new Promise(resolve => setTimeout(resolve, 1000));

  // Move to the surface and look around
  const testBounds2 = createBounds(getReference(CRSEnum.CRS_84), [7.889030524, 0.001, 54.177825005, 0.001]);

  yield cameraService.moveCameraTo(testBounds1, { duration: 2000, targetPitch: -89 });
  document.map.globeColor = null;
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

  document.map.globeColor = DEFAULT_MAP_GLOBE_COLOR;
  yield cameraService.moveCameraTo(testBounds3, { duration: 8000, targetYaw: 180 });
  // Look left and right
  yield cameraService.moveCameraTo(testBounds2, { duration: 4000, targetPitch: -10, targetYaw: 45 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -10, targetYaw: -45 });
  yield cameraService.moveCameraTo(testBounds2, { duration: 1000, targetPitch: -10, targetYaw: 0 });
  yield new Promise(resolve => setTimeout(resolve, 500));

  // Finally, move back to the surface and to the initial position
  yield cameraService.moveCameraTo(testBounds2, { duration: 2000, targetPitch: -45, targetYaw: 0 });
  yield cameraService.defaultCameraPosition({ duration: 6000 });

  mapEl.style.pointerEvents = 'auto';
  yield document.exitFullscreen();
  yield console.info('parformanceMesurementScenario Finished');
}
