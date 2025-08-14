import { Sprite } from 'kontra';

export class Cat {
    constructor(x, y, color = 'black') {
        this.sprite = Sprite({
            x,
            y,
            color,
            width: 40,
            height: 40,
            dx: 0,
            dy: 0,
            accel: 0.6,    
            friction: 0.92 
        });
    }

    update(inputX, inputY, canvas) {
        if (inputX !== 0 || inputY !== 0) {
            let length = Math.sqrt(inputX * inputX + inputY * inputY);
            inputX /= length;
            inputY /= length;
        }
    
        this.sprite.dx += inputX * this.sprite.accel;
        this.sprite.dy += inputY * this.sprite.accel;
    
        const maxSpeed = 5;
        const speed = Math.sqrt(this.sprite.dx ** 2 + this.sprite.dy ** 2);
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
        if (this.sprite.x + this.sprite.width > canvas.width - wallSize) {
            this.sprite.x = canvas.width - wallSize - this.sprite.width;
        }
        if (this.sprite.y + this.sprite.height > canvas.height - wallSize) {
            this.sprite.y = canvas.height - wallSize - this.sprite.height;
        }
    
    }

    render() {
        this.sprite.render();
    }
}
