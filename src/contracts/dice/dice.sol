pragma solidity ^0.5.0;

contract Ownable {
  constructor () public { 
    owner = msg.sender; 
  }
  address payable owner;
}

contract Mortal is Ownable {
   function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }
}

contract Casino is Mortal{
  uint minBet;
  uint public houseEdge; //in %

  event Won(bool _status, uint _amount);

  constructor (uint _minBet, uint _houseEdge) payable public {
    require(_minBet > 0);
    require(_houseEdge <= 100);
    minBet = _minBet;
    houseEdge = _houseEdge;
  }
 
  function bet(uint _number) payable public {
    require(_number > 0 && _number <= 10);
    require(msg.value >= minBet);
    bytes32 lucky = keccak256(abi.encodePacked(now, msg.sender));
    uint winningNumber = uint(lucky) %10;
    // uint winningNumber = block.number % 10 + 1;
    
    if (_number == winningNumber) {
      uint amountWon = msg.value * houseEdge;
      if(!msg.sender.send(amountWon)) revert();
      emit Won(true, amountWon);
    } else {
      emit Won(false, 0);
    }
  }
  
  function getBalance()  public view returns(uint256) {
      return address(this).balance;
  }
   // Withdraw amount
    function withdraw(uint amount) public returns (bool) {
        require(amount > 0);
        require(msg.sender==owner);
        msg.sender.transfer(amount);
        return true;
    }
}