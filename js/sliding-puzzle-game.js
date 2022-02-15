import { Tiles } from './tiles.js';

export class SlidingPuzzleGame {
    /* options:
        - size: number
        - imageUrl: string
        - board: HTMLElement
        - shuffleButton: string
        - resetButton: string
    */
    #tiles;
    #board;
    #shuffleButton;
    #resetButton;
    
    constructor(options) {
        if (document.readyState === 'complete') {
            this.#initialize(options);
            return;
        }
        window.addEventListener('DOMContentLoaded', () => {
            this.#initialize(options);
        });
    }

    #initialize(options) {
        const imageUrl = options?.imageUrl ?? './images/puzzle.jpg';
        const size = options?.size ?? 2;
        const board = this.#getElement(options?.board ?? 'board');
        const boardWidth = board.clientWidth;
        const boardHeight = board.clientHeight;

        this.#tiles = new Tiles(imageUrl, size, boardWidth, boardHeight, () => {
            this.#setupButtons(options);            
            board.appendChild(this.#tiles.elements);
            this.#board = board;
        });
    }

    #getElement(id) {
        const elem = document.getElementById(id);
        if (elem == null) {
            throw new Error(`invalid element id: '${id}'`);
        }
        return elem;
    }

    #setupButtons(options) {
        this.#shuffleButton = this.#getElement(options?.shuffleButton ?? 'shuffle-button');
        this.#resetButton = this.#getElement(options?.resetButton ?? 'reset-button');

        this.#shuffleButton.addEventListener('click', () => {
            this.#tiles.shuffle();
            this.#updateBoard();
        });

        this.#resetButton.addEventListener('click', () => {
            this.#tiles.reset();
            this.#updateBoard();
        });
    }

    #updateBoard() {
        const board = this.#board;
        board.innerHTML = '';
        board.appendChild(this.#tiles.elements);
    }
}