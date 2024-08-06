const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Comp = await hre.ethers.getContractFactory("Comp");
  const comp = await Comp.deploy(deployer.address);

  await comp.deployed();

  console.log("Comp deployed to:", comp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
