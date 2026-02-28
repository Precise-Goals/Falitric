// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FaltricEnergyToken
 * @dev ERC-20 token where 1 token = 1 kWh of energy.
 *      Only accounts with MINTER_ROLE can mint new tokens.
 */
contract EnergyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address defaultAdmin) ERC20("FaltricEnergyToken", "ENRG") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
    }

    /**
     * @dev Mint tokens to an address. Restricted to MINTER_ROLE.
     * @param to Recipient address
     * @param amount Amount in token units (18 decimals)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from the caller's balance.
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
