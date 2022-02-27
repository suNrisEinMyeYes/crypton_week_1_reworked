import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { contractAddress } from "../config"
dotenv.config();

task("transfer", "Transfer to address")
    .addParam("to", "The account's address")
    .addParam("sum", "Tokens to transfer")
    .setAction(async (taskArgs, hre) => {
      const provider = new hre.ethers.providers.JsonRpcProvider(process.env.API_URL) 
      const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : [], provider)

      const myContract = await hre.ethers.getContractAt('ERC20', contractAddress, signer)
      const out = await myContract.transfer(taskArgs.to, taskArgs.sum);
      console.log(out)
    });