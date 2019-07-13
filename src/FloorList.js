import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import ZoneList from "./ZoneList";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));

var ReceivedFloorObjects = []; //This stores all the floor objects
//recieved from parent component BuildingList as props

export default function FloorList(props) {
  const classes = useStyles();
  var floorCheckBoxList = []; //This stores names of floors to be
  //used while creating checkboxes for floors and also stores their
  //state whether they are checked or not.

  var zoneData = []; //This stores all the data of selected floors
  //that has to be passed to it's child component ZoneList

  for (var i = 0; i < props.floorData.length; i++) {
    floorCheckBoxList[i] = { floor: props.floorData[i].floor, checked: true };
    zoneData = zoneData.concat(props.floorData[i].zoneArray);
    ReceivedFloorObjects.push(props.floorData[i]);
  }

  const [state, setState] = React.useState({
    floorList: floorCheckBoxList,
    zoneArray: zoneData
  });

  useEffect(() => {
    //This modifies floorCheckBoxList and zoneData based on the
    //buildings selected in it's parent component BuildingList
    var floorCheckBoxList = [];
    var zoneData = [];
    for (var i = 0; i < props.floorData.length; i++) {
      floorCheckBoxList[i] = { floor: props.floorData[i].floor, checked: true };
      zoneData = zoneData.concat(props.floorData[i].zoneArray);
      ReceivedFloorObjects.push(props.floorData[i]);
    }
    setState({ ...state, floorList: floorCheckBoxList, zoneArray: zoneData });
  }, [props.floorData]);

  const handleChange = name => event => {
    //This finds all the floor checkboxes that are selected
    //and based on this remove all zone checkboxes and sensor checkboxes
    //that were inside those unchecked floors. And this will be passed
    //to ZoneList component
    state.floorList[name].checked = event.target.checked;
    var checkedFloorZoneArray = [];
    for (var i = 0; i < state.floorList.length; i++) {
      if (state.floorList[i].checked == true) {
        checkedFloorZoneArray = checkedFloorZoneArray.concat(
          ReceivedFloorObjects[i].zoneArray
        );
      }
    }
    setState({ floorList: state.floorList, zoneArray: checkedFloorZoneArray });
  };

  var FloorCheckBoxComponent = []; //This renders all the checkboxes related to floors
  var currentBuilding = ""; //This is the current building name for which we are working on all of it's floors
  var currentCampus = ""; //This is the current campus name for which we are working on all of it's building.
  //Above two variables are used to combine checkboxes of same campus and building in one set
  //And these building name and campus name will be displayed along with each set

  for (var i = 0; i < state.floorList.length; i++) {
    if (props.floorData[i]) {
      if (
        props.floorData[i].building == currentBuilding &&
        props.floorData[i].campus == currentCampus
      ) {
        //this check whether checkboxes will be in same set
        //or different one while rendering
        FloorCheckBoxComponent.push(
          <FormControlLabel
            control={
              <Checkbox
                checked={state.floorList[i].checked}
                onChange={handleChange(i)}
              />
            }
            label={state.floorList[i].floor}
          />
        );
      } else {
        currentBuilding = props.floorData[i].building;
        currentCampus = props.floorData[i].campus;
        FloorCheckBoxComponent.push(
          <div>
            <FormHelperText>
              {currentBuilding + ", " + currentCampus}
            </FormHelperText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.floorList[i].checked}
                  onChange={handleChange(i)}
                />
              }
              label={state.floorList[i].floor}
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
          <FormLabel component="legend">Floor List</FormLabel>
          <FormGroup>{FloorCheckBoxComponent}</FormGroup>
          <FormHelperText>Choose your Floor</FormHelperText>
        </FormControl>
      </div>

      <div style={{ display: "inline-block" }}>
        <ZoneList zoneData={state.zoneArray} label={props.label} />
      </div>
    </div>
  );
}
