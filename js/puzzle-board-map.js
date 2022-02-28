export const BLANK_TILE = -1;

const Directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
]

export class PuzzleBoardMap {
    // 보드 크기
    #dimension;
    /* 보드의 타일 맵: {
        r1: [c1, c2, c3, ... ],
        r2: [c1, c2, c3, ... ],
        ...
    }
    */
    #map;

    constructor(dimension) {
        if (dimension < 2) {
            this.#throwIntancitationFailedException(`dimension is too small: ${dimension}`);
        }        
        this.#dimension = dimension;
        this.reset();
    }

    #throwIntancitationFailedException(e) {
        throw new Error(`failed to create a PuzzleBoardMap instance: ${e}`);
    }

    reset() {
        this.#map = {};
        const map = this.#map;
        const dimension = this.#dimension;        
        let tileId = 0;
        
        for (let row = 0; row < dimension; row++) {
            map[row] = [];
            for (let col = 0; col < dimension; col++) {
                map[row].push(tileId++);
            }
        }
        map[dimension - 1][dimension - 1] = BLANK_TILE;
    }

    static objectIsBlankTile(obj) {
        return obj.id === BLANK_TILE;
    }

    [Symbol.iterator]() {
        const map = this.#map;
        const dimension = this.#dimension;
        let row = 0;
        let col = 0;

        return {
            next() {
                if (row === dimension) {
                    return { done: true };
                }
                
                const id = map[row][col];
                const currentCol = col;
                const currentRow = row;

                if (++col === dimension) {
                    col = 0;
                    row++;
                }

                return { 
                    // 실제 맵 데이터(ID 값)를 반환하는 것이 아니라,
                    // 임의의 부가정보를 추가한 객체를 반환.
                    value: {
                        row: currentRow,
                        col: currentCol,
                        id: id,
                    }, 
                    done: false 
                };
            }
        };
    }

    tryMove(id) {
        const mapObj = this.#getMapObject(id);
        if (!mapObj) {
            return undefined;
        }

        for (const d of Directions) {
            const targetPos = {
                row: mapObj.row + d.row,
                col: mapObj.col + d.col,
            }
            const targetId = this.#getMapObjectIdByPosition(targetPos.row, targetPos.col);
            if (targetId && targetId === BLANK_TILE) {
                const targetObj = this.#getMapObject(targetId);
                this.#moveMapObject(mapObj, targetObj);
                return targetPos;
            }
        }
        return undefined;
    }
    
    #getMapObject(id) {
        return [...this].find((obj) => {
            if (obj.id == id) {
                return obj;
            }
        });
    }

    #getMapObjectIdByPosition(row, col) {
        return (row >= 0 && col >= 0) && (row < this.#dimension && col < this.#dimension) ?
            this.#map[row][col] : undefined;
    }

    #moveMapObject(from, to) {
        const map = this.#map;        
        const temp = map[from.row][from.col];        
        map[from.row][from.col] = map[to.row][to.col];
        map[to.row][to.col] = temp;
    }

    shuffle(count = 100) {
        for (let i = 0; i < count; i++) {
            this.#moveMapObject(
                this.#getRandomPosition(), 
                this.#getRandomPosition()
            );
        }
    }

    #getRandomPosition() {
        function random() {
            return Math.floor(Math.random() * this.#dimension);
        }
        return {
            row: random(),
            col: random(),
        }
    }
}