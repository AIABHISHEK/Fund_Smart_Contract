// we deploy on mock local 
const { network } = require("hardhat");

const { developmentChains, decimals, initialAnswer } = require("../helper-hardhat-config");

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        log("local network deployment ********");
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [decimals, initialAnswer] //argument to be passed contract check -->in node module  Chainlink module "MockV3Aggregator"
        });
        log("mock deployed   ___***** ");
    }
};

module.exports.tags  = ["all", "mocks"] // while deploying we want to deploy specific this script we can add --tags mocks while deploying