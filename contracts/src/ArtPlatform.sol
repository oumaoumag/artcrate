// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ArtPlatform  is ERC20, ERC721URIStorage, Ownable, ReentrancyGuard {
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

   // Main mint function with reentrancy protection
    function mintNFT(string memory uri) external nonReentrant {
        if (bytes(uri).length == 0) revert InvalidTokenURI();
        if (_nextTokenId >= MAX_SUPPLY) revert MaxSupplyReached();
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        creators[tokenId] = msg.sender;
        _mint(msg.sender, rewardAmount);
        
        emit NFTMinted(msg.sender, tokenId);
    }

    // Configuration functions
    function setRewardAmount(uint256 newAmount) external onlyOwner {
        rewardAmount = newAmount;
        emit RewardUpdated(newAmount);
    }

    // Overide transfer functions to disable token tranfers
    function transfer(address, uint256) public pure override returns (bool) {
        revert TransferDisabled();
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert TransferDisabled();
    }

    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }    

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
     {
        return super.supportsInterface(interfaceId); 
    }
}
