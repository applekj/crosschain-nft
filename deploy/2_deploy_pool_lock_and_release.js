const { developmentChains, networkConfig } = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    let sourceChainRouter
    let linkTokenAddr
    // if it's local or hardhat network, getting mocka contract's sourceRouter_ and linkRouter_
    if (developmentChains.includes(network.name)) {
        const ccipSimulatorDeployment = await deployments.get('CCIPLocalSimulator')
        const ccipSimulator = await ethers.getContractAt('CCIPLocalSimulator', ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration()
        sourceChainRouter = ccipConfig.sourceRouter_
        linkTokenAddr = ccipConfig.linkToken_
        log(`local environment: sourcechain router: ${sourceChainRouter}, link token: ${linkTokenAddr}`)
    } else {
        sourceChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
        log(`not local environment: sourcechain router: ${sourceChainRouter}, link token: ${linkTokenAddr}`)
    }

    const nftAddr = (await deployments.get('MyToken')).address

    log('deploying NFTPoolLockAndRelease contract')

    await deploy('NFTPoolLockAndRelease', {
        contract: 'NFTPoolLockAndRelease',
        from: firstAccount,
        log: true,
        args: [sourceChainRouter, linkTokenAddr, nftAddr]
    })

    log('NFTPoolLockAndRelease contract is deployed!')
}

module.exports.tags = ['all', 'sourcechain']