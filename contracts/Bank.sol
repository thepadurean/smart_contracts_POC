//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Bank {
    // map for holding balances according to addresses
    mapping (address => uint256) public accountBankBalance;

    struct accountTransfers {
        address depositingAccount; // Account sending the money
        address depositorAccount; // Account where the money is sent
        string depositMessage; // Attached messages on deposit
        uint256 depositAmount; // The amount sent in the transaction
        uint256 timestamp; // The timestamp when the user waved.
    }

    // an array of account transfers
    accountTransfers[] transferHistory;

    // a payable constructor that holds value as a balance inside the contract
    // payable means you can send value as a transaction parameter
    constructor() payable {
        console.log("Contract Initialised");
        console.log("Contract balance: %d",address(this).balance);
    }
    
    // a payable function that allows deposits into the contract, the transaction history is logged.
    function deposit() external payable {
        accountBankBalance[msg.sender] += msg.value;
        transferHistory.push(accountTransfers(msg.sender, msg.sender, "SELF-DEPOSIT", msg.value, block.timestamp));
        console.log("Deposit successful, current balance: %d ",address(this).balance);
    }


    // a payable function that allows a 3rd party to deposit into the virtual bank account of the 2nd, transaction history is logged.
    function depositTo(address depositToAccount, string memory _message) public payable{
        transferHistory.push(accountTransfers(msg.sender,depositToAccount, _message, msg.value, block.timestamp));
        accountBankBalance[depositToAccount] += msg.value;
        console.log("Deposit successful, current balance: %d ",address(this).balance);
    }

    //  a function that permits withdrawing from the general value of the contract, it checks that the withdrawing address has enough
    // virtual balance, transaction history is logged
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

    // retrieves the balance of a particular address
    function customerBalance(address customerAddress) public view returns (uint256){
        return accountBankBalance[customerAddress];
    }

    // returns all the transactions in the history
    function getAllTransfers() public view returns (accountTransfers[] memory) {
        return transferHistory;
    }

    // returns the balance of the general contract
    function contractBalance() public view returns(uint) {
        return address(this).balance;
    }

}