const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CErc20Delegate = await hre.ethers.getContractFactory("CErc20Delegate");
  const cErc20Delegate = await CErc20Delegate.deploy();

  await cErc20Delegate.deployed();

  console.log("CErc20Delegate deployed to:", cErc20Delegate.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
