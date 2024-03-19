const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ProposalMultisigModule", (m) => {
  const lock = m.contract("ProposalApprovalMultiSig", [
    "0x22072f8Ac3f2Dd4E635c9fF3b9bf44DeF9502268",
  ]);

  return { lock };
});

//0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
