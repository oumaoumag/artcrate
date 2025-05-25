// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ArtPlatform  is ERC20, ERC721UIStorage, Owner, ReentrancyGuard {
    // Token ID tracking
    uint256 private _nextTokenId = 1;

    // Reward configuration
    uint256 public rewardAmount;
    uint256 public constant MAX_SUPPLY = type(uint256).max;

    // Token metadata
    mapping(uint256 => address) public creators;

    // Events
    event NFTMinted(address indexed creator, uint256 indexed tokenId);
    event RewardUpdated(uint256 newAmount);

    error MaxSupplyReached();
    error InvalidTokenURI();
    error TransferDisabled();

    constructor(uint256 initialReward) 
        ERC20("CreatorToken", "CTK")
        ERC721("ArtNFT", "ANFT")
        Ownable(msg.sender)
        {
            rewardAmount = initialReward;
        }

    
}
