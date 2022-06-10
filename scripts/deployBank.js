const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const bankFactory = await hre.ethers.getContractFactory("Bank");
    const bankContract = await bankFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    await bankContract.deployed();
  
    console.log("Bank address: ", bankContract.address);
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