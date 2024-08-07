const { ethers } = require("hardhat");

async function main() {
  const comptrollerAddress = "0x94326c5C7bCA92726cB4c82F8A2dc1cCc2279ed7"; // Replace with your Comptroller contract address
  const cTokenAddress = "0x7Ee95894A0aFdf19F4eAdAbdE3Bd975818F2CD00"; // Replace with your cToken contract address

  // Get the Comptroller contract instance
  const Comptroller = await ethers.getContractAt(
    "ComptrollerG7",
    comptrollerAddress
  );

  // Set the collateral factor (e.g., 75%)
  const collateralFactorMantissa = ethers.utils.parseUnits("0.75", 18); // 75%
  let tx = await Comptroller._setCollateralFactor(
    cTokenAddress,
    collateralFactorMantissa
  );
  await tx.wait();
  console.log(
    `Collateral factor set to ${collateralFactorMantissa.toString()} for market ${cTokenAddress}`
  );

  // Set the close factor (e.g., 50%)
  const closeFactorMantissa = ethers.utils.parseUnits("0.5", 18); // 50%
  tx = await Comptroller._setCloseFactor(closeFactorMantissa);
  await tx.wait();
  console.log(`Close factor set to ${closeFactorMantissa.toString()}`);

  // Set the liquidation incentive (e.g., 10%)
  const liquidationIncentiveMantissa = ethers.utils.parseUnits("1.10", 18); // 10%
  tx = await Comptroller._setLiquidationIncentive(liquidationIncentiveMantissa);
  await tx.wait();
  console.log(
    `Liquidation incentive set to ${liquidationIncentiveMantissa.toString()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
