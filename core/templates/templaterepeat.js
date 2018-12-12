import {bind} from '../util.js'
export class TemplateRepeat extends HTMLTemplateElement{
    constructor(){
        super();
        this._collection = [];
        this._as = 'item';
    }
    set collection(value){
        this._collection = value;
    }
    get collection(){
        return this._collection || [];
    }
    set as(value){
        this._as = value;
    }
    get as(){
        return this._as || 'item';
    }
    clone(){
        var template = document.createElement('template');
        this.collection.forEach(item=>{
            let obj ={};
            obj[this.as] = item;
            template.content.appendChild(bind(this,obj));
        });
        return template;
    }
}
customElements.define('pld-repeat',TemplateRepeat,{extends:'template'});