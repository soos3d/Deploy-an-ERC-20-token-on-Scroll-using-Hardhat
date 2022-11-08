require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    scrollL2: {
      url: `https://prealpha.scroll.io/l2`,
      accounts: [PRIVATE_KEY]
    }
  }
};
