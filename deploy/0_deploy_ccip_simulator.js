const { developmentChains, networkConfig } = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments
    // if it's local or hardhat network, deployment the mocka contract
    if (developmentChains.includes(network.name)) {
        const { firstAccount } = await getNamedAccounts()

        log('deploying CCIPLocalSimulator contract')
        await deploy('CCIPLocalSimulator', {
            contract: 'CCIPLocalSimulator',
            from: firstAccount,
            log: true,
            args: []
        })

        log('CCIPLocalSimulator contract is deployed')
    } else {
        log('CCIPLocalSimulator contract skipped the deployment')
    }
}

module.exports.tags = ['all', 'test']