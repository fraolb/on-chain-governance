// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract WEB3ETH is ERC20 {
    address public liquidityFeeWallet;
    AggregatorV3Interface internal dataFeed;

    event buyWEB3ETHEvent(address indexed sender, uint indexed amount);
    event transferEvent(
        address indexed sender,
        address indexed reciever,
        uint256 amount
    );

    constructor(
        address liquidityFeesWallet1
    ) ERC20("Web3Foundation", "WEB3ETH") {
        _mint(_msgSender(), 1000000 * 10 ** 18);
        liquidityFeeWallet = liquidityFeesWallet1;
        dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    function transfer(
        address to,
        uint256 value
    ) public override returns (bool) {
        address owner = _msgSender();
        require(value < super.balanceOf(owner), "Not enough balance");
        uint256 theFeeValue = value - (value * 95) / 100;
        uint256 theTransactionAmount = value - theFeeValue;
        require(theFeeValue > 0, "The fees are 0");
        console.log(theTransactionAmount);
        console.log(theFeeValue);
        super._transfer(owner, to, theTransactionAmount);
        super._transfer(owner, liquidityFeeWallet, theFeeValue);
        emit transferEvent(owner, to, value);
        return true;
    }

    function transferNormal(address to, uint256 value) public {
        bool success = super.transfer(to, value);
        require(success, "funds transfered");
    }

    function buyWEB3ETH() public payable {
        (, int answer, , , ) = dataFeed.latestRoundData();
        require(answer > 0, "Invalid ETH price from Chainlink");

        // Convert int answer to uint for multiplication
        uint ethPrice = uint(answer * 1e10);

        // Calculate the amount of tokens to mint based on ETH value received
        uint tokensToMint = (msg.value * ethPrice) / 1 ether;

        // Mint the tokens to the buyer
        _mint(_msgSender(), tokensToMint);
        emit buyWEB3ETHEvent(msg.sender, tokensToMint);
    }
}
