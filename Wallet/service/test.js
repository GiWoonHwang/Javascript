require("dotenv").config();
const network       = "https://goerli.infura.io/v3/236d0887e52a430f94dbd1b2caa589cc";
const Web3          = require("web3");
const fs            = require("fs");
const path          = require("path");
const web3          = new Web3(new Web3.providers.HttpProvider(network));
const balanceOfABI  = JSON.parse(fs.readFileSync(path.join(__dirname, "/tokeninfo/tokenabi.json")));
const moaddr        = process.env.MOADDR;
const tokenContract = fs.readFileSync(path.join(__dirname, "/tokeninfo/tokenca.txt")).toString();
const contract      = new web3.eth.Contract(balanceOfABI, tokenContract);
const Deposit       = require("../models/Deposit ");
const Account       = require('../controllers/eth')
const account       = new Account;
const User          = require("../models/User");
const to            = "0x369aAd17E370d52CaDbd81b847A75F9D8f868085";
const from          = '0x369aAd17E370d52CaDbd81b847A75F9D8f868085';
const axios         = require('axios');

// async function  toekn_collect(email, toaddr) {
//     let events       = await contract.getPastEvents("Transfer", {toBlock: "latest",fromBlock: 0,});
//     const decimal    = await contract.methods.decimals().call();
//     const arr        = []
//     for (let event of events) { 
//         let data  = (Number(event.returnValues.value) / Math.floor(10, decimal)).toLocaleString("fullwide", { useGrouping: false });
//         let value = Number(event.returnValues.value) / Math.pow(10, Number(decimal));
//         if (event.returnValues.to === toaddr && event.returnValues.from != '0x08d46a726EC33845559f6615785ad8d3308e2368') {      
//         // let value = Number(event.returnValues.value) / 1000000000000000000;   
//         arr.push(event)        
//     }};    
//     const data = arr.map((v,i,a)=>{
//         return {
//             email: email,
//             to   : arr[i].returnValues.to,
//             from : arr[i].returnValues.from,
//             value: Number(arr[i].returnValues.value) / Math.pow(10, Number(decimal)),
//             hash : arr[i].transactionHash
//         };
//         });
        
//     return data;
// };




// const crypto_deposit_list_test = async (email,to) =>{
//     const datas    = await toekn_collect(email, to);
//     const user     = await User.findOne({email:email});
//     let value_som  = 0;
    
//     for (data of datas){
//         value_som += data.value
//     }   
//     console.log(value_som);
//     return data
// };

// crypto_deposit_list_test('rlaejrqo465@naver.com',to)

// 서버로 보내야할 값
// 도토리: 유저가 입력한 스왑개수  + (유저가 입력한 개수 *0.01)
// 크립토: (유저가 입력한 스왑개수 * 1100원(도토리는 고정값)) // 크립토가격 == 크립토 개수 나옴
// const mega_result = async function (){
//   const crypto_result = await axios.get("https://api.coinone.co.kr/public/v2/ticker_new/KRW/BTC");  // <== 이건 api 예시 (크립토 도토리 불러온거 아님)
//   const dotori        =  110 + (110 * 0.01)
//   const dotori_vlaue  = 110 * 1100 // 110은 유저가 입력한 값 예시, 1100은 1100원을 의미(고정값)
//   const crypto_value = parseFloat(crypto_result.data.tickers[0].last);
//   const swap_rypto_value = dotori_vlaue / crypto_value;
//   console.log("보내줘야 할 값", dotori, swap_rypto_value);// };

// mega_result();


