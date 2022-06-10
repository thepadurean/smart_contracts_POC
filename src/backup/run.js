const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const main = async () => {
    let abi= [
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

    const [owner, randomPerson, thirdPerson] = await hre.ethers.getSigners();
    let contractAddress="0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00";
    const contractABI = abi;
    const bankContractObject = new ethers.Contract(contractAddress, contractABI, owner);

    // Fetch initial bank balance
    let currentBalance=await web3.eth.getBalance(bankContractObject.address);
    console.log(`Initial bank balance in ETH: ${ethers.utils.formatEther(currentBalance)} ETH`);

    // Deposit money 
    let depositAction=await bankContractObject.connect(randomPerson).deposit({value: hre.ethers.utils.parseEther("0.1")});
    await depositAction.wait();

    // Fetch bank balance
    getBankBalance(bankContractObject);

    // Deposit money to another account
    let depositActionTo=await bankContractObject.connect(randomPerson).depositTo(thirdPerson.address,"Have some free money!",{value: hre.ethers.utils.parseEther("0.1")});
    await depositAction.wait();

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