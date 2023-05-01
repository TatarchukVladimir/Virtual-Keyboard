export default class Key {
  constructor(elem) {
    this.key = document.createElement('div');

    this.key.innerText = elem.small;
    this.key.className = `key ${elem.code.toLowerCase()}`;
  }

  init() {
    return this.key;
  }
}
