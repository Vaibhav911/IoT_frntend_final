import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function SelectFrequency() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    frequency: ""
  });

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
    window.clientQuery.frequency = event.target.value;
  }

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="frequency-helper">Frequency</InputLabel>
        <Select
          value={values.frequency}
          onChange={handleChange}
          input={<Input name="frequency" id="frequency-helper" />}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="annual">Annual</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          {/* <MenuItem value="weekly">Weekly</MenuItem> */}
          {/* Currently the system don't support weekly analysis.
              However, backend can be modified to support this also*/}
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="hourly">Hourly</MenuItem>
        </Select>
        <FormHelperText>Select any Frequency</FormHelperText>
      </FormControl>
    </form>
  );
}
