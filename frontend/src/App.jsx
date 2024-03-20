import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

import Box from "@mui/material/Box";
import EthImg from "./assets/EthImage.png";
import EthIcon from "./assets/ethereum.png";
import { Button, Grid, TextField, Typography } from "@mui/material";

function App() {
  //EtH values
  const [balance, setBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  // The Token value and wallet address
  const [tokenBalance, setTokenBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");

  const firstPart = walletAddress?.substring(0, 6);
  const lastPart = walletAddress?.substring(walletAddress.length - 4);

  //inputs from owners
  const [formData, setFormData] = useState({
    description: "",
    options: [],
    startTime: null,
    endTime: null,
  });
  const [choice, setChoice] = useState("");
  const [startTime, setStartTime] = useState();
  const [startDate, setStartDate] = useState();
  const [endTime, setEndTime] = useState();
  const [endDate, setEndDate] = useState();

  const ContractAddress = "0x7Fe766F35acED48a76c49e215D929604c9dD0991";
  const TokenContractAddress = "0x22072f8Ac3f2Dd4E635c9fF3b9bf44DeF9502268";

  let signer = null;
  let provider;
  let userAddress;

  const ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalIndex",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
      ],
      name: "submitProposalEvent",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "Proposals",
      outputs: [
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "executed",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "approvals",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalIndex",
          type: "uint256",
        },
      ],
      name: "getOptionStatus",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalIndex",
          type: "uint256",
        },
      ],
      name: "getWinningOption",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "requiredApprovals",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
        {
          internalType: "string[]",
          name: "_options",
          type: "string[]",
        },
        {
          internalType: "uint256",
          name: "_startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_endTime",
          type: "uint256",
        },
      ],
      name: "submitProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "tokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalIndex",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "optionIndex",
          type: "uint256",
        },
      ],
      name: "voteProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "voters",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const TokenABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "liquidityFeesWallet1",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "allowance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "needed",
          type: "uint256",
        },
      ],
      name: "ERC20InsufficientAllowance",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "needed",
          type: "uint256",
        },
      ],
      name: "ERC20InsufficientBalance",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "approver",
          type: "address",
        },
      ],
      name: "ERC20InvalidApprover",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
      ],
      name: "ERC20InvalidReceiver",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "ERC20InvalidSender",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "ERC20InvalidSpender",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "liquidityFeeWallet",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "transferNormal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const ConnectWallet = async () => {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.enable(); // Request access to accounts
      // const userAddress = await provider.get
      signer = await provider.getSigner();
      userAddress = await signer.getAddress();
      setWalletAddress(userAddress);

      let userBalanceFetch = await GetBalance(userAddress);
      //console.log("the user balance is ", userBalanceFetch);
      setUserBalance(userBalanceFetch);

      let contractBalanceFetch = await GetBalance(ContractAddress);
      setBalance(contractBalanceFetch);
      //console.log("the user Adrees is ", userAddress);

      let userTokenBalanceFetch = await checkTokenBalance(userAddress);
      //console.log("the user token balance is ", userTokenBalanceFetch);
    }
  };

  ///For Specific Token
  const checkTokenBalance = async (address) => {
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(
        TokenContractAddress,
        TokenABI,
        provider
      );
      const balance = await tokenContract.balanceOf(address);

      const changeBalanceFromWeiToEth = Number(balance) / 10 ** 18;
      console.log("the balance is ", changeBalanceFromWeiToEth);
      setTokenBalance(changeBalanceFromWeiToEth);
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  ///for ETH
  const GetBalance = async (e) => {
    // e.PreventDefault();
    const balance = await provider.getBalance(e);
    const actualVal = ethers.formatEther(balance);
    return actualVal;
    //
  };

  //Convert Time to EtH time
  function convertToTimestamp(dateString, timeString) {
    const dateTimeString = `${dateString} ${timeString}`; // Concatenate the date and time strings
    const timestamp = Math.floor(new Date(dateTimeString).getTime() / 1000); // Convert to Unix timestamp (in seconds)
    return timestamp;
  }
  ///////////// functions for the form///////////
  //////////////////////////////////////////////
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOptionAdd = () => {
    setFormData((prevData) => ({
      ...prevData,
      options: [...prevData.options, choice],
    }));
    setChoice("");
  };

  const handleTimeStamp = () => {
    const startTimeInEth = convertToTimestamp(startDate, startTime);
    console.log("start time ", startTimeInEth, typeof startTimeInEth);
    const endTimeInEth = convertToTimestamp(endDate, endTime);
    console.log("end time ", endTimeInEth);

    setFormData((prevData) => ({
      ...prevData,
      startTime: startTimeInEth,
      endTime: endTimeInEth,
    }));
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data:", formData);
    // Add logic to submit form data

    if (signer == null) {
      console.log("the signer isnull");
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      console.log("now the signer is ", signer);
    }

    const contract = new ethers.Contract(ContractAddress, ABI, signer);
    console.log("the signer is ", signer);
    console.log("the contract is ", contract);

    const submitProposal = await contract.submitProposal(
      formData.description,
      formData.options,
      formData.startTime,
      formData.endTime
    );

    await console.log("the submitProposal is ", submitProposal);

    const result = await submitProposal.wait();
    console.log("the result is ", result);
    console.log("the result log is ", result.logs);
    console.log("the result log array is ", result.logs[0].args);
    console.log("the result log array first data is ", result.logs[0].args[0]);
    console.log("the result log array second data is ", result.logs[0].args[1]);

    setFormData({
      description: "",
      options: [],
      startTime: null,
      endTime: null,
    });
  };
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////

  useEffect(() => {
    const funs = async () => {
      await ConnectWallet().catch(console.error);
    };
    funs();
  }, []);

  return (
    <Box className="body">
      <Box className="header" height={{ xs: "100vh", md: "70vh" }}>
        <Box display={"flex"} justifyContent={"right"} padding={4}>
          {walletAddress == "" ? (
            <Button variant="outlined" onClick={ConnectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Box display={"flex"}>
              <Box display={"flex"} mr={2}>
                <img
                  src={EthIcon}
                  style={{
                    height: "30px",
                    width: "auto",
                  }}
                />
                <Typography variant="h6">
                  {Number(userBalance).toFixed(2)}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                border={"solid"}
                style={{ borderRadius: "5px" }}
                pl={2}
                pr={2}
              >
                {firstPart}...{lastPart}
              </Typography>
            </Box>
          )}
        </Box>
        <Grid container spacing={2} padding={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h2" textAlign={"center"}>
              <h6 style={{ padding: 0, margin: 0 }}>Welcome to the </h6>
              <h1 style={{ padding: 0, margin: 0 }}> DAO</h1> Govenrnance System
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box mt={{ xs: 0, md: "30px" }}>
              <img
                src={EthImg}
                style={{
                  height: "auto",
                  width: "100%",
                  borderRadius: "20px",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2}>
        <Typography variant="h4">Create a Proposal</Typography>
        <Box>
          <form onSubmit={handleSubmit}>
            <Box>
              <label>Description:</label>
              <TextField
                variant="standard"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Box>
            <Box>
              <label>Options:</label>
              {formData.options.map((option, index) => (
                <Box key={index}>
                  <input type="text" value={option} readOnly />
                </Box>
              ))}
              <input
                type="text"
                name="options"
                value={choice}
                onChange={(e) => setChoice(e.target.value)}
              />
              <button type="button" onClick={handleOptionAdd}>
                Add Option
              </button>
            </Box>
            <Box>
              <Box>
                <label>Start Time (ETH):</label>
                <input
                  type="time"
                  name="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <input
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Box>
              <Box>
                <label>End Time (ETH):</label>
                <input
                  type="time"
                  name="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                <input
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Box>
              <Box style={{ margin: "20px" }}>
                <button type="button" onClick={handleTimeStamp}>
                  Assign the Timestamp
                </button>
              </Box>
            </Box>

            <button type="submit">Submit</button>
          </form>
        </Box>
      </Box>
      <Box>
        <h4>The Contract ETH balance: {balance}</h4>
        <h4>the user ETH Balance is : {userBalance}</h4>

        <Box>
          <h2>Token Balance Checker</h2>
          <p>Wallet Address: {walletAddress}</p>
          <p>Token Balance: {tokenBalance}</p>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
