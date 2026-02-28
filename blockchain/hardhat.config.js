require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env" });

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x" + "0".repeat(64);
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
