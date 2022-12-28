// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Todos {
    address public owner;
    string[] public todos;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert('You are not the owner');
        }
        _;
    }

    function addTodo(string memory todo) external onlyOwner {
        todos.push(todo);
    }

    function getTodos() external view returns (string[] memory) {
        return todos;
    }
}
