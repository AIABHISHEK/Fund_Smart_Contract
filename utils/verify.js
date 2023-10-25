const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
    try {
        console.log("verifiying");
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        });
    }
    catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified");
        }
        else {
            console.log(e);
        }
    }
};

module.exports = { verify };