var SimpleAuction = artifacts.require("./SimpleAuction.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleAuction, 54, '0xF4d128506DF039D7E00CFA760C680e894B8e0Dbf' );
};
