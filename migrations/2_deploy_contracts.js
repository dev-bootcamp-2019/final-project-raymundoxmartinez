var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  //deployer.deploy(SimpleBank);
  deployer.deploy(SupplyChain);
};
