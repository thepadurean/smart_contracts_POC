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
}
);

const AppContextProvider = ({ children }) => {
    const [visibility, setVisibility] = React.useState(false);
    const [contextData, setContextData] = React.useState({});
    const [waveCount, setWaveCount] = React.useState(0);
    const [account, setAccount] = React.useState(null);

    return (
        <AppContext.Provider value={{ visibility, setVisibility, contextData, setContextData, waveCount, setWaveCount, account, setAccount }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
