import { keyPressed, initKeys, initPointer  } from 'kontra';

export function MainScene(sceneManager, nextScene, canvas) {
    initKeys();
    initPointer();

    let selected = 0;
    const options = ['Start Game', 'Quit', 'Fanpage'];


    return {
        id: 'menu',
        onEnter() {
           
        },

        update() {
            console.log('Updating Main Scene');
            if(keyPressed('arrowup')) selected = (selected - 1 + options.length) % options.length;
            if(keyPressed('arrowdown')) selected = (selected + 1) % options.length;
            if(keyPressed('enter')) {
                switch(selected){
                    case 0: sceneManager.show(nextScene); break;
                    case 1: window.close(); break;
                    case 2: alert('Fanpage not yet implemented'); break;
                
                }
            }
        },
        render() {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Hintergrund
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Titel
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Black Cat’s Hunt', canvas.width / 2, 100);

            // Optionen
            ctx.font = '24px Arial';
            options.forEach((text, i) => {
                ctx.fillStyle = (i === selected) ? 'yellow' : 'white';
                ctx.fillText(text, canvas.width / 2, 200 + i * 50);
            });
        },

        onExit() {
            console.log('Exiting Main Scene');
        },
        
    };
}