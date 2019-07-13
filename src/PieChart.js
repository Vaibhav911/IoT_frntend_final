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

var seriesData = {};

export default function PieChart(props) {
  //Each pie-chart component is plotted per
  //sensor set selected in InputHomePage component
  const classes = useStyles();

  seriesData = {}; //This object stores the labels and
  //values to be plotted on the pie chart

  if (props.graphData.data_type == "quantitative") {
    seriesData.name = props.graphData.histogram_data[0].labels[0];
    seriesData.data = props.graphData.histogram_data[0].counts[0];
  } else {
    seriesData.name = props.graphData.histogram_data[0].labels;
    seriesData.data = props.graphData.histogram_data[0].values;
  }

  const [state, setState] = React.useState({
    options: {
      labels: seriesData.name,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    },
    series: seriesData.data
  });
  const [values, setValues] = React.useState({
    attType: "0"
  });

  function handleChange(event) {
    //This changes the state according to the
    //attribute selected by the user from the drop-down
    //menu in this component
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  useEffect(() => {
    //This passes the new data to be plotted to the graph
    //based on the attribute selected by the user.
    seriesData = {};
    if (props.graphData.data_type == "quantitative") {
      seriesData.name =
        props.graphData.histogram_data[0].labels[parseInt(values.attType)];
      seriesData.data =
        props.graphData.histogram_data[0].counts[parseInt(values.attType)];
    } else {
      seriesData.name =
        props.graphData.histogram_data[parseInt(values.attType)].labels;
      seriesData.data =
        props.graphData.histogram_data[parseInt(values.attType)].values;
    }

    setState({
      options: {
        labels: seriesData.name,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      },
      series: seriesData.data
    });
  }, [values.attType]);

  var menuItemArray = []; //Each element of this array contains attribute
  //that the sensor type has, and it will render them in a drop-down menu.

  for (var i = 0; i < props.graphData.attributes.length; i++) {
    menuItemArray.push(
      <MenuItem value={JSON.stringify(i)}>
        {props.graphData.attributes[i].charAt(0).toUpperCase() +
          props.graphData.attributes[i].slice(1)}
      </MenuItem>
    );
  }

  return (
    <div id="chart">
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="attType-helper">Attribute</InputLabel>
          <Select
            value={values.attType}
            onChange={handleChange}
            input={<Input name="attType" id="attType-helper" />}
          >
            {menuItemArray}
          </Select>
          <FormHelperText>Select any Attribute</FormHelperText>
        </FormControl>
      </form>
      <Chart
        options={state.options}
        series={state.series}
        type="pie"
        width="600"
      />
    </div>
  );
}
