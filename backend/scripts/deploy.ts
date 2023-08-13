
import { ethers } from "hardhat";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const worldId = "0x047ee5313f98e26cc8177fa38877cb36292d2364";
  const eascontract = "0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84";
  const widkey = "app_9e9ab92aa9b87725e01986fd9c1c3ee4";
  const actionId = "attest";

 // console.log(process.env.PK);

  const ContractFactory = await ethers.getContractFactory("ratingsol");
  const contract = await ContractFactory.deploy(worldId, eascontract, widkey, actionId);

  // The line below is optional and can be removed if you don't need to wait for the contract deployment confirmation.
  await contract.waitForDeployment();

  console.log("Contract deployed at:", contract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});