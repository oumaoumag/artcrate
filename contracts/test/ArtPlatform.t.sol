// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ArtPlatform} from "../src/ArtPlatform.sol";

contract ArtPlatformTest is Test {
    ArtPlatform public artPlatform;
    address public owner;
    address public user1;
    address public user2;

    uint256 public constant INITIAL_REWARD = 10 * 10**18; // 10 CTK
    string public constant TEST_URI = "https://ipfs.io/ipfs/QmTest123";

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        artPlatform = new ArtPlatform(INITIAL_REWARD);
    }

    function test_InitialState() public {
        assertEq(artPlatform.rewardAmount(), INITIAL_REWARD);
        assertEq(artPlatform.tokenTotalSupply(), 0);
        assertEq(artPlatform.nftTotalSupply(), 0);
        assertEq(artPlatform.tokenName(), "CreatorToken");
        assertEq(artPlatform.tokenSymbol(), "CTK");
        assertEq(artPlatform.nftName(), "ArtNFT");
        assertEq(artPlatform.nftSymbol(), "ANFT");
    }

    function test_MintNFT() public {
        vm.prank(user1);
        artPlatform.mintNFT(TEST_URI);

        // Check NFT was minted
        assertEq(artPlatform.nftTotalSupply(), 1);
        assertEq(artPlatform.nftBalanceOf(user1), 1);
        assertEq(artPlatform.tokenURI(1), TEST_URI);
        assertEq(artPlatform.creators(1), user1);

        // Check tokens were rewarded
        assertEq(artPlatform.tokenBalanceOf(user1), INITIAL_REWARD);
        assertEq(artPlatform.tokenTotalSupply(), INITIAL_REWARD);
    }

    function test_MultipleNFTMints() public {
        // User1 mints first NFT
        vm.prank(user1);
        artPlatform.mintNFT(TEST_URI);

        // User2 mints second NFT
        vm.prank(user2);
        artPlatform.mintNFT("https://ipfs.io/ipfs/QmTest456");

        // Check balances
        assertEq(artPlatform.nftTotalSupply(), 2);
        assertEq(artPlatform.tokenBalanceOf(user1), INITIAL_REWARD);
        assertEq(artPlatform.tokenBalanceOf(user2), INITIAL_REWARD);
        assertEq(artPlatform.tokenTotalSupply(), INITIAL_REWARD * 2);
    }

    function test_TokenTransfer() public {
        // Mint NFT to get tokens
        vm.prank(user1);
        artPlatform.mintNFT(TEST_URI);

        // Transfer tokens
        uint256 transferAmount = 5 * 10**18;
        vm.prank(user1);
        artPlatform.tokenTransfer(user2, transferAmount);

        // Check balances
        assertEq(artPlatform.tokenBalanceOf(user1), INITIAL_REWARD - transferAmount);
        assertEq(artPlatform.tokenBalanceOf(user2), transferAmount);
    }

    function test_SetRewardAmount() public {
        uint256 newReward = 20 * 10**18;
        artPlatform.setRewardAmount(newReward);
        assertEq(artPlatform.rewardAmount(), newReward);

        // Test new reward amount works
        vm.prank(user1);
        artPlatform.mintNFT(TEST_URI);
        assertEq(artPlatform.tokenBalanceOf(user1), newReward);
    }

    function test_RevertEmptyURI() public {
        vm.prank(user1);
        vm.expectRevert(ArtPlatform.InvalidURI.selector);
        artPlatform.mintNFT("");
    }

    function test_RevertInvalidRewardAmount() public {
        // Test zero amount
        vm.expectRevert(ArtPlatform.InvalidRewardAmount.selector);
        artPlatform.setRewardAmount(0);
    }

    function test_RevertExcessiveRewardAmount() public {
        // Test amount exceeding maximum
        uint256 maxReward = artPlatform.MAX_REWARD_AMOUNT();
        vm.expectRevert(ArtPlatform.InvalidRewardAmount.selector);
        artPlatform.setRewardAmount(maxReward + 1);
    }

    function test_RevertOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        artPlatform.setRewardAmount(5 * 10**18);
    }

    function test_PauseUnpause() public {
        artPlatform.pause();

        vm.prank(user1);
        vm.expectRevert();
        artPlatform.mintNFT(TEST_URI);

        artPlatform.unpause();

        vm.prank(user1);
        artPlatform.mintNFT(TEST_URI);
        assertEq(artPlatform.nftTotalSupply(), 1);
    }
}
