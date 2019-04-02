
/**
 * 空投合约
 * 1. web3:收集转账到管理员地址的地址，作为目标地址
 	web3.eth.getBlock => transactions
 	web3.eth.getTransaction => from
 * 2. 向目标地址进行转账
 */
pragma solidity 0.5.2;
contract lottery {

    address payable [] public players;
    // mapping (uint => address) public players;
    
    constructor() public {

	}

    function collect(address payable _player) external {
    	if(!_isAlreadyPlaying(_player)){
    		 players.push(_player);
    	}
       
	}

	 function _isAlreadyPlaying(address _player) internal view returns(bool){
        for(uint i = 0; i < players.length; i++){
            if(players[i] == _player){
                return true;
            }
        }
        return false;
    }
}