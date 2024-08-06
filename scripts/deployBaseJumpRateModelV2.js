const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const JumpRateModelV2 = await hre.ethers.getContractFactory(
    "JumpRateModelV2"
  );
  const jumpRateModelV2 = await JumpRateModelV2.deploy(
    hre.ethers.utils.parseEther("0.02"), // 2% base rate per year
    hre.ethers.utils.parseEther("0.1"), // 10% multiplier per year
    hre.ethers.utils.parseEther("1.0"), // 100% jump multiplier per year
    hre.ethers.utils.parseEther("0.8"), // 80% kink
    deployer.address
  );

  await jumpRateModelV2.deployed();

  console.log("jumpRateModelV2 deployed to:", jumpRateModelV2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
