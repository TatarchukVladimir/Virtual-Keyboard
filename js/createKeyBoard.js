import languages from './lang/lang.js';
import Key from './createKey.js';

export default class KeyBoard {
  constructor(langMode) {
    this.currentLang = langMode;
  }

  init() {
    this.createKeyboard();
    
    document.querySelector('.lang').addEventListener('click', (event) => {
      this.changeLang(event.target, this);
    });

    document.querySelector('.capslock').addEventListener('click', (event) => {
      this.capsMode(event.target);
    });
  }

  createKeyboard() {
    const container = document.createElement('div');
    const board = document.createElement('div');
    const textArea = document.createElement('textarea');

    document.body.prepend(container);
    container.append(textArea, board);

    container.className = 'keyContainer';
    textArea.className = 'textArea';
    board.className = 'board';

    for (let elem  of languages[this.currentLang]) {
      let key = new Key(elem);
      board.append(key);
    }

    return board;
  }

  changeLang(target) {
    document.body.innerHTML = null;
    
    this.currentLang = target.innerHTML.toLowerCase();

    this.init();
    
    localStorage.setItem('lang', this.currentLang);
  }

  capsMode(target) {
    const leters = document.querySelectorAll('.caps');
    
    leters.forEach(val => {
      val.classList.toggle('capsMode'); 
    });

    target.classList.toggle('capsActive');
  }

}