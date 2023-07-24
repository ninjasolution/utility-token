const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { constants } = require("ethers");
const { UniswapV2Deployer, ethers } = require("hardhat");

function eth(amount) {
  return ethers.utils.parseEther(amount.toString())
}

describe("DREToken", function () {

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [deployer, fund, target] = await ethers.getSigners();

    // deploy the uniswap v2 protocol
    const { factory, router, weth9 } = await UniswapV2Deployer.deploy(deployer);

    // deploy our token
    const Token = await ethers.getContractFactory("DREX")
    const token = await Token.deploy(router.address, fund.address)
    await token.deployed()

    // get our pair
    const pair = new ethers.Contract(await token.uniswapV2Pair(), UniswapV2Deployer.Interface.IUniswapV2Pair.abi)

    // approve the spending
    await weth9.approve(router.address, eth(1000))
    await token.approve(router.address, eth(1000))

    // add liquidity
    await router.addLiquidityETH(
      token.address,
      eth(500),
      eth(500),
      eth(10),
      deployer.address,
      constants.MaxUint256,
      { value: eth(10) }
    )

    return { token, deployer, fund, target, factory, router, weth9, pair }
  }

  describe("transfer", function () {

    it("shouldn't tax on transfer", async function () {
      const { token, deployer, fund, target } = await loadFixture(deploy)

      await expect(token.transfer(target.address, eth(100))).to.changeTokenBalances(
        token,
        [deployer, fund, target],
        [eth(100).mul(-1), 0, eth(100)]
      )

    })

  })

});
