//SPDX-License-Identifier: Unlicense
//Declare the version of solidity to compile this contract.
//This must match the version of solidity in your hardhat.config.js file
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CWF is ERC20, AccessControl, Ownable {

    bytes32 public constant BLACKER_ROLE = keccak256("BLACKER_ROLE");

    mapping(address => bool) internal blacklisted;

    event Blacklisted(address indexed _account);
    event UnBlacklisted(address indexed _account);
    event AddAdmin(address indexed _account);
    event RemoveAdmin(address indexed _account);
    event AddBlacker(address indexed _account);
    event RemoveBlacker(address indexed _account);

    uint16 public _maxBalancePercent = 100; // 1%
    uint16 public _percentDivisor = 10000;

    constructor() ERC20("Federation World Contact", "CWF") {
        _mint(msg.sender, 700_000_000 * 10 ** 18);
        _grantRole(BLACKER_ROLE, msg.sender);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {

        require(!(blacklisted[from] || blacklisted[to]), "CWF: Black listed account.");

        uint256 balance = balanceOf(to);
        balance += amount;
        
        require(balance <= _maxBalancePercent * totalSupply() / _percentDivisor, "CWF: Anti whale policy.");
        
        super._transfer(from, to, amount);
    }

    /**
     * @dev Adds account to blacklist
     * @param _account The address to blacklist
     */
    function addBlacklist(address _account) public {
        require(hasRole(BLACKER_ROLE, msg.sender), "DOES_NOT_HAVE_Blacker_ROLE");

        blacklisted[_account] = true;
        emit Blacklisted(_account);
    }

    /**
     * @dev Removes account from blacklist
     * @param _account The address to remove from the blacklist
     */
    function removeBlacklist(address _account) public {
        require(
            hasRole(BLACKER_ROLE, msg.sender),
            "DOES_NOT_HAVE_Blacker_ROLE"
        );
        blacklisted[_account] = false;
        emit UnBlacklisted(_account);
    }

    /**
     * @dev Adds account to blacker list
     * @param _account The address to blacklist
     */
    function addBlacker(address _account) public onlyOwner {
        _grantRole(BLACKER_ROLE, _account);
        emit AddBlacker(_account);
    }

    /**
     * @dev Removes account to blacker list
     * @param _account The address to blacklist
     */
    function removeBlacker(address _account) public onlyOwner {
        _revokeRole(BLACKER_ROLE, _account);
        emit RemoveBlacker(_account);
    }

    receive() external payable {}
}
