// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

// has to match the file name
contract WavePortalImplementation {
    uint256 totalWaves;
    uint256 public randomInt;
    address owner;
    mapping (address => bool) public callersThatCalled;
    mapping (address => uint) public waves;
    mapping (uint=>address) public allCallersMap;
    uint callersCount;

    event NewWave(address indexed from, uint256 timestamp, string message);
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }
    Wave[] messageWaves;

    uint256 prizeAmount = 0.0001 ether;

     constructor() payable {
        owner = msg.sender;
        randomInt=uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  msg.sender))) % 1000;
        console.log("randomInt is: ",randomInt);
    }

    function wave(string memory _message) public {
        waves[msg.sender]++;
        if(!callersThatCalled[msg.sender]){
            allCallersMap[callersCount]=msg.sender;
            callersCount++;
            callersThatCalled[msg.sender]=true;
        }

        messageWaves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);

        totalWaves++;
        console.log("%s has waved!", msg.sender);
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    error onlyOwnerCanGetTotal(address owner, address caller);

    function getTotalWavesNonOwner() public view returns(uint256){
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getTotalWaves() public view returns (uint256) {
        if(msg.sender != owner){
            revert onlyOwnerCanGetTotal({owner: owner, caller: msg.sender});
        }
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }


    function balances() external view returns (uint) {
        return waves[msg.sender];
    }

    
    function getAllCallersMap() public view returns (address[] memory){
        address[] memory ret = new address[](callersCount);
        for (uint i = 0; i < callersCount; i++) {
            ret[i] = allCallersMap[i];
        }
        return ret;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return messageWaves;
    }

    function getOwner() public view returns (address){
        return owner;
    }
}