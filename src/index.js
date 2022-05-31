import React from "react";
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './components/mainScreen';
import AppContextProvider from "./components/context";

ReactDOM.render(
    <AppContextProvider>
        <App/>
    </AppContextProvider>
    ,
    document.getElementById('root')
);