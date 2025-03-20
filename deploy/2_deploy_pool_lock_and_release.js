module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    const ccipSimulatorDeployment = await deployments.get('CCIPLocalSimulator')
    const ccipSimulator = await ethers.getContractAt('CCIPLocalSimulator', ccipSimulatorDeployment.address)
    const ccipConfig = await ccipSimulator.configuration()
    const sourceChainRouter = ccipConfig.sourceRouter_
    const linkTokenAddr = ccipConfig.linkToken_
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