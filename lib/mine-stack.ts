import * as path from "path"
import * as fs from "fs"
import * as cdk from "aws-cdk-lib"
import { Tags } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import { EC2Client, DescribeKeyPairsCommand } from "@aws-sdk/client-ec2"

const ec2_client = new EC2Client({ region: process.env.CDK_DEFAULT_REGION })

/**
 * read user data script line by line
 * @param path_to_user_data
 */
function read_user_data_script(user_data_script_name: string): string[] {
    const contents = fs.readFileSync(
        path.resolve(`./user_data_scripts/${user_data_script_name}`),
        { encoding: "utf-8" }
    )
    // shift since we do not need the shebang, cdk inserts it for us
    let commands = contents.split("\n")
    commands.shift()
    commands = commands.filter((line) => line.length > 0) // Remove empty lines

    if (!commands) {
        console.error("error: script is empty or not found")
        process.exit(1)
    }

    return commands
}

export class MineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)
        const default_vpc = ec2.Vpc.fromLookup(this, "VPC", {
            isDefault: true,
        })

        // this creates a keypair for connecting to the instance via ssh
        // the private key is stored in parameter store under
        // /ec2/keypair/<key-id>
        const keyPair = new ec2.CfnKeyPair(this, "Instance Key Pair", {
            keyName: "MineStackServerInstanceKeyPair",
            tags: [{ key: "STACK", value: "MineStack" }],
        })

        if (process.env.MINECRAFT_EDITION === "BEDROCK") {
            const user_data = ec2.UserData.forLinux({
                shebang: "#!/usr/bin/env bash",
            })
            user_data.addCommands(...read_user_data_script("bedrock.sh"))

            const server_sg = new ec2.SecurityGroup(this, "ServerInstanceSG", { vpc: default_vpc })
            server_sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTcp(), "Allow TCP from any IPv4")
            server_sg.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.allTcp(), "Allow TCP from any IPv6")
            server_sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "Allow SSH from any IPv4")
            const server_instance = new ec2.Instance(this, "ServerInstance", {
                instanceType: ec2.InstanceType.of(
                    ec2.InstanceClass.T2,
                    ec2.InstanceSize.MEDIUM
                ),
                vpc: default_vpc,
                // Using free tier ubuntu ami, there doesn't seem to be a cleaner way of doing this, without me writing an ami lookup utility
                machineImage: ec2.MachineImage.genericLinux({
                    [process.env.CDK_DEFAULT_REGION!]: "ami-0310483fb2b488153"
                }),
                userData: user_data,
                keyName: keyPair.keyName,
                userDataCausesReplacement: true,
                securityGroup: server_sg
            })

            Tags.of(server_instance).add("STACK", "MineStack")
        } else if (process.env.MINCRAFT_EDITION === "JAVA") {
            console.error(
                "error: currently do not support java edition of the server"
            )
            process.exit(1)
        }

        const describe_command = new DescribeKeyPairsCommand({ KeyNames: [keyPair.keyName] })
        ec2_client.send(describe_command).then(res => {
            const key_id = res.KeyPairs![0].KeyPairId

            new cdk.CfnOutput(this, "KeyPairId", {
                description: "Key Pair ID",
                value: key_id!
            })
        })


    }
}
