
CONTRACT_ABI=[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "winner",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "tournamentOrganizer",
				"type": "string"
			}
		],
		"name": "setWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllWinnersHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "tournamentOrganizer",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "winner",
						"type": "string"
					}
				],
				"internalType": "struct SimpleContract.WinnerRecord[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWinnerCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getWinnerHistory",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]