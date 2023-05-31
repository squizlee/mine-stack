#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json')
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2')
const { CloudFormationClient, DescribeStacksCommand } = require('@aws-sdk/client-cloudformation')
const chalk = require('chalk')

const ec2_client = new EC2Client()
const cf_client = new CloudFormationClient()
const log = console.log

program
    .name('minestack')
    .description('MineStack CLI')
    .version(version)

program.command('toggle')
    .description('toggle server on/off')
    .action(() => toggle())

program.command('status')
    .description('print status of server')
    .action(() => status())

program.parse();

async function toggle() {
    // get status of instance
}

async function status() {
    // Check if the stack exists
    const stack_exists_cmd = new DescribeStacksCommand({ StackName: "MineStack" })
    const cf_res = await cf_client.send(stack_exists_cmd)

    // Get information about the server
    const serverInstanceCMD = new DescribeInstancesCommand({
        Filters: [{
            "Name": "tag:STACK",
            "Values": ["MineStack"]
        }]
    })
    const instance_res = await ec2_client.send(serverInstanceCMD)
    log(instance_res)

    let instance_information

    for (const reservation of instance_res.Reservations) {
        const { PublicIpAddress, State } = reservation.Instances[0]
        instance_information = { PublicIpAddress, State }
    }

    log('MINE STACK STATUS')
    if (cf_res.Stacks.length > 0) {
        log('Server Stack...', chalk.green('exists ✅'))
    } else {
        log('Server Stack...', chalk.red('does NOT exist ❌'))
    }

    if (instance_information) {
        log('Status: ', instance_information.State.Name.toUpperCase())
        instance_information.PublicIpAddress ? log("Active on public IP", chalk.bold(`${instance_information.PublicIpAddress}`)) : log('Inactive, no IP Address')
    }

}