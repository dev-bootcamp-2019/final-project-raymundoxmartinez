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
    const { classes } = this.props;
    return (
      <Card style={{width: "20rem"}}>
        <img
          style={{height: "180px", width: "100%", display: "block"}}
          className={classes.imgCardTop}
          src="..."
          alt="Card-img-cap"
        />
        <CardBody>
          <h4 className={classes.cardTitle}>Card title</h4>
          <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <Button color="primary">Do something</Button>
        </CardBody>
      </Card>
    );
  }
}

export default withStyles(style)(Cards);