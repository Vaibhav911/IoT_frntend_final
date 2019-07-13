import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));

export default function SensorList(props) {
  const classes = useStyles();
  var sensorCheckBoxList = []; //This stores names of sensors to be
  //used while creating checkboxes for sensors and also stores their
  //state whether they are checked or not.

  for (var i = 0; i < props.sensorData.length; i++) {
    sensorCheckBoxList[i] = {
      sensor: props.sensorData[i].sensorId,
      checked: true
    };
  }

  const [state, setState] = React.useState({
    sensorList: sensorCheckBoxList
  });

  useEffect(() => {
    //This modifies sensorCheckBoxList  based on the
    //Zones selected in it's parent component ZoneList
    var sensorCheckBoxList = [];
    for (var i = 0; i < props.sensorData.length; i++) {
      sensorCheckBoxList[i] = {
        sensor: props.sensorData[i].sensorId,
        checked: true
      };
    }
    setState({ ...state, sensorList: sensorCheckBoxList });

    var checkedSensorLables = [];
    for (var i = 0; i < state.sensorList.length; i++) {
      if (state.sensorList[i].checked == true) {
        checkedSensorLables.push(state.sensorList[i].sensor);
      }
    }
    window.clientQuery.sensorList_Array[
      props.label
    ].sensorList = checkedSensorLables;
  }, [props.sensorData]);

  const handleChange = name => event => {
    //This finds all the sensor checkboxes that are selected
    //and initialises the clientQuery global variable.
    var sensorList = state.sensorList;
    sensorList[name].checked = event.target.checked;
    setState({ ...state, sensorList: sensorList });

    var checkedSensorLables = [];
    for (var i = 0; i < state.sensorList.length; i++) {
      if (state.sensorList[i].checked == true) {
        checkedSensorLables.push(state.sensorList[i].sensor);
      }
    }
    window.clientQuery.sensorList_Array[
      props.label
    ].sensorList = checkedSensorLables;
  };

  var SensorCheckBoxComponent = []; //This renders all the checkboxes related to sensors
  var currentZone = ""; //This is the current zone name for which we are working on all of it's sensors
  var currentFloor = ""; //This is the current floor name for which we are working on all of it's zones
  var currentBuilding = ""; //This is the current building name for which we are working on all of it's floors
  var currentCampus = ""; //This is the current campus name for which we are working on all of it's buildings
  for (var i = 0; i < state.sensorList.length; i++) {
    if (props.sensorData[i]) {
      if (
        props.sensorData[i].zone == currentZone &&
        props.sensorData[i].floor == currentFloor &&
        props.sensorData[i].building == currentBuilding &&
        props.sensorData[i].campus == currentCampus
      ) {
        //this checks whether checkboxes will be in same set
        //or different one while rendering

        SensorCheckBoxComponent.push(
          <FormControlLabel
            control={
              <Checkbox
                checked={state.sensorList[i].checked}
                color="primary"
                onChange={handleChange(i)}
              />
            }
            label={state.sensorList[i].sensor + "-" + props.sensorData[i].type}
          />
        );
      } else {
        currentZone = props.sensorData[i].zone;
        currentFloor = props.sensorData[i].floor;
        currentBuilding = props.sensorData[i].building;
        currentCampus = props.sensorData[i].campus;

        SensorCheckBoxComponent.push(
          <div>
            <FormHelperText>
              {currentZone +
                ",Floor " +
                currentFloor +
                ", " +
                currentBuilding +
                ", " +
                currentCampus}
            </FormHelperText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.sensorList[i].checked}
                  color="primary"
                  onChange={handleChange(i)}
                />
              }
              label={
                state.sensorList[i].sensor + "-" + props.sensorData[i].type
              }
            />
          </div>
        );
      }
    }
  }

  return (
    <div>
      <div
        className={classes.root}
        style={{ display: "inline-block", overflow: "auto", height: "250px" }}
      >
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Sensor List</FormLabel>
          <FormGroup>{SensorCheckBoxComponent}</FormGroup>
          <FormHelperText>Choose Sensor</FormHelperText>
        </FormControl>
      </div>
    </div>
  );
}
