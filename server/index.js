const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp, recoverPublicKey } = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

// Initialize with some balances (use actual addresses from your generated keys)
// PS C:\Users\ASUS\Documents\ecdsa-node\server> node .\generateKeys.js
// private key    :  7b31309f8296a6af55135c49c1d9dcbe303d012efa50de53d4aebf8b613757fb
// public key     :  04974f9cc3521d24dd02a2424e49577cce14136c3143a2b6e8e9130b70505b0688891905bbf4b28747e33183b0f08a09d37f26
// address        :  0x35759F0700BB6BFDBC85526AFAE8479672E2BA09
// PS C:\Users\ASUS\Documents\ecdsa-node\server> node .\generateKeys.js
// private key    :  29aa087391fda1cf604944674dfa956763ab600bec9b69440b5399591a559c28
// public key     :  04d59bbd6a0dd6bc1843a041c8d8afb4ea9f53d8b3fe3175faa5a68ea72eb7ba953ea2ce0a1737cc9e9530b147b6cbd7c630dd
// address        :  0x663779C410CFC1C94A963C1EBFB4D0C5F25378DA
// PS C:\Users\ASUS\Documents\ecdsa-node\server> node .\generateKeys.js
// private key    :  3b838b5ecf2a8354be00baca327cbce487a3f21cf0b72e9fdbe2b60bafbcbfda
// public key     :  04ac341123d002b1d8aa2b57d1a813d436d7caa9ccb3c5841f3a52e79aa7072fb1bf147461dcbefe7705c5f1cb221d691cc4409931bd8e74de092960ad4a82ecea
// address        :  0x8356D3C00D5D3EBA4DCF55B7010F7B22EF6623EB
const balances = {
  "0x35759F0700BB6BFDBC85526AFAE8479672E2BA09": 100,
  "0x663779C410CFC1C94A963C1EBFB4D0C5F25378DA": 50,
  "0x8356D3C00D5D3EBA4DCF55B7010F7B22EF6623EB": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, timestamp, signature, recoveryBit } = req.body;

  try {
    // Prevent self-transfer
    if (sender.toLowerCase() === recipient.toLowerCase()) {
      return res.status(400).send({ message: "Cannot transfer to yourself" });
    }
    
    // Reconstruct identical message structure
    const message = {
      sender,
      recipient,
      amount: Number(amount),
      timestamp: Number(timestamp)
    };

    // Create identical message hash
    const messageStr = JSON.stringify(message, Object.keys(message).sort());
    const messageHash = keccak256(
      Uint8Array.from(Buffer.from(messageStr, 'utf-8'))
    );

    // Recover public key
    const publicKey = recoverPublicKey(
      messageHash,
      hexToBytes(signature),
      recoveryBit
    );

    // Derive address
    const address = toHex(keccak256(publicKey.slice(1)).slice(-20)).toUpperCase();
    const recoveredAddress = `0x${address}`;

    // Debug output
    console.log("Server Verification:", {
      receivedSender: sender,
      recoveredAddress,
      messageHash: toHex(messageHash),
      publicKey: toHex(publicKey)
    });

    if (recoveredAddress !== sender) {
      return res.status(401).send({ 
        message: `Signature mismatch! Expected: ${sender}, Got: ${recoveredAddress}`
      });
    }

    // Process transaction
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    }

    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(400).send({ message: error.message });
  }
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});