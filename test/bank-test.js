const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");


describe.only("Bank balance", function () {
    let bankContractDeployed;
    let owner;
    let randomPerson;
    let thirdPerson;
    let randomConnectedToContract;
    before(async function (){
        const [owner, randomPerson, thirdPerson] = await hre.ethers.getSigners();
        const BankContract = await ethers.getContractFactory("Bank");
        bankContractDeployed = await BankContract.deploy({value: hre.ethers.utils.parseEther("0.1")});
        await bankContractDeployed.deployed();
        randomConnectedToContract=bankContractDeployed.connect(randomPerson);
    });

    it("Should return the correct balance after deployment", async function () {
        expect(await  bankContractDeployed.contractBalance()).to.equal(hre.ethers.utils.parseEther("0.1"));
    });

    it("Should return the correct updated balance after deposit", async function (){
        const addBalanceTx = await randomConnectedToContract.deposit({value: hre.ethers.utils.parseEther("0.1")});
        
        await addBalanceTx.wait();

        expect(await bankContractDeployed.contractBalance()).to.equal(hre.ethers.utils.parseEther("0.2"));
    });

});
