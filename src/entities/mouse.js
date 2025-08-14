import { Sprite } from 'kontra';

export class Mouse {
    constructor(x, y) {
        this.sprite = Sprite({
            x,
            y,
            width: 20,
            height: 20,
            color: 'gray',
            dx: 0,
            dy: 0
        });

        this.state = 'random';
        this.stateTimer = 0;
        this.changeDirectionCounter = 0;

        this.speed = 1 + Math.random(); // zufällige Grundgeschwindigkeit 1-2
    }

    setState(state, durationFrames) {
        this.state = state;
        this.stateTimer = durationFrames;
    }

    update(canvas, player) {
        // Timer
        if (this.stateTimer > 0) this.stateTimer--;
        else if (this.state !== 'random') this.state = 'random';

        switch(this.state) {
            case 'random':
                this.randomMove();
                break;
            case 'chase':
                this.chaseMove(player);
                break;
            case 'flee':
                this.fleeMove(player);
                break;
        }

        // Bewegung anwenden
        this.sprite.x += this.sprite.dx;
        this.sprite.y += this.sprite.dy;

        // Canvas-Grenzen
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

    randomMove() {
        // Wenn Pause aktiv ist, nur langsam abbremsen
        if (this.pauseCounter > 0) {
            this.pauseCounter--;
            this.sprite.dx *= 0.9;
            this.sprite.dy *= 0.9;
            return;
        }
    
        // Richtung alle 60–120 Frames ändern für längere Laufpassagen
        if (this.changeDirectionCounter <= 0) {
            const angle = Math.random() * Math.PI * 2;
            const speedVariation = 0.5 + Math.random() * 1.0;
            this.targetDx = Math.cos(angle) * this.speed * speedVariation;
            this.targetDy = Math.sin(angle) * this.speed * speedVariation;
            this.changeDirectionCounter = 60 + Math.floor(Math.random() * 60);
    
            // zufällige Pause nach Richtungswechsel (5–15 Frames)
            if (Math.random() < 0.2) {
                this.pauseCounter = 5 + Math.floor(Math.random() * 10);
            }
        } else {
            this.changeDirectionCounter--;
        }
    
        // sanftes Gleiten auf Zielgeschwindigkeit
        const smooth = 0.15;
        this.sprite.dx += (this.targetDx - this.sprite.dx) * smooth;
        this.sprite.dy += (this.targetDy - this.sprite.dy) * smooth;
    }
    
    chaseMove(player) {
        if (!player) return;
        console.log('Chase move');

        let dx = (player.x + player.width/2) - (this.sprite.x + this.sprite.width/2);
        let dy = (player.y + player.height/2) - (this.sprite.y + this.sprite.height/2);
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len > 0) {
            const speedVariation = 0.8 + Math.random() * 0.5;
            dx = (dx/len) * this.speed * speedVariation;
            dy = (dy/len) * this.speed * speedVariation;
        }

        const smooth = 0.15;
        this.sprite.dx += (dx - this.sprite.dx) * smooth;
        this.sprite.dy += (dy - this.sprite.dy) * smooth;
    }

    fleeMove(player) {
        if (!player) return;
        console.log('Flee move'); 
        let dx = (this.sprite.x + this.sprite.width/2) - (player.x + player.width/2);
        let dy = (this.sprite.y + this.sprite.height/2) - (player.y + player.height/2);
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len > 0) {
            const speedVariation = 0.8 + Math.random() * 2.5;
            dx = (dx/len) * this.speed * speedVariation;
            dy = (dy/len) * this.speed * speedVariation;
        }

        const smooth = 0.15;
        this.sprite.dx += (dx - this.sprite.dx) * smooth;
        this.sprite.dy += (dy - this.sprite.dy) * smooth;
    }

    render() {
        this.sprite.render();
    }
}
