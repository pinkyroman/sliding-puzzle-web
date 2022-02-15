import { SlidingPuzzleGame } from './sliding-puzzle-game.js';

const images = [
    './images/puzzle.jpg',
    './images/na-bros.jpg',
    './images/metallica-master-of-puppets.jpg',
    './images/sakai-izumi.jpg',
    './images/dio-holy-diver.jpg',
    './images/judas-priest-sad-wings-of-destiny.jpg',
];

try {
    new SlidingPuzzleGame({
        size: 3,
        imageUrl: images[1],
        board: 'board',
        shuffleButton: 'shuffle-button',
        resetButton: 'reset-button',
    });
} catch (e) {
    console.error(e);
}
