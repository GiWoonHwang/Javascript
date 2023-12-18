require("dotenv").config();
const moaddr     = process.env.MOADDR
const mopriv     = process.env.MOPRIV
const User       = require('../models/User')
const Withdrawal = require('../models/Withdrawal')
const Web3       = require('web3');
const Account    = require('./eth')
const pwd        = '2435@#@#@±±±±!!!!678543213456764321§34567543213456785432134567'
const account    = new Account
// 모지갑 0x08d46a726EC33845559f6615785ad8d3308e2368
// 모비번 0x4c4c4250740a79b86fba39b26d73409347abc5ee2f0773c9a02ba429bc2439b4

exports.create_wallet = async (req,res)=>{
    // #swagger.tags = ['store']
    const {email} = req.body
    const connect = await account.infura_connect()
    const wallet  = await account.create_wallet(pwd)
    const user    = await User.findOne({email:email});
    // 0xb38591841536f4e2ea31530ef73b08f1b319dadff3e17fc529e8e1daa1005e50 비밀키

    if (user.wallet != "-"){
        return res.json({
            message : '지갑 이미 있음',
            value   : -2
        }) 
    }else{
    const result = await User.updateOne({email:email},{wallet:wallet['address'],priv:wallet['privateKey']})
    return res.status(200).json({
    message : wallet['address'],
    value   : 1                
            })
}};

exports.collect = async(req,res)=>{
    // #swagger.tags = ['eth']
    try{
    const dbemail   = await User.findOne({email:req.params['id']},{_id:0,__v:0});
    const fromaddr  = dbemail['wallet'] // 유저 지갑
    const frompriv  = dbemail['priv'] // 유저 비밀키
    const userval   = dbemail['crypto_dotori']
    
    if(userval >= 1){

    const amount    = await account.token_balance(fromaddr)
    const token_gas = await account.estimate_tx_fee(fromaddr,moaddr,amount) // 유저계좌에 보낼 최소 수수료 체크


    const deploy    = await account.deploy(moaddr,mopriv,fromaddr,token_gas)
    const balance   = await account.balances(moaddr,fromaddr)
    const transfer  = await account.token_transfer(fromaddr,frompriv,moaddr,amount)
    return res.status(200).json({
    message : "집금성공",
    value   : 1                
            })
    }else{
        return res.json({
            message : '집금하기 부족!',
            value   : userval
        });

            }

    }catch(err){
        console.error(err)
    }
};