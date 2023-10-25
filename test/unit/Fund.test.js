
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
// testing fund me contract
let contractFund;
let deployer;
let mockV3Aggregator;
let sendValue = ethers.utils.parseEther("2");
describe("Fund", async function () {

    beforeEach(async function () {

        deployer = (await getNamedAccounts()).deployer;
        ///deploy the Fund contract
        // deploy every contract that have tag all
        await deployments.fixture(["all"]);
        // gets the most recent deployrd contract
        contractFund = await ethers.getContract("Fund", deployer);

        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    });

    describe("constructor", async function () {
        it("Sets the aggregator address", async function () {
            const response = await contractFund.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });

    describe("fund", async function () {
        it("fails if not enough fund ETH", async function () {
            await expect(contractFund.getFund()).to.be.revertedWith;
        });
        it("update the address and amount funded ", async function () {
            await contractFund.getFund({ value: sendValue });
            const response = await contractFund.addressToFundAmount(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });
        it("add funders to array", async function () {
            await contractFund.getFund({ value: deployer });
            const funders = await contractFund.funders();
            assert.equal(funders, deployer);
        });
    });
});