import { useState, useEffect } from 'react'
import { ethers } from "ethers";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [balance, setBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [favoriteNumber, setFavouriteNumber] = useState(null);
  const [changeFavNum, setChangeFavNum] = useState(0);

  const [description, setDescription] = useState("")
  const [choice, setChoice] = useState("")
  const [option, setOption]= useState([])
  const [startDate, setStartDate]= useState()
  const [startTime, setStartTime]= useState()
  const [endTime, setEndTime]= useState()
  const [endDate, setEndDate]= useState()

  const ContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  let signer = null;
  let provider;
  let userAddress;

  const ABI =  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "Proposals",
      "outputs": [
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "executed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "approvals",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalIndex",
          "type": "uint256"
        }
      ],
      "name": "getOptionStatus",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalIndex",
          "type": "uint256"
        }
      ],
      "name": "getWinningOption",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requiredApprovals",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_options",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endTime",
          "type": "uint256"
        }
      ],
      "name": "submitProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "optionIndex",
          "type": "uint256"
        }
      ],
      "name": "voteProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

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

      let userBalanceFetch = await GetBalance(userAddress);
      //console.log("the user balance is ", userBalanceFetch);
      setUserBalance(userBalanceFetch);

      let contractBalanceFetch = await GetBalance(ContractAddress);
      setBalance(contractBalanceFetch);
      //console.log("the user Adrees is ", userAddress);

      ///the total supply
      console.log("the contract address is ", ContractAddress);
      const contractRO = new ethers.Contract(ContractAddress, ABI, provider);
      // const Sign = contractRO.connect(signer);
      // console.log("The sign is ", Sign);
      // setCallSigner(Sign);
      console.log("the contract is ", contractRO);
      
    }
  };

  const GetBalance = async (e) => {
    // e.PreventDefault();
    const balance = await provider.getBalance(e);
    const actualVal = ethers.formatEther(balance);
    return actualVal;
    //
  };

  const handleTime = async()=>{
    const change = await convertToTimestamp(startDate, startTime)
    console.log('the chagne', change)
  }

  function convertToTimestamp(dateString, timeString) {
    const dateTimeString = `${dateString} ${timeString}`; // Concatenate the date and time strings
    const timestamp = Math.floor(new Date(dateTimeString).getTime() / 1000); // Convert to Unix timestamp (in seconds)
    return timestamp;
  }

  const userDate = "2024-03-17";
  const userTime = "13:24:26";
  const unixTimestamp = convertToTimestamp(userDate, userTime);
  console.log(unixTimestamp);

  useEffect(()=>{
    const funs = async () => {
      await ConnectWallet().catch(console.error);
      
    };
    funs();
  })

  return (
    <>
       <div className="App">
        <h2>Hello</h2>
        <h4>The Contract balance: {balance}</h4>
        <h4>the user Balance is : {userBalance}</h4>
        <h5>The Fav num is : {favoriteNumber}</h5>
        <div>
          <input
            value={changeFavNum}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Proposal Description"
          />
          <div>
            <input
              value={choice}
              onChange={(e) => setChoice(e.target.value)}
              placeholder="Proposal Description"
            />
            <button onClick={()=>{setOption(...option, choice); setChoice("")}}>Add</button>
          </div>
          
          <input
            value={startDate}
            type='date'
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="start datt"
          />
          <input
            value={startTime}
            type='time'
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="start time"
          />
          <p>to</p>
          <input
            value={endTime}
            type='time'
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="end time"
          />
          
          <input
            value={endDate}
            type='date'
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="end data"
          />
          <button onClick={handleTime}>Add</button>
        </div>
    </div>
    </>
  )
}

export default App
