import { toNum } from './index'
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

// GasPrice
export function getGasPrice() {
  return new Promise((resolve, reject) => {
    window.web3.eth.getGasPrice((error, result) => {
      if (!error) {
        resolve(toNum(result))
      } else {
        console.error(error);
      }
    })
  })
}

// gas Limit
export function estimateGas(rawTx) {
  return new Promise((resolve, reject) => {
    window.web3.eth.estimateGas(rawTx, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        console.error(error);
      }
    })
  })
}

// get nonce
export function getNonce(addr) {
  return new Promise((resolve, reject) => {
    window.web3.eth.getTransactionCount(addr, (error, result) => {
      if (!error) {
        // let nonce = '0x' + result.toString(16)
        resolve(toNum(result))
      } else {
        console.error(error);
      }
    })
  })
}

export function getBlockNumber() {
  return new Promise((resolve, reject) => {
    const data = { "jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 83 }
    const request = new XMLHttpRequest();
    request.open('post', 'https://ropsten.infura.io/v3/323e44018f994f0c97025d409eb79344')
    request.onload = function() {
      let res = JSON.parse(request.response)
      resolve(res.result)
    };
    request.send(JSON.stringify(data))
  })


}

export function callForContract(contractAddr, encoded) {
  return new Promise((resolve, reject) => {
    window.web3.eth.call({
      to: contractAddr,
      data: encoded
    }, (error, result) => {
      if (!error) {
        resolve(result)
      } else
        console.error(error);
    });
  })


}
