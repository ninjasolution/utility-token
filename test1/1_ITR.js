const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { constants } = require("ethers");
const { UniswapV2Deployer, ethers } = require("hardhat");

function eth(amount) {
  return ethers.utils.parseEther(amount.toString())
}

describe("ITR", function () {

  let token, governace;
  let deployer, target, fund;

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [_deployer, _fund, _target] = await ethers.getSigners();

    // deploy the uniswap v2 protocol
    const { factory, router, weth9 } = await UniswapV2Deployer.deploy(deployer);

    // deploy our token
    const Token = await ethers.getContractFactory("ITR")
    token = await Token.deploy()
    await token.deployed()

    // deploy our token
    const ITRGovernor = await ethers.getContractFactory("ITRGovernor");
    governace = await ITRGovernor.deploy();
    await governace.deployed();

    
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

      await expect(token.transfer(target.address, eth(100))).to.changeTokenBalances(
        token,
        [deployer, fund, target],
        [eth(100).mul(-1), 0, eth(100)]
      )

    })

  })

  describe("Governor", function() {
    it("Create a proposal", async function() {

      const grantAmount = eth(1000);
      const transferCalldata = token.interface.encodeFunctionData("transfer", [target.address, grantAmount]);
  
      await governor.propose(
        [token.address],
        [0],
        [transferCalldata],
        "Proposal #1: Give grant to team"
      );
    })
  })

});
