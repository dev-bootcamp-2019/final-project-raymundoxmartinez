
pragma solidity ^0.5.0;
import "./SupplyChain.sol";

/** @title Mortal. Here I have inhereted the modifiers 
***from the SupplyChain contract */
contract Mortal is SupplyChain {
    /**@dev enables the creator of the contract to desctroy it */
    function destroy() public isOwner {
        selfdestruct(owner);
    }

    /**@dev sends the remaining ether stored within the contract 
    ***to a designated target address
     */
    function destroyAndSend(address payable recipient) public isOwner {
        selfdestruct(recipient);
    }
}