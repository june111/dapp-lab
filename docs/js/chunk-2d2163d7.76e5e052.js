(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2163d7"],{c22d:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("p",[t._v(t._s(t.address))]),n("button",{on:{click:t.load}},[t._v("读数据")]),n("p",[t._v("读取结果："+t._s(t.contractBalance))]),n("br"),n("input",{directives:[{name:"model",rawName:"v-model",value:t.amount,expression:"amount"}],attrs:{type:"test"},domProps:{value:t.amount},on:{input:function(e){e.target.composing||(t.amount=e.target.value)}}}),n("button",{on:{click:t.write}},[t._v("写数据 ")]),n("p",[t._v("TxHash："+t._s(t.tx))])])},o=[],s=(n("96cf"),n("3b8d")),i=(n("cadf"),n("551c"),n("097d"),n("bac7")),r=n.n(i),u=[{constant:!0,inputs:[],name:"getBalance",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"amount",type:"uint256"}],name:"withdraw",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[],name:"kill",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{name:"_number",type:"uint256"}],name:"bet",outputs:[],payable:!0,stateMutability:"payable",type:"function"},{constant:!0,inputs:[],name:"houseEdge",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{inputs:[{name:"_minBet",type:"uint256"},{name:"_houseEdge",type:"uint256"}],payable:!0,stateMutability:"payable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!1,name:"_status",type:"bool"},{indexed:!1,name:"_amount",type:"uint256"}],name:"Won",type:"event"}],c="0x39EFaFde0B067F4021697Be98C0c3bBf7dC8B83c",l=n("4260"),p={created:function(){this.getWeb3(),this.setContract()},data:function(){return{amount:.001,isMetamask:!1,casinoContract:void 0,casino:void 0,tx:"",contractBalance:"",address:""}},methods:{getWeb3:function(){var t=Object(s["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!window.ethereum){t.next=20;break}return alert("111111111"),window.web3=new r.a(ethereum),t.prev=3,alert("111112222222"),t.next=7,ethereum.enable();case 7:this.address=t.sent,this.requestSignature(),this.isMetamask=!0,t.next=18;break;case 12:t.prev=12,t.t0=t["catch"](3),alert("11111333333"),alert(t.t0),console.log(t.t0),this.isMetamask=!1;case 18:t.next=21;break;case 20:if(window.web3){alert("222222111111");try{alert("222222222222"),window.web3=new r.a(web3.currentProvider),this.requestSignature(),this.isMetamask=!0}catch(e){alert("222222333333"),alert(e),this.isMetamask=!1}}else alert("333333333333"),console.log("Non-Ethereum browser detected. You should consider trying MetaMask!"),this.isMetamask=!1;case 21:console.log("Get Web3!");case 22:case"end":return t.stop()}},t,this,[[3,12]])}));function e(){return t.apply(this,arguments)}return e}(),setContract:function(){this.casinoContract=window.web3.eth.contract(u),this.casino=this.casinoContract.at(c),console.log("Set Contract!")},load:function(){var t=this;console.log(c),window.web3.eth.getBalance(c,function(e,n){e?console.error(e):t.contractBalance=Object(l["b"])(n)/Math.pow(10,18)})},requestSignature:function(){web3.toHex("Hello from Junezhu.top"),web3.eth.coinbase,console.log;web3.personal.sign(web3.toHex("Hello from Junezhu.top"),web3.eth.coinbase,console.log)},requestMoreSignature:function(){web3.personal.sign(web3.toHex("Hello from Junezhu.top"),web3.eth.coinbase,console.log)},write:function(){var t=this;this.isMetamask&&this.casino.bet(1,{gas:3e5,gasPrice:window.web3.toWei("0.000000001","ether"),value:window.web3.toWei(this.amount,"ether"),from:window.web3.eth.coinbase},function(e,n,a){e?console.error(e):t.tx=n})}}},b=p,w=n("2877"),m=Object(w["a"])(b,a,o,!1,null,null,null);e["default"]=m.exports}}]);