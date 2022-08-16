import CryptoJS from 'crypto-js';
import SecureStorage from 'secure-web-storage';

const secureStorage = (password) => new SecureStorage(localStorage, {
  hash: function hash(key) {
    const hashedKey = CryptoJS.SHA256(key, password);
    return hashedKey.toString();
  },
  encrypt: function encrypt(data) {
    const newData = CryptoJS.AES.encrypt(data, password);
    return newData.toString();
  },
  decrypt: function decrypt(data) {
    const newData = CryptoJS.AES.decrypt(data, password);
    return newData.toString(CryptoJS.enc.Utf8);
  },
});

export default secureStorage;
