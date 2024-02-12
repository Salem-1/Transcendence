#!/bin/bash

vault operator unseal $KEY_1 && \
vault operator unseal $KEY_2  && \
vault operator unseal $KEY_3  && \
vault login $VAULT_TOKEN_KEY && echo vault successfully unsealed

vault kv get --field cert secret/ssl/cert > ./nginx/cert.pem
vault kv get --field key secret/sslkey  > ./nginx/key.pem

# vault kv put secret1/ssl/cert cert=@/cert.pem
# vault kv put secret/sslkey key=@/key.pem

# # vault kv put secret/myfiles sslkey=@/ssl/key.pem
# vault kv put secret/myfiles sslcert=@/ssl/cert.pem
# openssl req -x509 -nodes -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

