import {bind} from './core/index.js'
class ToolBar extends HTMLElement {
    constructor() {
        super();
        this._template = document.getElementById('template');
        const node = bind(this._template,this);
        debugger;
        this.appendChild(node);
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
