// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require('web3');
const {readFile, writeFile, copyFile, promises: fsPromises} = require('fs');
let relativeAddressFilePath='./src/bankContractAddress.js';
let relativeAbiFilePath='./artifacts/contracts/Bank.sol/Bank.json';
let relativeAbiFileNewPath='./src/abis/bankContractAbi.json'


async function main() {
  console.log(process.argv);

  //get the first 2 addresses on the blockchain (Ethers handles this, only for development purposes)
  const [owner, randomPerson] = await hre.ethers.getSigners();

  let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const bankContract = await hre.ethers.getContractFactory("Bank");

  // Deploy it with an initial 0.001 ETH balance
  const bankContractObject = await bankContract.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });

  // Await for the blockchain to confirm deployment
  await bankContractObject.deployed();

  let currentBalance=await web3.eth.getBalance(bankContractObject.address);
  // Contract successfully deployed to contract address
  console.log("Contract deployed by:", owner.address);
  console.log("Bank deployed to:", bankContractObject.address);
  writeToFile(bankContractObject.address);
  copyContractFile();
  console.log(`Bank balance in ETH: ${ethers.utils.formatEther(currentBalance)} ETH`);
  return true;
}


async function replaceInFile(filename, replacement) {
  try {
    const contents = await fsPromises.readFile(filename, 'utf-8');
    const replaced = contents.replace(/to be replaced/gi, replacement);

    await fsPromises.writeFile(filename, replaced);
  } catch (err) {
    console.log(err);
  }
}

async function writeToFile(contractAddress){
  const contractJs = `export const contractAddress = "${contractAddress}" \n export default contractAddress`;
  writeFile(relativeAddressFilePath, contractJs, 'utf-8', function (err) {
    console.log(err);
  });
}

async function copyContractFile(){
  copyFile(relativeAbiFilePath, relativeAbiFileNewPath, (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();