const { ethers } = require("ethers");
const Installation = require("../models/Installation");
const MeterReading = require("../models/MeterReading");

const POLL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

// Minimal ERC-20 mint ABI
const ENERGY_TOKEN_ABI = [
  "function mint(address to, uint256 amount) external",
  "function balanceOf(address account) view returns (uint256)",
];

function getMockMeterData(installation) {
  // Mock smart meter data - in production, call real meter API
  const baseGeneration = installation.capacityKw * (0.3 + Math.random() * 0.6);
  const baseConsumption = installation.capacityKw * (0.1 + Math.random() * 0.3);
  return {
    generation: parseFloat(baseGeneration.toFixed(4)),
    consumption: parseFloat(baseConsumption.toFixed(4)),
  };
}

async function pollAndMint() {
  try {
    const installations = await Installation.find({ verified: true }).lean();
    if (!installations.length) return;

    const rpcUrl = process.env.SEPOLIA_RPC_URL || "http://127.0.0.1:8545";
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const tokenAddress = process.env.ENERGY_TOKEN_ADDRESS;

    if (!privateKey || !tokenAddress || tokenAddress === ethers.ZeroAddress) {
      console.warn("MeterPoller: Blockchain config missing, skipping token minting.");
      // Still record readings without minting
      for (const installation of installations) {
        const { generation, consumption } = getMockMeterData(installation);
        const surplus = Math.max(0, generation - consumption);
        await MeterReading.create({
          installationId: installation._id,
          generation,
          consumption,
          surplus,
          source: "poller",
        });
      }
      return;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const token = new ethers.Contract(tokenAddress, ENERGY_TOKEN_ABI, wallet);

    for (const installation of installations) {
      try {
        const { generation, consumption } = getMockMeterData(installation);
        const surplus = Math.max(0, generation - consumption);

        let txHash = null;
        let tokensMinted = 0;

        if (surplus > 0) {
          // T = surplus kWh → mint T tokens (18 decimals)
          const amount = ethers.parseEther(surplus.toFixed(6));
          const tx = await token.mint(installation.walletAddress, amount);
          await tx.wait();
          txHash = tx.hash;
          tokensMinted = surplus;
          console.log(`Minted ${surplus} ENRG for ${installation.walletAddress} (tx: ${txHash})`);
        }

        await MeterReading.create({
          installationId: installation._id,
          generation,
          consumption,
          surplus,
          tokensMinted,
          txHash,
          source: "poller",
        });
      } catch (instErr) {
        console.error(`MeterPoller: Error for installation ${installation._id}:`, instErr.message);
      }
    }
  } catch (err) {
    console.error("MeterPoller: Poll cycle error:", err.message);
  }
}

function startMeterPoller() {
  console.log(`MeterPoller started (interval: ${POLL_INTERVAL_MS / 60000} min)`);
  pollAndMint(); // Run immediately on startup
  setInterval(pollAndMint, POLL_INTERVAL_MS);
}

module.exports = { startMeterPoller, pollAndMint };
