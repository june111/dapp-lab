## Introduction

Live version available at [http://blog.junezhu.top/dapp-lab/zombie.html](http://blog.junezhu.top/dapp-lab/zombie.html)

## Acknowledge

[Smart Contract Tutorial](https://cryptozombies.io/)

## TBD

* An "admin page" 

	* setKittyContractAddress, setLevelUpFee, and withdraw. 

* The user's homepage

	* feedOnKitty 
	
		* Some method in the UI that allows the user to feed on CryptoKitties. We could have a button by each zombie on the homepage that says "Feed Me", then a text box that prompted the user to enter a kitty's ID (or a URL to that kitty, e.g. https://www.cryptokitties.co/kitty/578397). This would then trigger our function feedOnKitty.

	* The user's homepage would also have options by each zombie to change name, change DNA, and level up (for a fee). Options would be greyed out if the user wasn't yet high enough level.

* middleware(node)

	* We would probably also want to implement some sort of front-end caching layer so we aren't always slamming Infura with requests for the same data. (Our current implementation of displayZombies calls getZombieDetails for every single zombie every time we refresh the interface — but realistically we only need to call this for the new zombie that's been added to our army).

>However, with the SDK we're building at [Loom Network](https://medium.com/loom-network/loom-network-is-live-scalable-ethereum-dapps-coming-soon-to-a-dappchain-near-you-29d26da00880), soon you'll be able to serve front-ends like this from their own DAppChain instead of a centralized web server. That way between Ethereum and the Loom DAppChain, your entire app would run 100% on the blockchain.

