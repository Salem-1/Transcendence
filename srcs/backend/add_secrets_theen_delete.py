# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

import hvac
import sys
import os
# Authentication
client = hvac.Client(
    url='http://vault:8200',
    token= os.environ.get('VAULT_TOKEN_KEY')
)

path = '/secret/'

secrets_str = """WEB3=fHpwkycBArhYu1ZDkBJMbDDpYpoIbkzCaRZbQo5+Z5B1nbSW7gFVog
PROJECT_ENDPOINT=https://sepolia.infura.io/v3/456a485f15b54c47bd82fc0e03c395f5
New_account_created_ADDRESS=0xEcaEB1ed7154fDCA1949b65b78457c87bBA1B3f4
New_account_Private_key=b'\xa6\xaa^]a\xcb\x95\\\x02\xb7f\xeav\x185\xfa\x8d(uCN\xc7\x8c\xff\xab\x96:\xb4^\xa0v?'
WALLET_ADDRESS=0x5DeB09f25733e3Bc2052a3d43842Fe0D49f8D57E
WALLET_PVT_KEY=c4f0c04fd8a8fe29a176596927416fb362f5d6565d61f2a6c02c3effa88287a8
CONTRACT_ADDRESS=0x5De6e5EC8acbA907DA4A2916286054F720286c7C"""

secrests_lines = secrets_str.split("\n")
secrets_len = len(secrests_lines)
secrets_dict = {}
secret = []
for line in secrests_lines:
    secret = line.split("=")
    if len(secret) == 0:
        continue
    elif len(secret) != 2:
        print(secret)
        print("bad parsing")
        exit(2)
    secrets_dict[secret[0]] = secret[1]
    secret = []

if secrets_len != len(secrets_dict):
    print(f"{secrets_len} != there are missed secrets during parsimng")
    exit(1)
else:
    print("Parsing success!.")

def add_secret(key, value):
    create_response = client.secrets.kv.v2.create_or_update_secret(
    path='secret/' + key,
    secret=dict(key=value),)

def test_added_pass(key):
    value = get_secret(key)
    if value:
        print(f"{key}={value}")
    else:
        print("Failed to add secret ")

def get_secret(key):
    read_response = client.secrets.kv.read_secret_version(path='secret/'+ key)
    return read_response['data']['data']['key']

for key in secrets_dict:
    add_secret(key, secrets_dict[key])
    test_added_pass(key)
