

pragma solidity ^0.5.0;

/** @title Supply Chain. */
contract SupplyChain {

  address payable owner;
  bool public contractPaused = false;
  uint public skuCount;
  mapping (uint => Item ) public items;

  enum State {
    ForSale,
    Sold
  }

  struct Item {
    string name;
    uint sku;
    uint price;
    string image;
    State state;
    address payable seller;
    address payable buyer;
  }


  event ForSale(uint indexed sku);
  event Sold(uint indexed sku);

  /**@dev modifier used to only allow owner 
  ***of the contract to call modfied function */
  modifier isOwner () { require(msg.sender == owner); _;}

  /**@dev verifies that the buyer has payed enough Ether 
  ***to complete the transaction  */
  modifier paidEnough(uint _price) { require(msg.value >= _price, "Not enough Ether."); _;}
  
  /**@dev checks whether there is a remaining
  ***balance to refund */
  modifier checkValue(uint _sku) {
    _;
    uint _price = items[_sku].price;
    uint amountToRefund = msg.value - _price;
    items[_sku].buyer.transfer(amountToRefund);
  }

  /**@dev checks to see if the item requested has 
  ***already been sold.*/
  modifier forSale(uint _sku){
    require(items[_sku].state == State.ForSale, "Item is not For Sale");
    _;
  }

  /**@dev a circuit breaker to that prevents all 
  ***app functionality if something bad occurs
  ***if the contract is paused, modified function stops*/
  modifier checkIfPaused() {
    require(contractPaused == false);
    _;
  }

  /**@dev initializes the contract
  ***setting the owner of the contract to be msg.sender
  ***and initializing the id count of the items at 0
  */
  constructor() public {
       owner = msg.sender;
       skuCount = 0;
  }

  /**@dev adds an item to the contract storage.
    *@param _name Name of the item
    *@param _skuCount The identity number of the item
    *@param _image an image address of the item
   */
  function addItem(string memory _name, uint _price, string memory _image) public checkIfPaused {
    emit ForSale(skuCount);
    items[skuCount] = Item({name: _name, sku:skuCount, price: _price, image: _image, state: State.ForSale, seller: msg.sender, buyer: address(0)});
    skuCount = skuCount + 1;
  }

/**@dev allows user to buy an item stored in the contract
  *@param sku the identity number of the item
 */
  function buyItem(uint sku)
    public
    payable
    forSale(sku)
    paidEnough(msg.value)
    checkValue(sku)
    checkIfPaused
  {
    items[sku].buyer = msg.sender;
    items[sku].seller.transfer(items[sku].price);
    items[sku].state = State.Sold;
    emit Sold(sku);
  }

  /**@dev allows the owner of the contract to 
  ***terminate execution of functions modified by 
  ***a isPaused modifier
   */
  function circuitBreaker() public isOwner {
    if(contractPaused == false) { contractPaused = true; }
    else { contractPaused = false; }
  }
  
  /**@dev returns the item with the specified sku
    *@param _sku the items identity number
    *@return name Name of the item
    *@return sku Id of the item
    *@return price Price of the item
    *@return state State of the Item (ForSale | Sold)
    *@return seller Seller of the Item
    *@return buyer Buyer of the item
    *@return image Image of the item
   */
  function fetchItem(uint _sku) public view returns (string memory name, uint sku, uint price, uint state, address seller, address buyer, string memory image) {
    name = items[_sku].name;
    sku = items[_sku].sku;
    price = items[_sku].price;
    state = uint(items[_sku].state);
    seller = items[_sku].seller;
    buyer = items[_sku].buyer;
    image = items[_sku].image;
    return (name, sku, price, state, seller, buyer, image);
  }

}