const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const coinInu = await ethers.getContractFactory("CoinInu");

  // here we deploy the contract, the parameter in () is the contructor argument.
  const deployedCoinInu = await coinInu.deploy();   // 10 is the Maximum number of whitelisted addresses allowed.
  console.log(`Deploying smart contract...`)                             // This is just so you know what is happening during the process

  // Wait for it to finish deploying.
  await deployedCoinInu.deployed();

  // print the address of the deployed contract
  console.log(`The smart contract was deployed at: ${deployedCoinInu.address} on Scroll L2!`);
}

// Call the main function and catch if there is any error

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
