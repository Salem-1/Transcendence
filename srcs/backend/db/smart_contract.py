from web3 import Web3, Account
from .abi import CONTRACT_ABI
from .authintication_utils import has_special_characters
import os
from .get_secret import get_secret


#account abstraction

# def get_secret(key):
#     return os.environ.get(key)

def connect_to_w3():
    project_endpoint = get_secret("PROJECT_ENDPOINT")
    print(project_endpoint)
    w3 = Web3(Web3.HTTPProvider(project_endpoint))
    network_id = w3.net.version 
    if not network_id or network_id == "":
        raise RuntimeError("Failed to connect to web3 network")
    print(f"Connected to network with ID: {network_id}")
    return w3

def load_contract(w3, contract_address, contract_abi):
    contract=w3.eth.contract(address=contract_address, abi=contract_abi)
    if not contract:
        raise RuntimeError("Failed to load contract")
    return contract

def get_account_balance(w3, wallet_address):
    balance = w3.eth.get_balance(wallet_address)
    ETH_balance = w3.from_wei(balance, 'ether')
    if not ETH_balance:
        raise RuntimeError("Failed to get account balabce")
    return ETH_balance

def has_alpha(password):
    password = password.lower()
    has_alpha = any(char.islower() for char in password)

    return has_alpha

def record_winner(w3, contract, private_key, winner, owner, address):
    # Encode function call data
    encoded_data = contract.encodeABI(fn_name="setWinner", args=[winner, owner])
    # Prepare transaction
    transaction = {
        'to': contract.address,
        'data': encoded_data,
        'gas': 75200,  # Adjust gas limit accordingly
        'gasPrice': w3.to_wei('75', 'gwei'), # Increase gas price to 75 Gwei
        'nonce': w3.eth.get_transaction_count(address),  # Add nonce to prevent replay attacks
    }
    # Sign transaction
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    # Send transaction
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    # Wait for transaction to be mined
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Transaction successful. Transaction hash: {tx_hash.hex()}")
    return tx_hash.hex()

def load_contract(w3, contract_address, contract_abi):
    contract=w3.eth.contract(address=contract_address, abi=contract_abi)
    return contract

def get_winner_owner(request_body, owner):
    if len(request_body) != 1 or ("winner" not in request_body):
        raise RuntimeError("Bad request body")
    winner = request_body["winner"]
    print(winner)
    print(owner)
    if len(winner) < 1 or len(winner) > 14 or \
        len(owner) < 1 or len(owner) > 14 or \
             (not has_alpha(winner)) or (not has_alpha(owner)):
        raise RuntimeError("Failed to get winners")
    return winner, owner


def set_winner_on_smart_contract(request_body, owner):
    winner, owner = get_winner_owner(request_body, owner)
    w3 = connect_to_w3()
    contract = load_contract(w3, get_secret("CONTRACT_ADDRESS"), 
                CONTRACT_ABI)
    private_key = get_secret("WALLET_PVT_KEY")
    wallet_address = get_secret("WALLET_ADDRESS")
    get_account_balance(w3, wallet_address)
    # record_winner(w3, contract, private_key, winner, owner, get_secret("WALLET_ADDRESS"))
    return True



def get_all_winners():
    w3 = connect_to_w3()
    contract = load_contract(w3, get_secret("CONTRACT_ADDRESS"), 
                CONTRACT_ABI)
    private_key = get_secret("WALLET_PVT_KEY")
    wallet_address = get_secret("WALLET_ADDRESS")
    get_account_balance(w3, wallet_address)
    winners = contract.functions.getAllWinnersHistory().call()
    print(winners)
    dummy = []
    if type(winners) != type(dummy) or len(winners) < 1:
        raise RuntimeError("Failed to get winners")
    return winners