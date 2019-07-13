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

export default function StackedBar(props) {
  const classes = useStyles();

  var seriesData = []; // this variable stores all the bar graph data
  //which is used by this component for plotting purposes.
  //This array stores objects for the data of each and every set
  //A set is a sensor set of all the sensors that were selected in one CampusList component
  //Each set represents aggregation of all those sensors.

  var selectStatType = {}; //This object stores stat type
  //and attribute type for all the sensor sets

  for (var i = 0; i < props.barGraphData.length; i++) {
    var statType = "statType" + JSON.stringify(i);
    var attribute = "attribute" + JSON.stringify(i);
    selectStatType[statType] = "percentage";
    selectStatType[attribute] = props.barGraphData[i].attributes[1];
  }
  const [statState, setStatState] = React.useState(selectStatType);

  for (var i = 0; i < props.barGraphData[0].bar_data.length; i++) {
    seriesData.push({
      name: props.barGraphData[0].bar_data[i].percentage
    });
  }

  const [state, setState] = React.useState({
    options: {
      chart: {
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "datetime",
        categories: props.barGraphData[0].labels
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    },
    series: [
      {
        name: "False",
        data: props.barGraphData[0].bar_data[0].non_percentage.false
      },
      {
        name: "True",
        data: props.barGraphData[0].bar_data[0].non_percentage.true
      }
    ]
  });

  useEffect(() => {
    seriesData = [];
    var statType = statState["statType" + JSON.stringify(0)];
    var attribute = statState["attribute" + JSON.stringify(0)];
    var attributeIndex = 0;
    for (var i = 0; i < props.barGraphData[0].attributes.length; i++) {
      if (attribute == props.barGraphData[0].attributes[i]) {
        attributeIndex = i;
        break;
      }
    }
    seriesData.push({
      name: props.comparisonLabels.sensorList_Array[0].label,
      data: props.barGraphData[0].bar_data[attributeIndex][statType]
    });

    setState({
      options: {
        chart: {
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          type: "datetime",
          categories: props.barGraphData[0].labels
        },
        legend: {
          position: "right",
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      },
      series: [
        {
          name: "False",
          data: props.barGraphData[0].bar_data[attributeIndex][statType].false
        },
        {
          name: "True",
          data: props.barGraphData[0].bar_data[attributeIndex][statType].true
        }
      ]
    });
  }, [statState]);

  var statTypeComponent = []; //This create stat type drop-down menu
  //and attribute drop-down menu for each sensor set

  for (var i = 0; i < props.barGraphData.length; i++) {
    let attributeArray = [];
    for (var j = 0; j < props.barGraphData[0].attributes.length; j++) {
      attributeArray.push(
        <MenuItem value={props.barGraphData[0].attributes[j]}>
          {props.barGraphData[0].attributes[j].charAt(0).toUpperCase() +
            props.barGraphData[0].attributes[j].slice(1)}
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
              {/* <MenuItem value="expected_values">Expectedvalue</MenuItem> */}
              {/* If you want expected values to be plotted on stacked bar
              This will require some data manipulation here*/}
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="non_percentage">Non percentage</MenuItem>
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
  function handleChange(event) {
    setStatState(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

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
