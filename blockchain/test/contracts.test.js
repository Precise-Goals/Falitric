const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnergyToken", function () {
  let energyToken;
  let owner, minter, user;

  beforeEach(async function () {
    [owner, minter, user] = await ethers.getSigners();
    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    energyToken = await EnergyToken.deploy(owner.address);
    await energyToken.waitForDeployment();
  });

  it("has correct name and symbol", async function () {
    expect(await energyToken.name()).to.equal("FaltricEnergyToken");
    expect(await energyToken.symbol()).to.equal("ENRG");
  });

  it("allows MINTER_ROLE to mint", async function () {
    const amount = ethers.parseEther("100");
    await energyToken.mint(user.address, amount);
    expect(await energyToken.balanceOf(user.address)).to.equal(amount);
  });

  it("prevents non-minter from minting", async function () {
    const amount = ethers.parseEther("100");
    await expect(
      energyToken.connect(user).mint(user.address, amount)
    ).to.be.reverted;
  });

  it("allows granting MINTER_ROLE", async function () {
    const MINTER_ROLE = await energyToken.MINTER_ROLE();
    await energyToken.grantRole(MINTER_ROLE, minter.address);
    const amount = ethers.parseEther("50");
    await energyToken.connect(minter).mint(user.address, amount);
    expect(await energyToken.balanceOf(user.address)).to.equal(amount);
  });

  it("allows burning tokens", async function () {
    const amount = ethers.parseEther("100");
    await energyToken.mint(user.address, amount);
    await energyToken.connect(user).burn(ethers.parseEther("30"));
    expect(await energyToken.balanceOf(user.address)).to.equal(ethers.parseEther("70"));
  });
});

describe("TradeEngine", function () {
  let energyToken;
  let tradeEngine;
  let owner, seller, buyer;
  const tokenAmount = ethers.parseEther("100");
  const ethAmount = ethers.parseEther("0.1");

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    energyToken = await EnergyToken.deploy(owner.address);
    await energyToken.waitForDeployment();

    const TradeEngine = await ethers.getContractFactory("TradeEngine");
    tradeEngine = await TradeEngine.deploy(await energyToken.getAddress(), owner.address);
    await tradeEngine.waitForDeployment();

    // Mint tokens to seller
    await energyToken.mint(seller.address, tokenAmount);
    // Approve TradeEngine to spend seller tokens
    await energyToken.connect(seller).approve(await tradeEngine.getAddress(), tokenAmount);
  });

  it("locks a trade and emits TradeCreated", async function () {
    await expect(
      tradeEngine.connect(seller).lockTrade(buyer.address, tokenAmount, { value: ethAmount })
    )
      .to.emit(tradeEngine, "TradeCreated")
      .withArgs(0, seller.address, buyer.address, tokenAmount, ethAmount);

    const trade = await tradeEngine.getTrade(0);
    expect(trade.seller).to.equal(seller.address);
    expect(trade.buyer).to.equal(buyer.address);
    expect(trade.tokenAmount).to.equal(tokenAmount);
    expect(trade.ethAmount).to.equal(ethAmount);
    expect(trade.status).to.equal(0); // Open
  });

  it("releases a trade", async function () {
    await tradeEngine.connect(seller).lockTrade(buyer.address, tokenAmount, { value: ethAmount });

    const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
    await expect(tradeEngine.connect(owner).releaseTrade(0))
      .to.emit(tradeEngine, "TradeReleased")
      .withArgs(0);

    expect(await energyToken.balanceOf(buyer.address)).to.equal(tokenAmount);
    const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
    expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);

    const trade = await tradeEngine.getTrade(0);
    expect(trade.status).to.equal(1); // Released
  });

  it("cancels a trade and refunds", async function () {
    await tradeEngine.connect(seller).lockTrade(buyer.address, tokenAmount, { value: ethAmount });

    await expect(tradeEngine.connect(owner).cancelTrade(0))
      .to.emit(tradeEngine, "TradeCancelled")
      .withArgs(0);

    expect(await energyToken.balanceOf(seller.address)).to.equal(tokenAmount);

    const trade = await tradeEngine.getTrade(0);
    expect(trade.status).to.equal(2); // Cancelled
  });

  it("prevents releasing a non-open trade", async function () {
    await tradeEngine.connect(seller).lockTrade(buyer.address, tokenAmount, { value: ethAmount });
    await tradeEngine.connect(owner).releaseTrade(0);
    await expect(tradeEngine.connect(owner).releaseTrade(0)).to.be.revertedWith("Trade not open");
  });
});
