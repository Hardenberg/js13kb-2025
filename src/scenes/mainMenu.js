import { pointerPressed , initKeys, initPointer, getPointer, onKey  } from 'kontra';
import dummyMenu from '../assets/dummy_menue.png'; 

export function MainScene(sceneManager, nextScene, canvas) {
    initKeys();
    initPointer();

    let alphaPulse = 0.3;  // Hintergrundbild Puls
    let alphaDirection = 1;
    let glowPulse = 0;      // Button-Glow
    let glowDirection = 1;
    let selected = 0;
    const options = ['Start Game', 'Quit', 'Fanpage'];

    const menuImage = new Image();
    menuImage.src = dummyMenu;   // Vite gibt hier eine URL zurück
    let menuImageLoaded = false;

    menuImage.onload = () => {
        menuImageLoaded = true;
        console.log("✅ Menu image loaded!");
    };

    // Klickbereiche definieren
    const buttonPositions = options.map((_, i) => ({
        x: canvas.width / 2,
        y: 200 + i * 50,
        width: 200,
        height: 40
    }));

    function handleSelection(index) {
        switch (index) {
            case 0: sceneManager.show(nextScene); break;
            case 1: window.close(); break;
            case 2: alert('Fanpage not yet implemented'); break;
        }
    }

    return {
        id: 'menu',

        onEnter() {
            console.log('Entering Main Scene');
            selected = 0; // Zurücksetzen der Auswahl
            initKeys();
            initPointer();
            onKey('arrowup', () => {
                selected = (selected - 1 + options.length) % options.length;
            }, 'up');
            onKey('arrowdown', () => {
                selected = (selected + 1) % options.length;
            }, 'up');
            onKey('enter', () => {
                handleSelection(selected);
            }, 'up');
        },

        update() {
            console.log('Updating Main Scene');

            // Maus
            const p = getPointer();
            if (pointerPressed('left')) {
                console.log('Pointer pressed at', p.x, p.y);

                for (let i = 0; i < buttonPositions.length; i++) {
                    const btn = buttonPositions[i];
                    const bx = btn.x - btn.width / 2;
                    const by = btn.y - btn.height / 2;

                    if (p.x >= bx && p.x <= bx + btn.width &&
                        p.y >= by && p.y <= by + btn.height) {
                        selected = i;
                        handleSelection(i);
                    }
                }
            }
        },

        render() {
            const ctx = canvas.getContext('2d');

            // Hintergrund
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Hintergrundbild mit pulsierender Transparenz
            if (menuImageLoaded) {
                ctx.globalAlpha = alphaPulse;
                ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;

                alphaPulse += 0.005 * alphaDirection;
                if (alphaPulse >= 0.7 || alphaPulse <= 0.3) alphaDirection *= -1;
            }

            // Semi-transparentes Overlay für bessere Lesbarkeit
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Titel
            const titleFont = '40px Arial';
            ctx.font = titleFont;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            ctx.fillText('Black Cat’s Hunt', canvas.width / 2, 100);
            ctx.shadowBlur = 0;

            // Buttons
            ctx.font = '24px Arial';
            buttonPositions.forEach((btn, i) => {
                // Glow-Animation nur für ausgewählten Button
                if (i === selected) {
                    glowPulse += 0.02 * glowDirection;
                    if (glowPulse >= 0.7 || glowPulse <= 0.3) glowDirection *= -1;
                } else {
                    glowPulse = 0;
                }

                // Button-Hintergrund
                ctx.fillStyle = (i === selected) ? `rgba(255,255,0,${0.5 + glowPulse/2})` : 'rgba(255,255,255,0.2)';
                ctx.beginPath();
                ctx.roundRect(btn.x - btn.width/2, btn.y - btn.height/2, btn.width, btn.height, 10);
                ctx.fill();

                // Button-Text
                ctx.fillStyle = (i === selected) ? 'yellow' : 'white';
                ctx.fillText(options[i], btn.x, btn.y);

                // Button-Rahmen
                ctx.strokeStyle = (i === selected) ? 'yellow' : 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }
        
    };
}
