const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const main = async () => {
    let bankABI= [
      {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "accountBankBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "contractBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "customerAddress",
            "type": "address"
          }
        ],
        "name": "customerBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "depositToAccount",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_message",
            "type": "string"
          }
        ],
        "name": "depositTo",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllTransfers",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "depositingAccount",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "depositorAccount",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "depositMessage",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "depositAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct Bank.accountTransfers[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "withdrawAmount",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    let LotteryABI=[
      {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "enter",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "pickWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "players",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const [owner, randomPerson, thirdPerson] = await hre.ethers.getSigners();
    let bankContractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";
    let lotteryContractAddrress="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
    const bankContractObject = new ethers.Contract(bankContractAddress, bankABI, owner);
    const lotteryContractObject = new ethers.Contract(lotteryContractAddrress, LotteryABI, owner);

    // Fetch initial bank balance
    let currentBalance=await web3.eth.getBalance(bankContractObject.address);
    console.log(`Initial bank balance in ETH: ${ethers.utils.formatEther(currentBalance)} ETH`);

    
    // Fetch initial bank balance
    let currentLotteryBalance=await web3.eth.getBalance(lotteryContractObject.address);
    console.log(`Initial lottery balance in ETH: ${ethers.utils.formatEther(currentLotteryBalance)} ETH`);

    // Deposit money 
    let depositAction=await bankContractObject.connect(randomPerson).deposit({value: hre.ethers.utils.parseEther("0.1")});
    await depositAction.wait();

    // Fetch bank balance
    getBankBalance(bankContractObject);

    // Deposit money to another account
    let depositActionTo=await bankContractObject.connect(randomPerson).depositTo(thirdPerson.address,"Have some free money!",{value: hre.ethers.utils.parseEther("0.1")});
    await depositActionTo.wait();

    // Fetch bank balance
    getBankBalance(bankContractObject);

    // Get 3rd person's balance
    let thirdPersonBalance= await bankContractObject.customerBalance(thirdPerson.address);
    console.log(`Third person balance: ${ethers.utils.formatEther(thirdPersonBalance)} ETH`)

    // Withdraw money
    let withdrawAction=await bankContractObject.connect(randomPerson).withdraw(hre.ethers.utils.parseEther("0.01"));
    await withdrawAction.wait();

    // Fetch bank balance
    getBankBalance(bankContractObject);

    // Get full transfer history
    let transferHistory= await bankContractObject.getAllTransfers();
    transferHistory.slice(0).reverse().map((transfer, index) => {
      console.log(`Listing transfer, FROM: ${transfer.depositingAccount}, TO: ${transfer.depositorAccount}, 
      MESSAGE: ${transfer.depositMessage}, AMOUNT: ${ethers.utils.formatEther(transfer.depositAmount)}, TIMESTAMP: ${new Date(transfer.timestamp*1000)}`);
    })
  };
  
  const getBankBalance = async (bankContractObject) => {
      // Fetch bank balance
      let currentBalance=await web3.eth.getBalance(bankContractObject.address);
      console.log(`Bank balance in ETH: ${ethers.utils.formatEther(currentBalance)} ETH`);
  }

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();