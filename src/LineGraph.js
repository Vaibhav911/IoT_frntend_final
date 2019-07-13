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

var seriesData = []; // this variable stores all the line graph data
//which is used by this component for plotting purposes.
//Each element of this array stores label and data for each sensor set
//A sensor set contains all the sensors that were selected in one CampusList component
//Each set represents aggregation of all those sensors.

export default function LineGraph(props) {
  seriesData = [];
  if (props.lineGraphData[0].data_type == "quantitative") {
    for (var k = 0; k < props.lineGraphData.length; k++) {
      seriesData.push({
        name: props.comparisonLabels.sensorList_Array[k].label,
        data: props.lineGraphData[k].bar_data[0].values[0].mean
      });
    }
  } else {
    for (var k = 0; k < props.lineGraphData.length; k++) {
      seriesData.push({
        name: props.comparisonLabels.sensorList_Array[k].label,
        data: props.lineGraphData[k].bar_data[0].expected_values
      });
    }
  }

  const [state, setState] = React.useState({
    options: {
      chart: {
        shadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 1
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Average High & Low Temperature",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 6
      },
      xaxis: {
        categories:
          props.lineGraphData[0].data_type == "quantitative"
            ? props.lineGraphData[0].bar_data[0].labels
            : props.lineGraphData[0].labels,
        title: {
          text: "Month"
        }
      },
      yaxis: {
        title: {
          text: "Temperature"
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    },
    series: seriesData
  });

  var selectStatType = {}; //This object stores stat type
  //and attribute type for all the sensor sets

  var dataType = props.lineGraphData[0].data_type;
  if (dataType == "quantitative") {
    for (var i = 0; i < props.lineGraphData.length; i++) {
      var statType = "statType" + JSON.stringify(i);
      var attribute = "attribute" + JSON.stringify(i);
      selectStatType[statType] = "mean";
      selectStatType[attribute] = props.lineGraphData[i].attributes[0];
    }
  } else {
    for (var i = 0; i < props.lineGraphData.length; i++) {
      var statType = "statType" + JSON.stringify(i);
      var attribute = "attribute" + JSON.stringify(i);
      selectStatType[statType] = "expected_values";
      selectStatType[attribute] = props.lineGraphData[i].attributes[0];
    }
  }

  const [statState, setStatState] = React.useState(selectStatType);

  const classes = useStyles();

  function handleChange(event) {
    ////This changes the state based on what
    //stat type or attribute user has selected
    setStatState(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  var statTypeComponent = []; //This create stat type drop-down menu
  //and attribute drop-down menu for each sensor set

  if (dataType == "quantitative") {
    for (var i = 0; i < props.lineGraphData.length; i++) {
      let attributeArray = [];
      for (var j = 0; j < props.lineGraphData[i].attributes.length; j++) {
        attributeArray.push(
          <MenuItem value={props.lineGraphData[i].attributes[j]}>
            {props.lineGraphData[i].attributes[j].charAt(0).toUpperCase() +
              props.lineGraphData[i].attributes[j].slice(1)}
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
                {attributeArray}
              </Select>
              <FormHelperText>Select any Attribute</FormHelperText>
            </FormControl>
          </form>
        </div>
      );
    }
  } else {
    for (var i = 0; i < props.lineGraphData.length; i++) {
      let attributeArray = [];
      for (var j = 0; j < props.lineGraphData[i].attributes.length; j++) {
        attributeArray.push(
          <MenuItem value={props.lineGraphData[i].attributes[j]}>
            {props.lineGraphData[i].attributes[j].charAt(0).toUpperCase() +
              props.lineGraphData[i].attributes[j].slice(1)}
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
                <MenuItem value="expected_values">Expectedvalue</MenuItem>
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
                {attributeArray}
              </Select>
              <FormHelperText>Select any Attribute</FormHelperText>
            </FormControl>
          </form>
        </div>
      );
    }
  }

  useEffect(() => {
    //this is used to change the line graph data every time
    //user changes either stats type or attribute type
    seriesData = [];

    if (props.lineGraphData[0].data_type == "quantitative") {
      for (var k = 0; k < props.lineGraphData.length; k++) {
        var statType = statState["statType" + JSON.stringify(k)];
        var attribute = statState["attribute" + JSON.stringify(k)];
        var attributeIndex = 0;
        for (var i = 0; i < props.lineGraphData[k].attributes.length; i++) {
          if (attribute.toLowerCase() == props.lineGraphData[k].attributes[i]) {
            attributeIndex = i;
            break;
          }
        }
        seriesData.push({
          name: props.comparisonLabels.sensorList_Array[k].label,
          data:
            props.lineGraphData[k].bar_data[0].values[attributeIndex][statType]
        });
      }
    } else {
      for (var k = 0; k < props.lineGraphData.length; k++) {
        var statType = statState["statType" + JSON.stringify(k)];
        var attribute = statState["attribute" + JSON.stringify(k)];
        var attributeIndex = 0;
        for (var i = 0; i < props.lineGraphData[k].attributes.length; i++) {
          if (attribute == props.lineGraphData[k].attributes[i]) {
            attributeIndex = i;
            break;
          }
        }
        seriesData.push({
          name: props.comparisonLabels.sensorList_Array[k].label,
          data: props.lineGraphData[k].bar_data[attributeIndex].expected_values
        });
      }
    }

    setState({
      options: {
        chart: {
          shadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 1
          },
          toolbar: {
            show: false
          }
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: "Average High & Low Temperature",
          align: "left"
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        markers: {
          size: 6
        },
        xaxis: {
          categories:
            props.lineGraphData[0].data_type == "quantitative"
              ? props.lineGraphData[0].bar_data[0].labels
              : props.lineGraphData[0].labels,
          title: {
            text: "Month"
          }
        },
        yaxis: {
          title: {
            text: "Temperature"
          }
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      },
      series: seriesData
    });
  }, [statState]);

  return (
    <div id="chart">
      {statTypeComponent}

      {props.lineGraphData[0].data_type == "qualitative" ? (
        <div>
          {JSON.stringify(props.lineGraphData[0].bar_data[0].enumeration)}
        </div>
      ) : (
        <div />
      )}

      <Chart
        options={state.options}
        series={state.series}
        type="line"
        height="500"
      />
    </div>
  );
}
