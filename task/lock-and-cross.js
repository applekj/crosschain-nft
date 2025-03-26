const { task } = require('hardhat/config')
const { networkConfig } = require('../helper-hardhat-config')

task('lock-and-cross')
    .addOptionalParam('chainSelector', 'chain selector of destination chain')
    .addOptionalParam('receiver', 'receiver address on destination chain')
    .addParam('tokenId', 'token ID to be crossed chain')
    .setAction(async (taskArgs, { getNamedAccounts, ethers, companionNetworks, network }) => {

        const { firstAccount } = await getNamedAccounts()

        const tokenId = taskArgs.tokenId

        const chainSelector = taskArgs.chainSelector || networkConfig[network.config.chainId].chainSelector
        console.log(`destination chain seletor is ${chainSelector}`)

        const receiver = taskArgs.receiver || (await companionNetworks['destChain'].deployments.get('NFTPoolBurnAndMint')).address
        console.log(`destination chain receiver is ${receiver}`)

        const linkTokenAddr = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt('LinkToken', linkTokenAddr)
        const nftPoolLockAndRelease = await ethers.getContract('NFTPoolLockAndRelease', firstAccount)

        /* transfer 10 LINK token to nftPoolLockAndRelease from deployer */
        // check if the nftPoolLockAndRelease contract has LINK token
        const balanceBefore = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`before transfer LINK token, nftPoolLockAndRelease has ${balanceBefore} LINK token`)
        if (balanceBefore < 1 * 10 ** 18) {
            const transferTranscation = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther('10'))
            await transferTranscation.wait(6)
        }
        const balanceAfter = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`after transfer LINK token, nftPoolLockAndRelease has ${balanceAfter} LINK token`)

        // approve the nftPoolLockAndRelease contract have permision to transfer deployer's nft 
        const nft = await ethers.getContract('MyToken', firstAccount)
        await nft.approve(nftPoolLockAndRelease.target, tokenId)
        console.log('approve successfully')

        console.log(`tokenId:${tokenId} firstAccount:${firstAccount} chainSelector:${chainSelector} receiver:${receiver}`)
        const lockAndCrossTranscation = (await nftPoolLockAndRelease.lockAndSendNFT(tokenId, firstAccount, chainSelector, receiver))?.hash
        console.log(`NFT locked and crossed, transcation hash is ${JSON.stringify(lockAndCrossTranscation)}`)
    })

module.exports = {}