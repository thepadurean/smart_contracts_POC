import {ethers, utils} from 'ethers';
import abi from "../abis/bankContractAbi.json";
import contractAddressFromFile from '../bankContractAddress.js';

const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const getWeb3Client = () =>{
    return web3;
}

export const getContractAddress= () =>{
    return contractAddressFromFile
}

const getBankContract = () => {
    const {ethereum} = window;
    const contractABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const bankContract = new ethers.Contract(getContractAddress(), contractABI, signer);
    
    return bankContract;
}

export default getBankContract