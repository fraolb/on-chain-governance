const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CoinVestModule", (m) => {
  const lock = m.contract("WEB3ETH",["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"]);

  return { lock };
});
