import {ethers, utils} from 'ethers';
import abi from "../abis/Bank.json";

const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const getWeb3Client = () =>{
    return web3;
}

export const getContractAddress= () =>{
    //testnet address
    // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    //local address
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  return contractAddress
}

const getBankContract = () => {
    const {ethereum} = window;
    const Web3 = require('web3');
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contractABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const bankContract = new ethers.Contract(getContractAddress(), contractABI, signer);
    
    return bankContract;
}

export default getBankContract