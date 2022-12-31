import { useEffect, useState, createContext, useRef } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {

  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  //------Template Code------//
  const [state, setState] = useState({
    provider: null,
    signer: null,
    transactionsContract: null,
  });

  const connectWallet = async () => {
    // const contractAddress = contractAddress;
    // const contractABI = contractABI;
    try {
      const { ethereum } = window;

      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(account);
        setCurrentAccount(account[0]);
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const transactionsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setState({ provider, signer, transactionsContract });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // connectWallet();
    console.log(state);
    // getAllTransactionss();
  }, []);

  useEffect(() => {
    getAllTransactionss();
  }, [state]);

  //------Template Code------//

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactionss = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      console.log(state.transactionsContract);
      const availableTransactions =
        await state.transactionsContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );

      console.log(structuredTransactions);

      setTransactions(structuredTransactions);
      // console.log(transactions);
    } catch (error) {
      console.log(error);
    }
  };

  // const checkIfWalletIsConnect = async () => {
  //   try {
  //     if (!ethereum) return alert("Please install MetaMask.");

  //     const accounts = await ethereum.request({ method: "eth_accounts" });
  //     console.log(accounts);

  //     if (accounts.length) {
  //       setCurrentAccount(accounts[0]);
  //       // getAllTransactions();
  //     } else {
  //       console.log("No accounts found");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const currentTransactionCount =
          await state.transactionsContract.getTransactionCount();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash =
          await state.transactionsContract.addToBlockchainnnn(
            addressTo,
            parsedAmount,
            message,
            keyword
          );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount =
          await state.transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   checkIfWalletIsConnect();
  // }, []);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
