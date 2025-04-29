import {aws_certificatemanager, aws_route53, aws_ses, CfnOutput, Duration, Fn, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {DkimIdentity, EasyDkimSigningKeyLength} from "aws-cdk-lib/aws-ses";

export class LmaRoute53Stack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const domainName = "lma.neura-legal.de";
        const identifier = "lma"

        const route53Zone = new aws_route53.HostedZone(
            this, identifier + "Route53Zone", {
                zoneName: domainName
            }
        );

        const devRoute53Zone = new aws_route53.HostedZone(
            this, "Dev" + identifier + "Route53Zone",
            {
                zoneName: "dev." + domainName,
            }
        );

        new aws_route53.NsRecord(this, "NS Record for Dev", {
            zone: route53Zone,
            recordName: "dev",
            values: devRoute53Zone.hostedZoneNameServers!!,
        });

        new aws_certificatemanager.DnsValidatedCertificate(this, identifier + 'ConfiguratorWildcardCertificate', {
            domainName: domainName,
            hostedZone: route53Zone,
            subjectAlternativeNames: ['*.' + domainName],
        });

        const devNs = Fn.join(",", devRoute53Zone.hostedZoneNameServers!!);
        new CfnOutput(this, "NameServers for Dev", {value: devNs})

        const ns = Fn.join(",", route53Zone.hostedZoneNameServers!!);
        new CfnOutput(this, "NameServers for Prod", {value: ns})
    }

}
