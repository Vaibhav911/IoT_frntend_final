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

export default function HeatMap(props) {
  //Each heat map component is plotted per
  //sensor set selected in InputHomePage component

  var seriesData = []; //Each element of this array
  //stores label(sensorId). And if sensor set type is
  //quantitative, it initially stores mean value of all
  //time-frames that the user queried. Mean can be changed
  //to other stat type for quantitative value. However
  //for qualitative, only expected value make sense to be plotted.
  //There is no mean or median for such values.

  if (props.graphData.data_type == "quantitative") {
    for (var k = 0; k < props.graphData.length; k++) {
      seriesData.push({
        name: props.comparisonLabels.sensorList_Array[k].label,
        data: props.graphData[k].bar_data[0].values[0].mean
      });
    }
  } else {
    for (var k = 0; k < props.graphData.length; k++) {
      seriesData.push({
        name: props.comparisonLabels.sensorList_Array[k].label,
        data: props.graphData[k].bar_data[0].expected_values
      });
    }
  }

  seriesData = [];
  var quantType = {};
  if (props.graphData.data_type == "quantitative") {
    quantType.statType = "mean";
    quantType.attType = "0";
  } else {
    quantType.attType = "0";
  }
  const [values, setValues] = React.useState(quantType);

  const classes = useStyles();

  function handleChange(event) {
    //This changes the the stat type or
    //attribute type based on what user has
    //selected in drop down menus of
    //HeatMap component.
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  function generateData(sensor) {
    //This prepares the data that is passed
    //to be final heat-map graph.
    var i = 0;
    var series = [];
    if (props.graphData.data_type == "quantitative") {
      while (i < props.graphData.heat_map_data.data[0][sensor].mean.length) {
        var x = props.graphData.bar_data[0].labels[i];
        var y =
          props.graphData.heat_map_data.data[parseInt(values.attType)][sensor][
            values.statType
          ][i];
        series.push({
          x: x,
          y: y
        });
        i++;
      }
    } else {
      while (i < props.graphData.heat_map_data[0][0].length) {
        var x = props.graphData.labels[i];
        var y =
          props.graphData.heat_map_data[parseInt(values.attType)][sensor][i];
        series.push({
          x: x,
          y: y
        });
        i++;
      }
    }
    return series;
  }
  if (props.graphData.data_type == "quantitative") {
    for (var k = 0; k < props.graphData.heat_map_data.sensorIds.length; k++) {
      seriesData.push({
        name: "Sensor " + props.graphData.heat_map_data.sensorIds[k],
        data: generateData(k)
      });
    }
  } else {
    for (var k = 0; k < props.graphData.sensorIds.length; k++) {
      seriesData.push({
        name: "Sensor " + props.graphData.sensorIds[k],
        data: generateData(k)
      });
    }
  }

  const [state, setState] = React.useState({
    options: {
      enableShades: true,
      dataLabels: {
        enabled: true
      },
      colors: ["#008FFB"],

      title: {
        text: "HeatMap Chart (Single color)"
      }
    },
    series: [seriesData]
  });

  useEffect(() => {
    //Based on the stat type and attribute type selected by
    //the user from drop-down menus in this component, it will
    //change the data in the heat-map graph, and will re-render it.
    seriesData = [];
    if (props.graphData.data_type == "quantitative") {
      for (var k = 0; k < props.graphData.heat_map_data.sensorIds.length; k++) {
        seriesData.push({
          name: "Sensor " + props.graphData.heat_map_data.sensorIds[k],
          data: generateData(k)
        });
      }
    } else {
      for (var k = 0; k < props.graphData.sensorIds.length; k++) {
        seriesData.push({
          name: "Sensor " + props.graphData.sensorIds[k],
          data: generateData(k)
        });
      }
    }

    setState({
      options: {
        enableShades: true,
        dataLabels: {
          enabled: true
        },
        colors: ["#008FFB"],
        title: {
          text: "HeatMap Chart (Single color)"
        }
      },
      series: seriesData
    });
  }, [values]);

  var menuItemArray = [];

  //This conditional blocks creates the drop-down menu
  //that includes stat type and attribute type based
  //on wether sensor set data type is qualitative or
  //quantitative
  if (props.graphData.data_type == "quantitative") {
    let attributeArray = []; //It's stores all the attributes of current set of sensors
    //and render them

    for (var i = 0; i < props.graphData.attributes.length; i++) {
      attributeArray.push(
        <MenuItem value={JSON.stringify(i)}>
          {props.graphData.attributes[i].charAt(0).toUpperCase() +
            props.graphData.attributes[i].slice(1)}
        </MenuItem>
      );
    }
    menuItemArray.push(
      <div>
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="statType-helper">StatType</InputLabel>
            <Select
              value={values.statType}
              onChange={handleChange}
              input={<Input name="statType" id="statType-helper" />}
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
            <InputLabel htmlFor="attType-helper">Attribute</InputLabel>
            <Select
              value={values.attType}
              onChange={handleChange}
              input={<Input name="attType" id="attType-helper" />}
            >
              {attributeArray}
              {/* <MenuItem value="0">
                {props.graphData.attributes[0].charAt(0).toUpperCase() +
                  props.graphData.attributes[0].slice(1)}
              </MenuItem>
              <MenuItem value="1">
                {props.graphData.attributes[1].charAt(0).toUpperCase() +
                  props.graphData.attributes[1].slice(1)}
              </MenuItem>
              <MenuItem value="2">
                {props.graphData.attributes[2].charAt(0).toUpperCase() +
                  props.graphData.attributes[2].slice(1)}
              </MenuItem> */}
            </Select>
            <FormHelperText>Select any Attribute</FormHelperText>
          </FormControl>
        </form>
      </div>
    );
  } else {
    let attributeArray = [];
    for (var i = 0; i < props.graphData.attributes.length; i++) {
      attributeArray.push(
        <MenuItem value={JSON.stringify(i)}>
          {props.graphData.attributes[i].charAt(0).toUpperCase() +
            props.graphData.attributes[i].slice(1)}
        </MenuItem>
      );
    }
    menuItemArray.push(
      <div>
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="statType-helper">StatType</InputLabel>
            <Select
              value={values.statType}
              onChange={handleChange}
              input={<Input name="statType" id="statType-helper" />}
            >
              <MenuItem value="expected_values">Expectedvalue</MenuItem>
            </Select>
            <FormHelperText>Select any Stat type</FormHelperText>
          </FormControl>
        </form>

        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="attType-helper">Attribute</InputLabel>
            <Select
              value={values.attType}
              onChange={handleChange}
              input={<Input name="attType" id="attType-helper" />}
            >
              {attributeArray}
              {/* <MenuItem value="0">
                {props.graphData.attributes[0].charAt(0).toUpperCase() +
                  props.graphData.attributes[0].slice(1)}
              </MenuItem>
              <MenuItem value="1">
                {props.graphData.attributes[1].charAt(0).toUpperCase() +
                  props.graphData.attributes[1].slice(1)}
              </MenuItem> */}
            </Select>
            <FormHelperText>Select any Attribute</FormHelperText>
          </FormControl>
        </form>
      </div>
    );
  }

  return (
    <div id="chart">
      {menuItemArray}
      <Chart
        options={state.options}
        series={state.series}
        type="heatmap"
        height="350"
      />
    </div>
  );
}
