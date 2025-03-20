module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments

    log('Deploying wnft contract')
    await deploy('WrappedMyToken', {
        contract: 'WrappedMyToken',
        from: firstAccount,
        log: true,
        args: ['WrappedMyToken', 'WMT']
    })

    log('WrappedMyToken contract is deployed!')

}

module.exports.tags = ['all', 'destchain']