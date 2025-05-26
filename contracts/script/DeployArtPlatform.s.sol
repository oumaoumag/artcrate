// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ArtPlatform} from "../src/ArtPlatform.sol";

contract DeployArtPlatform is Script {
    // Default reward amount: 10 CTK tokens (10 * 10^18 wei)
    uint256 public constant DEFAULT_REWARD_AMOUNT = 10 * 10**18;
    
    function setUp() public {}

    function run() public {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the ArtPlatform contract
        ArtPlatform artPlatform = new ArtPlatform(DEFAULT_REWARD_AMOUNT);

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment information
        console.log("=== ArtPlatform Deployment Complete ===");
        console.log("Contract Address:", address(artPlatform));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Initial Reward Amount:", DEFAULT_REWARD_AMOUNT);
        console.log("Network:", block.chainid);
        
        // Log contract details
        console.log("\n=== Contract Details ===");
        console.log("NFT Name:", artPlatform.nftName());
        console.log("NFT Symbol:", artPlatform.nftSymbol());
        console.log("Token Name:", artPlatform.tokenName());
        console.log("Token Symbol:", artPlatform.tokenSymbol());
        console.log("Token Decimals:", artPlatform.tokenDecimals());
        console.log("Max NFT Supply:", artPlatform.MAX_NFT_SUPPLY());
        console.log("Max Token Supply:", artPlatform.MAX_TOKEN_SUPPLY());
        console.log("Current Reward Amount:", artPlatform.rewardAmount());
        
        // Save deployment info to file
        string memory deploymentInfo = string(
            abi.encodePacked(
                "{\n",
                '  "contractAddress": "', vm.toString(address(artPlatform)), '",\n',
                '  "deployer": "', vm.toString(vm.addr(deployerPrivateKey)), '",\n',
                '  "chainId": ', vm.toString(block.chainid), ',\n',
                '  "rewardAmount": "', vm.toString(DEFAULT_REWARD_AMOUNT), '",\n',
                '  "deploymentBlock": ', vm.toString(block.number), ',\n',
                '  "timestamp": ', vm.toString(block.timestamp), '\n',
                "}"
            )
        );
        
        vm.writeFile("./deployments/lisk-sepolia.json", deploymentInfo);
        console.log("\nDeployment info saved to: ./deployments/lisk-sepolia.json");
    }
}
