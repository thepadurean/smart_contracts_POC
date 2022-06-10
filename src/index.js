import React from "react";
import ReactDOM from 'react-dom';
import './style/index.css';
import BankApp from './components/bankApp';
import AppContextProvider from "./components/context";

ReactDOM.render(
    <AppContextProvider>
        <BankApp/>
    </AppContextProvider>
    ,
    document.getElementById('root')
);