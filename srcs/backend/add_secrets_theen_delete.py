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

secrets_str = """TEST=TEST"""

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
