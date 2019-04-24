 
/**
 * [decodedLogs description]
 * @param    {[type]}                 abi     [description]
 * @param    {[type]}                 data    [description]
 * @param    {[type]}                 topics  [description]
 * @param    {[type]}                 address [description]
 * @return   {[type]}                         [description]
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

 function handleDecodeEvents(data) {
   console.log('data', data)
 }
 export function getWeb3Filter(fromBlock, toBlock, address, topics, abi) {
   const filter = web3.eth.filter({
     fromBlock: fromBlock,
     toBlock: toBlock,
     address: address,
     topics: topics
   })

   filter.get((err, result) => {
     if (!err) {
       const decodedLogsss = decodedLogs(abi, result[0].data, result[0].topics, address)
       handleDecodeEvents(decodedLogsss)
     } else {
       console.error(error);
     }

   })

 }
