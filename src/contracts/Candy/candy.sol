import 'github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * 用户规则
 * 1. 在周期内可以领一次
 * 2. 每次领取固定数量
 * 3. 领取过后不能重复领
 * 4. 没有这个币的不能领取
 */

 // -------------------------get candy Start-----------------------------------------------
 //
contract CandyDemo is Ownable{
    using SafeMath for uint256;

    //gobal invalid zero addr
    address public constant ZERO_ADDR = address(0x00);
    
    //target candy token
    IErc20Ex public targetToken;
    uint256 public minInterval;

    //singel pay amout
    uint256 public payAmount;

    //user pay item
    struct PayItem{
        uint256 lastPayBlock;
        uint256 totalPay;
    }
    mapping(address => PayItem) userPays;

    // event LogSendCandy(address indexed who, uint256 when, uint256 val);

    constructor(address ttoken, uint256 iinterval, uint256 aamount)
    public {
        // chk arg valid
        require(ttoken != ZERO_ADDR && iinterval > 0 && aamount > 0);

        targetToken = IErc20Ex(ttoken);
        minInterval = iinterval;
        payAmount = aamount;
    }

    /*get candy token info */
    function getTokenInfo()
    public view returns(address, string, string, uint256) {
        return (targetToken, targetToken.name(),
        targetToken.symbol(), selfBalance());
    }

    /*usr withDraw candy token */
    function withDrawToken() public {
        //chk tokan balance and last pay block
        require(
            selfBalance() >= payAmount &&
            (userPays[msg.sender].lastPayBlock - block.number) >= minInterval
        );

        //chg pay stat first
        userPays[msg.sender].lastPayBlock = block.number;
        userPays[msg.sender].totalPay = userPays[msg.sender].totalPay.add(payAmount);

        //do really send user camdy token
        targetToken.transfer(msg.sender, payAmount);
    }

    /*admin stop candy send */
    function stopCandy(address admin) public onlyOwner {
        //send left token to admin
        targetToken.transfer(admin, selfBalance());
    }

    /*get self token balance */
    function selfBalance() public view returns(uint256) {
        //send left token to admin
        return targetToken.balanceOf(address(this));
    }
}
 //
 // -------------------------get candy End-----------------------------------------------


 /**
 * 管理规则
 * 1. 设置周期
 * 2. 设置每次领取固定数量
 * 3. 
 */