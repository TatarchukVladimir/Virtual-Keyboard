import KeyBoard from './js/createKeyBoard.js';

const langMode = localStorage.getItem('lang') || 'en';
const keyBoard = new KeyBoard(langMode);
keyBoard.init();