import {ethers} from "hardhat"
import {expect} from "chai"
import {tName, tSymbol, tDec, tTotalSupply} from "../config"
import { BigNumber, Contract, Signer } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
describe("Token contract", function () {

    let Token;
    let hardhatToken : Contract;
    let owner : Signer;
    let addr1 : Signer;
    let addr2 : Signer;
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";


    beforeEach(async function () {
        
        Token = await ethers.getContractFactory("ERC20");
        [owner, addr1, addr2] = await ethers.getSigners();
        
        hardhatToken = await Token.deploy(tName, tSymbol, tDec, 0);
      });

      describe("Deployment", function () {
        
        it("Should get right name and symbol", async function () {
         
          expect(await hardhatToken.name()).to.equal(tName);
          expect(await hardhatToken.symbol()).to.equal(tSymbol);
          expect(await hardhatToken.decimals()).to.equal(tDec);
          expect(await hardhatToken.totalSupply()).to.equal(0);


        });
      });

        describe("Should mint tokens to address, check supply and check balance and finally burn half", function() {
        it("Mint tokens and check suuply, balance, after burn half", async function() {
            await expect(hardhatToken._mint(ZERO_ADDRESS, parseEther("5000000000000000000"))).to.be.revertedWith("ERC20: mint to zero address");
            await hardhatToken._mint(addr1.getAddress(), parseEther("50"));

            expect(await hardhatToken.totalSupply()).to.equal(parseEther("50"));
            expect(await hardhatToken.balanceOf(addr1.getAddress())).to.equal(parseEther("50"));

            await expect(hardhatToken._burn(ZERO_ADDRESS, parseEther("50"))).to.be.revertedWith("ERC20: burn from zero address");
            await expect(hardhatToken._burn(addr1.getAddress(), parseEther("500"))).to.be.revertedWith("ERC20: burn amount exceeds balance");

            await hardhatToken._burn(addr1.getAddress(), parseEther("50"));
            expect(await hardhatToken.totalSupply()).to.equal(parseEther("0"));
            expect(await hardhatToken.balanceOf(addr1.getAddress())).to.equal(parseEther("0"));


        });

        describe("All transfers check", function() {
            it("Transfer func", async function() {
            
                await hardhatToken._mint(addr1.getAddress(), parseEther("50"));
                await expect(hardhatToken.connect(ZERO_ADDRESS).transfer(addr1.getAddress(),parseEther("50"))).to.be.reverted;
                await expect(hardhatToken.connect(addr1).transfer(ZERO_ADDRESS, parseEther("50"))).to.be.revertedWith("ERC20: transfer to zero address");
                await expect(hardhatToken.connect(addr1).transfer(addr2.getAddress(),parseEther("100"))).to.be.revertedWith("ERC20: transfer amount exceeds balance");

                await hardhatToken.connect(addr1).transfer(addr2.getAddress(), parseEther("10"))

                expect(await hardhatToken.balanceOf(addr2.getAddress())).to.equal(parseEther("10"));
                
                expect(await hardhatToken.balanceOf(addr1.getAddress())).to.equal(parseEther("40"));
                
            });
            it("TransferFrom func", async function() {
                
                    await hardhatToken._mint(addr1.getAddress(), parseEther("50"));
                    
                    await hardhatToken.connect(addr1).approve(addr2.getAddress(), parseEther("10"));


                    
                    await hardhatToken.transferFrom(addr1.getAddress(), addr2.getAddress(), parseEther("10"))
                    
                    expect(await hardhatToken.balanceOf(addr2.getAddress())).to.equal(parseEther("10"));
                    
                    expect(await hardhatToken.balanceOf(addr1.getAddress())).to.equal(parseEther("40"));
                    
                });
    
        });

        describe("Allowence check", function() {
            it("approve check", async function() {
               
                await hardhatToken._mint(addr1.getAddress(), parseEther("50"));
                
                await expect(hardhatToken.connect(ZERO_ADDRESS).approve(addr1.getAddress(),parseEther("50"))).to.be.reverted;//With("ERC20: approve from zero address");
                await expect(hardhatToken.connect(addr1).approve(ZERO_ADDRESS, parseEther("50"))).to.be.revertedWith("ERC20: approve to zero address");

                await hardhatToken.connect(addr1).approve(addr2.getAddress(), parseEther("10"));


                expect(await hardhatToken.allowance(addr1.getAddress(), addr2.getAddress())).to.equal(parseEther("10"));
                await expect(hardhatToken.transferFrom(addr1.getAddress(), addr2.getAddress(),parseEther("990"))).to.be.revertedWith("ERC20: insufficient allowance");

                
            });
            it("Increase Decrease check", async function() {
            
                await hardhatToken._mint(addr1.getAddress(), parseEther("50"));
                
                await hardhatToken.connect(addr1).approve(addr2.getAddress(), parseEther("5"));
                await hardhatToken.connect(addr1).increaseAllowance(addr2.getAddress(), parseEther("1"));
                expect(await hardhatToken.allowance(addr1.getAddress(), addr2.getAddress())).to.equal(parseEther("6"));
                await hardhatToken.connect(addr1).decreaseAllowance(addr2.getAddress(), parseEther("2"));
                expect(await hardhatToken.allowance(addr1.getAddress(), addr2.getAddress())).to.equal(parseEther("4"));

                await expect(hardhatToken.connect(addr1).decreaseAllowance(addr2.getAddress(), parseEther("10"))).to.be.revertedWith("ERC20: decreased allowance below zero");
            });
        
        
        });


        
    });


});
