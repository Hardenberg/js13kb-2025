export class Mouse {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 20;
      this.height = 15;
      this.dx = 0;
      this.dy = 0;
      this.speed = 1 + Math.random(); // zufällige Grundgeschwindigkeit 1-2
  
      this.state = 'random';
      this.stateTimer = 0;
      this.changeDirectionCounter = 0;
      this.pauseCounter = 0;
  
      this.targetDx = 0;
      this.targetDy = 0;
    }
  
    setState(state, durationFrames) {
      this.state = state;
      this.stateTimer = durationFrames;
    }
  
    update(canvas, player) {
      if (this.stateTimer > 0) this.stateTimer--;
      else if (this.state !== 'random') this.state = 'random';
  
      switch (this.state) {
        case 'random': this.randomMove(); break;
        case 'chase': this.chaseMove(player); break;
        case 'flee': this.fleeMove(player); break;
      }
  
      this.x += this.dx;
      this.y += this.dy;
  
      const wallSize = 40;
      if (this.x < wallSize) this.x = wallSize;
      if (this.y < wallSize) this.y = wallSize;
      if (this.x + this.width > canvas.width - wallSize) this.x = canvas.width - wallSize - this.width;
      if (this.y + this.height > canvas.height - wallSize) this.y = canvas.height - wallSize - this.height;
    }
  
    randomMove() {
      if (this.pauseCounter > 0) {
        this.pauseCounter--;
        this.dx *= 0.9;
        this.dy *= 0.9;
        return;
      }
  
      if (this.changeDirectionCounter <= 0) {
        const angle = Math.random() * Math.PI * 2;
        const speedVariation = 0.5 + Math.random() * 1.0;
        this.targetDx = Math.cos(angle) * this.speed * speedVariation;
        this.targetDy = Math.sin(angle) * this.speed * speedVariation;
        this.changeDirectionCounter = 60 + Math.floor(Math.random() * 60);
  
        if (Math.random() < 0.2) {
          this.pauseCounter = 5 + Math.floor(Math.random() * 10);
        }
      } else {
        this.changeDirectionCounter--;
      }
  
      const smooth = 0.15;
      this.dx += (this.targetDx - this.dx) * smooth;
      this.dy += (this.targetDy - this.dy) * smooth;
    }
  
    chaseMove(player) {
      if (!player) return;
      let dx = (player.x + player.width/2) - (this.x + this.width/2);
      let dy = (player.y + player.height/2) - (this.y + this.height/2);
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len > 0) {
        const speedVariation = 0.8 + Math.random() * 0.5;
        dx = (dx/len) * this.speed * speedVariation;
        dy = (dy/len) * this.speed * speedVariation;
      }
      const smooth = 0.15;
      this.dx += (dx - this.dx) * smooth;
      this.dy += (dy - this.dy) * smooth;
    }
  
    fleeMove(player) {
      if (!player) return;
      let dx = (this.x + this.width/2) - (player.x + player.width/2);
      let dy = (this.y + this.height/2) - (player.y + player.height/2);
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len > 0) {
        const speedVariation = 0.8 + Math.random() * 2.5;
        dx = (dx/len) * this.speed * speedVariation;
        dy = (dy/len) * this.speed * speedVariation;
      }
      const smooth = 0.15;
      this.dx += (dx - this.dx) * smooth;
      this.dy += (dy - this.dy) * smooth;
    }
  
    render(ctx) {
        if (!ctx) return;

        // Körper (schlank)
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Kopf (abgerundet vorne)
        ctx.beginPath();
        ctx.arc(this.x + this.width + 3, this.y + this.height / 2, this.height / 2, 0, Math.PI * 2);
        ctx.fill();

        // Ohren
        ctx.fillStyle = 'darkgray';
        ctx.beginPath();
        ctx.arc(this.x + this.width, this.y + 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width, this.y + this.height - 3, 3, 0, Math.PI * 2);
        ctx.fill();

        // Augen
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + this.width + 3, this.y + this.height / 2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Beine
        ctx.strokeStyle = 'darkgray';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y + this.height - 1);
        ctx.lineTo(this.x + 4, this.y + this.height + 4);
        ctx.moveTo(this.x + 10, this.y + this.height - 1);
        ctx.lineTo(this.x + 10, this.y + this.height + 4);
        ctx.moveTo(this.x + 16, this.y + this.height - 1);
        ctx.lineTo(this.x + 16, this.y + this.height + 4);
        ctx.stroke();

        // Schwanz
        ctx.strokeStyle = 'pink';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.quadraticCurveTo(this.x - 12, this.y + this.height / 2 - 4, this.x - 8, this.y + this.height / 2 - 12);
        ctx.stroke();

        // Schnurrhaare
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width + 4, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width + 10, this.y + this.height / 2 - 2);
        ctx.moveTo(this.x + this.width + 4, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width + 10, this.y + this.height / 2 + 2);
        ctx.stroke();
    }
  }
  