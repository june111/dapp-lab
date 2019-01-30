pragma solidity ^0.4.25;
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.sol";

contract RNG is usingOraclize {

   string public randomNum;
   mapping(bytes32=>bool) validIds;
   event LogConstructorInitiated(string nextStep);
   event LogNumberUpdated(string dice);
   event LogNewOraclizeQuery(string description);

   constructor () payable public {
       oraclize_setCustomGasPrice(4000000000);
        oraclize_setProof(proofType_TLSNotary);
      emit LogConstructorInitiated("Constructor was initiated.");
   }

   function __callback(bytes32 myid, string result, bytes proof) public {
       
        if (!validIds[myid]) revert();
        if (msg.sender != oraclize_cbAddress()) revert();
       randomNum = result;
       emit LogNumberUpdated(result);
        delete validIds[myid];
        getNumber();
   }

   function getNumber() payable public {
       if (oraclize_getPrice("URL") > address(this).balance) {
           emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
       } else {
           emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        //   bytes32 queryId =  oraclize_query("URL", "https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new");
        bytes32 queryId =  oraclize_query("URL", "json(https://randomapi.com/api/?key=PZFO-VK8M-XV6H-H92P&ref=y5kkh9i8).results[0].numeric");
       validIds[queryId] = true;
           
       }

   }
}