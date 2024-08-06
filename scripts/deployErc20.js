const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const mockToken = await MockToken.deploy(
    "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9" //initial owner
  );

  await mockToken.deployed();

  console.log("MockToken deployed to:", mockToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
