/****************/
/* APP GAME */
/****************/
socket = io();

App = {

    contracts: {},

    init: async () => {
        await App.loadContracts();
        await App.getAccount();
    },

    getAccount: async () => {
        //Eth_Accounts-getAccountsButton
        const btnConect = document.getElementById('btnConect');
        btnConect.addEventListener('click', async () => {
            try {
                // Will open the MetaMask UI
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                App.account = accounts[0];
                boxConect.innerHTML = `<form action="/login" method="POST" id="form_login">
                <input type="text" id="inputAddress" name="address" readonly value="${App.account}" style="border: none; background: transparent;font-family: cursive;">
                </form>`;
                
                const formLogin = document.getElementById("form_login");
                formLogin.submit()
                // socket.emit("login",{user:`${App.account}`});
                // socket.emit('register', {address:App.account});

            } catch (error) {
                sendMessage("danger", error.message);
            };
        });
    },

    loadContracts: async () => {
        try {
            // Loading TokenContract   
            const res = await fetch("Token.json")
            const tokenContractJSON = await res.json()
            App.contracts.tokenContract = TruffleContract(tokenContractJSON)
            App.contracts.tokenContract.setProvider(App.web3Provider)
            App.tokenContract = await App.contracts.tokenContract.deployed()

            // Loading NftsContract   
            const res2 = await fetch("Nfts.json")
            const nftsContractJSON = await res2.json()
            App.contracts.nftsContract = TruffleContract(nftsContractJSON)
            App.contracts.nftsContract.setProvider(App.web3Provider)
            App.nftsContract = await App.contracts.nftsContract.deployed()
        } catch (error) {
            sendMessage("danger", error.message);
        }

    },
}


/*************************/
// Util Functions 
/*************************/
// Tests 
const test = (data) => {
    alert("RESULTADO DEL TEST => ", data);
}
// Alerts
const sendMessage = (type, info) => {
    const div = document.getElementById("boxAlert")
    div.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert" style="position: absolute; width: max-content; margin-top: 30px;">
                        ${info}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                   </div>`
}


/*************************/
/* web3Provider functions*/
/*************************/
const getWeb3 = () => {
    //Basic Actions Section
    const boxConect = document.getElementById('boxConect');

    //Created check function to see if the MetaMask extension is installed
    const isMetaMaskInstalled = () => {
        //Have to check the ethereum binding on the window object to see if it's installed
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    //------Inserted Code------\\
    const MetaMaskClientCheck = () => {
        //Now we check to see if MetaMask is installed
        if (!isMetaMaskInstalled()) {
            //If it isn't installed we ask the user to click to install it
            boxConect.innerHTML = `<a type="button" class="btn" id="btnConect" href="/">
            Click here to install Metamask! <i class="fas fa-sign-in-alt"></i>
            </a>`
        } else {
            App.web3Provider = window.ethereum
            boxConect.innerHTML = `<button type="button" class="btn" id="btnConect">
            Conect <i class="fas fa-sign-in-alt"></i>
            </button>`;
            App.init();
        }
    };
    MetaMaskClientCheck();
};
// este evento informa que la cuenta ha cambiado
try {
    window.ethereum.on('accountsChanged', async () => {
        // const signOut = document.getElementById("signOut")
        // signOut.submit();
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        App.account = accounts[0];
        boxConect.innerHTML = `<span id="boxAccount">${App.account}</span>`;
    })
} catch (error) {
    sendMessage("danger", error.message);
}
// este evento informa que la red ha cambiado
window.ethereum.on('networkChanged', (red) => {
    if (red != 5777) {
        alert("error network, switch to Binance Smart Chain");
        // window.location.reload()
    }
    const signOut = document.getElementById("signOut")
    signOut.submit();
})
getWeb3();
// este evento notifica de cualquier error en metamask
ethereum.on('message', (message) => {
    alert("Ha ocurrido un error en metamask >>> ", message);
});


