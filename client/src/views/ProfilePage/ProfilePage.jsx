import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import { connect } from 'react-redux';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import shop from "assets/img/shop.png";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

import getWeb3 from "../../util/getWeb3";
import SupplyChain from "../../contracts/SupplyChain.json";

import ItemCard from "components/ItemCard";
import AddItemModal from "./components/AddItemModal";

class ConnectedProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemAdded: null,
      items: [],
      totalItems: 0,
      web3: null,
      accounts: null,
      supplyChainContract: null,
    };
    this.addItem = this.addItem.bind(this);
    this.handleBuyItem = this.handleBuyItem.bind(this);
  }

  componentDidMount = async () => {
    console.log("test");
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const supplyChainDeployedNetwork = SupplyChain.networks[networkId];
      const SupplyChainContractInstance = new web3.eth.Contract(
        SupplyChain.abi,
        supplyChainDeployedNetwork && supplyChainDeployedNetwork.address
      );
     
      const totalItems = await SupplyChainContractInstance.methods.skuCount().call();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        supplyChainContract: SupplyChainContractInstance,
        totalItems: totalItems,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    } finally {
      this.fetchItems();
    }
  };

  async fetchItems() {
    const { supplyChainContract, totalItems } = this.state;
    let itemsArray = [];
    // Retrieve Items
    for (let i = 0; i < totalItems; i++) {
      const item = await supplyChainContract.methods.fetchItem(i).call();
      itemsArray.push(item);
    }
    // Update state with the result.
    this.setState({ items: itemsArray });
  }

  async addItem() {
    const { accounts, supplyChainContract, items } = this.state;
    const { itemData } = this.props;

    // Stores a given value, 5 by default.
    await supplyChainContract.methods.addItem(itemData.itemName, itemData.price, itemData.image).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await supplyChainContract.methods.fetchItem(items.length).call();

    // Update state with the result.
    this.setState((prevState) => {
      return { items: [...prevState.items, response] }
    });
  }

  handleBuyItem = async (sku, price) => {
    const { accounts, supplyChainContract } = this.state;

    // Stores a given value, 5 by default.
    await supplyChainContract.methods.buyItem(parseInt(sku)).send({ from: accounts[0], value: price });

    // Get the value from the contract to prove it worked.
    const updatedItem = await supplyChainContract.methods.fetchItem(sku).call();
    // Update state with the result.
    this.setState((prevState) => {
      prevState.items[sku] = updatedItem
      return {
        items: prevState.items
      }
    }
    );
  };

  makeBid() {

  }
  render() {
    const { classes, ...rest } = this.props;
    const { items, accounts} = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );

    let itemList;
    if (items.length === 0) {
      itemList = (
        <GridItem sm={12} md={12}>
          <div>There aren't any items available. Click the cross above to add an item.</div>
        </GridItem>
      )
    } else {
      itemList = items.map((item) => (
        <GridItem key={item.sku} sm={12} md={4}>
          <ItemCard
            key={item.sku}
            name={item.name}
            image={item.image}
            price={item.price}
            sku={item.sku}
            state={item.state}
            handleBuyItem={this.handleBuyItem}
          />
        </GridItem>
      ))
    }
    return (
      <div>
        <Header
          color="transparent"
          brand="Market Place"
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white"
          }}
          {...rest}
        />
        <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img src={shop} alt="..." className={imageClasses} />
                    </div>
                    <div className={classes.name}>
                      <h3 className={classes.title}>Your Store.</h3>
                      <h6> {accounts!== null? `Welcome: ${accounts[0]}` : "Please make sure you have copied the mnemonic into Metamask and signed in."}</h6>
                      <Button justIcon link className={classes.margin5}>
                        <i className={"fab fa-twitter"} />
                      </Button>
                      <Button justIcon link className={classes.margin5}>
                        <i className={"fab fa-instagram"} />
                      </Button>
                      <Button justIcon link className={classes.margin5}>
                        <i className={"fab fa-facebook"} />
                      </Button>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
              <div className={classes.description}>
                Add an item to the blockchain.
                <ul style={{listStyleType:'none'}}>
                  <li>1. Click on the cross below to begin</li>
                  <li>2. Provide a Name</li>
                  <li>3. Provide a Price</li>
                  <li>4. Provide an image less than or equal to 6kbs</li>
                </ul>
              </div>
              <GridContainer
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <GridItem md={2}>
                  <div>
                    <strong>Add Item</strong>
                  </div>
                  <div>
                    <AddItemModal handleAddItem={this.addItem} />
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridContainer
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="flex-start"
                >
                  {itemList}
                </GridContainer>
              </GridContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    itemData: !(state.form.addItemForm === undefined) ? state.form.addItemForm.values : null,
  }
);

const ProfilePage = connect(mapStateToProps, null)(withStyles(profilePageStyle)(ConnectedProfilePage));

export default ProfilePage;