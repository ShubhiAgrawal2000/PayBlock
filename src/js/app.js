App = {
	web3Provider: null,
	contracts: {},
	account: '0x043016Ea59B0fFedd99CBeb86079D6C3A04f8897',
	loading: false,
	tokenPrice: 1000000000000000,

	init: function(){
		console.log("App initialized...");
		return App.initWeb3();
	},

	initWeb3: async function() {

    // Modern dapp browsers...
    if (window.ethereum){
      web3 = new Web3(web3.currentProvider);
      try {
        //Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
      App.web3Provider = web3.currentProvider;
      console.log("modern dapp browser");
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
      console.log("legacy dapp browser");
    }
    // if no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContracts();
    
  },

	initContracts: function(){
		$.getJSON("PeacockSale.json", function(peacockSale){
			App.contracts.PeacockSale = TruffleContract(peacockSale);
			App.contracts.PeacockSale.setProvider(App.web3Provider);
			App.contracts.PeacockSale.deployed().then(function(peacockSale){
				console.log("Peacock Sale Address:", peacockSale.address);
			});
		}).done(function() {
				$.getJSON("Peacock.json", function(peacock){
					App.contracts.Peacock = TruffleContract(peacock);
					App.contracts.Peacock.setProvider(App.web3Provider);
					App.contracts.Peacock.deployed().then(function(peacock){
						console.log("Peacock Address:", peacock.address);
					});
				return App.render();
			});
		})
	},

	render: function(){
		if(App.loading){
			return;
		}
		App.loading = true;
		var loader = $('#loader');
		var content = $('#content');

		loader.show();
		content.hide();

		web3.eth.getCoinbase(function(err, account){
			if(err === null){
				console.log("account", account);
				App.account = account;
				$('#account-address').html("Your Account: " + account);
			}
		})

		//App.contracts.PeacockSale.deployed().then(function(instance){
			//peacockSaleInstance = instance;
			//return peacockSaleInstance.tokenPrice();
		//});
		App.loading = false;
			loader.hide();
			content.show();

		
		//}).then(function(tokenPrice){
		//	console.log("tokenPrice", tokenPrice);
		//	App.tokenPrice = tokenPrice;
		//	$('.token-price').html(App.tokenPrice.toNumber());
		
	}
}


$(function() {
	$(window).load(function() {
		App.init();
	})
});