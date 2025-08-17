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

    // Hintergrund-Augen (creepy)
function drawBackgroundEyes(ctx, backgroundEyes) {
    backgroundEyes.forEach(e => {
        // Zufälliges Flackern / Farbe
        const colors = ['#ff0000', '#990000', '#ff3300', '#00ff66'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5 + Math.random() * 15;

        // Zufälliges leichtes Zittern
        const jitterX = (Math.random() - 0.5) * 2;
        const jitterY = (Math.random() - 0.5) * 2;

        // Augenform: leicht oval statt Block
        ctx.beginPath();
        ctx.ellipse(e.x + jitterX, e.y + jitterY, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(e.x + 10 + jitterX, e.y + jitterY, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupillen: schwarze Schlitze
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.rect(e.x - 1 + jitterX, e.y - 3 + jitterY, 2, 6);
        ctx.fill();

        ctx.beginPath();
        ctx.rect(e.x + 9 + jitterX, e.y - 3 + jitterY, 2, 6);
        ctx.fill();
    });
}


    // Nebel, Augen und Bäume
    const nebels = Array.from({length:50}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radiusX: 50 + Math.random()*100,
        radiusY: 25 + Math.random()*50,
        alpha: Math.random()*0.1
    }));

    function generateBackgroundEyes(count, canvas, cat) {
        const eyes = [];
        const sectionWidth = canvas.width / count;
        const minDistance = 25;
    
        // Fallback-Werte, falls Sprite noch nicht geladen ist
        const fallbackWidth = 40;
        const fallbackHeight = 40;
    
        // Bounding-Box Katze
        const catBox = {
            x: cat.x || 0,
            y: cat.y || 0,
            width: (cat.sprite && cat.sprite.width) ? cat.sprite.width : fallbackWidth,
            height: (cat.sprite && cat.sprite.height) ? cat.sprite.height : fallbackHeight
        };
    
        function isInsideCatBox(x, y, box) {
            return (
                x >= box.x &&
                x <= box.x + box.width &&
                y >= box.y &&
                y <= box.y + box.height
            );
        }
    
        for (let i = 0; i < count; i++) {
            let x, y, valid;
    
            do {
                valid = true;
    
                x = i * sectionWidth + Math.random() * (sectionWidth - 20);
                y = 300 + Math.random() * 100;
    
                // Mindestabstand prüfen
                for (const e of eyes) {
                    const dx = e.x - x;
                    const dy = e.y - y;
                    if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
                        valid = false;
                        break;
                    }
                }
    
                // Katze vermeiden
                if (isInsideCatBox(x, y, catBox)) {
                    valid = false;
                }
            } while (!valid);
    
            eyes.push({ x, y });
        }
    
        return eyes;
    }
    
    // Beispiel: Bounding-Box der Katze
    const catBox = { x: 260, y: 320, width: 80, height: 60 };
    
    const backgroundEyes = generateBackgroundEyes(5, canvas, catBox);
    
    

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
        // Nebel mit Bewegung und Puls
        nebels.forEach(n => {
            // leichte Positionsänderung für Bewegung
            n.x += (Math.random() - 0.5) * 0.3;
            n.y += (Math.random() - 0.5) * 0.2;

            // Pulsierender Alpha-Wert für flackernden Nebel
            const alphaPulse = 0.05 + Math.sin(Date.now() * 0.001 + n.x + n.y) * 0.05;
            const alpha = Math.min(Math.max(n.alpha + alphaPulse, 0), 0.15); // clamp

            // leicht farbige Tönung für unheimlichen Effekt
            const r = 40 + Math.random() * 20;
            const g = 40 + Math.random() * 20;
            const b = 50 + Math.random() * 20;

            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
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
        shadowTrees.forEach((t, i) => {
            const baseHeight = h - t.y;
            const width = 30 + Math.random() * 20; 
            const segments = 4 + Math.floor(Math.random() * 3); 
            ctx.fillStyle = `rgba(0,0,0,${0.6 - i*0.1})`;
            ctx.beginPath();
            ctx.moveTo(t.x, h); 

            for (let s = 0; s <= segments; s++) {
                const segmentHeight = baseHeight / segments;
                const offsetX = (Math.random() - 0.5) * width; 
                ctx.lineTo(t.x + offsetX, h - s * segmentHeight);
            }
        
            ctx.lineTo(t.x + (Math.random() - 0.5) * width, h);
            ctx.closePath();
            ctx.fill();
        
            for (let b = 0; b < 2; b++) {
                const branchHeight = h - Math.random() * baseHeight;
                const branchLength = 15 + Math.random() * 10;
                ctx.beginPath();
                ctx.moveTo(t.x, branchHeight);
                ctx.lineTo(t.x + (Math.random() > 0.5 ? branchLength : -branchLength), branchHeight - 5);
                ctx.strokeStyle = `rgba(0,0,0,${0.6 - i*0.1})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
        
        // Fledermäuse
        ctx.fillStyle = '#000';
        const bats = [
            [400, 100], [450, 150], [480, 120],
            [350, 80], [500, 130], [550, 90], [600, 140]
        ];

        bats.forEach(([x, y]) => {
            const wingSpread = 12 + Math.random() * 6; // vary wing size
            const wingHeight = 8 + Math.random() * 4;
            const jagged = 2 + Math.floor(Math.random() * 3); // number of jagged points per wing
            const angleOffset = (Math.random() - 0.5) * 0.3; // slight rotation

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angleOffset);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            // Left wing
            for (let i = 0; i <= jagged; i++) {
                const dx = -i * (wingSpread / jagged);
                const dy = -Math.sin((i / jagged) * Math.PI) * wingHeight;
                ctx.lineTo(dx, dy);
            }

            ctx.lineTo(0, 0);

            // Right wing (mirrored)
            for (let i = 0; i <= jagged; i++) {
                const dx = i * (wingSpread / jagged);
                const dy = -Math.sin((i / jagged) * Math.PI) * wingHeight;
                ctx.lineTo(dx, dy);
            }

            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });


        // Katze mit Schatten und glühenden Augen
        ctx.fillStyle = '#000';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 20; // stärkerer Schatten
        ctx.beginPath();
        ctx.ellipse(300, 350, 60, 30, 0, 0, Math.PI*2);
        ctx.fill();

        // Ohren
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

        // Schwanz animiert mit leichtem Zittern
        ctx.shadowBlur = 0;
        tailOffset += tailDir;
        if(tailOffset>0.2 || tailOffset<-0.2) tailDir*=-1;
        ctx.beginPath();
        ctx.moveTo(360,350);
        ctx.quadraticCurveTo(400,330+tailOffset*30,380,360);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Augen mit gruseligem Flackern
        const eyeOffsetX = (mouse.x - 300) / 40;
        const eyeOffsetY = (mouse.y - 300) / 60;

        // Farben für unheimliches Flackern (rot/grün)
        const colors = ['#ff0000', '#990000', '#ff3300', '#00ff66'];

        // leichte Zufallsauswahl für "flackernden" Effekt
        const color = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20 + Math.random() * 20; // stärkeres, zufälliges Glühen

        // Augen (oval / katzenartig)
        ctx.beginPath();
        ctx.ellipse(280 + eyeOffsetX, 340 + eyeOffsetY, 8, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(320 + eyeOffsetX, 340 + eyeOffsetY, 8, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupillen (schmale, schwarze Schlitze -> Katze/Dämon)
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.rect(278 + eyeOffsetX, 334 + eyeOffsetY, 4, 12);
        ctx.fill();

        ctx.beginPath();
        ctx.rect(318 + eyeOffsetX, 334 + eyeOffsetY, 4, 12);
        ctx.fill();

        // Optional: Bluttränen unter den Augen
        ctx.strokeStyle = '#800000';
        ctx.lineWidth = 2;
        [280 + eyeOffsetX, 320 + eyeOffsetX].forEach(x => {
            ctx.beginPath();
            ctx.moveTo(x, 348 + eyeOffsetY);
            ctx.lineTo(x - 3 + Math.random() * 6, 370 + Math.random() * 10);
            ctx.stroke();
        });
        // Leichter Nebel um die Katze
        ctx.fillStyle = 'rgba(50,50,50,0.2)';
        ctx.beginPath();
        ctx.ellipse(300, 350, 70, 35, 0, 0, Math.PI*2);
        ctx.fill();
        // Update mouse position with jitter
        mouse.x += mouse.dir * mouse.speed + (Math.random() - 0.5) * 0.3; // slight horizontal jitter
        mouse.y += (Math.random() - 0.5) * 0.2; // slight vertical jitter

        // Reverse direction at boundaries
        if(mouse.x > 250 || mouse.x < 150) mouse.dir *= -1;

        // Draw mouse body
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.ellipse(mouse.x, mouse.y, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw wiggling tail
        const tailLength = 15;
        const tailWave = Math.sin(Date.now() * 0.01) * 5; // sinus wave for tail
        ctx.beginPath();
        ctx.moveTo(mouse.x - 12, mouse.y);
        ctx.quadraticCurveTo(mouse.x - 12 - tailLength / 2, mouse.y + tailWave, mouse.x - 12 - tailLength, mouse.y);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw uneven eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(mouse.x + 5, mouse.y - 3 + (Math.random() - 0.5) * 1.5, 2, 2);
        ctx.fillRect(mouse.x + 5, mouse.y + 1 + (Math.random() - 0.5) * 1.5, 2, 2);


        // Hintergrund-Augen
        drawBackgroundEyes(ctx, backgroundEyes);
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
