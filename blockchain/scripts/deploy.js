const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy EnergyToken
  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const energyToken = await EnergyToken.deploy(deployer.address);
  await energyToken.waitForDeployment();
  const tokenAddress = await energyToken.getAddress();
  console.log("EnergyToken deployed to:", tokenAddress);

  // Deploy TradeEngine
  const TradeEngine = await ethers.getContractFactory("TradeEngine");
  const tradeEngine = await TradeEngine.deploy(tokenAddress, deployer.address);
  await tradeEngine.waitForDeployment();
  const tradeEngineAddress = await tradeEngine.getAddress();
  console.log("TradeEngine deployed to:", tradeEngineAddress);

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`ENERGY_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`TRADE_ENGINE_ADDRESS=${tradeEngineAddress}`);
  console.log(`DEPLOYER_ADDRESS=${deployer.address}`);
  console.log(`NETWORK=${(await ethers.provider.getNetwork()).name}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
