const Peacock = artifacts.require("Peacock");
const PeacockSale = artifacts.require("PeacockSale");

module.exports = function (deployer) {
  deployer.deploy(Peacock, 1000000).then(function(){
    //token price is 0.001 ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(PeacockSale, Peacock.address, tokenPrice);
  });
};

