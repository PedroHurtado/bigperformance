import {bind} from './core/index.js'
class ToolBar extends HTMLElement {
    constructor() {
        super();
        this._template = document.getElementById('template');
        const node = bind(this._template,this);
        this.appendChild(node); // TODO: meter los hijos y no el body entero
    }
    get textPlaceHolder(){
        return 'Search';
    }
    get collection(){
        return [{id:1},{id:2},{id:3}];
    }
    get image(){
        return 'assets/img/Paladin_LOGO_white_no_text.png';
    }
    get expression(){
        return true;
    }
}

customElements.define('pld-toolbar', ToolBar);
