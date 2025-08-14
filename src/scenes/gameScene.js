import kontra, { keyPressed, initKeys, initPointer, onKey    } from 'kontra';
import { Cat } from '../entities/cat';
import { Mouse } from '../entities/mouse';

export function GameScene(sceneManager, nextScene, canvas) {
    let cat = null;
    let mice = [];
    let score = 0;
    let energy = 0;
    let maxEnergy = 0;
    let health = 0;
    let maxHealth = 0;
    let showCircle = false;
    let circleTimeout = null;


    const tileSize = 40;
    let caveTiles = [];


    for (let y = 0; y < canvas.height; y += tileSize) {
        caveTiles[y] = [];
        for (let x = 0; x < canvas.width; x += tileSize) {
            let isWall = (
                y === 0 ||
                y >= canvas.height - tileSize ||
                x === 0 ||
                x >= canvas.width - tileSize
            );
    
            if (isWall) {
                caveTiles[y].push({
                    x,
                    y,
                    isWall: true,
                    color: '#1a1a1a',
                    spots: []
                });
            } else {
                const colors = ['#2b2b2b', '#353535', '#3d3d3d', '#292929'];
                let color = colors[Math.floor(Math.random() * colors.length)];
    
                let spots = [];
                for (let i = 0; i < 3; i++) {
                    spots.push({
                        x: Math.random() * tileSize,
                        y: Math.random() * tileSize,
                        r: Math.random() * 3
                    });
                }
    
                caveTiles[y].push({ x, y, isWall: false, color, spots });
            }
        }
    }

    function spawnMouse() {
        let randX = Math.random() * (canvas.width - 20);
        let randY = Math.random() * (canvas.height - 20);
        return new Mouse(randX, randY);
    }

    return {
        id: 'game',
        onEnter() {
            energy = 100;
            maxEnergy = 100;
            health = 100;
            maxHealth = 100;
            initPointer();
            initKeys();
            cat = new Cat(100, 80, 'black');
            mice = Array.from({ length: 5 }, () => spawnMouse());
            onKey('j', () => {
                showCircle = true;
                if (circleTimeout) {
                    clearTimeout(circleTimeout);
                }

                circleTimeout = setTimeout(() => {
                    showCircle = false;
                    circleTimeout = null;
                }, 1000); 
            }, 'up')
            onKey('esc', () => {
                sceneManager.show('menu');
            }, 'down');
        },

        update() {
            let inputX = 0;
            let inputY = 0;

            if (keyPressed('w')) inputY -= 1;
            if (keyPressed('s')) inputY += 1;
            if (keyPressed('a')) inputX -= 1;
            if (keyPressed('d')) inputX += 1;
            
            if (keyPressed('k')) {
                mice.forEach(mouse => {
                    mouse.setState('flee', 20);
                });
            }
            if (keyPressed('l')) {
                mice.forEach(mouse => {
                    mouse.setState('chase', 10);
                });
            }
            
            cat.update(inputX, inputY, canvas);
            mice.forEach((mouse, index) => {
                mouse.update(canvas, cat.sprite);
                if (this.checkCollision(cat.sprite, mouse.sprite)) {
                    if(showCircle){
                        score++;
                        mice.splice(index, 1);
                    } else {
                        health -= 10;
                        mice.splice(index, 1);
                        setTimeout(() => {
                            console.log('Neuer Maus gespawnt: ' + mice.length);
                            mice.push(spawnMouse());
                        }, 2000)
                    }
                    if (health <= 0) {
                        sceneManager.show('menu');
                        return;
                    }  
                }
            });
            
        },

        render() {
            let ctx = canvas.getContext('2d');
        
            // Hintergrund löschen
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            // Boden zeichnen
            caveTiles.forEach(row => {
                row.forEach(tile => {
                    ctx.fillStyle = tile.color;
                    ctx.fillRect(tile.x, tile.y, tileSize, tileSize);
        
                    // Felsflecken nur auf Boden
                    if (!tile.isWall) {
                        ctx.fillStyle = 'rgba(0,0,0,0.1)';
                        tile.spots.forEach(spot => {
                            ctx.beginPath();
                            ctx.arc(tile.x + spot.x, tile.y + spot.y, spot.r, 0, Math.PI * 2);
                            ctx.fill();
                        });
                    }
                });
            });
        
            // Game-Objekte
            cat.render();
            mice.forEach(mouse => mouse.render());
        
            // UI
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, 10, 20);
            ctx.fillText(`Health: ${health}/${maxHealth}`, 10, 50);
            ctx.fillText(`Energy: ${energy}/${maxEnergy}`, 10, 80);

            
            // Kreis zeichnen, wenn aktiv
            if (showCircle) {
                ctx.beginPath();
                ctx.arc(
                    cat.sprite.x + cat.sprite.width / 2,
                    cat.sprite.y + cat.sprite.height / 2,
                    44,
                    0,
                    Math.PI * 2
                );
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        },

        checkCollision(a, b) {
            return (
                a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y
            );
        }
    };
}