//SPDX-License-Identifier: Unlicense
//Declare the version of solidity to compile this contract. 
//This must match the version of solidity in your hardhat.config.js file
pragma solidity ^0.8.0;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';

contract DREX is ERC20, Ownable, Pausable  {
 
    using SafeMath for uint256;

    uint8 private _decimals = 18;
    uint256 public divisor = 10000;
    uint256 public buyFee = 150;
    uint256 public sellFee = 500;

    address public vault;

    uint256 public _maxTxAmount = 1000000 * 10 **_decimals;

    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;
    

    constructor(address _router, address _vault) ERC20("Dean Real Estate Utility Token", "DREX") {
 
        _mint(msg.sender, 100000000 * 10 ** _decimals);
        // IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); /* mainnet */
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(_router); /* 0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45 */
        vault = _vault;

        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

        uniswapV2Router = _uniswapV2Router;

    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        uint256 feeAmount = 0;
        
        if(from == address(uniswapV2Pair)) {
            feeAmount = amount.mul(buyFee).div(divisor);
        }else if (to == address(uniswapV2Pair)) {
            feeAmount = amount.mul(sellFee).div(divisor);
        }

        super._transfer(from, vault, feeAmount);
        super._transfer(from, to, amount.sub(feeAmount));
    }

    receive() external payable {    }
}