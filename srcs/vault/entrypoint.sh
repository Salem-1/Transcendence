#!/bin/bash


vault operator unseal $KEY_1 && \
vault operator unseal $KEY_2  && \
vault operator unseal $KEY_3  && \
vault login $VAULT_TOKEN_KEY
