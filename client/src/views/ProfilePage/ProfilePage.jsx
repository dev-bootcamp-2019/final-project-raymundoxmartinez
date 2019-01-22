import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
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


import getWeb3 from "../../util/getWeb3";
import SupplyChain from "../../contracts/SupplyChain.json";

import ItemCard from 'components/ItemCard';
import BuyItemModal from './components/BuyItemModal';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      itemAdded: null,
      web3: null,
      accounts: null,
      contract: null
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SupplyChain.networks[networkId];
      const instance = new web3.eth.Contract(
        SupplyChain.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  addItem = async () => {
    debugger
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.addItem('Rolex', 300).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.fetchItem(0).call();

    // Update state with the result.
    this.setState({ itemAdded: response });
  };

  buyItem = async () => {
    debugger
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.buyItem(0).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.fetchItem(0).call();
    debugger
    // Update state with the result.
    this.setState({ itemAdded: response });
  };
  render() {
    const { classes, ...rest } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);


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
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} >
                  <BuyItemModal />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} className={classes.navWrapper}>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4}>

                      <ItemCard />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <img
                        alt="..."
                        src={studio5}
                        className={navImageClasses}
                      />
                      <img
                        alt="..."
                        src={studio4}
                        className={navImageClasses}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(ProfilePage);
