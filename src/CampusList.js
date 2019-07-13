import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import BuildingList from "./BuildingList";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));

var ReceivedCampusObjects = []; //This stores all the campus objects received
//from InputHomePage

export default function CampusList(props) {
  const classes = useStyles();

  var campusCheckBoxList = []; //This stores names of campus to be
  //used while creating checkboxes for campuses and also their state
  //wether they checked or not.
  var buildingData = []; //This stores all the data of selected campuses
  //that has to be passed to it's child component BuildingList

  for (var i = 0; i < props.campusData.campusList.length; i++) {
    campusCheckBoxList[i] = {
      campus: props.campusData.campusList[i].campus,
      checked: true
    };
    buildingData = buildingData.concat(
      props.campusData.campusList[i].buildingArray
    );
    ReceivedCampusObjects.push(props.campusData.campusList[i]);
  }

  const [state, setState] = React.useState({
    campusList: campusCheckBoxList,
    buildingArray: buildingData
  });

  const handleChange = name => event => {
    //This finds all the campus checkboxes that are selected
    //and based on this remove all building checkboxes, floor checkboxes,
    //zone checkboxes and sensor checkboxes
    //that were inside those unchecked campuses. And this will be passesd
    //to BuildingList component
    state.campusList[name].checked = event.target.checked;
    var checkedCampusBuildingArray = [];
    for (var i = 0; i < state.campusList.length; i++) {
      if (state.campusList[i].checked == true) {
        checkedCampusBuildingArray = checkedCampusBuildingArray.concat(
          ReceivedCampusObjects[i].buildingArray
        );
      }
    }
    setState({
      campusList: state.campusList,
      buildingArray: checkedCampusBuildingArray
    });
  };

  const { campusList } = state;

  var campusFormList = []; //This stores all the campus name checkboxes
  //and renders them
  for (var i = 0; i < campusList.length; i++) {
    campusFormList.push(
      <FormControlLabel
        control={
          <Checkbox
            checked={state.campusList[i].checked}
            onChange={handleChange(i)}
          />
        }
        label={state.campusList[i].campus}
      />
    );
  }

  return (
    <div>
      <div
        className={classes.root}
        style={{ display: "inline-block", overflow: "auto", height: "250px" }}
      >
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Campus List</FormLabel>
          <FormGroup>{campusFormList}</FormGroup>
          <FormHelperText>Choose your Campus</FormHelperText>
        </FormControl>
      </div>

      <div style={{ display: "inline-block" }}>
        <BuildingList buildingData={state.buildingArray} label={props.label} />
      </div>
    </div>
  );
}
