import{toNum}from'./index'
export function loadFromContract(addr, encoded) {
  return new Promise((resolve, reject) => {
    //调用合约方法
    window.web3.eth.call({
      to: addr,
      data: encoded
    }, (error, result) => {
      if (!error) {
        resolve(result)
      } else
        console.error(error);
    });
  })
}
export function getETHBalance(addr) {
  return new Promise((resolve, reject) => {
    window.web3.eth.getBalance(addr, (error, result) => {
      if (!error) {
        resolve(toNum(result) / Math.pow(10, 18))
      } else {
        console.error(error);
      }
    });
  })

}
