import { SlidingPuzzleGame } from './sliding-puzzle-game.js';

try {
    new SlidingPuzzleGame({
        app: '#app',
        version: '#app-version',
        board: {
            elem: '#puzzle-board', 
            dimension: 3,
            images: [
                './images/puzzle.jpg',
                './images/na-bros.jpg',
                './images/metallica-master-of-puppets.jpg',
                './images/sakai-izumi.jpg',
                './images/dio-holy-diver.jpg',
                './images/judas-priest-sad-wings-of-destiny.jpg',        
            ],
            defaultImageIndex: 1,
        },
    });
} catch (e) {
    console.error(e);
}
