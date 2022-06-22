const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("WavePortalImplementation", function () {
  it("Should return the total number of waves, meaning 1.", async function () {
    //contract filename
    const WavePortalImplementation = await ethers.getContractFactory("WavePortalImplementation");

    //deploying the contract locally
    const WavePortal = await WavePortalImplementation.deploy();

    //function call to contract function
    await WavePortal.deployed();

    //assertion
    let wave=await WavePortal.wave();
    console.log(wave);

    let totalWaves=await WavePortal.getTotalWavesNonOwner();
    console.log(totalWaves);
    expect(totalWaves).to.equal(1);

    let totalWavesOwner=await WavePortal.getTotalWaves();
    console.log(totalWavesOwner);
    expect(totalWavesOwner).to.equal(1);
  });
});