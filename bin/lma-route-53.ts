#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LmaRoute53Stack } from '../lib/lma-route-53-stack';

const app = new cdk.App();
new LmaRoute53Stack(app, 'LmaRoute53Stack', {
    env: {
        account: "727646493251",
        region: "eu-central-1",
    }
});
