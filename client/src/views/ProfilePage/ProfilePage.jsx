import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import { connect } from 'react-redux';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Add from "@material-ui/icons/Add";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import profile from "assets/img/faces/christian.jpg";

import studio1 from "assets/img/examples/studio-1.jpg";
import studio2 from "assets/img/examples/studio-2.jpg";
import studio3 from "assets/img/examples/studio-3.jpg";
import studio4 from "assets/img/examples/studio-4.jpg";
import studio5 from "assets/img/examples/studio-5.jpg";
import work1 from "assets/img/examples/olu-eletu.jpg";
import work2 from "assets/img/examples/clem-onojeghuo.jpg";
import work3 from "assets/img/examples/cynthia-del-rio.jpg";
import work4 from "assets/img/examples/mariya-georgieva.jpg";
import work5 from "assets/img/examples/clem-onojegaw.jpg";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

import mockItems from "../../mock/mockItems";

import getWeb3 from "../../util/getWeb3";
import SupplyChain from "../../contracts/SupplyChain.json";
import SimpleAuction from "../../contracts/SimpleAuction.json";

import ItemCard from "components/ItemCard";
import AddItemModal from "./components/AddItemModal";


const CryptoJS = require('crypto-js');

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
      simpleAuctionContract: null,
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
      const simpleAuctionDeployedNetwork = SimpleAuction.networks[networkId];
      const SimpleAuctionContractInstance = new web3.eth.Contract(
        SimpleAuction.abi,
        simpleAuctionDeployedNetwork && simpleAuctionDeployedNetwork.address
      );
      const totalItems = await SupplyChainContractInstance.methods.skuCount().call();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        supplyChainContract: SupplyChainContractInstance,
        simpleAuctionContract: SimpleAuctionContractInstance,
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
    const { accounts, supplyChainContract, totalItems, items } = this.state;
    const { itemData } = this.props;

    // Stores a given value, 5 by default.
    await supplyChainContract.methods.addItem(itemData.itemName, itemData.price, itemData.image).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await supplyChainContract.methods.fetchItem(items.length).call();
    debugger

    // Update state with the result.
    this.setState((prevState) => { 
      return {items: [...prevState.items, response] }
    });
  }

  handleBuyItem = async (sku, price) => {
    const { accounts, supplyChainContract } = this.state;
    debugger;

    // Stores a given value, 5 by default.
    await supplyChainContract.methods.buyItem(parseInt(sku)).send({ from: accounts[0], value: price }, (err, res)=>{
      console.log(err)
      debugger
    });

    // Get the value from the contract to prove it worked.
    const updatedItem = await supplyChainContract.methods.fetchItem(sku).call();
    debugger;
    // Update state with the result.
    this.setState((prevState) => { 
      debugger
      prevState.items[sku]= updatedItem
      return {
        items:prevState.items
      }
    }
    );
  };

  makeBid() {

  }
  render() {
    const { classes, ...rest } = this.props;
    const { items } = this.state;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

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
          rightLinks={<HeaderLinks />}
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
                      <img src={profile} alt="..." className={imageClasses} />
                    </div>
                    <div className={classes.name}>
                      <h3 className={classes.title}>Christian Louboutin</h3>
                      <h6>Merchant</h6>
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
                <p>
                  An artist of considerable range, Chet Faker — the name taken
                  by Melbourne-raised, Brooklyn-based Nick Murphy — writes,
                  performs and records all of his own music, giving it a warm,
                  intimate feel with a solid groove structure.{" "}
                </p>
              </div>
              <GridContainer
                container
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
                {/* <GridItem md={1}>
                </GridItem> */}
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
        <Footer />
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