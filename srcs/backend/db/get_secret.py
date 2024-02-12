import hvac
import os 

    
def get_secret(key):
    client = hvac.Client(
    url='http://vault:8200',
    token= os.environ.get('VAULT_TOKEN_KEY')
    )
    read_response = client.secrets.kv.read_secret_version(path='secret/'+ key)
    return read_response['data']['data']['key']
    