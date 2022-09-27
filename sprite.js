const spriteWidth = 16;
const spriteHeight = 16;
const borderWidth = 1;
const spacingWidth = 0;

export function spritePositionToImagePosition(row, col) {
  return {
    x: borderWidth + col * (spacingWidth + spriteWidth),
    y: borderWidth + row * (spacingWidth + spriteHeight),
  };
}