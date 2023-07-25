require("@nomicfoundation/hardhat-toolbox");
require("@onmychain/hardhat-uniswap-v2-deploy-plugin");
// Any file that has require('dotenv').config() statement 
// will automatically load any variables in the root's .env file.
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY
const etherscanKey = process.env.ETHERSCAN_KEY
const infraKey = process.env.INFRA_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infraKey}`,
      accounts: [PRIVATE_KEY],
      //gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infraKey}`,
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