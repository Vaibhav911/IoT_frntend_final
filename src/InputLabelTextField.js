import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
}));

export default function InputLabelTextField(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: ""
  });

  const handleChange = name => event => {
    //This function stores the label value(s) entered by the user
    setValues({ ...values, [name]: event.target.value });
    window.clientQuery.sensorList_Array[props.label].label = event.target.value;
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="standard-name"
        label="Add a Label"
        className={classes.textField}
        value={values.name}
        onChange={handleChange("name")}
        margin="normal"
      />
    </form>
  );
}
