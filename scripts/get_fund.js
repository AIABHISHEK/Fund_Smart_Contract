const { getNamedAccounts, ethers } = require("hardhat");

// scripts to fund our contract
async function main() {
    const { deployer } = await getNamedAccounts();
    const contractFund = await ethers.getContract("Fund", deployer);
    console.log("funding contract");
    const trxResponse = await contractFund.getFund({ value: ethers.utils.parseEther("20") });
    await trxResponse.wait(1);
    console.log("funded");
}

main().then(() => {
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
})