import { pointerPressed, initKeys, initPointer, getPointer, onKey } from 'kontra';
export function MainScene(sceneManager, nextScene, canvas) {
    initKeys();
    initPointer();

    let glowPulse = 0, glowDirection = 1;
    let selected = 0;
    const options = ['Start Game', 'Quit', 'Fanpage'];

    const buttonPositions = options.map((_, i) => ({
        x: canvas.width / 2,
        y: 450 + i * 100, // weiter nach unten verschoben
        width: 240,
        height: 50
    }));

    function handleSelection(index) {
        switch (index) {
            case 0: sceneManager.show(nextScene); break;
            case 1: window.close(); break;
            case 2: alert('Fanpage not yet implemented'); break;
        }
    }

    // Nebel, Augen und Bäume
    const nebels = Array.from({length:50}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radiusX: 50 + Math.random()*100,
        radiusY: 25 + Math.random()*50,
        alpha: Math.random()*0.1
    }));

    const backgroundEyes = Array.from({length:5}, () => ({
        x: Math.random() * canvas.width,
        y: 300 + Math.random() * 100
    }));

    const shadowTrees = Array.from({length:5}, (_, i) => ({
        x: 100 + i*150,
        y: 300 + Math.random()*50
    }));

    // Animations-Zustände
    let mouse = {x: 200, y: 370, dir: 1, speed: 0.5};
    let tailOffset = 0, tailDir = 0.05;

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
        const w = canvas.width, h = canvas.height;

        // Himmel
        const skyGradient = ctx.createLinearGradient(0,0,0,h);
        skyGradient.addColorStop(0,'#0a0a0a');
        skyGradient.addColorStop(1,'#2b2b2b');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0,0,w,h);

        // Nebel
        nebels.forEach(n => {
            ctx.fillStyle = `rgba(50,50,50,${n.alpha})`;
            ctx.beginPath();
            ctx.ellipse(n.x, n.y, n.radiusX, n.radiusY, 0, 0, Math.PI*2);
            ctx.fill();
        });

        // Mond
        const moonX = 500, moonY = 150, moonR = 50;
        const moonGrad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, moonR);
        moonGrad.addColorStop(0,'#ffeabf');
        moonGrad.addColorStop(1,'#d2691e');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,235,180,${0.08 + Math.sin(Date.now()*0.002)*0.02})`; // leichtes Pulsieren
        ctx.beginPath();
        ctx.arc(moonX, moonY, 120,0,Math.PI*2);
        ctx.fill();

        // Schatten-Bäume
        shadowTrees.forEach((t,i)=>{
            ctx.fillStyle = `rgba(0,0,0,${0.6 - i*0.1})`;
            ctx.beginPath();
            ctx.moveTo(t.x,h);
            ctx.lineTo(t.x-25,t.y);
            ctx.lineTo(t.x+25,t.y);
            ctx.closePath();
            ctx.fill();
        });

        // Fledermäuse
        ctx.fillStyle='#000';
        [[400,100],[450,150],[480,120],[350,80],[500,130],[550,90],[600,140]].forEach(([x,y])=>{
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x+12,y-8);
            ctx.lineTo(x+20,y);
            ctx.fill();
        });

        // Katze
        ctx.fillStyle='#000';
        ctx.shadowColor='rgba(0,0,0,0.8)';
        ctx.shadowBlur=15;
        ctx.beginPath();
        ctx.ellipse(300,350,60,30,0,0,Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(260,340);
        ctx.lineTo(270,310);
        ctx.lineTo(280,340);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(340,340);
        ctx.lineTo(350,310);
        ctx.lineTo(360,340);
        ctx.fill();

        // Schwanz animiert
        ctx.shadowBlur=0;
        tailOffset += tailDir;
        if(tailOffset>0.2 || tailOffset<-0.2) tailDir*=-1;
        ctx.beginPath();
        ctx.moveTo(360,350);
        ctx.quadraticCurveTo(400,330+tailOffset*30,380,360);
        ctx.strokeStyle='#000';
        ctx.lineWidth=4;
        ctx.stroke();

        // Augen folgen Maus
        const eyeOffsetX = (mouse.x-300)/50;
        ctx.fillStyle='#fff';
        ctx.fillRect(280+eyeOffsetX,340,10,10);
        ctx.fillRect(320+eyeOffsetX,340,10,10);

        // Maus bewegt sich
        mouse.x += mouse.dir*mouse.speed;
        if(mouse.x>250 || mouse.x<150) mouse.dir*=-1;
        ctx.fillStyle='#888';
        ctx.beginPath();
        ctx.ellipse(mouse.x,mouse.y,12,8,0,0,Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(mouse.x-12,mouse.y);
        ctx.lineTo(mouse.x-25,mouse.y-5);
        ctx.strokeStyle='#888';
        ctx.lineWidth=2;
        ctx.stroke();
        ctx.fillStyle='#fff';
        ctx.fillRect(mouse.x+5,mouse.y-3,2,2);

        // Hintergrund-Augen
        ctx.fillStyle='#ff0';
        backgroundEyes.forEach(e=>{
            ctx.fillRect(e.x,e.y,5,5);
            ctx.fillRect(e.x+10,e.y,5,5);
        });
    }

    return {
        id:'menu',

        onEnter() {
            selected=0;
            initKeys();
            initPointer();
            onKey('arrowup',()=>{selected=(selected-1+options.length)%options.length},'up');
            onKey('arrowdown',()=>{selected=(selected+1)%options.length},'up');
            onKey('enter',()=>handleSelection(selected),'up');
        },

        update() {
            const p = getPointer();
            if(pointerPressed('left')){
                buttonPositions.forEach((btn,i)=>{
                    const bx=btn.x-btn.width/2, by=btn.y-btn.height/2;
                    if(p.x>=bx && p.x<=bx+btn.width && p.y>=by && p.y<=by+btn.height){
                        selected=i;
                        handleSelection(i);
                    }
                });
            }
        },

        render() {
            const ctx = canvas.getContext('2d');
            renderScene(ctx);

            // Overlay
            ctx.fillStyle='rgba(0,0,0,0.4)';
            ctx.fillRect(0,0,canvas.width,canvas.height);

            // Titel-Text gruselig
            const time = Date.now() * 0.003; // Zeit für Animation
            ctx.font = '50px Creepster, Arial'; // optional: gruselige Schriftart
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // leichtes Zittern
            const shakeX = Math.sin(time*3) * 5;
            const shakeY = Math.cos(time*2) * 3;

            // pulsierender Glow
            const glow = 0.5 + Math.sin(time*5) * 0.5;

            // Schatten
            ctx.shadowColor = `rgba(255, ${Math.floor(100 + glow*155)}, 0, 0.8)`; // orange-rötlicher Glow
            ctx.shadowBlur = 10 + glow*10;

            ctx.fillStyle = `rgba(255, ${Math.floor(180 + glow*75)}, 0, 1)`; // heller Glow
            ctx.fillText('Black Cat’s Hunt', canvas.width/2 + shakeX, 100 + shakeY);

            ctx.shadowBlur = 0;

            // Buttons
            ctx.font='24px Arial';
            buttonPositions.forEach((btn, i) => {
                if(i===selected){
                    glowPulse += 0.03 * glowDirection; // etwas schnelleres Flackern
                    if(glowPulse >= 0.7 || glowPulse <= 0.3) glowDirection *= -1;
                } else glowPulse=0;

                // Gruseliger Button-Hintergrund
                const gradient = ctx.createLinearGradient(btn.x-btn.width/2, btn.y-btn.height/2, btn.x+btn.width/2, btn.y+btn.height/2);
                gradient.addColorStop(0, 'rgba(50,0,0,0.6)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
                ctx.fillStyle = gradient;
                drawRoundedRect(ctx, btn.x-btn.width/2, btn.y-btn.height/2, btn.width, btn.height, 12);
                ctx.fill();

                // Glühender Rand
                ctx.strokeStyle = i===selected ? `rgba(255,140,0,${0.5+glowPulse/2})` : 'rgba(200,200,200,0.3)';
                ctx.lineWidth = i===selected ? 3 : 1.5;
                ctx.stroke();

                // Text
                ctx.fillStyle = i===selected ? 'orange' : 'white';
                ctx.font = '26px Arial';
                ctx.fillText(options[i], btn.x, btn.y+3);
            });
        }
    };
}
