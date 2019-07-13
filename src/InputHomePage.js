import React, { useEffect } from "react";
import "./App.css";
import CampusList from "./CampusList";
import StartTimePicker from "./StartTimePicker";
import EndTimePicker from "./EndTimePicker";
import SelectFrequency from "./SelectFrequency";
import axios from "axios";
import { Button } from "@material-ui/core";
import InputLabelTextField from "./InputLabelTextField";
import SelectSensorType from "./SelectSensorType";
import Graphs from "./Graphs";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

window.graphData = {};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

function InputHomePage() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    CampusData: [],
    dataReceived: {},
    count: 0,
    graphData: {},
    comparisonLabels: "",
    possibleTransactionStatus: [
      "takeInput",
      "loadingData",
      "transactionFailed",
      "plotGraph"
    ],
    transactionStatus: "takeInput"
  });

  useEffect(() => {
    //This fetches all the data required to render all the checkboxes
    //at the start.
    axios.get("http://localhost:7000/getcampusdata").then(res => {
      setState({
        ...state,
        CampusData: [
          <div>
            <CampusList campusData={res.data} label={state.count} />
            <InputLabelTextField label={state.count} />
            <SelectSensorType label={state.count} />
          </div>
        ],
        dataReceived: res.data,
        count: 1
      });
    });
  }, []);

  function handleSubmit() {
    //This checks necessary constraints that user has
    //to select while entering query in input-home page
    //and if everything passes, it requests the all the
    //graph data based on the user query. And handle few
    //things if data received is not proper.
    if (window.clientQuery.frequency == "") {
      alert("you have not selected freq");
    }
    setState({
      ...state,
      transactionStatus: state.possibleTransactionStatus[1]
    });

    function getGraphData() {
      axios({
        method: "post",
        url: "http://localhost:4000/getdata",
        data: window.clientQuery
      })
        .catch(function(error) {
          console.log(error);
          setState({
            ...state,
            transactionStatus: state.possibleTransactionStatus[2]
          });
        })
        .then(function(response) {
          if (response.data.length == 0 || response.data == "error") {
            setState({
              ...state,
              transactionStatus: state.possibleTransactionStatus[2]
            });
          } else {
            setState({
              ...state,
              graphData: response.data,
              transactionStatus: state.possibleTransactionStatus[3],
              comparisonLabels: window.clientQuery
            });
          }
        });
    }
    getGraphData();
  }

  function handleAddInputBlock() {
    //This add one more CampusList component for comparison
    //if the user click Add to compare button.
    window.clientQuery.sensorList_Array.push({ sensorList: [], label: "" });
    var CampusArray = state.CampusData;
    CampusArray.push(
      <div>
        <hr />
        <CampusList campusData={state.dataReceived} label={state.count} />
        <InputLabelTextField label={state.count} />
        <SelectSensorType label={state.count} />
      </div>
    );
    setState({ ...state, CampusData: CampusArray, count: state.count + 1 });
  }

  return (
    <div>
      {state.transactionStatus == state.possibleTransactionStatus[0] ? (
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              />
              <Typography variant="h6" className={classes.title}>
                {<img src={require("./senZopt-logo.png")} />}
                Data Analytics
              </Typography>
              <Button color="inherit">Logout</Button>
            </Toolbar>
          </AppBar>

          <div>{state.CampusData}</div>

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddInputBlock}
            >
              Add to compare
            </Button>
          </div>

          <hr />

          <div style={{ display: "flex" }}>
            <StartTimePicker />
          </div>

          <div style={{ display: "flex" }}>
            <EndTimePicker />
          </div>

          <div style={{ display: "flex" }}>
            <SelectFrequency />
          </div>

          <div>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      ) : state.transactionStatus == state.possibleTransactionStatus[1] ? (
        <div className={classes.root}>
          <LinearProgress />
          Loading your Data...
        </div>
      ) : state.transactionStatus == state.possibleTransactionStatus[2] ? (
        <div>Problem in Loading Data. Refresh and try again .</div>
      ) : (
        <Graphs graphData={state.graphData} labels={state.comparisonLabels} />
      )}
    </div>
  );
}

export default InputHomePage;
