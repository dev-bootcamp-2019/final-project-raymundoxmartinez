import React from "react";
import Button from "components/CustomButtons/Button.jsx";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Add from "@material-ui/icons/Add";
import AddItemForm from "../forms/AddItemForm";

export default class FormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button justIcon round color="primary" onClick={this.handleClickOpen}>
          <Add style={{ color: "#FFFFFF" }} />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add an item to your collection.
            </DialogContentText>
            <AddItemForm
              handleAddItem={this.props.handleAddItem}
              handleClose={this.handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
