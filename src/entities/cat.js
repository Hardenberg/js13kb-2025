import { Sprite } from 'kontra';

export class Cat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.dx = 0;
    this.dy = 0;
    this.accel = 0.6;
    this.friction = 0.92;
  }

  update(inputX, inputY, canvas) {
    if (inputX !== 0 || inputY !== 0) {
      const length = Math.sqrt(inputX ** 2 + inputY ** 2);
      inputX /= length;
      inputY /= length;
    }

    this.dx += inputX * this.accel;
    this.dy += inputY * this.accel;

    const maxSpeed = 5;
    const speed = Math.sqrt(this.dx ** 2 + this.dy ** 2);
    if (speed > maxSpeed) {
      this.dx = (this.dx / speed) * maxSpeed;
      this.dy = (this.dy / speed) * maxSpeed;
    }

    this.dx *= this.friction;
    this.dy *= this.friction;

    this.x += this.dx;
    this.y += this.dy;

    const wallSize = 40;
    if (this.x < wallSize) this.x = wallSize;
    if (this.y < wallSize) this.y = wallSize;
    if (this.x + this.width > canvas.width - wallSize)
      this.x = canvas.width - wallSize - this.width;
    if (this.y + this.height > canvas.height - wallSize)
      this.y = canvas.height - wallSize - this.height;
  }

  render(ctx) {
    if (!ctx) return;

    // Körper
    ctx.fillStyle = '#111'; // fast schwarz
    ctx.beginPath();
    ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ohren spitz
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y + 2);
    ctx.lineTo(this.x + 15, this.y - 12);
    ctx.lineTo(this.x + 25, this.y + 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x + this.width - 25, this.y + 2);
    ctx.lineTo(this.x + this.width - 15, this.y - 12);
    ctx.lineTo(this.x + this.width - 5, this.y + 2);
    ctx.fill();

    // Augen glühend
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.ellipse(this.x + 15, this.y + 10, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(this.x + this.width - 15, this.y + 10, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Krallen
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x + 10 + i * 10, this.y + this.height);
        ctx.lineTo(this.x + 10 + i * 10 - 5, this.y + this.height + 10);
        ctx.stroke();
    }

    // Schwanz gespenstisch gebogen
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height / 2);
    ctx.quadraticCurveTo(this.x - 20, this.y - 10, this.x + 10, this.y - 20);
    ctx.stroke();
}
}
