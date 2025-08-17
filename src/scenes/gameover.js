import { initKeys, initPointer, onKey, getPointer, pointerPressed} from 'kontra';

export function GameOverScreen(sceneManager, restartScene, canvas) {
    initKeys();
    initPointer();
    const w = canvas.width;
    const h = canvas.height;

    // Hintergrund-Nebel
    const nebels = Array.from({ length: 30 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radiusX: 50 + Math.random() * 100,
        radiusY: 20 + Math.random() * 40,
        alpha: Math.random() * 0.1
    }));

    let selected = 0;
    const options = ['Restart', 'Quit'];

    const buttonPositions = options.map((_, i) => ({
        x: w / 2,
        y: 350 + i * 80,
        width: 200,
        height: 50
    }));

    function handleSelection(index) {
        switch (index) {
            case 0: sceneManager.show(restartScene); break;
            case 1: window.close(); break;
        }
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    function renderScene(ctx) {
        // Himmel dunkel
        const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
        skyGradient.addColorStop(0, '#0a0a0a');
        skyGradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, w, h);

        // Nebel
        nebels.forEach(n => {
            n.x += (Math.random() - 0.5) * 0.2;
            n.y += (Math.random() - 0.5) * 0.1;

            const alphaPulse = 0.05 + Math.sin(Date.now() * 0.001 + n.x + n.y) * 0.05;
            const alpha = Math.min(Math.max(n.alpha + alphaPulse, 0), 0.15);

            ctx.fillStyle = `rgba(50,50,50,${alpha})`;
            ctx.beginPath();
            ctx.ellipse(n.x, n.y, n.radiusX, n.radiusY, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // Blutroter "Game Over"-Text
        const time = Date.now() * 0.003;
        const shakeX = Math.sin(time * 3) * 4;
        const shakeY = Math.cos(time * 2) * 3;
        const glow = 0.5 + Math.sin(time * 5) * 0.5;

        ctx.font = '60px Creepster, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = `rgba(255,0,0,${0.6 + glow/2})`;
        ctx.shadowBlur = 15 + glow * 5;
        ctx.fillStyle = `rgba(200,0,0,1)`;
        ctx.fillText('GAME OVER', w / 2 + shakeX, 150 + shakeY);
        ctx.shadowBlur = 0;

        // Buttons
        ctx.font = '24px Arial';
        buttonPositions.forEach((btn, i) => {
            const gradient = ctx.createLinearGradient(btn.x - btn.width/2, btn.y - btn.height/2, btn.x + btn.width/2, btn.y + btn.height/2);
            gradient.addColorStop(0, 'rgba(50,0,0,0.6)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
            ctx.fillStyle = gradient;
            drawRoundedRect(ctx, btn.x - btn.width/2, btn.y - btn.height/2, btn.width, btn.height, 12);
            ctx.fill();

            ctx.strokeStyle = i === selected ? 'orange' : 'rgba(200,200,200,0.3)';
            ctx.lineWidth = i === selected ? 3 : 1.5;
            ctx.stroke();

            ctx.fillStyle = i === selected ? 'orange' : 'white';
            ctx.fillText(options[i], btn.x, btn.y + 3);
        });
    }

    return {
        id: 'gameover',

        onEnter() {
            selected = 0;
            initKeys();
            initPointer();
            onKey('arrowup', () => { selected = (selected - 1 + options.length) % options.length }, 'up');
            onKey('arrowdown', () => { selected = (selected + 1) % options.length }, 'up');
            onKey('enter', () => handleSelection(selected), 'up');
        },

        update() {
            const p = getPointer();
            if(pointerPressed('left')){
                buttonPositions.forEach((btn,i)=>{
                    const bx = btn.x - btn.width/2, by = btn.y - btn.height/2;
                    if(p.x >= bx && p.x <= bx + btn.width && p.y >= by && p.y <= by + btn.height){
                        selected = i;
                        handleSelection(i);
                    }
                });
            }
        },

        render() {
            const ctx = canvas.getContext('2d');
            renderScene(ctx);
        }
    };
}