const main = async () => {
    // eslint-disable-next-line no-undef
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    // eslint-disable-next-line no-undef
    const WavePortalImplementation = await hre.ethers.getContractFactory("WavePortalImplementation");
    const waveContract = await WavePortalImplementation.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
      });
    await waveContract.deployed();

    console.log("Contract address: ", waveContract.address);
};

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