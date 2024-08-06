const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SimplePriceOracle = await hre.ethers.getContractFactory(
    "SimplePriceOracle"
  );
  const simplePriceOracle = await SimplePriceOracle.deploy();

  await simplePriceOracle.deployed();

  console.log("SimplePriceOracle deployed to:", simplePriceOracle.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
