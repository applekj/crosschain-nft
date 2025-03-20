module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    log('deploying CCIPLocalSimulator contract')
    await deploy('CCIPLocalSimulator', {
        contract: 'CCIPLocalSimulator',
        from: firstAccount,
        log: true,
        args: []
    })

    log('CCIPLocalSimulator contract is deployed')
}

module.exports.tags = ['all', 'test']