// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

import "./PriceConverter.sol";

error Fund__notOwner();
// error are cheaper than require

/** @title title Fund
*   @author abhishek yadav
*   @notice this is demo funding contract
*   @dev this implements price feed library
*/
contract Fund {
    //private and internal variable have cheaper gas price cost than public
    using PriceConverter for uint256; // to call library function for uint256 as member function
    //immutable similar to constant but you can assign them later after declration
    address public immutable i_owner;

    AggregatorV3Interface public s_priceFeed;

// get funds function //
    address[] public s_funders; // those who send fund
    uint256 public constant MINIMUM_FUND_IN_USD = 1;
    
    mapping(address => uint256) public s_addressToFundAmount;

// we can pass address of network we want the price and of which token
    constructor(address priceFeedAddress) { 
        // when deployed constructor is called
        i_owner = msg.sender; /// who ever deploy will be owner
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

// revert() function can we used in functions to revet tx
    // *****************
    // Receive and Fallback function
    // what happens when someone sends eth without calling the fund function
    receive() external payable {
        //get triggered when someone sends the eth without data
        getFund();
    }

    fallback() external payable {
        getFund();
        //get triggered when someone sends the eth with data
    }


    // modifiers to modify function
    modifier onlyOwner() {
        // add this to function
        // require(msg.value ==owner, "Sender is not owner");
        // instead of require we can create custom error which are more gas efficient
        if (msg.sender != i_owner) {
            revert Fund__notOwner();
        }
        _;
    }

    function getFund() public payable {
        // payable for functions: Allows them to receive Ether together with a call.
        // to get minimum amount use require

        // require(getConversionRate(msg.value) >= minimunFundInUSD, "Not enough fund by sender"); //

        //reverts trx if condition not satisfied
        // msg.value acts as first parameter  (library ) for further parameter add it in (here of getConversionRate)
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_FUND_IN_USD,
            "Not enough fund by sender"
        );
         // msg.sender give the address of the sender
        s_addressToFundAmount[msg.sender] = msg.value;
        s_funders.push(msg.sender);
    }

    // *************************************
    // if we want to interact with other contract we need to get
    //abi
    //address --> 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e (rinkeby test net)
    // of the that contarct
    // we can import contract to get abi or by its interface
    // but there is way to interact with contract without abi

    //**************************************
    //withdraw function
    // withdraw
    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < s_funders.length; i++) {
            address funder_address = s_funders[i];
            s_addressToFundAmount[funder_address] = 0;
        }
        //reset array
        s_funders = new address[](0); // reset to 0 element

        // sending funds
        // 3 ways
        //  --  transfer
        //  --  send
        //  --  call
        // msg.sender is address type cast it to payable address (only payable address used for tx)
        // *****
        //payable(msg.sender).transfer(address(this).balance); // throw error if failed and reverts automatically

        //send
        //bool isSent = payable(msg.sender).send(address(this).balance);
        //return bool do notr revert automatically
        // require(isSent, "Sending fund failed");

        //call
        //returs 2 values 1 bool and other any data returned
        (bool isSent_byCall, ) = payable(msg.sender).call{ value: address(this).balance }(""); 
        // takes the data to passed msg.data
        require(isSent_byCall, "failed tx");
    }

    function cheaperWithdraw() public payable onlyOwner{
        address[] memory funders = s_funders;
        // reading and stroring in storage costs gas lots of gas
        //mappings can not be in memory
        for(uint256 index = 0; index < funders.length; index++){
            address funder = funders[index];
            s_addressToFundAmount[funder] = 0;
        }
        s_funders = new address[](0);

        (bool isSent_byCall_Success, ) = payable(msg.sender).call{ value: address(this).balance }(""); 
        // takes the data to passed msg.data
        require(isSent_byCall_Success, "failed tx");
    }
}
