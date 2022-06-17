// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const Web3 = require('web3');


async function main() {

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
  const lotteryContract = await hre.ethers.getContractFactory("Lottery");

  // Deploy it with an initial 0.001 ETH balance
  const lotteryContractObject = await lotteryContract.deploy({
    value: hre.ethers.utils.parseEther("10"),
  });

  // Await for the blockchain to confirm deployment
  await lotteryContractObject.deployed();

  let currentBalance=await web3.eth.getBalance(lotteryContractObject.address);
  // Contract successfully deployed to contract address
  console.log("Contract deployed by:", owner.address);
  console.log("Lottery deployed to:", lotteryContractObject.address);
  console.log(`Lottery balance in ETH: ${ethers.utils.formatEther(currentBalance)} ETH`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
