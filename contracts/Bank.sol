//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Bank {
    mapping (address => uint256) public accountBankBalance;

    struct accountTransfers {
        address depositingAccount; 
        address depositorAccount;
        string depositMessage;
        uint256 depositAmount;
        uint256 timestamp; // The timestamp when the user waved.
    }
    accountTransfers[] transferHistory;

    constructor() payable {
        console.log("Contract Initialised");
        console.log("Contract balance: %d",address(this).balance);
    }
    
    function deposit() external payable {
        accountBankBalance[msg.sender] += msg.value;
        transferHistory.push(accountTransfers(msg.sender, msg.sender, "SELF-DEPOSIT", msg.value, block.timestamp));
        console.log("Deposit successful, current balance: %d ",address(this).balance);
    }

    function depositTo(address depositToAccount, string memory _message) public payable{
        transferHistory.push(accountTransfers(msg.sender,depositToAccount, _message, msg.value, block.timestamp));
        accountBankBalance[depositToAccount] += msg.value;
        console.log("Deposit successful, current balance: %d ",address(this).balance);
    }

    function withdraw(uint256 withdrawAmount) public {
        require(
            customerBalance(msg.sender) >= withdrawAmount,
            "Trying to withdraw more money than you have deposited."
        );

        accountBankBalance[msg.sender] -= withdrawAmount;

        payable(msg.sender).transfer(withdrawAmount);
        transferHistory.push(accountTransfers(msg.sender,msg.sender, "SELF-WITHDRAW", withdrawAmount, block.timestamp));
        console.log("Successfully withdrew amount: %d, current bank balance: %d",withdrawAmount,address(this).balance);
    }

    function customerBalance(address customerAddress) public view returns (uint256){
        return accountBankBalance[customerAddress];
    }

    function getAllTransfers() public view returns (accountTransfers[] memory) {
        return transferHistory;
    }

    function contractBalance() public view returns(uint) {
        return address(this).balance;
    }

}