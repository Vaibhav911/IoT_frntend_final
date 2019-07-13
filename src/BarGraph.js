import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

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

var seriesData = []; // this variable stores all the bar graph data
//which is used by this component for plotting purposes.
//This array stores objects for the data of each and every set
//A set is a sensor set of all the sensors that were selected in one CampusList component
//Each set represents aggregation of all those sensors.

export default function BarGraph(props) {
  // **This component renders grouped bar graphs for quantitative type only.**
  //This also has code for qualitative data types.
  //However ApexCharts don't support stacked grouped bar
  //graphs currently. So this won't allow comparison of quantitative
  //data type with qualitative one. This might be useful in future

  seriesData = [];
  if (props.barGraphData[0].data_type == "quantitative") {
    for (var k = 0; k < props.barGraphData.length; k++) {
      seriesData.push({
        name: props.comparisonLabels.sensorList_Array[k].label,
        data: props.barGraphData[k].bar_data[0].values[0].mean
      });
    }
  } //else the sensor data type will be qualitative
  else {
    for (var k = 0; k < props.barGraphData.length; k++) {
      seriesData.push({
        name: props.comparisonLabels.sensorList_Array[k].label,
        data: props.barGraphData[k].bar_data[0].percentage
      });
    }
  }

  const [state, setState] = React.useState({
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        // this is where the x axis labels(time stamps) of the bar graph are initialised
        //for sensor set 0 and attribute index 0 . Note labels in our case are same
        //for each and every sensor set and attribute
        // index as they have a common timeStamp labels
        categories: props.barGraphData[0].bar_data[0].labels
      }
    },
    series: seriesData // this initializes the data of the bar graphs for
    // the 0th attribute of given sensor type
  });

  var selectStatType = {}; // stores the statistitic type and attribute type which
  //the user inputs from the dropdown for all the senor sets.
  //By default its 'mean' and 0th attribute in case of quantitative sensor data type
  //and 'percentage' and 0th attribute for qualititative sensor data type.

  var dataType = props.barGraphData[0].data_type; //this is the sensor data type(qualt/quant)
  // for 0th sensor set. Current system restricts all the sets to have same
  //sensor data type(either all qualitative or all quantitative).However with some-modifcations
  //in python script and react, the system will allow users to compare qualititative with
  //quantitative also.

  if (dataType == "quantitative") {
    for (var i = 0; i < props.barGraphData.length; i++) {
      var statType = "statType" + JSON.stringify(i);
      var attribute = "attribute" + JSON.stringify(i);
      selectStatType[statType] = "mean";
      selectStatType[attribute] = props.barGraphData[i].attributes[0];
    }
  } else {
    for (var i = 0; i < props.barGraphData.length; i++) {
      var statType = "statType" + JSON.stringify(i);
      var attribute = "attribute" + JSON.stringify(i);
      selectStatType[statType] = "percentage";
      selectStatType[attribute] = props.barGraphData[i].attributes[0];
    }
  }
  const [statState, setStatState] = React.useState(selectStatType);

  const classes = useStyles();

  function handleChange(event) {
    //This changes the attribute type or statistics type
    //of the select statistics dropdown menu of any sensor set
    setStatState(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  var statTypeComponent = []; //This stores all the drop menus components
  //to select statistic type and attribute type for each set

  if (dataType == "quantitative") {
    for (var i = 0; i < props.barGraphData.length; i++) {
      let attributeItemArray = []; //It's stores all the attributes of current set of sensors
      //and render them
      for (var j = 0; j < props.barGraphData[i].attributes.length; j++) {
        attributeItemArray.push(
          <MenuItem value={props.barGraphData[i].attributes[j]}>
            {props.barGraphData[i].attributes[j].charAt(0).toUpperCase() +
              props.barGraphData[i].attributes[j].slice(1)}
          </MenuItem>
        );
      }
      statTypeComponent.push(
        <div>
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="statType-helper">StatType</InputLabel>
              <Select
                value={statState["statType" + JSON.stringify(i)]}
                onChange={handleChange}
                input={
                  <Input
                    name={"statType" + JSON.stringify(i)}
                    id={"statType-helper" + JSON.stringify(i)}
                  />
                }
              >
                <MenuItem value="mean">Mean</MenuItem>
                <MenuItem value="median">Median</MenuItem>
                <MenuItem value="max">Maximum</MenuItem>
                <MenuItem value="min">Minimum</MenuItem>
                <MenuItem value="variance">Variance</MenuItem>
                <MenuItem value="stddev">Stddev</MenuItem>
              </Select>
              <FormHelperText>Select any Stat type</FormHelperText>
            </FormControl>
          </form>

          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="attribute[i]-helper">
                {props.comparisonLabels.sensorList_Array[0].label}
              </InputLabel>
              <Select
                value={statState["attribute" + JSON.stringify(i)]}
                onChange={handleChange}
                input={
                  <Input
                    name={"attribute" + JSON.stringify(i)}
                    id={"attribute-helper" + JSON.stringify(i)}
                  />
                }
              >
                {attributeItemArray}
              </Select>
              <FormHelperText>Select any Attribute</FormHelperText>
            </FormControl>
          </form>
        </div>
      );
    }
  } else {
    for (var i = 0; i < props.barGraphData.length; i++) {
      let attributeItemArray = []; //It's stores all the attributes of current set of sensors
      //and render them
      for (var j = 0; j < props.barGraphData[i].attributes.length; j++) {
        attributeItemArray.push(
          <MenuItem value={props.barGraphData[i].attributes[j]}>
            {props.barGraphData[i].attributes[j].charAt(0).toUpperCase() +
              props.barGraphData[i].attributes[j].slice(1)}
          </MenuItem>
        );
      }
      statTypeComponent.push(
        <div>
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="statType-helper">StatType</InputLabel>
              <Select
                value={statState["statType" + JSON.stringify(i)]}
                onChange={handleChange}
                input={
                  <Input
                    name={"statType" + JSON.stringify(i)}
                    id={"statType-helper" + JSON.stringify(i)}
                  />
                }
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="nonpercentage">Non Percentage</MenuItem>
                <MenuItem value="expectedval">expectedval</MenuItem>
              </Select>
              <FormHelperText>Select any Stat type</FormHelperText>
            </FormControl>
          </form>

          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="attribute[i]-helper">
                {props.comparisonLabels.sensorList_Array[0].label}
              </InputLabel>
              <Select
                value={statState["attribute" + JSON.stringify(i)]}
                onChange={handleChange}
                input={
                  <Input
                    name={"attribute" + JSON.stringify(i)}
                    id={"attribute-helper" + JSON.stringify(i)}
                  />
                }
              >
                {attributeItemArray}
              </Select>
              <FormHelperText>Select any Attribute</FormHelperText>
            </FormControl>
          </form>
        </div>
      );
    }
  }

  useEffect(() => {
    //this is used to change the bargraph data every time
    //user changes either stats type or attribute type
    seriesData = [];
    for (var k = 0; k < props.barGraphData.length; k++) {
      var statType = statState["statType" + JSON.stringify(k)];
      var attribute = statState["attribute" + JSON.stringify(k)];
      var attributeIndex = 0; //This identifies the index of the attribute
      //that the user has selected among the array of attributes for a particular
      //sensor set
      for (var i = 0; i < props.barGraphData[k].attributes.length; i++) {
        if (attribute.toLowerCase() == props.barGraphData[k].attributes[i]) {
          attributeIndex = i;
          break;
        }
      }
      seriesData.push({
        name: props.comparisonLabels.sensorList_Array[k].label,
        data: props.barGraphData[k].bar_data[0].values[attributeIndex][statType]
      });
    }
    setState({
      options: {
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              position: "top"
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: "12px",
            colors: ["#fff"]
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          //x coordinates labels of time-frames
          //time-frame labels will be same for all the sets
          //because common timeperiod is selected for all sensor sets
          categories: props.barGraphData[0].bar_data[0].labels
        }
      },
      series: seriesData
    });
  }, [statState]);

  return (
    <div id="chart">
      {statTypeComponent}
      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        height="350"
      />
    </div>
  );
}
