//SPDX-License-Identifier: Unlicense
//Declare the version of solidity to compile this contract. 
//This must match the version of solidity in your hardhat.config.js file
pragma solidity ^0.8.0;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ITR is ERC20, Ownable  {
 
    constructor() ERC20("Interest Tax Rent", "ITR") {
 
        _mint(msg.sender, 100000000 * 10 ** 18);
    }

    receive() external payable {    }
}