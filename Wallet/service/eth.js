const network       = "https://goerli.infura.io/v3/236d0887e52a430f94dbd1b2caa589cc"
const Web3          = require('web3')
const fs            = require('fs');
const path          = require('path')
const web3          = new Web3(new Web3.providers.HttpProvider(network));
const balanceOfABI  = JSON.parse(fs.readFileSync(path.join(__dirname, '/tokeninfo/tokenabi.json')));
const tokenContract = fs.readFileSync(path.join(__dirname, '/tokeninfo/tokenca.txt')).toString();            
const contract      = new web3.eth.Contract(balanceOfABI, tokenContract)   

class Account {

    constructor(){}

    async infura_connect(){
    try{
        const web3  = await new Web3(new Web3.providers.HttpProvider(network));
        const block = await web3.eth.getBlockNumber()
        return block
    }catch(err){
        console.error(err)
    }
    }

    async create_wallet(password){
        try{
            const wallet = await web3.eth.accounts.create(password);                
            return wallet
        }catch(err){
            console.error(err)
        }
    }

    async isAddress(address) { // 주소 유효성
        try{
        const wallet = await web3.utils.isAddress(address);        
		return wallet
        }catch(err){
            console.error(err)
        }
	}

    async token_balance(walletAddress){ // 토큰 잔액 조회
        try{
            const weibal        = await contract.methods.balanceOf(walletAddress).call(); // 잔액조회
            let ethval          = weibal
            // console.log('contractAbi',ethval/1000000000000000000)
            let transfer_amount = web3.utils.fromWei(ethval)
            return transfer_amount 

        }catch(err){
            console.error(err)
        }
    }

    async estimate_tx_fee(from,to,amount){
        const estimate_gas = await contract.methods.transfer(to, web3.utils.toWei(amount)).estimateGas({from})
        const price        = await web3.eth.getGasPrice();
        console.log('estimate_gas',estimate_gas)
        
        return estimate_gas * price
    }

    async deploy(addressFrom,privKey,addressTo,gas_value){     
        console.log(`Attempting to make transaction from ${addressFrom} to ${addressTo}`);

        // const weiValue = Web3.utils.toWei(String(gas_value), 'ether');
        // console.log('dddddd',weiValue)
        const gas_pirce         = await web3.eth.getGasPrice()
        const createTransaction = await web3.eth.accounts.signTransaction(
        {
        from    : addressFrom,
        to      : addressTo,
        value   : gas_value, // 토큰 집금에 필요한 최소 수수료
        gas     : '21000',
        gasPrice: gas_pirce
        },
        privKey
        );
        // Deploy transaction
        const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
        );
        console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);
        return createReceipt.transactionHash
    };
        
    
    async balances(addressFrom,addressTo){
        const balanceFrom = web3.utils.fromWei(await web3.eth.getBalance(addressFrom),'ether');
        const balanceTo   = await web3.utils.fromWei(await web3.eth.getBalance(addressTo),'ether');
        console.log(`The balance of mother wallet ${addressFrom} is: ${balanceFrom} ETH.`);
        console.log(`The balance of user wallet ${addressTo} is: ${balanceTo} ETH.`);
        }


    async token_transfer(from,frompriv,to,amount){ // 집금
            try{
                console.log('너 몇개있니?',amount)
                const amount_hex       = web3.utils.toHex(web3.utils.toWei(String(amount)))
                const estimate_gas     = await contract.methods.transfer(to, web3.utils.toWei(amount)).estimateGas({from})
                const data             = await contract.methods.transfer(to, amount_hex).encodeABI()
                const gas_pirce        = await web3.eth.getGasPrice()
                const txObj            =   {
                                        "gas"   : web3.utils.toHex(estimate_gas),
                                        gasPrice:gas_pirce,
                                        "to"    : tokenContract,
                                        "value" : "0x00",
                                        "data"  : data,
                                        "from"  : from
                                        }
                const sign_transaction = await web3.eth.accounts.signTransaction(txObj, frompriv)
                const send             = await web3.eth.sendSignedTransaction(sign_transaction.rawTransaction)
                                    
                return send
            }catch(err){
                console.error(err)
            };
        }

    async toekn_collect(email, toaddr) {
        let events       = await contract.getPastEvents("Transfer", {toBlock: "latest",fromBlock: 0,});
        const decimal    = await contract.methods.decimals().call();
        const arr        = []
        for (let event of events) { 
            let data  = (Number(event.returnValues.value) / Math.floor(10, decimal)).toLocaleString("fullwide", { useGrouping: false });
            
            if (event.returnValues.to === toaddr && event.returnValues.from != '0x08d46a726EC33845559f6615785ad8d3308e2368') {      
                
                let value = Number(event.returnValues.value) / Math.pow(10, Number(decimal));
                // let value = Number(event.returnValues.value) / 1000000000000000000;
                arr.push(event)        
            }};    
        
        const data = arr.map((v,i,a)=>{
            return {
                email: email,
                to   : arr[i].returnValues.to,
                from : arr[i].returnValues.from,
                value: Number(arr[i].returnValues.value) / Math.pow(10, Number(decimal)),
                hash : arr[i].transactionHash
            };
            });

        return data;
    };
};
        




module.exports = Account;

