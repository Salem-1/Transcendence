from web3 import Web3, Account
from .abi import CONTRACT_ABI
import os

def get_secret(key):
    return os.environ.get(key)

def connect_to_w3():
    w3 = Web3(Web3.HTTPProvider(get_secret("PROJECT_ENDPOINT")))
    network_id = w3.net.version 
    if not network_id or network_id == "":
        raise RuntimeError("Failed to connect to web3 netork")
    print(f"Connected to network with ID: {network_id}")
    return w3

def load_contract(w3, contract_address, contract_abi):
    contract=w3.eth.contract(address=contract_address, abi=contract_abi)
    if not contract:
        raise RuntimeError("Failed to connect to web3 netork")
    return contract



# contract = get_secret("CONTRACT_ADDRESS")


def set_winner_on_smart_contract():
    w3 = connect_to_w3()
    contract = load_contract(
        w3, get_secret("CONTRACT_ADDRESS"), CONTRACT_ABI)
    return True

