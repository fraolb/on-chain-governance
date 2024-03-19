const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CoinVestModule", (m) => {
  const lock = m.contract("WEB3ETH", [
    "0x77B687D0eF084f5d2faBf3de003124a646d6E61D",
  ]);

  return { lock };
});
