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

    event TradeInitiated(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 tokenAmount);
    event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 tokenAmount, uint256 ethAmount);
    event TradeReleased(uint256 indexed tradeId);
    event TradeCancelled(uint256 indexed tradeId);

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        require(tokenAddress != address(0), "Invalid token address");
        energyToken = IERC20(tokenAddress);
    }

    /**
     * @dev Phase 1: Seller locks ENRG tokens to initiate a trade.
     *      Call approve(tradeEngine, tokenAmount) on the token contract first.
     * @param buyer  Designated buyer address
     * @param tokenAmount  Amount of ENRG tokens to escrow
     * @return tradeId  New trade identifier
     */
    function lockTrade(address buyer, uint256 tokenAmount) external nonReentrant returns (uint256 tradeId) {
        require(buyer != address(0) && buyer != msg.sender, "Invalid buyer");
        require(tokenAmount > 0, "Token amount must be > 0");

        bool transferred = energyToken.transferFrom(msg.sender, address(this), tokenAmount);
        require(transferred, "Token transfer failed");

        tradeId = nextTradeId++;
        trades[tradeId] = Trade({
            seller: msg.sender,
            buyer: buyer,
            tokenAmount: tokenAmount,
            ethAmount: 0,
            status: TradeStatus.Open
        });

        emit TradeInitiated(tradeId, msg.sender, buyer, tokenAmount);
    }

    /**
     * @dev Phase 2: Buyer funds the trade by sending the agreed ETH amount.
     *      Only the designated buyer may call this function.
     * @param tradeId  Trade to fund
     */
    function fundTrade(uint256 tradeId) external payable nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.Open, "Trade not open");
        require(msg.sender == trade.buyer, "Only buyer can fund");
        require(msg.value > 0, "ETH amount must be > 0");
        require(trade.ethAmount == 0, "Trade already funded");

        trade.ethAmount = msg.value;
        emit TradeCreated(tradeId, trade.seller, trade.buyer, trade.tokenAmount, msg.value);
    }

    /**
     * @dev Release trade: sends tokens to buyer, ETH to seller.
     *      Requires trade to be funded (ethAmount > 0).
     *      Only callable by owner (backend arbitrator) or the parties.
     */
    function releaseTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.status == TradeStatus.Open, "Trade not open");
        require(trade.ethAmount > 0, "Trade not yet funded by buyer");
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

        // Only refund ETH if the buyer had funded the trade
        if (trade.ethAmount > 0) {
            (bool sent, ) = trade.buyer.call{value: trade.ethAmount}("");
            require(sent, "ETH refund failed");
        }

        emit TradeCancelled(tradeId);
    }

    /**
     * @dev Get trade details.
     */
    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        return trades[tradeId];
    }
}
