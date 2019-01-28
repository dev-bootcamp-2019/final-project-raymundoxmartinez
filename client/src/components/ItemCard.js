import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "./Card/Card.jsx";
import CardBody from "./Card/CardBody.jsx";
import Button from "./CustomButtons/Button.jsx";

import imagesStyles from "assets/jss/material-kit-react/imagesStyles.jsx";

import { cardTitle } from "assets/jss/material-kit-react.jsx";

const style = {
  ...imagesStyles,
  cardTitle,
};

class Cards extends React.Component {
  render() {
    const { classes, price, image,name, sku, state } = this.props;
    debugger
    let button;
    if(parseInt(state) === 0){
      button =  <Button onClick= {()=>this.props.handleBuyItem(sku, price)} color="primary">Buy</Button>;
    } else{
      button =  <Button disabled={true} color="rose">Sold</Button>
    }
    return (
      <Card style={{width: "20rem"}}>
        <img
          style={{height: "180px", width: "100%", display: "block"}}
          className={classes.imgCardTop}
          src={image}
          alt="Card-img-cap"
        />
        <CardBody>
          <h4 className={classes.cardTitle}>{name}</h4>
          <p>$ {price}</p>
         {button}
        </CardBody>
      </Card>
    );
  }
}

export default withStyles(style)(Cards);