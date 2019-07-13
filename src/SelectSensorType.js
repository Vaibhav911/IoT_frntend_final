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

export default function SelectSensorType(props) {
  //All the sensor types are hard-coded right now.
  //However it is advised that they are fetched from the database.
  const classes = useStyles();
  const [values, setValues] = React.useState({
    sensorType: ""
  });

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
    window.clientQuery.sensorList_Array[props.label].sensorType =
      event.target.value;
  }

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="sensorType-helper">Sensor Type</InputLabel>
        <Select
          value={values.sensorType}
          onChange={handleChange}
          input={<Input name="sensorType" id="SensorType-helper" />}
        >
          <MenuItem value="">
            <em>Select Sensor Type</em>
          </MenuItem>
          <MenuItem value="thl">THL</MenuItem>
          <MenuItem value="parking">Parking</MenuItem>
          <MenuItem value="aqi">AQI</MenuItem>
          <MenuItem value="ppm">PPM</MenuItem>
        </Select>
        <FormHelperText>Select any Sensor Type</FormHelperText>
      </FormControl>
    </form>
  );
}
