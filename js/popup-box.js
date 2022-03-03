import * as Util from './util.js';

export class PopupBox {
    static #instance;

    #parent;
    #parentStyleBackup;
    #backdrop;
    #onKeydownEventHandler;

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
        this.#onKeydownEventHandler = this.#onKeydown.bind(this);
        window.addEventListener('keydown', this.#onKeydownEventHandler, true);

        this.#backdrop = Util.queryElement(options.mount);

        this.#backupParentStyle();
        this.#parent.style.position = 'relative';
        this.#parent.style.overflow = 'hidden';

        const contentSelector = `${options.mount} .popup-box-contents`;
        Util.load(contentSelector, options.contents);

        this.#backdrop.style.display = 'block';
    }
    
    #backupParentStyle() {
        this.#parent = this.#backdrop.parentElement;
        const computedStyle = window.getComputedStyle(this.#parent);
        this.#parentStyleBackup = {
            position: computedStyle.position,
            overflow: computedStyle.overflow,
        };
    }    

    close() {        
        this.#restoreParentStyle();
        this.#backdrop.style.display = 'none';
    }

    #restoreParentStyle() {
        const style = this.#parent.style;
        const backedupStyle = this.#parentStyleBackup;
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