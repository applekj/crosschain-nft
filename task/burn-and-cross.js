const { task } = require('hardhat/config')
const { networkConfig } = require('../helper-hardhat-config')

task('burn-and-cross')
    .addParam('tokenId', 'token id to be burned and crossed')
    .addOptionalParam('chainSelector', 'chain selector of destination chain')
    .addOptionalParam('receiver', 'receiver address on destination chain')
    .setAction(async (taskArgs, { getNamedAccounts, ethers }) => {
        const { firstAccount } = await getNamedAccounts()
        const tokenId = taskArgs.tokenId

        const chainSelector = taskArgs.chainSelector || networkConfig[network.config.chainId].chainSelector
        console.log(`destination chain seletor is ${chainSelector}`)

        const receiver = taskArgs.receiver || (await companionNetworks['destChain'].deployments.get('NFTPoolLockAndRelease')).address
        console.log(`destination chain receiver is ${receiver}`)

        const linkTokenAddr = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt('LinkToken', linkTokenAddr)
        const wnftPoolBurnAndMint = await ethers.getContract('NFTPoolBurnAndMint', firstAccount)

        /* transfer 10 LINK token to wnftPoolBurnAndMint from deployer */
        // check if the wnftPoolBurnAndMint contract has LINK token
        const balanceBefore = await linkToken.balanceOf(wnftPoolBurnAndMint.target)
        console.log(`before transfer LINK token, wnftPoolBurnAndMint has ${balanceBefore} LINK token`)
        if (balanceBefore < 1 * 10 ** 18) {
            const transferTranscation = await linkToken.transfer(wnftPoolBurnAndMint.target, ethers.parseEther('10'))
            await transferTranscation.wait(6)
        }
        const balanceAfter = await linkToken.balanceOf(wnftPoolBurnAndMint.target)
        console.log(`after transfer LINK token, wnftPoolBurnAndMint has ${balanceAfter} LINK token`)

        // approve the wnftPoolBurnAndMint contract have permision to transfer deployer's nft 
        const nft = await ethers.getContract('WrappedMyToken', firstAccount)
        await nft.approve(wnftPoolBurnAndMint.target, tokenId)
        console.log('approve successfully')

        console.log(`tokenId:${tokenId} firstAccount:${firstAccount} chainSelector:${chainSelector} receiver:${receiver}`)
        const burnAndCrossTranscation = (await wnftPoolBurnAndMint.burnAndMint(tokenId, firstAccount, chainSelector, receiver))?.hash
        console.log(`WNFT burned and tokenId corssed, transcation hash is ${burnAndCrossTranscation}`)
    })