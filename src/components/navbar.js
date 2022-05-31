import React, {useEffect, useState} from "react";
import "../style/Navbar.css"
import AppContext, {useAppContext} from "./context";


const Navbar = (props) => {
    const {
      visibility, setVisibility,
        contextData, setContextData,
        waveCount, setWaveCount,
        account, setAccount
    } = useAppContext();
    const [isNavExpanded, setIsNavExpanded] = useState(false)
    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            /*
            * Check if we're authorized to access the user's wallet
            */
            const accounts = await ethereum.request({method: "eth_accounts"});

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setAccount(account)
            } else {
                console.log("No authorized account found")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                alert("Please install Metamask.");
                return;
            }

            const accounts = await ethereum.request({method: "eth_requestAccounts"});

            console.log("Connected", accounts[0]);
            setAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }

    window.ethereum.on('accountsChanged', async () => {
        connectButton = <ConnectButton onClick={connectWallet}/>;
        setAccount(null);
    });

    let connectButton;
    if (!account) {
        connectButton = <ConnectButton onClick={connectWallet}/>;
    } else {
        connectButton = <AddressButton account={account}
        />;
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    return (
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
    );

    function ConnectButton(props) {
        return (
            <button onClick={props.onClick}>
                Connect Wallet
            </button>
        );
    }

    function AddressButton(props) {
        return (
            <button className="emphasis">
                {props.account}
            </button>
        );
    }
}
export default Navbar