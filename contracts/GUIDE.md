# Faltric Smart Contracts — Deployment Guide

> **FaltricToken (FAL)** — ERC-20 on Ethereum Sepolia Testnet  
> `1 FAL = 100 kWh Units = 400 INR` &nbsp;|&nbsp; Deployed once, used forever.

---

## Prerequisites

| Tool        | Version    | Install                                      |
| ----------- | ---------- | -------------------------------------------- |
| Node.js     | ≥ 18       | [nodejs.org](https://nodejs.org)             |
| npm         | ≥ 9        | bundled with Node                            |
| MetaMask    | any        | [metamask.io](https://metamask.io/download/) |
| Sepolia ETH | > 0.05 ETH | Free from faucet (see below)                 |

---

## Step 1 — Install Dependencies

```bash
cd contracts
bun install
```

This installs:

- **Hardhat** — Solidity compile + deploy framework
- **@openzeppelin/contracts** — Battle-tested ERC-20 base

---

## Step 2 — Get a Sepolia RPC URL

1. Go to [alchemy.com](https://www.alchemy.com) → **Create account → Create App**
2. Select **Ethereum** → **Sepolia** network
3. Copy the **HTTPS** endpoint — looks like:
   ```
   https://eth-sepolia.g.alchemy.com/v2/abc123XYZ...
   ```
   > Alternatively use [Infura](https://infura.io) — same process.

---

## Step 3 — Get Your Deployer Wallet Private Key

> ⚠️ **Use a dedicated deployer wallet. Never use your main wallet's private key.**

1. Open MetaMask → click the account icon → **Account Details**
2. Click **Export Private Key** → enter your password
3. Copy the 64-character hex string (no `0x` prefix needed)

### Get Free Sepolia ETH (Faucets)

You need ~0.05 ETH to deploy. Use any of:

- [sepoliafaucet.com](https://sepoliafaucet.com) — requires Alchemy login
- [faucets.chain.link](https://faucets.chain.link/sepolia) — requires GitHub
- [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)

---

## Step 4 — Fill in `contracts/.env`

Create a file called `.env` inside the `contracts/` folder:

```bash
# contracts/.env

# Your Alchemy / Infura Sepolia endpoint
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY_HERE

# Private key of the deployer wallet (no 0x prefix)
PRIVATE_KEY=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

# (Optional) For verifying the contract on Etherscan after deploy
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

> 🔒 `.env` is in `.gitignore` — it will never be committed.

---

## Step 5 — Compile the Contract

```bash
cd contracts
bunx hardhat compile
```

Expected output:

```
Compiled 1 Solidity file successfully (evm target: paris).
```

---

## Step 6 — Deploy to Sepolia

```bash
bunx hardhat run scripts/deploy.js --network sepolia
```

Expected output:

```
🚀 Deploying FaltricToken with account: 0xYourWallet...
💰 Account balance: 0.1 ETH
✅ FaltricToken (FAL) deployed to: 0xABCDEF...
📋 Token Name: Faltric
🔤 Token Symbol: FAL
🔑 Owner: 0xYourWallet...

─── Add this to your root .env ───
VITE_FAL_TOKEN_ADDRESS=0xABCDEF...
──────────────────────────────────
```

---

## Step 7 — Save the Contract Address

Copy the printed address and add it to **the project root `.env`**:

```env
VITE_FAL_TOKEN_ADDRESS=0xABCDEF...your_deployed_address...
```

This allows the frontend to interact with the correct contract via `ethers.js`.

---

## Step 8 — (Optional) Verify on Etherscan

```bash
bunx hardhat verify --network sepolia <CONTRACT_ADDRESS> <YOUR_WALLET_ADDRESS>
```

Example:

```bash
bunx hardhat verify --network sepolia 0xABCDEF... 0xYourWallet...
```

After verification, your contract is publicly visible and auditable at:  
`https://sepolia.etherscan.io/address/0xABCDEF...`

---

## Contract Reference

### `mintFromGeneration(address to, uint256 units)`

Called by the contract **owner only** (your deployer wallet) to reward energy producers.

```js
// Example: reward 350 kWh → mints 3 FAL
await contract.mintFromGeneration("0xProducerWallet", 350);
// Mints 3 FAL (350 / 100 = 3, remainder 50 tracked off-chain)
```

### `calculateTokens(uint256 units)` → `uint256`

View: how many FAL would `units` kWh earn?

### `calculateINRValue(uint256 tokenAmount)` → `uint256`

View: INR value of a given FAL amount (1 FAL = 400 INR).

### `authorizeMinter(address minter)` — owner only

Authorize an additional address to call `mintFromGeneration` (e.g., a backend oracle).

---

## Tokenomics Summary

```
1 Unit (kWh)  =  4 INR
100 Units     =  1 FAL token
1 FAL token   =  400 INR
```

| Units Generated | FAL Earned | INR Value |
| --------------- | ---------- | --------- |
| 100             | 1 FAL      | ₹400      |
| 500             | 5 FAL      | ₹2,000    |
| 1,000           | 10 FAL     | ₹4,000    |
| 10,000          | 100 FAL    | ₹40,000   |

---

## Folder Structure

```
contracts/
├── FaltricToken.sol        ← The ERC-20 contract
├── hardhat.config.cjs      ← Network config (reads from .env)
├── package.json            ← Hardhat + OpenZeppelin deps
├── .env                    ← Your secrets (never commit this!)
├── GUIDE.md                ← This file
└── scripts/
    └── deploy.js           ← Deployment + address printer
```

---

## Troubleshooting

| Error                 | Fix                                                   |
| --------------------- | ----------------------------------------------------- |
| `insufficient funds`  | Top up deployer wallet with Sepolia ETH from a faucet |
| `invalid private key` | Make sure no `0x` prefix, exactly 64 hex chars        |
| `network not found`   | Check that `SEPOLIA_RPC_URL` is set and reachable     |
| `nonce too low`       | Wait a minute and retry — Sepolia can lag             |
| `already verified`    | Contract is already on Etherscan — no action needed   |
