 /**
  * 使用abi-decoder decode 得到的data
  * @Author   June
  * @DateTime 2019-04-24
  */
 function decodedLogs(abi, data, topics, address) {
   const abiDecoder = require('abi-decoder');

   abiDecoder.addABI(abi);

   const testLogs = [{
     data,
     topics,
     address
   }];
   // const decodedData = abiDecoder.decodeMethod(result[0].data);
   return abiDecoder.decodeLogs(testLogs);
 }

 /**
  * @dev 对得到的数据进行处理，存数据库
  * @Author   June
  * @DateTime 2019-04-25T11:13:40+0800
  */
 function handleDecodeEvents(result, abi, address) {
   let len = result.length
   let arr = []
   for (let i = 0; i < len; i++) {
     const decodedLogsss = decodedLogs(abi, result[i].data, result[i].topics, address)
     // @dev fix more than one topic
     arr.push(decodedLogsss[0])
   }
   return arr
 }


 /**
  * 用 topic 获取指定合约的 event log
  * @Author   June
  * @DateTime 2019-04-25
  */
 export function getWeb3Filter(fromBlock, toBlock, address, topics, abi) {
   const filter = web3.eth.filter({
     fromBlock: fromBlock,
     toBlock: toBlock,
     address: address,
     topics: topics
   })
   return new Promise((resolve, reject) => {
     filter.get((err, result) => {
       if (!err) {
         let data = handleDecodeEvents(result, abi, address)
         resolve(data)
       } else {
         console.error(error);
       }
     })

   })



 }
