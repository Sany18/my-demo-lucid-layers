export const getRandomColor = () => {
  // Generate random values for red, green, blue (0-255)
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgba(${r},${g},${b},0)`;
}
