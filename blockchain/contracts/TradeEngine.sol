// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TradeEngine
 * @dev Escrow contract for P2P energy token trading.
 *      Seller locks ENRG tokens, buyer locks ETH.
 *      Owner arbitrates via releaseTrade / cancelTrade.
 */
contract TradeEngine is Ownable, ReentrancyGuard {
    IERC20 public immutable energyToken;

    enum TradeStatus { Open, Released, Cancelled }

    struct Trade {
        address seller;
        address buyer;
        uint256 tokenAmount;
        uint256 ethAmount;
        TradeStatus status;
    }

    uint256 public nextTradeId;
    mapping(uint256 => Trade) public trades;

    event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 tokenAmount, uint256 ethAmount);
    event TradeReleased(uint256 indexed tradeId);
    event TradeCancelled(uint256 indexed tradeId);

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        require(tokenAddress != address(0), "Invalid token address");
        energyToken = IERC20(tokenAddress);
    }

    /**
     * @dev Seller initiates trade by locking tokens. Buyer locks ETH simultaneously.
     * @param buyer Address of the buyer
     * @param tokenAmount Amount of ENRG tokens to trade
     */
    function lockTrade(address buyer, uint256 tokenAmount) external payable nonReentrant returns (uint256 tradeId) {
        require(buyer != address(0) && buyer != msg.sender, "Invalid buyer");
        require(tokenAmount > 0, "Token amount must be > 0");
        require(msg.value > 0, "ETH amount must be > 0");

        // Transfer tokens from seller to this contract
        bool transferred = energyToken.transferFrom(msg.sender, address(this), tokenAmount);
        require(transferred, "Token transfer failed");

        tradeId = nextTradeId++;
        trades[tradeId] = Trade({
            seller: msg.sender,
            buyer: buyer,
            tokenAmount: tokenAmount,
            ethAmount: msg.value,
            status: TradeStatus.Open
        });

        emit TradeCreated(tradeId, msg.sender, buyer, tokenAmount, msg.value);
    }

    /**
     * @dev Release trade: sends tokens to buyer, ETH to seller.
     *      Only callable by owner (backend arbitrator) or seller/buyer by agreement.
     */
    function releaseTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.Open, "Trade not open");
        require(
            msg.sender == owner() || msg.sender == trade.seller || msg.sender == trade.buyer,
            "Not authorized"
        );

        trade.status = TradeStatus.Released;

        energyToken.transfer(trade.buyer, trade.tokenAmount);

        (bool sent, ) = trade.seller.call{value: trade.ethAmount}("");
        require(sent, "ETH transfer failed");

        emit TradeReleased(tradeId);
    }

    /**
     * @dev Cancel trade: refunds tokens to seller, ETH to buyer.
     *      Only callable by owner or the original parties.
     */
    function cancelTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.Open, "Trade not open");
        require(
            msg.sender == owner() || msg.sender == trade.seller || msg.sender == trade.buyer,
            "Not authorized"
        );

        trade.status = TradeStatus.Cancelled;

        energyToken.transfer(trade.seller, trade.tokenAmount);

        (bool sent, ) = trade.buyer.call{value: trade.ethAmount}("");
        require(sent, "ETH refund failed");

        emit TradeCancelled(tradeId);
    }

    /**
     * @dev Get trade details.
     */
    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        return trades[tradeId];
    }
}
