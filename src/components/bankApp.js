import React, {useContext, useEffect, useState} from "react";
import "../style/App.css";
import {ethers, utils} from 'ethers';
import abi from "../abis/Bank.json";
import TransactionModal from './TransactionModal'
import {useAppContext} from "./context";
import Navbar from "./navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import BasicTabs from "./operationsPanel.tsx";
import {getBankContract,getContractAddress} from "./bankContract";

const BankApp = () => {
    const Web3 = require('web3');
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const {ethereum} = window;
    const [currentAccount, setCurrentAccount] = useState("");
    const [message, setMessage] = useState("");
    const [depositAccount, setDepositAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [allTransactions, setAllTransactions] = useState([]);

    //local address
    // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    //testnest address
    const contractAddress = getContractAddress();

    
    const contractABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
    const {
        visibility,
        setVisibility,
        contextData,
        setContextData,
        waveCount,
        setWaveCount,
        account,
        setAccount,
        contractData, 
        setContractData
    } = useAppContext();

    useEffect(() => {
    }, [])

    const changeDepositAccount = (event) => {
        setDepositAccount(event.target.value);
    };

    
    const changeAmount = (event) => {
        setAmount(event.target.value);
    };

    const changeMessage = (event) => {
        setMessage(event.target.value);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
      }
    
    return (
        <>
            <Navbar/>
            <div className="mainContainer">
            <div className="bio" style={{ backgroundImage: `url(background_bank.jpg)` }}>
                        <h1>Welcome to the digital bank!</h1>
                    </div>
                <div className="dataContainer">
                    <BasicTabs />
                </div>
            </div>
            <TransactionModal/>
        </>
    );

    function AddressButton(props) {

    }
}
export default BankApp