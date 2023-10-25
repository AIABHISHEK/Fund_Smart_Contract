const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const { deployer } = getNamedAccounts();

    const withdrawContract = await ethers.getContract("Fund", deployer);
    console.log("withdrawing fund");
    const trxResponse = await withdrawContract.withdraw();
    await trxResponse.wait(1);
    console.log("withdrawn");
}

main()
    .then(() => {
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
})