# MINE STACK
🚧 Work in progress

Start your own minecraft server on the cloud. 

Honestly, I just want to play minecraft with my friends, so why not.

## Get started
1. Create an AWS account
1. Install `node js`: Follow the instructions here -  https://nodejs.org/en
1. Install `aws cdk`: `npm i -g aws-cdk`
1. Install `aws cli`: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
1. Configure your system to use your credentials: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
1. Download mine-stack from here

## Running the stack
1. Create `.env` file with the following values configured: CDK_DEFAULT_REGION, CDK_DEFAULT_ACCOUNT, MINECRAFT_EDITION
1. `cdk bootstrap` (if you  haven't already for your account)
1. `cdk deploy`