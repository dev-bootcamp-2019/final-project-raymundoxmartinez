import React, { PureComponent } from "react";
import { reduxForm, Field } from "redux-form";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';


const styles = () => ({

});


const validate = values => {
    const errors = {};
    if (!values.email) {
        errors.email = "Please enter your email.";
    } 
    if (!values.firstName) {
        errors.firstName = 'Please enter your first name.';
    }
    if (!values.lastName) {
        errors.lastName = 'Please enter your last name.';
    }

    return errors;
};

class AppointmentForm extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            genderValue: '',
            preferredTimeOfDay: '',

        }
        this.createRenderer = this.createRenderer.bind(this);
        this.RenderInput = this.RenderInput.bind(this);
        this.RenderPicker = this.RenderPicker.bind(this);
        this.RenderRadio = this.RenderRadio.bind(this);
        this.RenderSelect = this.RenderSelect.bind(this);
    }



    createRenderer = render => ({ input, meta, label, type, ...rest }) => (
        <label className={meta.error && meta.touched ? "error" : ""}>
            <div className="popover-label">
                {render(input, label, type, rest)}
            </div>{" "}

            {meta.error &&
                meta.touched && <span style={{ color: "red" }}>{meta.error}</span>}
        </label>
    );

    RenderInput = this.createRenderer((input, label, type) =>
        <TextField
            {...input}
            margin="dense"
            label={label}
            type={type}
            fullWidth={true}
        />
    )
    RenderPicker = this.createRenderer((input, label, type) =>
        <TextField
            {...input}
            margin="dense"
            label={label}
            type={type}
            fullWidth={true}
            InputLabelProps={{
                shrink: true,
            }}
        />
    )
    RenderRadio = this.createRenderer((input, label, type, ...rest) =>
        <FormControlLabel   {...input} control={<Radio />} label={label} />
    )
    RenderSelect = this.createRenderer((input, label, type, { children }) =>
        <FormControl>
            <InputLabel shrink htmlFor="age-native-label-placeholder">
                {label}
            </InputLabel>
            <Select
                {...input}
                native
                inputProps={{
                    name: 'age',
                    id: 'age-native-simple',
                }}
                input={<Input name="preferredTimeOfDay" id="age-native-label-placeholder" />}
            >
                {children}
            </Select>
        </FormControl>
    );

    render() {
        const { error, handleSubmit, submitting, classes, pristine, handleAddItem, handleClose } = this.props;
        return (
            <form style={{ textAlign: "center" }} onSubmit={handleSubmit(handleAddItem)}>
                <Grid container spacing={40}   >
                    <Grid item xs={12} md={6}>
                        <Field name="itemName" label="Item Name" component={this.RenderInput} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field name="price" label="Price" component={this.RenderInput} />
                    </Grid>
                </Grid>
                <Button onClick={handleClose} color="primary">
                    Cancel
            </Button>
                <Button type="submit" disabled={pristine || submitting} color="primary">
                    Request
            </Button>
            </form>
        )
    }
}

AppointmentForm.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default reduxForm({
    form: 'appointmentForm',
    destroyOnUnmount: true,
    validate,
})(withStyles(styles)(AppointmentForm));





