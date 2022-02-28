const DefaultTileSize = 3;

export class PuzzleBoardTiles {
    #url;
    #dimension;
    #tileSize;
    #callback;

    // 퍼즐 이미지 타일로 사용되는 엘리먼트 배열
    #tiles = [];

    /* options: {
        imageUrl: string,   // 필수 옵션
        dimension: number,  // 생략 시, 3 (n: n x n 타일 생성)
        boardSize: number,  // 필수 옵션
        completed: function  // 선택 옵션
    }
    */
    constructor(options) {
        try {
            if (options == null) {
                this.#throwInstantiatingFailedException(`invalid 'options': ${options}`);
            }

            this.#dimension = options.dimension ?? DefaultTileSize;
            this.#setImageUrl(options);
            this.#setBoardAndTileSize(options);
            this.#callback = options.initialized ?? (() => () => {
                console.warn('[PuzzleBoardTiles] no callback provided.');
            })();

            this.#createTiles();
        } catch (e) {
            this.#throwInstantiatingFailedException(e);
        }
    }

    #throwInstantiatingFailedException(e) {
        throw new Error(`failed to create a PuzzleBoardTiles instance: ${e}`);
    }

    #setImageUrl(options) {
        const imageUrl = options.imageUrl ?? undefined;
        if (imageUrl == null) {
            this.#throwInstantiatingFailedException(`invalid 'imageUrl': is null.`);
        }
        this.#url = imageUrl;
    }

    #setBoardAndTileSize(options) {
        const boardSize = options.boardSize ?? undefined;
        if (boardSize == null || boardSize <= 0) {
            this.#throwInstantiatingFailedException(`invalid board size: 'boardSize' = ${boardSize}, 'boardHeight' = ${boardHeight}`);
        }
        this.#tileSize = Math.floor(boardSize / this.#dimension);
    }

    #createTiles() {
        const tiles = this.#tiles;
        const dimension = this.#dimension;
        const canvasElem = document.createElement('canvas');
        const ctx = canvasElem.getContext('2d');
        const image = new Image();
        image.src = this.#url;

        image.onload = () => {
            const imageSliceWidth = canvasElem.width = Math.floor(image.width / dimension);
            const imageSliceHeight = canvasElem.height = Math.floor(image.height / dimension);
            const numberOfTiles = dimension * dimension - 1;

            for (let tileNo = 0; tileNo < numberOfTiles; tileNo++) {
                const sx = imageSliceWidth * (tileNo % dimension);
                const sy = imageSliceHeight * Math.floor(tileNo / dimension);

                ctx.drawImage(image, sx, sy, imageSliceWidth, imageSliceHeight, 0, 0, imageSliceWidth, imageSliceHeight);
                tiles.push(this.#createTile(tileNo, canvasElem.toDataURL()));
            }

            this.#callback();
        };
    }

    #createTile(id, url) {
        const tile = document.createElement('div');
        tile.id = id;
        tile.classList.add('puzzle-board-tile');

        const style = tile.style;
        const tileSize = this.#tileSize;
        style.width = `${tileSize}px`;
        style.height = `${tileSize}px`;
        style.backgroundImage = `url(${url})`;
        style.backgroundSize = `${tileSize}px ${tileSize}px`;
        
        return tile;
    }

    get tileSize() {
        return this.#tileSize;
    }

    getTile(id) {
        const tile = this.#tiles[id];
        if (tile == null) {
            console.warn(`[PuzzleBoardTiles] tile not found for id: ${id}`);
            return;
        }
        return tile;
    }
}