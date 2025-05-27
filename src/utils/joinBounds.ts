import { Bounds } from "@luciad/ria/shape/Bounds";
import { createBounds } from "@luciad/ria/shape/ShapeFactory";

export function joinBounds(bounds: Bounds[]) {
  if (bounds.length === 0) return null;

  let result = bounds[0];
  for (let i = 1; i < bounds.length; i++) {
    const current = bounds[i];
    const minX = Math.min(result.x, current.x);
    const minY = Math.min(result.y, current.y);
    const minZ = Math.min(result.z, current.z);
    const maxX = Math.max(result.x + result.width, current.x + current.width);
    const maxY = Math.max(result.y + result.height, current.y + current.height);
    const maxZ = Math.max(result.z + result.depth, current.z + current.depth);

    result = createBounds(result.reference, [minX, maxX - minX, minY, maxY - minY, minZ, maxZ - minZ]);
  }

  return result;
}
