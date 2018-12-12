import {bind} from './core/index.js'
class ToolBar extends HTMLElement {
    constructor() {
        super();
        this._template = document.getElementById('template');
        this.appendChild(bind(this._template,this));
    }
    get textPlaceHolder(){
        return 'Search';
    }
    get collection(){
        return [{id:1},{id:2},{id:3}];
    }
    get expression(){
        return false;
    }
}

customElements.define('pld-toolbar', ToolBar);