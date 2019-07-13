import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
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

export default function Histogram(props) {
  //Each Histogram component is plotted per
  //sensor set selected in InputHomePage component

  var seriesData = {};
  if (props.graphData.data_type == "quantitative") {
    seriesData.name = props.graphData.histogram_data[0].labels[0];
    seriesData.data = props.graphData.histogram_data[0].counts[0];
  } else {
    seriesData.name = props.graphData.histogram_data[0].labels;
    seriesData.data = props.graphData.histogram_data[0].values;
  }

  const classes = useStyles();
  const [state, setState] = React.useState({
    options: {
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: seriesData.name
      }
    },
    series: [
      {
        data: seriesData.data
      }
    ]
  });

  const [values, setValues] = React.useState({
    attType: "0"
  });

  function handleChange(event) {
    //This change the attribute in the state
    //based on value selected by the user in the state.
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  useEffect(() => {
    //This changes the value in the histogram graph
    //based on the value selected by the user in drop-down
    //menu
    var seriesData = {};
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
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: seriesData.name
        }
      },
      series: [
        {
          data: seriesData.data
        }
      ]
    });
  }, [values.attType]);

  let attributeArray = []; //This renders the list of attributes
  //available(for current sensor type) in the drop-down menu.
  for (var i = 0; i < props.graphData.attributes.length; i++) {
    attributeArray.push(
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
            {attributeArray}
          </Select>
          <FormHelperText>Select any Attribute</FormHelperText>
        </FormControl>
      </form>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="histogram"
        height="350"
        width="40%"
      />
    </div>
  );
}
