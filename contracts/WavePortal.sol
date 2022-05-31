// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    address public owner;
    mapping (address => uint) public waves;
    address[] public allCallers;


     constructor() {
        console.log("Yo yo, I am a contract and I am smart sender is", msg.sender);
        owner = msg.sender;
    }

    function wave() public {
        waves[msg.sender]++;
        allCallers.push(msg.sender);
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    error onlyOwnerCanGetTotal(address owner, address caller);

    function getTotalWaves(address sender) public view returns (uint256) {
        if(sender != owner){
            revert onlyOwnerCanGetTotal({owner: owner, caller: sender});
        }
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function balances(address account) external view returns (uint) {
        return waves[account];
    }
    

    function getAllCallers() external view returns (address[] memory) {   
        return allCallers;
    }
}