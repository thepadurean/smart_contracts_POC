const main = async () => {
  const [owner, randomPerson, personThree] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Owner Address is :", owner.address);
  console.log("RandomPerson address is:", randomPerson.address);
  console.log("personThree address is :", personThree.address);
  console.log("Contract owner is: ", await waveContract.owner());

  let waveCount;
  waveCount = await waveContract.getTotalWaves(owner.address); 

  let waveTxn2 = await waveContract.connect(randomPerson).wave();
  await waveTxn2.wait();

  let waveTxn3 = await waveContract.connect(randomPerson).wave();
  await waveTxn3.wait();

  let waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  let waveTxn1 = await waveContract.connect(personThree).wave();
  await waveTxn1.wait();


  waveCount = await waveContract.getTotalWaves(owner.address);
  console.log(`Total balance for address: ${randomPerson.address} is ${await waveContract.balances(randomPerson.address)}`);
  console.log(`All callers: ${await waveContract.getAllCallers()}`)
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