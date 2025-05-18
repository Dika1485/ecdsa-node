const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
    // The first byte indicates whether this is in compressed form or not
    const hash = keccak256(publicKey.slice(1));
    return toHex(hash.slice(-20)).toUpperCase();
}

const privateKey = secp.utils.randomPrivateKey();

console.log('private key    : ', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('public key     : ', toHex(publicKey));

const address = `0x${getAddress(publicKey)}`;

console.log('address        : ', address);