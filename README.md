# ECDSA Node Project

![Wallet Interface](ECDSA%20Node%20-%20Personal%20-%20Microsoft%E2%80%8B%20Edge%205_18_2025%207_26_54%20PM.png)

> **Note:** This project is a modified version of the original [ECDSA Node](https://github.com/alchemyplatform/ecdsa-node) implementation by Alchemy. We've added enhanced security features, improved transaction handling, and additional functionality.

A blockchain wallet implementation using Elliptic Curve Digital Signature Algorithm (ECDSA) for secure transactions.

## Features

- 🔐 Secure transaction signing with ECDSA
- 💸 Transfer funds between accounts
- ⚖️ Real-time balance tracking
- 🛡️ Prevention of self-transfers and invalid transactions

## Setup Instructions

### Client

The client folder contains a [React app](https://reactjs.org/) using [Vite](https://vitejs.dev/). To get started:

1. Open terminal in `/client` folder
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start application
4. Visit the app at http://localhost:5173/

### Server

The server folder contains a Node.js server using [Express](https://expressjs.com/). To run:

1. Open terminal in `/server` folder
2. Run `npm install` to install dependencies
3. Run `node index.js` to start server

**Pro Tip:** Install nodemon (`npm i -g nodemon`) and use `nodemon index.js` for automatic server restarts on changes!

The application automatically connects to server port 3042.

## Test Accounts

For immediate testing, these accounts are pre-configured:

| Address                                    | Private Key                              | Balance |
|--------------------------------------------|------------------------------------------|---------|
| `0x35759F0700BB6BFDBC85526AFAE8479672E2BA09` | `7b31309f8296a6af55135c49c1d9dcbe303d012efa50de53d4aebf8b613757fb` | 100 |
| `0x663779C410CFC1C94A963C1EBFB4D0C5F25378DA` | `29aa087391fda1cf604944674dfa956763ab600bec9b69440b5399591a559c28` | 50  |
| `0x8356D3C00D5D3EBA4DCF55B7010F7B22EF6623EB` | `3b838b5ecf2a8354be00baca327cbce487a3f21cf0b72e9fdbe2b60bafbcbfda` | 75  |

**Security Notice:** These are TEST KEYS only. Never use for real transactions.

## Generating New Accounts

To add more test accounts:
```bash
cd server
node generateKeys.js
```
Then update the balances object in server/index.js with the new addresses.

## How It Works

1. Transaction Flow:
    - User enters recipient and amount
    - Client creates and signs transaction
    - Server verifies signature before processing

2. Security Features:
    - Digital signature verification
    - Balance validation
    - Self-transfer prevention
    - Timestamp validation

## Dependencies

- Client: React, Vite, ethereum-cryptography
- Server: Express, ethereum-cryptography

## Troubleshooting

Common issues and their solutions:

| Issue | Solution |
|-------|----------|
| **Connection refused** | 1. Verify server is running<br>2. Check firewall settings<br>3. Confirm port 3042 is available |
| **"Signature failed" error** | 1. Verify private key matches sender<br>2. Check message consistency between client/server<br>3. Ensure proper timestamp format |
| **Transactions not updating** | 1. Check server console logs<br>2. Verify sufficient balance<br>3. Inspect network requests in browser dev tools |
| **"Invalid recovery bit"** | 1. Use exact package version: `ethereum-cryptography@1.2.0`<br>2. Verify signature generation code<br>3. Check recovery bit is 0 or 1 |
| **"Cannot transfer to yourself"** | Recipient address must differ from sender address |

## Project Structure

```text
ecdsa-node/
├── client/                 # React frontend (Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── Wallet.jsx  # Wallet interface
│   │   ├── Transfer.js # Transaction handler
│   │   ├── App.js          # Main application
│   │   └── main.jsx        # Entry point
│   └── package.json        # Client dependencies
└── server/                 # Node.js backend
    ├── index.js            # Express server
    ├── generateKeys.js     # Account generator
    └── package.json       # Server dependencies
```

## 📦 Dependencies

### Client
| Package | Version | Purpose |
|---------|---------|---------|
| [React](https://reactjs.org/) | 18+ | Frontend framework |
| [Vite](https://vitejs.dev/) | Latest | Build tool & dev server |
| [ethereum-cryptography](https://www.npmjs.com/package/ethereum-cryptography) | 1.2.0 | Cryptographic operations |

### Server
| Package | Version | Purpose |
|---------|---------|---------|
| [Express](https://expressjs.com/) | 4.x | Web framework |
| [ethereum-cryptography](https://www.npmjs.com/package/ethereum-cryptography) | 1.2.0 | Signature verification |
| [CORS](https://www.npmjs.com/package/cors) | Latest | Middleware for cross-origin requests |

## 📜 License
[MIT License](LICENSE)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```text
Copyright (c) 2025 Priandika Ratmadani Anugrah

Permission is hereby granted, free of charge...
[Full license text in LICENSE file]
```