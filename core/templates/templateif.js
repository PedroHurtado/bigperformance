export  class TemplateIf extends HTMLTemplateElement{
    constructor(){
        super();
        this._expression;
    }
    set expression(value){
        this._expression = value;
    }
    get expression(){
        return this._expression || false
    }
    clone(){
        var template = document.createElement('template');
        if(this.expression){
            template.content.appendChild(this.content.cloneNode(true));
        }
        return template;
    }
}
customElements.define('pld-if',TemplateIf,{extends:'template'});
