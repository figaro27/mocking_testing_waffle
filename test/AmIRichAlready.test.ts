const { use, expect } = require('chai')
const { Contract, utils, Wallet } = require("ethers")
const {
  deployContract,
  deployMockContract,
  MockProvider,
  solidity,
} = require("ethereum-waffle")

const IERC20 = require('../build/IERC20.json');
const AmIRichAlready = require('../build/AmIRichAlready.json');

use(solidity)

describe("Am I Rich Already", () => {
  let mockERC20
  let contract
  let wallet

  beforeEach(async () => {
    [wallet] = new MockProvider().getWallets()
    mockERC20 = await deployMockContract(wallet, IERC20.abi)
    contract = await deployContract(wallet, AmIRichAlready, [mockERC20.address])
  })

  it("checks if contract called balanceOf with certain wallet on the ERC20 token", async () => {
    await mockERC20.mock.balanceOf
      .withArgs(wallet.address)
      .returns(utils.parseEther("999999"))
    await contract.check()
    expect("balanceOf").to.be.calledOnContractWith(mockERC20, [wallet.address])
  })

  it("returns false if the wallet has less than 1000000 tokens", async () => {
    await mockERC20.mock.balanceOf
      .withArgs(wallet.address)
      .returns(utils.parseEther("999999"))
    expect(await contract.check()).to.be.equal(false)
  })

  it("returns true if the wallet has at least 1000000 tokens", async () => {
    await mockERC20.mock.balanceOf
      .withArgs(wallet.address)
      .returns(utils.parseEther("1000001"))
    expect(await contract.check()).to.be.equal(true)
  })

})

