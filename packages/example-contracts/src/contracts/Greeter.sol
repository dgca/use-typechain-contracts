// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Greeter {
    string greeting = 'Hello world';
    uint256 price = 0.1 ether;
    address lastUpdater;

    constructor() {
        lastUpdater = msg.sender;
    }

    function changeGreeting(string memory _greeting) external payable {
        if (msg.value != price) {
            revert('Invalid value amount');
        }

        (bool sent, ) = lastUpdater.call{value: msg.value}('');

        require(sent, 'Failed to send Ether');

        greeting = _greeting;
    }

    function getGreeting() external view returns (string memory) {
        return greeting;
    }
}
