import React, {useContext, useEffect, useState} from "react";
import "../style/App.css";
import {ethers, utils} from 'ethers';
import abi from "../abis/WavePortalImplementation.json";
import logo from '../assets/general-kenobi-kenobi.gif'
import TransactionModal from './TransactionModal'
import {useAppContext} from "./context";
import Navbar from "./navbar";

const App = () => {
    const {ethereum} = window;
    const [currentAccount, setCurrentAccount] = useState("");
    const [message, setMessage] = useState("");
    const [allWaves, setAllWaves] = useState([]);

    //local address
    // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    //testnest address
    const contractAddress = "0xda53E8E1C578b1f097D9a6fe89313B65F9f0AFE4";

    
    const contractABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
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
        getTotalWaves();
        getAllMessages();
    }, [])
    

    const getAllMessages = async () => {
        const waves = await wavePortalContract.getAllWaves();
        console.log(waves);
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);

    }

    const getTotalWaves = async () => {
        let count = await wavePortalContract.getTotalWavesNonOwner();
        console.log("Retrieved total wave count...", count.toNumber());
        count = count.toNumber();
        setWaveCount(count);
        return count;
    }

    const wave = async () => {
        try {
            if (ethereum) {
                const waveTxn = await wavePortalContract.wave(message);
                console.log("Mining...", waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined -- ", waveTxn.hash);

                let count = await getTotalWaves();
                setVisibility(true);
                setContextData({count: count});
                getAllMessages();
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            setVisibility(true);
            setContextData({error: error, error_code: error.code, error_message: error.message});
        }
    }

    const changeMessage = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        wave();
        event.preventDefault();
      }

    return (
        <>
            <Navbar/>
            {/*{account ? account : ""}*/}
            <div className="mainContainer">
                <div className="dataContainer">
                    <div className="header">
                        <p>Hello there!</p>

                        <img src={logo} alt="loading..."/>
                    </div>
                    <div className="bio">
                        Hello, my name is Adrian and welcome to THE smart contract WAVE APP
                    </div>
                    <div className="waveCounter">{waveCount ? "Current Wave count: " + waveCount : ""}</div>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Message:
                            <input type="text" value={message} onChange={changeMessage} />
                        </label>
                        <input className="waveButton" type="submit" value="Wave at Me" />
                    </form>
                    {allWaves.slice(0).reverse().map((wave, index) => {
                        return (
                            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                                <div>Address: {wave.address}</div>
                                <div>Time: {wave.timestamp.toString()}</div>
                                <div>Message: {wave.message}</div>
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
export default App