import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { contractAddress } from "../config"

dotenv.config();

task("balance", "balance of addr")
    .addParam("addr", "The account's address")
    .setAction(async (taskArgs, hre) => {
      const provider = new hre.ethers.providers.JsonRpcProvider(process.env.API_URL) 
      const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : [], provider)
      const myContract = await hre.ethers.getContractAt('ERC20', contractAddress, signer)
      const out = await myContract.balanceOf(taskArgs.addr);
      console.log(out)
    });