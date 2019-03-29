pragma solidity ^0.5.2;
import 'github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';


import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract Raffle is usingOraclize {
    
    //购买彩票事件，在购买彩票方法中调用
    event BuyLottery(address indexed buyer,uint money,uint16 luckNum);
    //开奖事件，在开奖方法中调用
    event DrawLottery(address winner,uint money,uint luckNum);
    event LogLuckNum(uint16 luckNum);
 
    //购买记录（购买者的address, 彩票号码）
    mapping(address=>uint) buyMapping;
    //购买用户的地址
    address[] public usrAdrList;

    //管理员地址
    address private manageAdr;
    //合约地址
    address private contractAdr;
    
    uint public lunckNum;
    
    enum QueryType {
        DONATE_BONUS, TOKEN_GAME_ODDEVEN
    }
    
    struct RandomQuery {
        QueryType typ;
        address who;
        uint256 blockNumber;
        uint256 minBound;
        uint256 maxBound;
        uint256 param1;
        uint256 param2;
    }
    
    mapping (bytes32 => RandomQuery) QQ;

    uint public randomNumber;
 
    event LogNewOraclizeQuery(bytes32 indexed queryId, uint256 queryPrice, string description);
    event LogOraclizeCallback(bytes32 indexed queryId, string result);
   
    constructor() public payable{
        //将合约部署人的地址保存起来作为管理员地址
        manageAdr=msg.sender;
        //将当前合约对象的地址保存
        // cast address to payable address
        contractAdr= address(this);
        
    }

 
    //0.4 显示合约余额
    function ShowContractMoney() view public returns(uint){
        return contractAdr.balance;
    }

    //0.5 买彩票方法 
    function BuyCaiPiao() payable public{
        //0. 判断用户账户是否有0.1 eth
        require(msg.value == 0.1 ether);
       
         //1. 判断彩票购买列表里是否已经存在当前用户
          // require(buyMapping[msg.sender]==0);
        if(buyMapping[msg.sender]==0){
             //3.2 添加到mapping
            buyMapping[msg.sender] = 1;
            
               //3.3 将地址存入 买家数组
            usrAdrList.push(msg.sender);
        }else{
            // todo
        }

     
    }

    function getRandom() adminOnly  payable public {
       
        uint N = 7; // number of random bytes we want the datasource to return
        uint delay = 0; // number of seconds to wait before the execution takes place
        uint callbackGas = 200000; // amount of gas we want Oraclize to set for the callback function
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas); // this function internally generates the correct oraclize_query and returns its queryId
        
    
        // address(uint160(tempAdr)).transfer(contractAdr.balance);
       
         emit LogNewOraclizeQuery(queryId, callbackGas, "oraclize_newRandomDSQuery");
    }
    
    function __callback(bytes32 _queryId,  string memory _result) public 
    {
        if (msg.sender != oraclize_cbAddress()) revert();
        
        RandomQuery storage query = QQ[_queryId];

        emit LogOraclizeCallback(_queryId, _result);


        // for simplicity of use, let's also convert the random bytes to uint if we need
        // uint maxRange = 2**(8* 7); // this is the highest uint we want to get. It should never be greater than 2^(8*N), where N is the number of random bytes we had asked the datasource to return
        uint maxRange = 30;
        bytes32 lucky = keccak256(abi.encodePacked(_result));
        randomNumber = uint(lucky) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange] range
        lunckNum = randomNumber ;
        // emit logRandom(uint2str(randomNumber));
         
    }
    
    //1. 开奖 - 必须是管理员才能操作
    function KaiJiang() adminOnly payable public returns(uint){
        //1.生成一个随机的开奖号码
        uint256 luckNum = uint256(keccak256(abi.encodePacked(block.difficulty,now)));
        //1.1 取模10，保证奖号在10以内
        // luckNum = luckNum % 3;
        uint maxRange = usrAdrList.length;
           
        randomNumber = uint(luckNum) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange] range

        if(randomNumber!=0){
            lunckNum = randomNumber -1;
        }else{
            lunckNum = randomNumber ;
        }
    
     
        address  tempAdr = usrAdrList[lunckNum];
        emit DrawLottery(tempAdr,contractAdr.balance,lunckNum);
        address(uint160(tempAdr)).transfer(contractAdr.balance);
        //3.返回 中奖号码
        return lunckNum;
    }

    //2. 重置数据
    function resetData() adminOnly public{
        //2.1 循环 买家数组，删除 购买记录mapping中对应的记录
        for(uint16 i = 0;i<usrAdrList.length;i++){
            delete buyMapping[usrAdrList[i]];
        }
        //2.2 删除 买家数组
        delete usrAdrList;
    }

    //3. 销毁合约
    function kill() adminOnly public{
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

    

