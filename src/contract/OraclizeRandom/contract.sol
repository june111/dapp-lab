/*
   Oraclize "relaxed" random-datasource example
   This contract uses the random-datasource to securely generate off-chain N random bytes
    Lower security guarantees than default setting
*/

pragma solidity >= 0.4.11 < 0.5;

import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.sol";

contract RandomExample is usingOraclize {
    
    event newRandomNumber_bytes(bytes);
    event newRandomNumber_uint(uint);
    event logRandom (string dice);

    constructor() public {
        oraclize_setProof(proofType_Ledger); // sets the Ledger authenticity proof in the constructor
    }

    // the callback function is called by Oraclize when the result is ready
    // the oraclize_randomDS_proofVerify modifier prevents an invalid proof to execute this function code:
    // the proof validity is fully verified on-chain
    function __callback(bytes32 _queryId, string _result, bytes _proof) public
    {
        if (msg.sender != oraclize_cbAddress()) revert();

        if (oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
            // the proof verification has failed, do we need to take any action here? (depends on the use case)
        } else {
            // the proof verification has passed
            // now that we know that the random number was safely generated, let's use it..

            emit newRandomNumber_bytes(bytes(_result)); // this is the resulting random number (bytes)

            // for simplicity of use, let's also convert the random bytes to uint if we need
            // uint maxRange = 2**(8* 7); // this is the highest uint we want to get. It should never be greater than 2^(8*N), where N is the number of random bytes we had asked the datasource to return
            uint maxRange = 100;
            bytes32 lucky = keccak256(abi.encodePacked(_result));
            uint randomNumber = uint(lucky) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange] range

        //   emit newRandomNumber_uint(randomNumber); // this is the resulting random number (uint)
            emit logRandom(uint2str(randomNumber));
        }
    }

    function update() payable public {
        uint N = 7; // number of random bytes we want the datasource to return
        uint delay = 0; // number of seconds to wait before the execution takes place
        uint callbackGas = 200000; // amount of gas we want Oraclize to set for the callback function
        // callback function Gas limit 0.004 ETH
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas); // this function internally generates the correct oraclize_query and returns its queryId
    }


 
}