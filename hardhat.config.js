require("@nomicfoundation/hardhat-toolbox");
require("@onmychain/hardhat-uniswap-v2-deploy-plugin");
// Any file that has require('dotenv').config() statement 
// will automatically load any variables in the root's .env file.
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY
const etherscanKey = process.env.ETHERSCAN_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [PRIVATE_KEY]
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      
    },
    goerli: {
      url: "https://eth-goerli.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
      accounts: [PRIVATE_KEY]
    },
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
  },
  solidity: {
    // version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.0",
      },]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: etherscanKey,
  },
}