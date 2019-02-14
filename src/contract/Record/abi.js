export const recordABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "countries",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "leader",
				"type": "string"
			},
			{
				"name": "population",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalCountries",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "countryName",
				"type": "string"
			},
			{
				"name": "newLeader",
				"type": "string"
			}
		],
		"name": "updateLeader",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "countryName",
				"type": "string"
			}
		],
		"name": "getCountry",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "leader",
				"type": "string"
			},
			{
				"name": "population",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTotalCountries",
		"outputs": [
			{
				"name": "length",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "countryName",
				"type": "string"
			},
			{
				"name": "leader",
				"type": "string"
			},
			{
				"name": "population",
				"type": "uint256"
			}
		],
		"name": "insert",
		"outputs": [
			{
				"name": "_totalCountries",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "countryName",
				"type": "string"
			}
		],
		"name": "deleteCountry",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "countryName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "leader",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "population",
				"type": "uint256"
			}
		],
		"name": "CountryEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "countryName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "leader",
				"type": "string"
			}
		],
		"name": "LeaderUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "countryName",
				"type": "string"
			}
		],
		"name": "CountryDelete",
		"type": "event"
	}
]

export const recordContractAddr = "0xa24a68a64d196695009daf9ae9ed74f02b37e912"