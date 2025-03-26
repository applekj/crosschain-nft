const { developmentChains, networkConfig } = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments
    let destinationRouter
    let linkTokenAddr

    if (developmentChains.includes(network.name)) {
        const ccipSimulatorDeployment = await deployments.get('CCIPLocalSimulator')
        const ccipSimulator = await ethers.getContractAt('CCIPLocalSimulator', ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration()
        destinationRouter = ccipConfig.destinationRouter_
        linkTokenAddr = ccipConfig.linkToken_
        log(`local environment: sourcechain router: ${destinationRouter}, link token: ${linkTokenAddr}`)
    } else {
        destinationRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
        log(`not local environment: sourcechain router: ${destinationRouter}, link token: ${linkTokenAddr}`)
    }

    const wnftAddr = (await deployments.get('WrappedMyToken')).address

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