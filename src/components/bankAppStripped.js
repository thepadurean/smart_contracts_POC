import React, {useContext, useEffect, useState} from "react";
import "../style/App.css";
import TransactionModal from './TransactionModal'
import Navbar from "./navbar";

const BankApp = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [message, setMessage] = useState("");
    const [depositAccount, setDepositAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [allTransactions, setAllTransactions] = useState([]);

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
            <nav className="navigation">
            <a href="/" className="logo-button">
                The Wave Company
            </a>
            <button
                className="hamburger"
                onClick={() => {
                    setIsNavExpanded(!isNavExpanded)
                }}
            >
            </button>
            <div
                className={
                    isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
                }
            >
                <ul>
                    <li>
                        {connectButton}
                    </li>
                </ul>
            </div>
        </nav>
            <div className="mainContainer">
            <div className="bio" style={{ backgroundImage: `url(background_bank.jpg)` }}>
                        <h1>Welcome to the digital bank!</h1>
                    </div>
                <div className="dataContainer">
                
                    <div>
                        <h1> SELF-OPERATIONS </h1>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Message: <input type="text" value={message} onChange={changeMessage} />
                                Amount: <input type="text" value={amount} onChange={changeAmount} />
                            </label>
                            <input className="depositToAccount" type="submit" value="Deposit Money" />
                        </form>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Amount: <input type="text" value={amount} onChange={changeAmount} />
                            </label>
                            <input className="depositToAccount" type="submit" value="Deposit Money" />
                        </form>
                    </div>
                    <div>
                        <h1> ADDRESS DEPOSIT </h1>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Deposit To: <input type="text" value={depositAccount} onChange={changeDepositAccount} />
                                Message: <input type="text" value={message} onChange={changeMessage} />
                                Amount: <input type="text" value={amount} onChange={changeAmount} />
                            </label>
                            <input className="depositToAccount" type="submit" value="Deposit Money" />
                        </form>
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