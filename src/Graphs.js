import React from "react";
import HeatMap from "./HeatMap";
import Histogram from "./Histogram";
import PieChart from "./PieChart";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import BarGraph from "./BarGraph";
import LineGraph from "./LineGraph";
import StackedBar from "./StackedBar";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.node.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  window: PropTypes.func
};

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

export default function Graphs(props) {
  const classes = useStyles();
  const [labelState, setlabelState] = React.useState({
    //These states defines which graph to be shown
    //in the page. These states are altered by the switches
    //at the auto-hide title bar of the page which contains
    //switches to modify each of them
    barGraph: true,
    lineGraph: false,
    pieChartHistogramHeatMap: false
  });

  const handleChange = name => event => {
    //This changes the state of labelSate based on
    //wether use has checked or unchecked a particular
    //switch
    setlabelState({ ...labelState, [name]: event.target.checked });
  };

  var pieChartHistogramHeatMapArray = []; //Each element of this array
  //contains PieChart, Histogram and Heatmap component. Each element of
  //this array corresponds to each sensor set selected in InputHomePage
  //in the same order

  for (var i = 0; i < props.graphData.length; i++) {
    pieChartHistogramHeatMapArray.push(
      <div style={{ borderWidth: "medium", display: "inline" }}>
        <HeatMap graphData={props.graphData[i]} />
        <PieChart graphData={props.graphData[i]} />
        <Histogram graphData={props.graphData[i]} />
      </div>
    );
  }

  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <HideOnScroll>
          <AppBar>
            <Toolbar>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={labelState.barGraph}
                      onChange={handleChange("barGraph")}
                      value="barGraph"
                      color="secondary"
                    />
                  }
                  label="Bar Graph"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={labelState.lineGraph}
                      onChange={handleChange("lineGraph")}
                      value="lineGraph"
                      color="secondary"
                    />
                  }
                  label="Line Graph"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={labelState.pieChartHistogramHeatMap}
                      onChange={handleChange("pieChartHistogramHeatMap")}
                      value="pieChartHistogramHeatMap"
                      color="secondary"
                    />
                  }
                  label="Pie Chart, Histogram and HeatMap"
                />
              </FormGroup>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar />
        <Container />
      </React.Fragment>

      {labelState.barGraph ? (
        props.graphData[0].data_type == "quantitative" ? (
          <BarGraph
            barGraphData={props.graphData}
            comparisonLabels={props.labels}
          />
        ) : (
          <StackedBar
            barGraphData={props.graphData}
            comparisonLabels={props.labels}
          />
        )
      ) : (
        <div />
      )}
      {labelState.lineGraph ? (
        <LineGraph
          lineGraphData={props.graphData}
          comparisonLabels={props.labels}
        />
      ) : (
        <div />
      )}
      {labelState.pieChartHistogramHeatMap ? (
        pieChartHistogramHeatMapArray
      ) : (
        <div />
      )}
    </div>
  );
}
