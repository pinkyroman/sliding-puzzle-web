import * as Util from './util.js';
import { PuzzleBoardMap } from './puzzle-board-map.js';
import { PuzzleBoardTiles } from './puzzle-borad-tiles.js';
import { PuzzleBoardRenderer } from './puzzle-board-renderer.js';

export class PuzzleBoard {
    // 보드 엘리먼트 레퍼런스
    #elem;
    // 어플리케이션 요소 가로/세로 크기    
    #size;
    // PuzzleBoardTiles 인스턴스
    #tiles;
    // PuzzleBoardMap 인스턴스
    #map;
    // PuzzleBoardRenderer 인스턴스
    #renderer;
    // 타일 이미지
    #images;
    #selectedImageIndex;

    /* options: {
        elem: 'query selector',     // 필수 옵션
        dimension: number,          // 생략 시, 3 (n: n x n 타일 생성)
        images: [array of string],  // 필수 옵션
        defaultImageIndex: number,  // 생략 시, 0
    }
    */
    constructor(options) {
        try {
            if (options == null) {
                this.#throwIntancitationFailedException(`invalid 'options': ${options}`);
            }
            
            this.#setupBoardElement(options);
            this.#setupImages(options);

            this.#tiles = new PuzzleBoardTiles({
                imageUrl: this.#images[this.#selectedImageIndex],
                dimension: options.dimension, 
                boardSize: this.#size, 
                initialized: () => {
                    this.#map = new PuzzleBoardMap(options.dimension);
                    this.#renderer = new PuzzleBoardRenderer(this.#elem, this.#tiles, this.#map);

                    this.#renderer.render();
                }
            });
        } catch (e) {            
            this.#throwIntancitationFailedException(e);
        }
    }

    #throwIntancitationFailedException(e) {
        throw new Error(`failed to create a PuzzleBoard instance: ${e}`);
    }

    #setupBoardElement(options) {
        const elem = Util.queryElement(options.elem);
        elem.addEventListener('click', this.#onBoardClick.bind(this));
        elem.style.height = window.getComputedStyle(elem).width

        this.#elem = elem;
        this.#size = elem.clientWidth;
    }

    #setupImages(options) {
        const images = options.images ?? null;
        if (images.length == null) {
            throw new Error(`invalid 'images': ${images}`);
        }

        const index = options.defaultImageIndex ?? 0;
        if (index < 0 || index >= images.length) {
            throw new Error(`'defaultImageIndex' is out of range: ${index}`);
        }

        this.#images = images;        
        this.#selectedImageIndex = index;
    }

    #onBoardClick(e) {
        const target = e.target;
        if (!target.matches('div.puzzle-board-tile')) {
            return;
        }

        const newPosition = this.#map.tryMove(target.id);
        if (newPosition) {
            this.#renderer.setTilePosition(target, newPosition);
        }
    }
}