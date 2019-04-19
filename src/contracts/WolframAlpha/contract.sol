/*
   WolframAlpha example

   This contract sends a temperature measure request to WolframAlpha
*/


pragma solidity ^0.4.20;
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.sol";

contract WolframAlpha is usingOraclize {
    
    string public randomNum;
    
    event newOraclizeQuery(string description);
    event logRrandomNum(string randomNum);

    constructor() public {
        // update();
    }
    
    function __callback(bytes32 myid, string result) public{
        if (msg.sender != oraclize_cbAddress()) revert();
        randomNum = result;
       emit logRrandomNum(result);
    }
    
    function update() payable public{
       emit newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("WolframAlpha", "random number between 0 and 100");
    }
    
} 