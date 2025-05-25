// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ArtPlatform
 *  NFT platform where creators earn tokens when users mint their art
 * @dev Single contract combining ERC721 NFTs with custom token rewards
 */
contract ArtPlatform is
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    ReentrancyGuard,
    Pausable
{
    // Supply limits to prevent abuse
    uint256 public constant MAX_NFT_SUPPLY = 10000;
    uint256 public constant MAX_TOKEN_SUPPLY = 1000000 * 10**18;
    uint256 public constant MAX_REWARD_AMOUNT = 1000 * 10**18;

    // Core state
    uint256 private _nextTokenId = 1;
    uint256 public rewardAmount;
    mapping(uint256 => address) public creators;

    // Token state (manual ERC20 implementation)
    mapping(address => uint256) private _tokenBalances;
    mapping(address => mapping(address => uint256)) private _tokenAllowances;
    uint256 private _tokenTotalSupply;
    string private _tokenName = "CreatorToken";
    string private _tokenSymbol = "CTK";
    uint8 private _tokenDecimals = 18;

    // Events
    event NFTMinted(address indexed creator, uint256 indexed tokenId, string uri);
    event RewardAmountUpdated(uint256 oldAmount, uint256 newAmount);

    // Errors
    error InvalidURI();
    error MaxSupplyReached();
    error MaxTokenSupplyReached();
    error InvalidRewardAmount();
    error ZeroAddress();

    constructor(uint256 initialReward)
        ERC721("ArtNFT", "ANFT")
        Ownable(msg.sender)
    {
        if (initialReward == 0 || initialReward > MAX_REWARD_AMOUNT) {
            revert InvalidRewardAmount();
        }
        rewardAmount = initialReward;
    }

    //  Mint an NFT and automatically reward the creator with tokens
    // @param metadataURI IPFS URI containing the NFT metadata
    function mintNFT(string memory metadataURI) external nonReentrant whenNotPaused {
        if (bytes(metadataURI).length == 0) revert InvalidURI();
        if (_nextTokenId > MAX_NFT_SUPPLY) revert MaxSupplyReached();

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);
        creators[tokenId] = msg.sender;

        // Give creator tokens as reward
        if (_tokenTotalSupply + rewardAmount > MAX_TOKEN_SUPPLY) {
            revert MaxTokenSupplyReached();
        }
        _mintTokens(msg.sender, rewardAmount);

        emit NFTMinted(msg.sender, tokenId, metadataURI);
    }

    //  Update the reward amount given per NFT mint (owner only)
    function setRewardAmount(uint256 newAmount) external onlyOwner {
        if (newAmount == 0 || newAmount > MAX_REWARD_AMOUNT) {
            revert InvalidRewardAmount();
        }
        uint256 oldAmount = rewardAmount;
        rewardAmount = newAmount;
        emit RewardAmountUpdated(oldAmount, newAmount);
    }

    //  Manually reward tokens to an address (emergency use only)
    function rewardCreator(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0 || amount > MAX_REWARD_AMOUNT) revert InvalidRewardAmount();
        if (_tokenTotalSupply + amount > MAX_TOKEN_SUPPLY) {
            revert MaxTokenSupplyReached();
        }
        _mintTokens(to, amount);
    }

    //  Emergency pause (stops all minting)
    function pause() external onlyOwner {
        _pause();
    }

    //  Resume normal operations
    function unpause() external onlyOwner {
        _unpause();
    }

    //  Get total number of NFTs minted so far
    function totalNFTSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // OpenZeppelin inheritance overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Internal helper to mint tokens
    function _mintTokens(address to, uint256 amount) internal {
        require(to != address(0), "ERC20: mint to the zero address");
        _tokenTotalSupply += amount;
        _tokenBalances[to] += amount;
        emit TokenTransfer(address(0), to, amount);
    }

    // Token functions (ERC20-like but with different names to avoid conflicts)

    //  Get token balance for an account
    function tokenBalanceOf(address account) public view returns (uint256) {
        return _tokenBalances[account];
    }

    //  Transfer tokens to another address
    function tokenTransfer(address to, uint256 amount) public nonReentrant returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        require(_tokenBalances[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");

        _tokenBalances[msg.sender] -= amount;
        _tokenBalances[to] += amount;
        emit TokenTransfer(msg.sender, to, amount);
        return true;
    }

    //  Check how many tokens spender is allowed to use
    function tokenAllowance(address owner, address spender) public view returns (uint256) {
        return _tokenAllowances[owner][spender];
    }

    //  Approve spender to use your tokens
    function tokenApprove(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "ERC20: approve to the zero address");
        _tokenAllowances[msg.sender][spender] = amount;
        emit TokenApproval(msg.sender, spender, amount);
        return true;
    }

    //  Transfer tokens on behalf of someone else (requires approval)
    function tokenTransferFrom(address from, address to, uint256 amount) public nonReentrant returns (bool) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(_tokenBalances[from] >= amount, "ERC20: transfer amount exceeds balance");
        require(_tokenAllowances[from][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");

        _tokenBalances[from] -= amount;
        _tokenBalances[to] += amount;
        _tokenAllowances[from][msg.sender] -= amount;
        emit TokenTransfer(from, to, amount);
        return true;
    }

    //  Get total supply of tokens
    function tokenTotalSupply() public view returns (uint256) {
        return _tokenTotalSupply;
    }

    //  Get token decimals (always 18)
    function tokenDecimals() public view returns (uint8) {
        return _tokenDecimals;
    }

    //  Get token name
    function tokenName() public view returns (string memory) {
        return _tokenName;
    }

    //  Get token symbol
    function tokenSymbol() public view returns (string memory) {
        return _tokenSymbol;
    }

    // Token events (renamed to avoid conflicts with ERC721)
    event TokenTransfer(address indexed from, address indexed to, uint256 value);
    event TokenApproval(address indexed owner, address indexed spender, uint256 value);

    // Helper functions for explicit NFT operations (if needed)
    function nftBalanceOf(address owner) public view returns (uint256) {
        return ERC721.balanceOf(owner);
    }

    function nftApprove(address to, uint256 tokenId) public {
        ERC721.approve(to, tokenId);
    }

    function nftTransferFrom(address from, address to, uint256 tokenId) public {
        ERC721.transferFrom(from, to, tokenId);
    }

    function nftTotalSupply() public view returns (uint256) {
        return ERC721Enumerable.totalSupply();
    }

    function nftName() public view returns (string memory) {
        return ERC721.name();
    }

    function nftSymbol() public view returns (string memory) {
        return ERC721.symbol();
    }
}