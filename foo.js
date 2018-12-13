class XFoo extends HTMLElement {
  get placeholder(){
    return this._placeholder;
  }
  set placeholder(value){
    console.log(value)
    this._placeholder = value
  }
}

customElements.define('x-foo', XFoo);
