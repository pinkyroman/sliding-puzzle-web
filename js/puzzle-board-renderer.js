import { PuzzleBoardMap } from "./puzzle-board-map.js";

export class PuzzleBoardRenderer {
    #parentElem;
    #tiles;
    #map;

    constructor(parentElem, tiles, map) {
        if (parentElem == null) {
            this.throwIntancitationFailedException(`invalid 'parentElem': ${parentElem}`);
        }
        this.#parentElem = parentElem;

        if (tiles == null) {
            this.#throwIntancitationFailedException(`invalid 'tiles': ${tiles}`);
        }
        this.#tiles = tiles;

        if (map == null) {
            this.#throwIntancitationFailedException(`invalid 'map': ${map}`);
        }
        this.#map = map;
    }

    #throwIntancitationFailedException(e) {
        throw new Error(`failed to create a PuzzleBoardRenderer instance: ${e}`);
    }

    render() {
        const fragments = new DocumentFragment();
        const map = this.#map;

        for (const mapObj of map) {
            if (PuzzleBoardMap.objectIsBlankTile(mapObj)) {
                continue;
            }

            const tile = this.#tiles.getTile(mapObj.id);
            this.setTilePosition(tile, mapObj);
            fragments.append(tile);
        }

        this.#parentElem.innerHTML = '';
        this.#parentElem.appendChild(fragments);
    }

    setTilePosition(tile, pos) {
        const style = tile.style;
        const tileSize = this.#tiles.tileSize;

        style.top = `${pos.row * tileSize}px`;
        style.left = `${pos.col * tileSize}px`;
    }
}