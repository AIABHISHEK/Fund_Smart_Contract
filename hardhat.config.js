require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  // solidity: "0.8.9",
// adding multiple compler version 
// rinkeby named network is goerli
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
      chainId: 5,
      blockConfirmations:6
    }
  },
  etherscan: {
    apiKey:ETHERSCAN_API_KEY
  },
  namedAccounts:{
    deployer: {
      default:0
    }
  },
  gasReporter:{
    enabled: true,
    outputFile: "gas-report.txt",
    currency: "USD"
  },
  solidity: {
    compilers: [{ version: "0.6.6" }, { version: "0.8.9" }]
  }
};