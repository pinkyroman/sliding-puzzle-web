export const BLANK_TILE = -1;
export const Direction = Object.freeze({
    Up: Symbol('up'),
    Right: Symbol('right'),
    Down: Symbol('down'),
    Left: Symbol('left'),
    None: Symbol('none')
});

const directionCheckData = {
    [Direction.Up]: {
        key: 'row',
        value: -1,
    },
    [Direction.Right]: {
        key: 'col',
        value: 1,
    },
    [Direction.Down]: {
        key: 'row',
        value: 1,
    },
    [Direction.Left]: {
        key: 'col',
        value: -1,
    },
};

export class TileMap {
    #size;
    #map;

    constructor(size) {
        if (size < 2) {
            throw new Error(`size is too small: ${size}`);
        }
        this.#size = size;
        this.#initialize();
    }

    #initialize() {
        this.#map = {};
        const map = this.#map;
        const size = this.#size;        
        let objId = 0;
        
        for (let row = 0; row < size; row++) {
            map[row] = [];
            for (let col = 0; col < size; col++) {
                map[row].push(objId++);
            }
        }
        map[size - 1][size - 1] = BLANK_TILE;
    }

    [Symbol.iterator]() {
        const map = this.#map;
        const size = this.#size;
        let row = 0;
        let col = 0;

        return {
            next() {
                if (row === size) {
                    return { done: true };
                }
                
                const id = map[row][col];
                const currentCol = col;
                const currentRow = row;

                if (++col === size) {
                    col = 0;
                    row++;
                }

                return { 
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
        const pos = this.#getPosition(id);
        if (!pos) {
            throw new Error(`an element with id: ${id} not found.`);
        }

        for (const dir of [Direction.Up, Direction.Right, Direction.Down, Direction.Left]) {
            const targetPos = {...pos};
            const checkData = directionCheckData[dir];
            const key = checkData.key;
            targetPos[key] += checkData.value;

            if ((targetPos[key] >= 0 && targetPos[key] < this.#size) && this.#map[targetPos.row][targetPos.col] === BLANK_TILE) {
                this.#moveMapObject(pos, targetPos);
                return dir;
            }
        }
        return Direction.None;
    }

    #getPosition(id) {
        return [...this].find((item) => {
            if (item.id === id) {
                return {
                    row: item.row,
                    col: item.col,
                };
            }
        });
    }

    #moveMapObject(from, to) {
        const map = this.#map;        
        const temp = map[from.row][from.col];        
        map[from.row][from.col] = map[to.row][to.col];
        map[to.row][to.col] = temp;
    }

    get resolved() {
        const map = this.#map;
        const blankRow = this.#size - 1;
        const blankCol = blankRow;
        let id = 0;

        for (const item of this) {
            if (item.id !== id) {
                if (item.row === blankRow 
                    && item.col === blankCol 
                    && item.id === BLANK_TILE) {
                    return true;
                }
                return false;
            }    
            id++;
        }
        return true;
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
        const size = this.#size;
        function random() {
            return Math.floor(Math.random() * size);
        }

        return {
            row: random(),
            col: random(),
        }
    }

    reset() {
        this.#initialize();
    }
}