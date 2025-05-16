import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import "./tasks";

dotenv.config();

const { PRIVATE_KEY, BASESCAN_API_KEY, COINMARKETCAP_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.27",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.GAS_REPORT === "true",
    // currency: "JPY",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    showTimeSpent: true,
    showMethodSig: true,
    noColors: false,
    outputFile: process.env.GAS_REPORT_FILE ? "./gas-report.txt" : undefined,
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      base: `${BASESCAN_API_KEY}`,
      baseSepolia: `${BASESCAN_API_KEY}`,
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
