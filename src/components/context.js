import React, { createContext, useContext } from "react";

const AppContext = createContext({
    visibility: false,
    setVisibility: () => {},
    contextData: {},
    setContextData: () => {},
    waveCount: 0,
    setWaveCount : () => {},
    account: null,
    setAccount : () => {},
    contractData: null,
    setContractData: () => {}
}
);

const AppContextProvider = ({ children }) => {
    const [visibility, setVisibility] = React.useState(false);
    const [contextData, setContextData] = React.useState({});
    const [contractData, setContractData] = React.useState({});
    const [waveCount, setWaveCount] = React.useState(0);
    const [account, setAccount] = React.useState(null);

    return (
        <AppContext.Provider value={{ visibility, setVisibility, contextData, setContextData, waveCount, setWaveCount, account, setAccount, contractData, setContractData }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
