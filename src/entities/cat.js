import { Sprite, SpriteSheet } from 'kontra';
import catImage from '../assets/cat.png';

let spriteSheet = null;
const image = new Image();
image.src = catImage;
image.onerror = () => console.error('❌ Cat image konnte nicht geladen werden');

function createSpriteSheet() {
  if (!spriteSheet) {
    spriteSheet = SpriteSheet({
      image: image,
      frameWidth: 16,
      frameHeight: 16,
      animations: {
        idle: { frames: 0 } // 0-basiert!
      }
    });
  }
}

export class Cat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;

    if (image.complete && image.naturalWidth > 0) {
      // Bild ist schon geladen
      createSpriteSheet();
      this.initSprite();
    } else {
      // Bild noch nicht geladen, warten
      image.onload = () => {
        createSpriteSheet();
        this.initSprite();
      };
    }
  }

  initSprite() {
    this.sprite = Sprite({
      x: this.x,
      y: this.y,
      width: 40,
      height: 40,
      dx: 0,
      dy: 0,
      accel: 0.6,
      friction: 0.92,
      animations: {
        idle: spriteSheet.animations.idle
      }
    });
  }

  update(inputX, inputY, canvas) {
    if (!this.sprite) return;

    if (inputX !== 0 || inputY !== 0) {
      const length = Math.sqrt(inputX**2 + inputY**2);
      inputX /= length;
      inputY /= length;
    }

    this.sprite.dx += inputX * this.sprite.accel;
    this.sprite.dy += inputY * this.sprite.accel;

    const maxSpeed = 5;
    const speed = Math.sqrt(this.sprite.dx**2 + this.sprite.dy**2);
    if (speed > maxSpeed) {
      this.sprite.dx = (this.sprite.dx / speed) * maxSpeed;
      this.sprite.dy = (this.sprite.dy / speed) * maxSpeed;
    }

    this.sprite.dx *= this.sprite.friction;
    this.sprite.dy *= this.sprite.friction;

    this.sprite.x += this.sprite.dx;
    this.sprite.y += this.sprite.dy;

    const wallSize = 40;
    if (this.sprite.x < wallSize) this.sprite.x = wallSize;
    if (this.sprite.y < wallSize) this.sprite.y = wallSize;
    if (this.sprite.x + this.sprite.width > canvas.width - wallSize)
      this.sprite.x = canvas.width - wallSize - this.sprite.width;
    if (this.sprite.y + this.sprite.height > canvas.height - wallSize)
      this.sprite.y = canvas.height - wallSize - this.sprite.height;
  }

  render() {
    if (this.sprite) this.sprite.render();
  }
}
