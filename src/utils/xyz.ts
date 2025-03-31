export const getXYZ = obj => {
  const { x, y, z } = obj;
  return `${x.toFixed(7)},${y.toFixed(7)},${z.toFixed(7)}`;
}
