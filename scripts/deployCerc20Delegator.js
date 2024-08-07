const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CErc20Delegator = await hre.ethers.getContractFactory(
    "CErc20Delegator"
  );
  const cErc20Delegator = await CErc20Delegator.deploy(
    "0xd49ac115b63e0402a6650b0c791ac89a0876df3b", //address underlying erc20 token
    "0x94326c5c7bca92726cb4c82f8a2dc1ccc2279ed7", //address comptroller
    "0x8ea2001255722577488e0a4a3353456ff84a8342", //address interestRateModel
    ethers.utils.parseUnits("0.02", 18), //uint256 initialExchangeRateMantissa(inital exchange rate scaled by 1e18)
    "Compound USDC", //string memory name
    "cUSDC", //string memory symbol
    8, //uint8 decimals (number of decimals for the ctoken)
    deployer.address, //address admin
    "0xc1211ecdf753abf7632503000f7d9ebdee5ef1f9", //address implementation (of the CErc20Delegate)
    "0x" //bytes memory becomeImplementationData(default 0x)
  );

  await cErc20Delegator.deployed();

  console.log("CErc20Delegator deployed to:", cErc20Delegator.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
