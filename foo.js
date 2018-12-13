class XFoo extends HTMLElement {
  constructor(){
    super();
    console.log('ctor')
  }
  get placeholder(){
    return this._placeholder;
  }
  set placeholder(value){
    console.log(value)
    this._placeholder = value
  }
  connectedCallback(){
    this.innerHTML = `<h1>FOO: ${this.placeholder}</h1>`
  }
}

customElements.define('x-foo', XFoo);
