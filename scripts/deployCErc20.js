const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CErc20 = await hre.ethers.getContractFactory("CErc20");
  const cErc20 = await CErc20.deploy(deployer.address);

  await cErc20.deployed();

  console.log("CErc20 deployed to:", cErc20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
