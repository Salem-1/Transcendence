from web3 import Web3, Account
from .abi import CONTRACT_ABI
import os

def get_secret(key):
    return os.environ.get(key)

def connect_to_w3():
    w3 = Web3(Web3.HTTPProvider(get_secret("PROJECT_ENDPOINT")))
    return w3




