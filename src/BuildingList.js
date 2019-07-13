import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import FloorList from "./FloorList";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));

var ReceivedBuildingObjects = []; //This stores all the building objects
//recieved from parent component CampusList as props

export default function BuildingList(props) {
  const classes = useStyles();
  var buildingCheckBoxList = []; //This stores names of building to be
  //used while creating checkboxes for buidlings and also stores their
  //state wether they are checked or not.

  var floorData = []; //This stores all the data of selected buildings
  //that has to be passed to it's child component FloorList

  for (var i = 0; i < props.buildingData.length; i++) {
    buildingCheckBoxList[i] = {
      building: props.buildingData[i].building,
      checked: true
    };
    floorData = floorData.concat(props.buildingData[i].floorArray);
    ReceivedBuildingObjects.push(props.buildingData[i]);
  }

  const [state, setState] = React.useState({
    buildingList: buildingCheckBoxList,
    floorArray: floorData
  });

  useEffect(() => {
    //This modifies buildingCheckBoxList and floorData based on the
    //campuses selected in it's parent component CampustList
    var buildingCheckBoxList = [];
    var floorData = [];
    for (var i = 0; i < props.buildingData.length; i++) {
      buildingCheckBoxList[i] = {
        building: props.buildingData[i].building,
        checked: true
      };
      floorData = floorData.concat(props.buildingData[i].floorArray);
      ReceivedBuildingObjects.push(props.buildingData[i]);
    }
    setState({
      ...state,
      buildingList: buildingCheckBoxList,
      floorArray: floorData
    });
  }, [props.buildingData]);

  const handleChange = name => event => {
    //This finds all the building checkboxes that are selected
    //and based on this remove all floor checkboxes, zone checkboxes and sensor checkboxes
    //that were inside those unchecked buildings. And this will be passesd
    //to FloorList component
    state.buildingList[name].checked = event.target.checked;
    var checkedBuildingFloorArray = [];
    for (var i = 0; i < state.buildingList.length; i++) {
      if (state.buildingList[i].checked == true) {
        checkedBuildingFloorArray = checkedBuildingFloorArray.concat(
          ReceivedBuildingObjects[i].floorArray
        );
      }
    }
    setState({
      buildingList: state.buildingList,
      floorArray: checkedBuildingFloorArray
    });
  };

  var buildingCheckboxComponent = []; //This renders all the checkboxes related to buildings
  var currentCampus = ""; //This is the current campus name for which we are working on all of it's buildings
  //This variable helps in combining all the buildings that are in one campus to one set
  //And campus name will be displayed along with each set
  for (var i = 0; i < state.buildingList.length; i++) {
    if (props.buildingData[i]) {
      if (props.buildingData[i].campus == currentCampus) {
        //this check wether checkboxes will be in same set
        //or different one while rendering
        buildingCheckboxComponent.push(
          <FormControlLabel
            control={
              <Checkbox
                checked={state.buildingList[i].checked}
                onChange={handleChange(i)}
              />
            }
            label={state.buildingList[i].building}
          />
        );
      } else {
        currentCampus = props.buildingData[i].campus;
        buildingCheckboxComponent.push(
          <div>
            <FormHelperText>{currentCampus}</FormHelperText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.buildingList[i].checked}
                  onChange={handleChange(i)}
                />
              }
              label={state.buildingList[i].building}
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
          <FormLabel component="legend">Building List</FormLabel>
          <FormGroup>{buildingCheckboxComponent}</FormGroup>
        </FormControl>
      </div>
      <div style={{ display: "inline-block" }}>
        <FloorList floorData={state.floorArray} label={props.label} />
      </div>
    </div>
  );
}
