module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    const ccipSimulatorDeployment = await deployments.get('CCIPLocalSimulator')
    const ccipSimulator = await ethers.getContractAt('CCIPLocalSimulator', ccipSimulatorDeployment.address)
    const ccipConfig = await ccipSimulator.configuration()
    // const sourceChainRouter = ccipConfig.sourceRouter_
    const { destinationRouter_: destinationRouter, linkToken_: linkTokenAddr } = ccipConfig
    // const linkTokenAddr = ccipConfig.linkToken_
    const wnftAddr = (await deployments.get('WrappedMyToken')).address
    // const nftDeployment = await deployments.get('MyToken')


    log('deploying NFTPoolBurnAndMint contract')

    await deploy('NFTPoolBurnAndMint', {
        contract: 'NFTPoolBurnAndMint',
        from: firstAccount,
        log: true,
        args: [destinationRouter, linkTokenAddr, wnftAddr]
    })

    log('NFTPoolBurnAndMint contract is deployed!')
}

module.exports.tags = ['all', 'destchain']