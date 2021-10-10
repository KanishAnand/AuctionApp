import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";

import getWeb3 from "./getWeb3";
import AuctionContract from "./contracts/Auction.json";
import Layout from "./pages/Layout";
import * as loader from "./assets/loader.json";

import "antd/dist/antd.dark.css";
import "./App.css";

export const BlockchainContext = createContext();

const App = (props) => {
  const [blockchain, setBlockchain] = useState({
    web3: null,
    accounts: null,
    contract: null,
    userAccount: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AuctionContract.networks[networkId];
        const contract = new web3.eth.Contract(
          AuctionContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        let userAccount = await web3.eth.getCoinbase();

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setBlockchain({ web3, accounts, contract, userAccount });
        console.log({ web3, accounts, contract, userAccount });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [load, setLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 2000);
  }, []);

  return blockchain.web3 === null || !load ? (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FadeIn>
        <div>
          <Lottie options={defaultOptions} height={320} width={320} />
        </div>
      </FadeIn>
      <div style={{ textAlign: "center", position: "fixed", bottom: "20px" }}>
        Loading Web3, accounts, and contract
      </div>
    </div>
  ) : (
    <FadeIn>
      <BlockchainContext.Provider value={blockchain}>
        <Layout />
      </BlockchainContext.Provider>
    </FadeIn>
  );
};

export default App;
