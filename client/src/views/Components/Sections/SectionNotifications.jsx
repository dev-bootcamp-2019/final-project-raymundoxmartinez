import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
// core components
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Clearfix from "components/Clearfix/Clearfix.jsx";
import notificationsStyles from "assets/jss/material-kit-react/views/componentsSections/notificationsStyles.jsx";

class SectionNotifications extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section} id="notifications">
        <SnackbarContent
          message={
            <span>
              <b>INFO ALERT:</b> There aren't any items available. Click the cross above to add an item.
            </span>
          }
          close
          color="info"
          icon="info_outline"
        />
        <Clearfix />
      </div>
    );
  }
}

export default withStyles(notificationsStyles)(SectionNotifications);
