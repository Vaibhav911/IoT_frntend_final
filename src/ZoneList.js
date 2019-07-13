import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import SensorList from "./SensorList";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));
var ReceivedZoneObjects = []; //This stores all the Zone objects
//recieved from parent component FloorList as props

export default function ZoneList(props) {
  const classes = useStyles();
  var zoneCheckBoxList = []; //This stores names of zones to be
  //used while creating checkboxes for zones and also stores their
  //state whether they are checked or not.

  var sensorData = []; //This stores all the data of selected zones
  //that has to be passed to it's child component SensorList

  for (var i = 0; i < props.zoneData.length; i++) {
    zoneCheckBoxList[i] = { zone: props.zoneData[i].zone, checked: true };
    sensorData = sensorData.concat(props.zoneData[i].sensorArray);
    ReceivedZoneObjects.push(props.zoneData[i]);
  }

  const [state, setState] = React.useState({
    zoneList: zoneCheckBoxList,
    sensorArray: sensorData
  });

  useEffect(() => {
    //This modifies zoneCheckBoxList and sensorData based on the
    //Floors selected in it's parent component FloorList
    var zoneCheckBoxList = [];
    var sensorData = [];
    for (var i = 0; i < props.zoneData.length; i++) {
      zoneCheckBoxList[i] = { zone: props.zoneData[i].zone, checked: true };
      sensorData = sensorData.concat(props.zoneData[i].sensorArray);
      ReceivedZoneObjects.push(props.zoneData[i]);
    }
    setState({ ...state, zoneList: zoneCheckBoxList, sensorArray: sensorData });
  }, [props.zoneData]);

  const handleChange = name => event => {
    //This finds all the zone checkboxes that are selected
    //and based on this remove all sensor checkboxes
    //And this will be passed to SensorList component
    state.zoneList[name].checked = event.target.checked;
    var checkedZoneSensorArray = [];
    for (var i = 0; i < state.zoneList.length; i++) {
      if (state.zoneList[i].checked == true) {
        checkedZoneSensorArray = checkedZoneSensorArray.concat(
          ReceivedZoneObjects[i].sensorArray
        );
      }
    }
    setState({ zoneList: state.zoneList, sensorArray: checkedZoneSensorArray });
  };

  var ZoneCheckBoxComponent = []; //This renders all the checkboxes related to zones
  var currentFloor = ""; //This is the current floor name for which we are working on all of it's zones
  var currentBuilding = ""; //This is the current building name for which we are working on all of it's floors.
  var currentCampus = ""; //This is the current campus name for which we are working on all of it's building.
  //Above three variables are used to combine checkboxes of same campus, building and floor in one set
  //And these floor number, building name and campus name will be displayed along with each set

  for (var i = 0; i < state.zoneList.length; i++) {
    if (props.zoneData[i]) {
      if (
        props.zoneData[i].floor == currentFloor &&
        props.zoneData[i].building == currentBuilding &&
        props.zoneData[i].campus == currentCampus
      ) {
        //this checks whether checkboxes will be in same set
        //or different one while rendering
        ZoneCheckBoxComponent.push(
          <FormControlLabel
            control={
              <Checkbox
                checked={state.zoneList[i].checked}
                onChange={handleChange(i)}
              />
            }
            label={state.zoneList[i].zone}
          />
        );
      } else {
        currentFloor = props.zoneData[i].floor;
        currentBuilding = props.zoneData[i].building;
        currentCampus = props.zoneData[i].campus;
        ZoneCheckBoxComponent.push(
          <div>
            <FormHelperText>
              {"Floor " +
                currentFloor +
                ", " +
                currentBuilding +
                ", " +
                currentCampus}
            </FormHelperText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.zoneList[i].checked}
                  onChange={handleChange(i)}
                />
              }
              label={state.zoneList[i].zone}
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
          <FormLabel component="legend">Zone List</FormLabel>
          <FormGroup>{ZoneCheckBoxComponent}</FormGroup>
          <FormHelperText>Choose Zone</FormHelperText>
        </FormControl>
      </div>

      <div style={{ display: "inline-block" }}>
        <SensorList sensorData={state.sensorArray} label={props.label} />
      </div>
    </div>
  );
}
