const { getNamedAccounts, deployments, ethers } = require('hardhat')
const { expect } = require('chai')

let firstAccount
let ccipSimulator
let nft
let wnft
let nftPoolLockAndRelease
let nftPoolBurnAndMint
let chainSelector

before(async () => {
    firstAccount = (await getNamedAccounts()).firstAccount
    await deployments.fixture(['all'])

    ccipSimulator = await ethers.getContract('CCIPLocalSimulator', firstAccount)
    nft = await ethers.getContract('MyToken', firstAccount)
    wnft = await ethers.getContract('WrappedMyToken', firstAccount)
    nftPoolLockAndRelease = await ethers.getContract('NFTPoolLockAndRelease', firstAccount)
    nftPoolBurnAndMint = await ethers.getContract('NFTPoolBurnAndMint', firstAccount)

    const config = await ccipSimulator.configuration()
    chainSelector = config.chainSelector_
})

describe('source chain -> dest chain tests', async () => {
    it('test if the user can mint a nft from nft contract successfully',
        async () => {
            await nft.safeMint(firstAccount)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)
        }
    )

    it('test if the user can lock the nft in the pool and send ccip message on source chain',
        async () => {
            await ccipSimulator.requestLinkFromFaucet(nftPoolLockAndRelease.target, ethers.parseEther('10'))
            await nft.approve(nftPoolLockAndRelease.target, 0)
            await nftPoolLockAndRelease.lockAndSendNFT(0, firstAccount, chainSelector, nftPoolBurnAndMint.target)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(nftPoolLockAndRelease.target)
        }
    )

    // test if the user can get a wrapped nft in destination chain

    // destination chain -> source chain

    // test if the user can burn the wnft and send ccip message in destination chain

    // test if the user have the nft unlocked in source chain
})
