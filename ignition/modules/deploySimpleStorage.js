const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleStorageModule", (m) => {
  const lock = m.contract("SimpleStorage");

  return { lock };
});
