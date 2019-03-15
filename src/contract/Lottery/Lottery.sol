
/**
 * 规则
 * 1. 彩票 0.1 eth 一张，入场费可修改
 * 2. 管理员开奖，随机选取中奖者
 * 3. 中奖者领走奖池的钱，扣除手续费10%
 * 4. 其中手续费的80% 用于管理费
 * 5. 历史记录保存到struct
 */

pragma solidity 0.5.2;

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract lottery is usingOraclize {
    
    uint public minEntry = 0.1 ether;
    uint32 private FEE = 10; // 10%
    address payable [] public players;
    address payable public winner;
    address internal constant ZERO_ADDR = address(0x00);
    // bytes32 oraclizeQueryId = 0;

    uint public order = 0;
    struct History {
        address[] players;
        address winner;
    }

    mapping (uint => History) historys;
    
     //管理员地址
    address payable private manageAdr;

    event MinEntryChanged(address indexed who, uint minEntry);
    event PlayerEntered(address indexed who, uint amount);
    event WinnerSelected(address indexed who);
    event NewRoundStarted(uint timestamp);
    
    // event logRandom (string dice);
    // string public dice = "null";

    // uint public flag = 0;
    uint public number = 0;
    uint public balance;

    constructor() public {
        //将合约部署人的地址保存起来作为管理员地址
        manageAdr = msg.sender;

        oraclize_setProof(proofType_Ledger); // sets the Ledger authenticity proof in the constructor
    }

    // the callback function is called by Oraclize when the result is ready
    // the oraclize_randomDS_proofVerify modifier prevents an invalid proof to execute this function code:
    // the proof validity is fully verified on-chain
    function __callback(bytes32 _queryId, string memory _result, bytes memory  _proof) public
    {
        // flag = 3;
        if (msg.sender != oraclize_cbAddress()) revert();

        if (oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
            // the proof verification has failed, do we need to take any action here? (depends on the use case)
            // flag = 2;
        } else {
        
            // flag = 1;

            // for simplicity of use, let's also convert the random bytes to uint if we need
            // uint maxRange = 2**(8* 7); // this is the highest uint we want to get. It should never be greater than 2^(8*N), where N is the number of random bytes we had asked the datasource to return
            uint maxRange = number;
            bytes32 lucky = keccak256(abi.encodePacked(_result));
            uint randomPlayerIndex = uint(lucky) % maxRange; // [0, maxRange) range

            emit logRandom(uint2str(randomPlayerIndex));
            // dice = uint2str(randomPlayerIndex);
            winner = players[randomPlayerIndex];
            historys[order].players = players;
            historys[order].winner = winner;

            // ------------- withdrawReward -----------
            //
            // balance = address(this).balance * (100 - FEE) / 100;
            // winner.transfer(balance);
                   
            if(winner != ZERO_ADDR){
                 winner.transfer(address(this).balance);
            }else{
                // flag = 4;
            }
            emit WinnerSelected(winner);

            players = new address payable[](0); // reset 
            order++;
            // oraclizeQueryId = 0;

            emit NewRoundStarted(block.timestamp);
        }
    }

    function enter() payable external {
        require(msg.value >= minEntry);
        // require(oraclizeQueryId == 0);
        require(!_isAlreadyPlaying(msg.sender));
        
        uint adminFee = address(this).balance * FEE * 80 /10000;
        manageAdr.transfer(adminFee);
        
        players.push(msg.sender);
     
        emit PlayerEntered(msg.sender, msg.value);
    }

    function startChooseWinnerProcess() external payable {
        // require(oraclizeQueryId == 0);
        // reset
        // flag = 0;
        winner = address(0x00);
        number = players.length; // players.length
        uint executionDelay = 0;
        uint callbackGas = 2000000;
        bytes32 queryId = oraclize_newRandomDSQuery(executionDelay, number, callbackGas); 
    }
    
    function setMinEntry(uint8 _minEntry) external {
        require(_minEntry > 0);

        minEntry = _minEntry;
        emit MinEntryChanged(msg.sender, _minEntry);
    }
    
    function _isAlreadyPlaying(address _player) internal view returns(bool){
        for(uint i = 0; i < players.length; i++){
            if(players[i] == _player){
                return true;
            }
        }
        return false;
    }
    // function getB() public view returns(uint) {
    //     return address(this).balance;
    // }

    //3. 销毁合约
    function kill() public{
        //3.1 调用合约自毁函数，把合约账户余额转给当前调用者（管理员）
        selfdestruct(msg.sender);
    }

    //4. 管理员修饰符，只允许管理员操作
    modifier adminOnly() {
        require(msg.sender == manageAdr);
        //代码修饰器所修饰函数的代码
        _;
    }
 
}