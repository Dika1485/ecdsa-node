import { useState } from "react";
import server from "./server";
import { secp256k1, sign } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      // Validate inputs
      const amountNum = parseInt(sendAmount);
      if (isNaN(amountNum)) throw new Error("Invalid amount");

      // Prevent self-transfer
      if (address.toLowerCase() === recipient.toLowerCase()) {
        throw new Error("Cannot transfer to yourself");
      }

      // Create deterministic message structure
      const message = {
        sender: address,
        recipient: recipient,
        amount: amountNum,
        timestamp: Math.floor(Date.now() / 1000) // UNIX timestamp in seconds
      };

      // Create consistent message hash
      const messageStr = JSON.stringify(message, Object.keys(message).sort());
      const messageHash = keccak256(
        new TextEncoder().encode(messageStr)
      );

      // Sign with proper recovery
      const [signatureBytes, recoveryBit] = await sign(
        messageHash,
        hexToBytes(privateKey),
        { recovered: true }
      );

      // Debug output
      console.log("Client Signing Data:", {
        message,
        messageHash: toHex(messageHash),
        signature: toHex(signatureBytes),
        recoveryBit
      });

      // Send to server
      const response = await server.post(`send`, {
        ...message,
        signature: toHex(signatureBytes),
        recoveryBit
      });

      setBalance(response.data.balance);
    } catch (ex) {
      console.error("Transfer Error:", ex);
      alert(ex.response?.data?.message || ex.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Private Key
        <input
          type="password"
          placeholder="Enter your private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;