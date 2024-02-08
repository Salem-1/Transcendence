from web3 import Web3, Account
from .abi import CONTRACT_ABI
from .authintication_utils import has_alphanumeric, has_special_characters
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

def get_account_balance(w3, wallet_address):
    balance = w3.eth.get_balance(wallet_address)
    ETH_balance = w3.from_wei(balance, 'ether')
    if not ETH_balance:
        raise RuntimeError("Failed to connect to web3 netork")
    return ETH_balance

# contract = get_secret("CONTRACT_ADDRESS")
def get_winner_owner(request_body):
    if len(request_body) != 2 or ("winner" not in request_body) \
        or ("owner" not in request_body):
        raise RuntimeError("Bad request body")


def set_winner_on_smart_contract(request_body):
    # winner, owner = get_winner_owner(request_body)
    w3 = connect_to_w3()
    contract = load_contract(
                w3, get_secret("CONTRACT_ADDRESS"), 
                CONTRACT_ABI)
    private_key = get_secret("WALLET_PVT_KEY")
    wallet_address = get_secret("WALLET_ADDRESS")
    get_account_balance(w3, wallet_address)
    return True

