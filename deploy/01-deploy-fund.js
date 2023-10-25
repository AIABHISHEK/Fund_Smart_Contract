
const { network } = require("hardhat");
const { logger } = require("ethers");

const { networkConfig, developmentChains } = require("../helper-hardhat-config.js");

const { verify } = require("../utils/verify");

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
     
    //get address for price feed
    let ethUsdPriceFeedAddress;

    // now we will want to get address on basis if we are on develoment network or not

    if (developmentChains.includes(network.name)) {
        let mockAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = mockAggregator.address;
    }

    else {
        console.log("hello");
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
    }
    let args = [ethUsdPriceFeedAddress];
    const contractFund = await deploy("Fund", {
        from: deployer,
        log: true,
        args: args, // price feed address
        waitConformations: 6
    });
    //if we are not on development chains and we have ETHERSCAN API KEY then we verify
    if (!developmentChains.includes(network.name) && (process.env.ETHERSCAN_API_KEY)) {
        console.log("verifying ****");
        await verify(contractFund.address, args);
    }
    log(" fund me deployed   ************");
};

module.exports.tags = ["all", "fund_"];


