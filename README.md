# Deploy an ERC-20 token on Scroll L2 using Hardhat 

This simple project shows you how to deploy an ERC-20 token on the Scroll L2 testnet using HardHat. Scroll is a new and emerging EVM compatible zero knowledge rollup blockchain aimed at improving Ethereum scalability and reducing costs. 

## Table of contents

 - [Prerequisites](#prerequisites)
  - [Quickstart](#quickstart)
  - [Create a Hardhat project](#create-a-hardhat-project)
  - [The smart contract](#the-smart-contract)
  - [Deploy the smart contract](#deploy-the-smart-contract)
    - [Configure the Hardhat project](#configure-the-hardhat-project)
  - [Conclusion](#conclusion)

## Prerequisites

* Node.js— [Install Node.js](https://nodejs.org/en/download/)
* Access to the [Scroll pre-alpha Testnet](https://prealpha.scroll.io/).
* Some TSETH to cover the transactions fees.

## Quickstart

The quickest way to play with Scroll and deploy an ERC-20 token on the Scroll L2 testnet is to:

1. Clone this repo.
1. Install dependencies.
    ```sh
    npm install
    ```
1. Create a `.env` file in the project's directory and add your private key (needed for deployment).
    ```env
    PRIVATE_KEY="YOUR_PRIVATE_KEY"
    ```
1. Compile the smart contract.
    ```sh
    npx hardhat compile
    ```
1. Deploy the smart contract.
    ```sh
    npx hardhat run scripts/deploy.js --network scrollL2
    ```

Congratulations! You just deployed an ERC-20 token named `CoinInu` with a supply of `1000000000`.

Now you can go check it on the [Scroll L2 explorer](https://l2scan.scroll.io/).

## Create a Hardhat project

The first thing to do here is to install and create a new Hardhat project. 

Create a new folder for your project, then open the directory from a terminal.

Initialize an npm project first. Answer the questions and it will create a `package.json` file.

```sh 
npm init
```

Then let't install Hardhat.

```sh 
npm install --save-dev hardhat
```

Then run the following in the directory where you installed Hardhat.

```sh 
npx hardhat
```

Choose `Create a Javascript Project` and answer the questions. This will create a sample project so that the structure is already there.

Then install the Hardhat toolbox, which contains tools to develop smart contracts.

```sh
npm install --save-dev "@nomicfoundation/hardhat-toolbox@^2.0.0" 
```

Now we initialized a Hardhat project! The structure should look like this. 

```sh
main-project-folder
    |_ contracts/
    |_ scripts/
    |_ test/
    |_ hardhat.config.js
```

## The smart contract

Now that we have a Hardhat project let's create the smart contract in the `contracts` folder. I named it `CoinInu.sol`.

> You can find the smart contract in the `contracts` folder in the repo, and it is en ERC-20 implementation made usin the [OpenZeppelin wizard](https://wizard.openzeppelin.com/).

To deploy your custom token, simply edit the constructor parameters to change the `token's name`, `symbol`, and how many tokens to mint and send to your wallet.

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinInu is ERC20 {
    constructor() ERC20("Coin Inu", "CINU") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }
}
```

In this case, this contract mints `1000000000` tokens when it is deployed. If you want to be able to mint more tokens, later on, choose the `mintable` flag on the OZ wizard, or add the `Ownable.sol` import, and add the `mint` function.

```sol
import "@openzeppelin/contracts/access/Ownable.sol";
```

This will give you access to the `Ownable` functions, which include the `mint` function.

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MTK") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

> Remember to also change the name of the contract!

Save your smart contract in the `contracts` folder. Now that we have our smart contract, we can compile it.

```sh
npx hardhat compile
```

## Deploy the smart contract

At this point, we are ready to deploy our ERC-20 token on the Scroll L2 testnet!

To do this, we need a deploy script, which goes into the `scripts` folder. Let's create `deploy.js` in it.

This script is heavily commented on, so you can understand what the functions do.

This deploy script uses the Ethers library to:

* Create a `ContractFactory` to deploy smart contracts.
* Deploy the smart contract.
* Retrieve and display the address.

```js
const { ethers } = require("hardhat");

async function main() {

  // A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  // so coinInu here is a factory for instances of our CoinInu contract.

  const coinInu = await ethers.getContractFactory("CoinInu");

  // here we deploy the contract, the parameter in () is the contructor argument.
  const deployedCoinInu = await coinInu.deploy();   
  console.log(`Deploying smart contract...`)      // This is just so you know what is happening during the process

  // Wait for it to finish deploying.
  await deployedCoinInu.deployed();

  // print the address of the deployed contract
  console.log(`The smart contract was deployed at: ${deployedCoinInu.address} on Scroll L2!`);
}

// Call the main function and catch if there is any error

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

> Make sure to use the exact name of your contract file in the contract factory.

If your smart contract is named `MyToken.sol`, use the same name in the contract factory.

```js
const coinInu = await ethers.getContractFactory("MyToken");
```

Once the script is ready and saved, let's take a look at `hardhat.config.js`.

### Configure the Hardhat project

The `hardhat.config.js` file is where Hardhat picks up the required dependencies, such as the network(s) to use and the wallet's private key deploying the smart contract.

The private key will be imported using the `dotenv` package so we don't push it online by mistake.

Intall dotenv.

```sh
npm i dotenv
```

Then create a `.env` file inside your project and set up your private key as an environment variable.

```env
PRIVATE_KEY="YOUR_PRIVATE_KEY"
```

Paste this code into your `hardhat.config.js` file.

```js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    scrollL2: {
      url: `https://prealpha.scroll.io/l2`,
      accounts: [PRIVATE_KEY]
    }
  }
};
```

As you can see, we set up a new network named `scrollL2` using the pre-alpha testnet Scroll endpoint. We also set up the private key for the standard account. 

We are now ready to deploy our contract!

> Keep in mind that you need to [bridge funds from Scroll L1 to Scroll L2](https://prealpha.scroll.io/bridge/)!

Run the following command to deploy.

```sh
npx hardhat run scripts/deploy.js --network scrollL2
```

This will run the deploy script using the configuration we just set up.

If everything goes well, this will be the response.

```sh
Deploying smart contract...
The smart contract was deployed at: 0x73bF7228Bde415e57FE705fD376c06970ba0D876 on Scroll L2!
```

By the way this token is deployed on the testnet and you can trade it!

[Web3Dave token](https://l2scan.scroll.io/token/0x50583434136284D87D11c185Bb64B0203deC5177/token-transfers)

## Conclusion

Congratulations, today you learned how to set up a new project in Hardhat and deploy an ERC-20 token on the Scroll testnet! Now you just need to add liquidity on the swap to be able to trade your token!