export default class Key {
    constructor(elem) {
        let key = document.createElement('div');
    
        key.innerText = elem.small; 
        key.className = `key ${elem.code.toLowerCase()}`;

        return key;
    }
}