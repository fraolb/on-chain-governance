// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

//0x406AB5033423Dcb6391Ac9eEEad73294FA82Cfbc

contract ProposalApprovalMultiSig {
    address[] public voters;
    address public tokenAddress;
    uint public requiredApprovals;

    struct Proposal {
        string description;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(uint256 => uint256) voteCounts;
    }

    Proposal[] public Proposals;
    mapping(uint => mapping(address => bool)) public approvals;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    // modifier onlyOwner1() {
    //     IERC20 token = IERC20(tokenAddress);
    //     require(token.balanceOf(address(this))>0,"not enough token balance");
    //     _;
    // }
    modifier onlyOwner() {
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(msg.sender) > 0, "Not enough token balance");
        _;
    }

    //, uint256 _startTime, uint256 _endTime
    function submitProposal(
        string memory _description,
        string[] memory _options,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyOwner {
        Proposal storage newProposal = Proposals.push();

        newProposal.description = _description;
        newProposal.options = _options;
        newProposal.startTime = _startTime;
        newProposal.endTime = _endTime;
        newProposal.executed = false;

        for (uint256 i = 0; i < _options.length; i++) {
            newProposal.voteCounts[i] = 0; // Initialize vote count for each option to 0
        }
    }

    function voteProposal(
        uint256 proposalIndex,
        uint256 optionIndex
    ) public onlyOwner {
        require(proposalIndex < Proposals.length, "Invalid proposal index");

        Proposal storage proposal = Proposals[proposalIndex];

        require(
            block.timestamp >= proposal.startTime,
            "Voting has not started yet"
        );
        require(block.timestamp <= proposal.endTime, "Voting has ended");

        require(optionIndex < proposal.options.length, "Invalid option index");

        require(!approvals[proposalIndex][msg.sender], "Already voted");

        approvals[proposalIndex][msg.sender] = true;

        proposal.voteCounts[optionIndex]++; // Increment the vote count for the chosen option
    }

    function getWinningOption(
        uint256 proposalIndex
    ) public view returns (string memory) {
        require(proposalIndex < Proposals.length, "Invalid proposal index");

        Proposal storage proposal = Proposals[proposalIndex];
        string[] storage options = proposal.options;
        uint256 winningVoteCount;
        uint256 winningOptionIndex;

        for (uint256 i = 0; i < options.length; i++) {
            uint256 voteCount = proposal.voteCounts[i];
            if (voteCount > winningVoteCount) {
                winningVoteCount = voteCount;
                winningOptionIndex = i;
            }
        }

        return options[winningOptionIndex];
    }

    function getOptionStatus(
        uint256 proposalIndex
    ) public view returns (uint256[] memory) {
        require(proposalIndex < Proposals.length, "Invalid proposal index");

        Proposal storage proposal = Proposals[proposalIndex];
        string[] storage options = proposal.options;
        uint256[] memory voteCounts = new uint256[](options.length);

        for (uint256 i = 0; i < options.length; i++) {
            voteCounts[i] = proposal.voteCounts[i];
        }

        return voteCounts;
    }
    //["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]
}
