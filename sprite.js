const spriteWidth = 16;
const spriteHeight = 16;
const borderWidth = 1;
const spacingWidth = 0;

export class Sprite {
  constructor(spriteImage) {
    this.spriteImage = spriteImage;
  }

  spritePositionToImagePosition(row, col) {
    return {
      x: borderWidth + col * (spacingWidth + spriteWidth),
      y: borderWidth + row * (spacingWidth + spriteHeight),
    };
  }

  drawSprite(canvasContext, player) {
    let [row, col] = this.getSpritePosition(player)
    const spritePosition = this.spritePositionToImagePosition(row, col)
    canvasContext.drawImage(
      this.spriteImage,
      spritePosition.x,
      spritePosition.y,
      16,
      16,
      player.x + 16,
      player.y + 16,
      16,
      16
    );
  }

  getSpritePosition(player) {
    // TODO - make it real
    return [1, 0];
  }
}
