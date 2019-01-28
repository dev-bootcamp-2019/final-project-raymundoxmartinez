/*
    This exercise has been updated to use Solidity version 0.5
    Breaking changes from 0.4 to 0.5 can be found here:
    https://solidity.readthedocs.io/en/v0.5.0/050-breaking-changes.html
*/

pragma solidity ^0.5.0;

contract SupplyChain {

    address payable owner;
    bool public contractPaused = false;
    uint public skuCount;
    mapping (uint => Item ) public items;

  enum State {
    ForSale,
    Sold,
    Shipped,
    Received
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
    event Shipped(uint indexed sku);
    event Received(uint indexed sku);


  modifier isOwner () { require(msg.sender == owner); _;}

  modifier verifyCaller (address _address) { require (msg.sender == _address); _;}

  modifier paidEnough(uint _price) { require(msg.value >= _price, "Not enough Ether."); _;}
  modifier checkValue(uint _sku) {
    //refund them after pay for item (why it is before, _ checks for logic before func)
    _;
    uint _price = items[_sku].price;
    uint amountToRefund = msg.value - _price;
    items[_sku].buyer.transfer(amountToRefund);
  }

  modifier forSale(uint _sku){
    require(items[_sku].state == State.ForSale, "Item is not For Sale");
    _;
  }
  modifier sold(uint _sku){
    require(items[_sku].state == State.Sold, "Item has been sold");
    _;
  }
  modifier shipped(uint _sku){
    require(items[_sku].state == State.Shipped, "Item has been Shipped.");
    _;
  }
  modifier received(uint _sku){
    require(items[_sku].state == State.Received, "Item has been received.");
    _;
  }

//Here is a circuit breaker to that prevents all 
//app functionality if something bad occurs
//if the contract is paused, stop the modified function
  modifier checkIfPaused() {
    require(contractPaused == false);
    _;
  }

  constructor() public {
    /* Here, set the owner as the person who instantiated the contract
       and set your skuCount to 0. */
       owner = msg.sender;
       skuCount = 0;
  }

  function addItem(string memory _name, uint _price, string memory _image) public {
    emit ForSale(skuCount);
    items[skuCount] = Item({name: _name, sku:skuCount, price: _price, image: _image, state: State.ForSale, seller: msg.sender, buyer: address(0)});
    skuCount = skuCount + 1;
  }

  function buyItem(uint sku)
    public
    payable
    forSale(sku)
    paidEnough(msg.value)
    checkValue(sku)
  {
    items[sku].buyer = msg.sender;
    items[sku].seller.transfer(items[sku].price);
    items[sku].state = State.Sold;
    emit Sold(sku);
  }

//only an owner can call 
  function circuitBreaker() public isOwner {
    if(contractPaused == false) { contractPaused = true; }
    else { contractPaused = false; }
  }
  function shipItem(uint sku)
    public
    sold(sku)
    verifyCaller(items[sku].seller)
  {
    items[sku].state = State.Shipped;
    emit Shipped(sku);
  }

  function receiveItem(uint sku)
    public
    shipped(sku)
    verifyCaller(items[sku].buyer)
  {
    items[sku].state = State.Received;
    emit Received(sku);
  }

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