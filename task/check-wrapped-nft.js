const { task } = require('hardhat/config')

task('check-wrapped-nft')
    .addParam('tokenId', 'check wrapped nft of tokenId')
    .setAction(async (taskArgs, { getNamedAccounts, ethers }) => {
        const tokenId = taskArgs.tokenId
        const { firstAccount } = await getNamedAccounts()
        const wnft = await ethers.getContract('WrappedMyToken', firstAccount)

        console.log('checking status of wrapped nft')
        const totalSupply = await wnft.totalSupply()
        console.log(`there are ${totalSupply} wrapped nft under the wrapped nft contract`)
        if (totalSupply > 0) {
            const owner = await wnft.ownerOf(tokenId)
            console.log(`tokenId:${tokenId} owner:${owner}`)
        }

    })

module.exports = {}