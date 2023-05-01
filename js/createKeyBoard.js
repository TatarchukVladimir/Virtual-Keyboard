import languages from './lang/lang.js';
import Key from './createKey.js';

export default class KeyBoard {
  constructor(langMode) {
    this.currentLang = langMode;
    this.container = document.createElement('div');
    this.header = document.createElement('h1');
    this.textArea = document.createElement('textarea');
    this.description = document.createElement('div');
    this.keyBoard = null;
    this.keyList = null;
    this.leters = null;
    this.caps = false;
    this.shift = false;

    this.container.className = 'keyContainer';
    this.header.className = 'head';
    this.textArea.className = 'textArea';
    this.textArea.autofocus = true;
    this.description.className = 'description';

    this.header.innerText = 'Virtual Keyboard';
    this.description.innerHTML = 'Keyboard for Windows.<br>Switch language on click: AltLeft + ShiftLeft or key on virtual board.';

    document.body.prepend(this.container);
    this.container.append(this.header);
    this.container.append(this.textArea);
    this.container.append(this.description);
  }

  init() {
    this.createKeyboard();

    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('key')) {
        this.handClick(e.target);
      }

      this.textArea.focus();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'ShiftLeft' && e.altKey) {
        const lang = document.querySelector('.lang');
        this.changeLang(lang);
      }

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!this.caps) {
          this.shiftModeOn();
        } else {
          this.shiftModeOn();
          this.shiftCapsModeOn();
        }
      }

      if (e.code === 'Tab') {
        e.preventDefault();
        this.inputChar('\t');
      }

      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        e.preventDefault();
      }

      if (e.code === 'CapsLock') {
        this.capsMode();
      } else {
        this.addStyleToPressKey(e.code, this.keyList);
      }

      this.textArea.focus();
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!this.caps) {
          this.shiftModeOff();
        } else {
          this.shiftModeOff();
          this.shiftCapsModeOff();
        }
      }

      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        e.preventDefault();
      }

      if (e.code === 'CapsLock') {
        return;
      }
      this.removeStyleToPressKey(e.code, this.keyList);

      this.textArea.focus();
    });
  }

  createKeyboard() {
    this.keyBoard = document.createElement('div');
    this.container.append(this.keyBoard);

    this.keyBoard.className = 'board';

    languages[this.currentLang].forEach((elem) => {
      const key = new Key(elem);
      this.keyBoard.append(key.init());
    });

    this.keyList = this.keyBoard.children;

    return this.keyBoard;
  }

  handClick(target) {
    if (target.classList.contains('lang')) {
      this.changeLang(target, this);
    } else if (target.innerText === 'CapsLock') {
      this.capsMode();
    } else if (target.innerText === 'Shift') {
      this.shiftMode(target);
    } else if (target.innerText === 'Space') {
      this.inputChar(' ');
    } else if (target.innerText === 'Tab') {
      this.inputChar('\t');
    } else if (target.innerText === 'Enter') {
      this.inputChar('\n');
    } else if (['Backspace', 'Del'].includes(target.innerText)) {
      this.deleteChar(target.innerHTML);
    } else {
      this.inputChar(target.innerText);
    }
  }

  inputChar(char) {
    this.textArea.setRangeText(char, this.textArea.selectionStart, this.textArea.selectionEnd, 'end');
  }

  deleteChar(target) {
    const cursorPosition = this.textArea.selectionStart;
    const currentValue = this.textArea.value;

    if (target === 'Backspace') {
      if (cursorPosition === 0) return;
      this.textArea.value = currentValue.slice(0, cursorPosition - 1)
          + currentValue.slice(cursorPosition);
      this.textArea.selectionStart = cursorPosition - 1;
      this.textArea.selectionEnd = cursorPosition - 1;
      return;
    }
    if (target === 'Del') {
      this.textArea.value = currentValue.slice(0, cursorPosition)
          + currentValue.slice(cursorPosition + 1);
      this.textArea.selectionStart = cursorPosition;
      this.textArea.selectionEnd = cursorPosition;
    }
  }

  changeLang(target) {
    this.currentLang = target.innerHTML.toLowerCase();

    let i = 0;
    this.keyBoard.childNodes.forEach((el) => {
      const elem = el;
      elem.innerText = languages[this.currentLang][i].small;
      i += 1;
    });

    localStorage.setItem('lang', this.currentLang);
  }

  capsMode() {
    this.leters = document.querySelectorAll('.caps');
    const capsLockKey = document.querySelector('.capslock');

    this.leters.forEach((el) => {
      const val = el;
      if (this.shift === false) {
        val.innerText = (!this.caps) ? val.innerText.toUpperCase() : val.innerText.toLowerCase();
      } else {
        val.innerText = (this.caps) ? val.innerText.toUpperCase() : val.innerText.toLowerCase();
      }
    });

    capsLockKey.classList.toggle('capsActive');

    this.caps = !(this.caps);
  }

  shiftMode(target) {
    if (!this.caps) {
      if (this.shift) {
        this.shiftModeOff();
        target.classList.remove('key__active');
        this.shift = false;
      } else {
        this.shiftModeOn();
        target.classList.add('key__active');
        this.shift = true;
      }
    }

    if (this.caps) {
      if (this.shift) {
        this.shiftModeOff();
        this.shiftCapsModeOff();
        target.classList.remove('key__active');
        this.shift = false;
      } else {
        this.shiftModeOn();
        this.shiftCapsModeOn();
        target.classList.add('key__active');
        this.shift = true;
      }
    }
  }

  shiftModeOff() {
    let i = 0;

    this.keyBoard.childNodes.forEach((el) => {
      const val = el;
      val.innerText = languages[this.currentLang][i].small;
      i += 1;
    });
  }

  shiftModeOn() {
    let i = 0;

    this.keyBoard.childNodes.forEach((el) => {
      const val = el;
      val.innerText = languages[this.currentLang][i].shift;
      i += 1;
    });
  }

  shiftCapsModeOn() {
    this.leters = document.querySelectorAll('.caps');

    Array.from(this.leters).forEach((el) => {
      const val = el;
      val.innerText = val.innerText.toLowerCase();
    });
  }

  shiftCapsModeOff() {
    this.leters = document.querySelectorAll('.caps');

    Array.from(this.leters).forEach((el) => {
      const val = el;
      val.innerText = val.innerText.toUpperCase();
    });
  }

  addStyleToPressKey(pressKey) {
    Array.from(this.keyList).forEach((el) => {
      const val = el;
      if (val.classList.contains(pressKey.toLowerCase())) {
        val.classList.add('key__active');
      }
    });
  }

  removeStyleToPressKey(pressKey) {
    Array.from(this.keyList).forEach((el) => {
      const val = el;
      if (val.classList.contains(pressKey.toLowerCase())) {
        val.classList.remove('key__active');
      }
    });
  }
}
