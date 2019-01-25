import React, { PureComponent } from "react";
import { reduxForm, Field } from "redux-form";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import ImageUpload from "../../../components/ImageUpload";

const styles = () => ({});

const validate = (values) => {
  const errors = {};
  if (!values.itemName) {
    errors.itemName = "Please enter a name for the item.";
  }
  if (!values.price) {
    errors.price = "Please enter a price for the item.";
  }
  if (!values.image) {
    errors.image = "Please insert an image.";
  }
  return errors;
};

class AddItemForm extends PureComponent {
  constructor(props) {
    super(props);
    this.createRenderer = this.createRenderer.bind(this);
    this.RenderInput = this.RenderInput.bind(this);
    this.RenderImageUpload = this.RenderImageUpload.bind(this);
  }

  createRenderer = (render) => ({ input, meta, label, type, ...rest }) => (
    <label className={meta.error && meta.touched ? "error" : ""}>
      <div className="popover-label">{render(input, label, type, rest)}</div>{" "}
      {meta.error && meta.touched && (
        <span style={{ color: "red" }}>{meta.error}</span>
      )}
    </label>
  );

  RenderImageUpload = this.createRenderer((input, label, type) => (
    <ImageUpload {...input} label={label} />
  ));
  RenderInput = this.createRenderer((input, label, type) => (
    <TextField
      {...input}
      margin="dense"
      label={label}
      type={type}
      fullWidth={true}
    />
  ));

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      classes,
      pristine,
      handleAddItem,
      handleClose
    } = this.props;
    return (
      <form
        style={{ textAlign: "center" }}
        onSubmit={handleSubmit(handleAddItem)}
      >
        <Grid container spacing={40}>
          <Grid item xs={12} md={6}>
            <Field
              name="itemName"
              label="Item Name"
              component={this.RenderInput}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field name="price" label="Price" component={this.RenderInput} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              name="image"
              label="Image"
              component={this.RenderImageUpload}
            />
          </Grid>
        </Grid>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" disabled={pristine || submitting} color="primary">
          Request
        </Button>
      </form>
    );
  }
}

AddItemForm.propTypes = {
  classes: PropTypes.object.isRequired
};
export default reduxForm({
  form: "addItemForm",
  destroyOnUnmount: true,
  validate
})(withStyles(styles)(AddItemForm));
