const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { constants } = require("ethers");
const { UniswapV2Deployer, ethers } = require("hardhat");

function eth(amount) {
  return ethers.utils.parseEther(amount.toString())
}

describe("Testqwe", function () {

  let token, governace;
  let deployer, target, fund;

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [_deployer, _fund, _target] = await ethers.getSigners();

    // deploy the uniswap v2 protocol
    const { factory, router, weth9 } = await UniswapV2Deployer.deploy(_deployer);

    // deploy our token
    const Token = await ethers.getContractFactory("CWF")
    token = await Token.deploy()
    await token.deployed()

    
    // approve the spending
    await weth9.approve(router.address, eth(1000));
    await token.approve(router.address, eth(1000));

    // add liquidity
    await router.addLiquidityETH(
      token.address,
      eth(500),
      eth(500),
      eth(10),
      _deployer.address,
      constants.MaxUint256,
      { value: eth(10) }
    )

    deployer = _deployer;
    target = _target;
    fund = _fund;
  }

  before(async () => {
    await deploy();
  })


  describe("transfer", function () {

    it("shouldn't tax on transfer", async function () {

      // await token.addBlacklist(target.address);
      // await token.removeBlacklist(fund.address);
      await token.addAdmin(fund.address);
      await token.removeAdmin(fund.address);
      await token.addBlacker(fund.address);
      await token.connect(fund).addBlacklist(target.address);
      await token.removeBlacker(fund.address);

      await expect(token.transfer(target.address, eth(100))).to.changeTokenBalances(
        token,
        [deployer, fund, target],
        [eth(100).mul(-1), 0, eth(100)]
      )

    })

  })

  
});
