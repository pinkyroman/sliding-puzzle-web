import * as Util from './util.js';

export class PopupBox {
    static #instance;

    #element;
    #parentElement;
    #onKeydownEventHandler;
    #parentElementStyleBackup;


    constructor() {
        if (PopupBox.#instance) {
            return PopupBox.#instance;
        }

        this.#initialize();
        PopupBox.#instance = this;
    }

    #initialize() {
    }

    show(options) {
        this.#element = Util.queryElement(options.mount);

        this.#backupParentStyle();
        this.#parentElement.style.position = 'relative';
        this.#parentElement.style.overflow = 'hidden';

        // TODO: load contents ...

        this.#element.style.display = 'block';

        this.#onKeydownEventHandler = this.#onKeydown.bind(this);
        window.addEventListener('keydown', this.#onKeydownEventHandler, true);
    }
    
    #backupParentStyle() {
        this.#parentElement = this.#element.parentElement;
        const computedStyle = window.getComputedStyle(this.#parentElement);
        this.#parentElementStyleBackup = {
            position: computedStyle.position,
            overflow: computedStyle.overflow,
        };
    }    

    close() {        
        this.#restoreParentStyle();
        this.#element.style.display = 'none';
    }

    #restoreParentStyle() {
        const style = this.#parentElement.style;
        const backedupStyle = this.#parentElementStyleBackup;
        style.position = backedupStyle.position;
        style.overflow = backedupStyle.overflow;
    }

    #onKeydown(e) {
        if (e.key === 'Escape') {
            e.stopPropagation();
            this.close();

            window.removeEventListener('keydown', this.#onKeydownEventHandler, true);
        }
    }
}