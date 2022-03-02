import * as Util from './util.js';
import { PuzzleBoard } from "./puzzle-board.js";

export class SlidingPuzzleGame {
    // 어플리케이션 버전
    #version = '0.2.0';
    
    // 'app' 및 'version'에 대한 HTML 엘리먼트 레퍼런스
    #appElem;    
    #versionElem;
    
    // PuzzleBoard 인스턴스
    #board;

    /* options: {
        app: 'query selector',          // 필수 옵션
        version: 'query selector',      // 필수 옵션
        board: {                        // 필수 옵션
            elem: 'query selector',     // 필수 옵션
            dimension: number,          // 생략 시, 3 (n: n x n 타일 생성)
            images: [array of string],  // 필수 옵션
            defaultImageIndex: number,  // 생략 시, 0
        }
    }
    */
    constructor(options) {
        window.addEventListener('DOMContentLoaded', this.#initialize(options));
    }

    #initialize(options) {
        return e => {
            try {
                if (options == null) {
                    throw new Error(`application option is null.`);
                }
    
                this.#appElem = Util.queryElement(options.app);
                this.#setVersion(options);
                this.#board = new PuzzleBoard(options.board);
            } catch (e) {
                throw e;
            }    
        }
    }

    #setVersion(options) {
        this.#versionElem = Util.queryElement(options.version);            
        this.#versionElem.innerText = `Version ${this.#version}`;
    }
}