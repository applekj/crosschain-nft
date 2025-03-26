const { task } = require('hardhat/config')

task('mint-nft').setAction(async (taskArgs, { getNamedAccounts, ethers }) => {
    const { firstAccount } = await getNamedAccounts()
    const nft = await ethers.getContract('MyToken', firstAccount)

    console.log('minting a nft from contract')
    const mintTransaction = await nft.safeMint(firstAccount)
    mintTransaction.wait(6)

    console.log('nft minted')
})

module.exports = {}