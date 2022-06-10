import React, {useContext, useEffect, useState} from "react";
import "../style/App.css";
import {ethers, utils} from 'ethers';
import abi from "../abis/Bank.json";
import TransactionModal from './TransactionModal'
import {useAppContext} from "./context";
import Navbar from "./navbar";

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
    const contractAddress = "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570";

    
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
        setAccount
    } = useAppContext();

    useEffect(() => {
        getAllTransactions();
    }, [])
    

    const getAllTransactions = async () => {
        const transactions = await bankContract.getAllTransfers();
        console.log(transactions);
        let transactionsCleaned = [];
        transactions.forEach(transaction => {
          transactionsCleaned.push({
            depositingAccount: transaction.depositingAccount,
            depositorAccount: transaction.depositorAccount,
            timestamp: new Date(transaction.timestamp * 1000),
            message: transaction.depositMessage,
            value: ethers.utils.formatEther(transaction.depositAmount) 
          });
        });
        setAllTransactions(transactionsCleaned);
    }

    const withdraw = async () => {
        try{
            const withdrawTx = await bankContract.withdraw(message);
            console.log("Mining...", withdrawTx.hash);
            await withdrawTx.wait();
            console.log("Mined -- ", withdrawTx.hash);
            let content="";
            setModalContent(content);
        }catch (error) {
            setVisibility(true);
            setContextData({error: error, error_code: error.code, error_message: error.message});
        }
    }

    const deposit = async () => {
        try{
            const depositTx = await bankContract.deposit(provider.utils.parseEther(changeAmount));
            console.log("Mining...", depositTx.hash);
            await depositTx.wait();
            console.log("Mined -- ", depositTx.hash);
            let content="";
            setModalContent(content);
        }catch (error) {
            setVisibility(true);
            setContextData({error: error, error_code: error.code, error_message: error.message});
        } 
    }

    const depositTo = async () => {
        try{
            const depositToTx = await bankContract.depositTo(depositAccount,changeMessage, provider.utils.parseEther(changeAmount));
            console.log("Mining...", depositToTx.hash);
            await depositToTx.wait();
            console.log("Mined -- ", depositToTx.hash);
            let content="";
            setModalContent(content);
        }catch (error) {
            setVisibility(true);
            setContextData({error: error, error_code: error.code, error_message: error.message});
        }
    }

    const setModalContent = async (content) => {
        setVisibility(true);
        setContextData(content);
        getAllTransactions();
    }

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
                
                    <div className="selfOperations">
                        <h1> SELF-OPERATIONS </h1>
                        <div className="selfOperationDeposit">
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Message: <input type="text" value={message} onChange={changeMessage} />
                                    Amount: <input type="text" value={amount} onChange={changeAmount} />
                                </label>
                                <input className="depositToAccount" type="submit" value="Deposit Money" />
                            </form>
                        </div>
                        <div className="selfOperationWithdraw">
                        <form onSubmit={handleSubmit}>
                            <label>
                                Amount: <input type="text" value={amount} onChange={changeAmount} />
                            </label>
                            <input className="depositToAccount" type="submit" value="Withdraw Money" />
                        </form>
                        </div>
                    </div>
                    <div className="foreignOperation">
                        <h1> ADDRESS DEPOSIT </h1>
                        <div className="foreignOperationSend">
                        <form onSubmit={handleSubmit}>
                            <label>
                                Deposit To: <input type="text" value={depositAccount} onChange={changeDepositAccount} />
                                Message: <input type="text" value={message} onChange={changeMessage} />
                                Amount: <input type="text" value={amount} onChange={changeAmount} />
                            </label>
                            <input className="depositToAccount" type="submit" value="Deposit Money" />
                        </form>
                        </div>
                    </div>

                    {allTransactions.slice(0).reverse().map((transaction, index) => {
                        return (
                            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                                <div>Sender Address: {transaction.depositingAccount}</div>
                                <div>Receiving Address: {transaction.depositorAccount}</div>
                                <div>Time: {transaction.timestamp.toString()}</div>
                                <div>Message: {transaction.depositMessage}</div>
                                <div>Amount: {transaction.value}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <TransactionModal/>
        </>
    );

    function AddressButton(props) {

    }
}
export default BankApp