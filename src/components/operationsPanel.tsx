import React, {useContext, useEffect, useState} from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import { Button, Paper } from "@mui/material/";
import "../style/App.css";
import {useAppContext} from "./context";
import getBankContract from "./bankContract";
import {ethers, utils} from 'ethers';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Transaction {
  depositingAccount: string,
  depositorAccount: string,
  timestamp: Date,
  message: string,
  value: string
}


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
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
  const Web3 = require('web3');
  let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  let renderedArray: {} | null | undefined=[];
  let bankContract=getBankContract();

  useEffect(() => {
  
  });

  /* @ts-ignore */
  let contentArray=[];

  const getAllTransactions = async () => {
    console.log("get all transactions")
    const allTransfers = await bankContract.getAllTransfers();
    let count=0;
    allTransfers.slice()
    .reverse().forEach((transaction: { depositingAccount: any; depositorAccount: any; timestamp: number; depositMessage: any; depositAmount: any; }) => {
      const transactionX: Transaction={
        depositingAccount: transaction.depositingAccount,
        depositorAccount: transaction.depositorAccount,
        timestamp: new Date(transaction.timestamp * 1000),
        message: transaction.depositMessage,
        value: ethers.utils.formatEther(transaction.depositAmount) 
      }
      contentArray.push(<div key={count++} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Sender Address: {transactionX.depositingAccount}</div>
              <div>Receiving Address: {transactionX.depositorAccount}</div>
              <div>Time: {transactionX.timestamp.toString()}</div>
              <div>Message: {transactionX.message}</div>
              <div>Amount: {transactionX.value}</div>
          </div>)
    });

     /* @ts-ignore */
    setTransactions(contentArray);
}

  const [value, setValue] = React.useState(0);
  const [localAccount, setLocalAccount] = React.useState(account);

  const [transactions, setTransactions] = useState([]);

  const [bankBalance, setBankBalance] = React.useState("");
  const [personalBalance, setPersonalBalance] = React.useState("");
  const [lotteryBalance, setLotteryBalance] = React.useState("");

  const [depositingAmount, setDepositingAmount] = useState<string>("");
  const onAmountChange = (e: any) => setDepositingAmount(e.target.value);

  const [depositingAccount, setDepositingAccount] = useState<string>("");
  const onDepositingAccountChange = (e: any) => setDepositingAccount(e.target.value);

  const [depositingMessage, setDepositingMessage] = useState<string>("");
  const onDepositingMessage = (e: any) => setDepositingMessage(e.target.value);

  const handleSelfWithdraw = () => withdraw();
  const handleSelfDeposit = () => deposit();
  const handleAddressSubmit = () => depositTo();
  const handleReset = () => {
    setDepositingAmount("")
    setDepositingAccount("")
    setDepositingMessage("")
  };

  const withdraw = async () => {
    try{
      let amount=utils.parseEther(depositingAmount);
      console.log(amount);
        const withdrawTx = await bankContract.withdraw(amount);
        console.log("Mining...", withdrawTx.hash);
        await withdrawTx.wait();
        console.log("Mined -- ", withdrawTx.hash);
        let content="";
        console.log(content);
        updateBankBalance();
        updatePersonalBalance();
        handleReset();
        getAllTransactions();
    }catch (error) {
console.log(error);
    }
  }
  
  const deposit = async () => {
    try{
      console.log(depositingAmount);
       // @ts-ignore: This expression is not callable.
       let amount=utils.parseEther(depositingAmount);
       console.log(amount);
        const depositTx = await bankContract.deposit({value: amount});
        console.log("Mining...", depositTx.hash);
        await depositTx.wait();
        console.log("Mined -- ", depositTx.hash);
        let content="";
        console.log(content);
        updateBankBalance();
        updatePersonalBalance();
        handleReset();
        getAllTransactions();
    }catch (error) {
      console.log(error);
    } 
  }
  
  const depositTo = async () => {
    try{
      let amount=utils.parseEther(depositingAmount);
      console.log(amount);
      // @ts-ignore: This expression is not callable.
        const depositToTx = await bankContract.depositTo(depositingAccount,depositingMessage, {value: amount});
        console.log("Mining...", depositToTx.hash);
        await depositToTx.wait();
        console.log("Mined -- ", depositToTx.hash);
        let content="";
        console.log(content);
        updateBankBalance();
        updatePersonalBalance();
        handleReset();
        getAllTransactions();
    }catch (error) {
      console.log(error);
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    updateBankBalance();
    updatePersonalBalance();
    getAllTransactions();
  };

async function updateBankBalance(){
  console.log("getting bank balance");
  let currentBalance=await web3.eth.getBalance(bankContract.address);
  setBankBalance(`${ethers.utils.formatEther(currentBalance)} ETH`)
}

async function updatePersonalBalance(){
  console.log("getting personal balance")
  if(account){
    try{
      // @ts-ignore: Object is possibly 'null'.
    let currentBalance=await bankContract.customerBalance(account);
    setPersonalBalance(`${ethers.utils.formatEther(currentBalance)} ETH`);
    }catch(e){
      console.log(e);
    }
  }
}

async function updateLotteryBalance(){

}

  return (
    <Box sx={{ width: '100%' }}>
          <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#101010' : 'grey.600',
          color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.50'),
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          p: 2,
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          position: 'absolute',
          top: 65,
          left: '80%',
          zIndex: 'tooltip',
          width:300
        }}
      >
       <p>CURRENT BANK BALANCE: {bankBalance}</p>
       <p>PERSONAL BALANCE: {personalBalance}</p>
       <p>LOTTERY BALANCE: {lotteryBalance}</p>

      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="SELF DEPOSIT" {...a11yProps(0)} />
          <Tab label="SELF WITHDRAW" {...a11yProps(0)} />
          <Tab label="ADDRESS DEPOSIT" {...a11yProps(1)} />
          <Tab label="MESSAGES" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="">
            <TextField
            className="materialUiInput"
              onChange={onAmountChange}
              value={depositingAmount}
              label={"Amount to deposit"} //optional
            />

          <div className="center-buttons">
            <Button onClick={handleSelfDeposit}>Deposit</Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="">
            <TextField
            className="materialUiInput"
              onChange={onAmountChange}
              value={depositingAmount}
              label={"Amount to withdraw"} //optional
            />

          <div className="center-buttons">
            <Button onClick={handleSelfWithdraw}>Withdraw</Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div>
            <TextField
              onChange={onAmountChange}
              value={depositingAmount}
              label={"Amount to deposit"}
              InputProps={{
                inputProps: {
                    style: { textAlign: "center"},
                }
            }}
            sx={{padding: "0 0 10px 0"}}
            />
            <TextField
              onChange={onDepositingAccountChange}
              value={depositingAccount}
              label={"Account to deposit to"} //optional
              className="materialUiInput"
              InputProps={{
                inputProps: {
                    style: { textAlign: "center" },
                }
            }}
            sx={{padding: "0 0 10px 0"}}
            />
            <TextField
              onChange={onDepositingMessage}
              value={depositingMessage}
              label={"Attach a message"} //optional
              className="materialUiInput"
              InputProps={{
                inputProps: {
                    style: { 
                      textAlign: "center" 
                    },
                }
            }}
            sx={{padding: "0 0 10px 0"}}
            />
            <div className="center-buttons">
            <Button onClick={handleAddressSubmit}>Submit</Button>
            <Button onClick={handleReset}>Reset</Button>
            </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/* @ts-ignore */}
        {transactions}
      </TabPanel>
    </Box>
  );
}
