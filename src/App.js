import React from "react";
import "./App.css";
import InputHomePage from "./InputHomePage";
import { Route, BrowserRouter } from "react-router-dom";
import AddSensor from "./AddSensor";

window.clientQuery = {
  //the global variable which stores all the parameters
  //the user has input in the InputHomePage component.
  //This is declared globally because
  //we have to use this data back in the component InputHomePage
  //which render the successive child component CampusList component
  //for whom data is sent as props. To get this data back from all the child components
  // global variable is very convinient to use.
  sensorList_Array: [{ sensorList: [], label: "", sensorType: "" }],
  startTime: "",
  endTime: "",
  frequency: ""
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route
            exact={true}
            path="/"
            render={() => (
              <div>
                <InputHomePage />
              </div>
            )}
          />
          <Route
            exact={true}
            path="/addsensor"
            render={() => (
              <div>
                <AddSensor />
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
