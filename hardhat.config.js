require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
      },
    },
    sepolia: {
      url: process.env.REACT_APP_SEPOLIA_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY_TEST],
    },
    amoy: {
      url: process.env.REACT_APP_AMOY_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY_TEST],
    },
    polygon: {
      url: process.env.REACT_APP_POLYGON_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY_MAIN],
    },
    /*arbitrumSepolia: {
      url: process.env.REACT_APP_ARBITRUM_SEPOLIA_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY_TEST],
    },*/
    arbitrum: {
      url: process.env.REACT_APP_ARBITRUM_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY_MAIN],
    },
    arbitrumOne: {
      url: process.env.REACT_APP_ARBITRUM_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY_MAIN],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.REACT_APP_ETHERSCAN_SEPOLIA_KEY,
      amoy: process.env.REACT_APP_POLYGONSCAN_KEY,
      polygon: process.env.REACT_APP_POLYGONSCAN_KEY,
      /*arbitrumSepolia: process.env.REACT_APP_ARBISCAN_SEPOLIA_KEY,
      arbitrum: process.env.REACT_APP_ARBISCAN_KEY,*/
      arbitrumOne: process.env.REACT_APP_ARBISCAN_KEY,
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      {
        network: "arbitrumOne",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io/",
        },
      },
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/",
        },
      },
    ],
  },
  paths: {
    sources: path.join(__dirname, "contracts"),
    artifacts: path.join(__dirname, "artifacts"),
    cache: path.join(__dirname, "cache"),
    tests: path.join(__dirname, "test"),
  },
};
