import React from "react";
import deburr from "lodash/deburr";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import SensorDataType from "./SensorDataType";
import { Button } from "@material-ui/core";

const suggestions = []; // a variable to hold all the suggestions related to campus names,
// building names, floor names, zone names

async function getLabels() {
  //This fetches all the suggestion related to campus names, building names etc
  //and push them to suggestions variable
  var link = "http://localhost:5000/getlabels";
  await axios.get(link).then(res => {
    for (var i = 0; i < res.data.locationLabels.length; i++) {
      if (!res.data.locationLabels[i].label) {
        continue;
      }
      suggestions.push(res.data.locationLabels[i]);
    }
  });
}
async function callGetLabels() {
  await getLabels();
}

callGetLabels();

function renderInputComponent(inputProps) {
  //use to  render the input handle of all the textboxes,
  //which are use to input the campus schema attributes like Campus names,
  //building names etc...
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  //use to render the suggestion texts for each and every textbox
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  //fetches the suggestions from the suggestions variable
  //based on the input string typed by the user inside the textbox
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const useStyles = makeStyles(theme => ({
  //css for all the textboxes
  root: {
    height: 250,
    flexGrow: 1
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  divider: {
    height: theme.spacing(2)
  }
}));

export default function AddSensor() {
  //this component renders all the input text boxes,
  //along with a drop menu for selecting sensor data type
  //eg. qualitative or quantitative.
  //This also shows all the suggestions based on the
  //values entered by the user.
  const classes = useStyles();
  const [state, setState] = React.useState({
    campus: "",
    building: "",
    floor: "",
    zone: "",
    sensorType: "",
    sensorId: ""
  });

  const [stateSuggestions, setSuggestions] = React.useState([]);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = name => (event, { newValue }) => {
    setState({
      ...state,
      [name]: newValue
    });
  };

  function handleSubmit() {
    //This sends all the data entered by user
    //to backend, which stores it in existing or
    //new campus document based on previous stored campus documents.
    var link =
      "http://localhost:5000/storesensor?" +
      "campus=" +
      state.campus +
      "&building=" +
      state.building +
      "&floor=" +
      state.floor +
      "&zone=" +
      state.zone +
      "&sensorId=" +
      state.sensorId +
      "&sensorType=" +
      state.sensorType +
      "&sensorDataType=" +
      window.sensorDataType;

    axios.get(link).then(res => {
      console.log("res is " + JSON.stringify(res));
    });
  }

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: "react-autosuggest-simple",
          label: "campus",
          placeholder: "Search a campus",
          value: state.campus,
          onChange: handleChange("campus")
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: "react-autosuggest-simple",
          label: "Building",
          placeholder: "Search a Building",
          value: state.building,
          onChange: handleChange("building")
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: "react-autosuggest-simple",
          label: "Floor",
          placeholder: "Search a Floor",
          value: state.floor,
          onChange: handleChange("floor")
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: "react-autosuggest-simple",
          label: "Zone",
          placeholder: "Search a Zone",
          value: state.zone,
          onChange: handleChange("zone")
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: "react-autosuggest-simple",
          label: "Sensor Type",
          placeholder: "Search a Sensor Type",
          value: state.sensorType,
          onChange: handleChange("sensorType")
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: "react-autosuggest-simple",
          label: "Sensor ID",
          placeholder: "Search a Sensor ID",
          value: state.sensorId,
          onChange: handleChange("sensorId")
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      <SensorDataType />
      <div className={classes.divider} />

      <div>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
