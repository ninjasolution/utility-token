// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  
  let router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  let vault = "0x7B7887059860a1A21f3C62542B6CE5c0a23c76d5";
  

  const Token = await hre.ethers.getContractFactory("DREX");
  const token = await Token.deploy(router, vault)
  console.log("Post deployed to:", token.address);
  
  await hre.run("verify:verify", {
    address: token.address,
    constructorArguments: [router, vault],
  });

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
