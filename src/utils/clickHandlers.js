import {
  mnemonicToEntropy,
  validateMnemonic,
  generateMnemonic,
} from 'ethereum-cryptography/bip39';
import { getRandomBytesSync } from 'ethereum-cryptography/random';
import { encrypt, decrypt } from 'ethereum-cryptography/aes';
import { HDKey } from 'ethereum-cryptography/hdkey';
import { scrypt } from 'ethereum-cryptography/scrypt';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import {
  utf8ToBytes,
  bytesToUtf8,
  toHex,
  hexToBytes,
} from 'ethereum-cryptography/utils';

export const encryptWithSignataKey = async (data, signataEncryptionKey) => encrypt(
  data,
  signataEncryptionKey.encryptionKeyBytes,
  signataEncryptionKey.iv,
  'aes-256-cbc',
  true,
);

export const handleClickConfirmCreateIdentity = async (
  e,
  name,
  identities,
  signataEncryptionKey,
) => {
  // TODO:
  // 1. generate a mnemonic and create it as a HD key
  // 2. encrypt the HD key private key
  // 3. generate 3 addresses in the wallet, set the record address as the first address
  // 4. write it to localStorage
  // 5. syncronise with the service if they have cloud enabled

  const mnemonic = generateMnemonic(wordlist);
  const hdKey = HDKey.fromMasterSeed(mnemonicToEntropy(mnemonic, wordlist));
  // encrypt the key data
  const encryptedKey = await encryptWithSignataKey(
    utf8ToBytes(hdKey.privateExtendedKey),
    signataEncryptionKey,
  );
  const newIdentities = identities;
  newIdentities.push({ name, encryptedKey });
};

export const handleClickUnlockAccount = async (
  e,
  password,
  config,
  setSignataAccountKey,
  handleClickClose,
  setUnlockError,
) => {
  console.log('handleClickUnlockAccount');
  try {
    const passwordEncoded = await scrypt(
      utf8ToBytes(password),
      hexToBytes(config.salt),
      16384,
      8,
      1,
      32,
    );

    const decryptedKey = await decrypt(
      hexToBytes(config.encryptedKey),
      passwordEncoded,
      hexToBytes(config.iv),
      'aes-256-cbc',
      true,
    );
    console.log(decryptedKey);
    const hdKey = HDKey.fromExtendedKey(bytesToUtf8(decryptedKey));
    console.log(hdKey);
    if (hdKey.publicExtendedKey === config.accountId) {
      setSignataAccountKey(hdKey);
      handleClickClose();
    } else {
      setUnlockError('Incorrect Key!');
    }
  } catch (error) {
    console.error(error);
    setUnlockError(error.message);
  }
};

export const handleClickCreatePassword = async (
  e,
  newPassword,
  signataAccountKey,
  setConfig,
  handleClickClose,
  config,
) => {
  console.log('handleClickCreatePassword');
  const salt = getRandomBytesSync(32);
  const iv = getRandomBytesSync(16);
  const passwordEncoded = await scrypt(
    utf8ToBytes(newPassword),
    salt,
    16384,
    8,
    1,
    32,
  );
  const keyBytes = utf8ToBytes(signataAccountKey.privateExtendedKey);
  const encryptedKey = await encrypt(
    keyBytes,
    passwordEncoded,
    iv,
    'aes-256-cbc',
    true,
  );

  setConfig({
    ...config,
    encryptedKey: toHex(encryptedKey),
    salt: toHex(salt),
    iv: toHex(iv),
  });
  handleClickClose();
};

// export const handleClickConfirmImportIdentity = () => {
//   // TODO:
//   // 1. import the mnemonic and create it as a HD key
//   // 2. encrypt the HD key private key
//   // 3. generate 3 addresses in the wallet, set the record address as the first address
//   // 4. write it to localStorage
//   // 5. syncronise with the service if they have cloud enabled
//   console.log('handleClickConfirmImportIdentity');
//   createResetState();
//   createSend();
// };

// export const handleClickBuyCloud = () => {
//   // TODO:
//   // 1. send 20 SATA to contract for rights
//   // 2. await completed transaction
//   // 3. enable sync of localStorage to cloud service
//   console.log('handleClickBuyCloud');
//   buyCloudSend();
// };

// export const handleClickDeleteIdentity = () => {
//   console.log('handleClickDeleteIdentity');
//   // TODO:
//   // 1. construct call for the chain
//   // 2. await completed transaction
//   // 3. update state of localStorage and cloud service
//   deleteResetState();
//   deleteSend();
// };

// export const handleClickLockIdentity = () => {
//   console.log('handleClickLockIdentity');
//   // TODO:
//   // 1. construct call for the chain
//   // 2. await completed transaction
//   // 3. update state of localStorage and cloud service
//   lockResetState();
//   lockSend();
// };

// export const handleClickUnlockIdentity = () => {
//   console.log('handleClickUnlockIdentity');
//   // TODO:
//   // 1. construct call for the chain
//   // 2. await completed transaction
//   // 3. update state of localStorage and cloud service
//   unlockResetState();
//   unlockSend();
// };

// export const handleClickMigrateIdentity = () => {
//   console.log('handleClickMigrateIdentity');
//   // TODO:
//   // 1. construct call for the chain
//   // 2. await completed transaction
//   // 3. update state of localStorage and cloud service
//   migrateResetState();
//   migrateSend();
// };

// export const handleClickSaveIdentity = () => {
//   console.log('handleClickSaveIdentity');
//   // TODO:
//   // 1. construct call for the chain
//   // 2. await completed transaction
//   // 3. update state of localStorage and cloud service
// };
