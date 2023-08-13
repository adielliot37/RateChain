import "@nomicfoundation/hardhat-toolbox";
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli_optimism: {
      url: `https://goerli.optimism.io`,
      accounts: [`0x12ffaf3a792f4e8cdb53d428b8023cf5302ce53117e6a5be10526c6a46fe3065`],
    },
  },
};