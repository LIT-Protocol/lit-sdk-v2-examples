import './App.css';
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { useState } from 'react';

function App() {
  const [day, setDay] = useState("");
  const [temperature, setTemperature] = useState("NA");
  const [forecast, setForecast] = useState("NA");

  const runLitAction = async () => {
    if (day === "") {
      alert("Select a day first!");
      return;
    }

    const litActionCode = `
      const fetchWeatherApiResponse = async () => {
        const url = "https://api.weather.gov/gridpoints/LWX/97,71/forecast";
        let toSign;
        try {
          const response = await fetch(url).then((res) => res.json());
          const forecast = response.properties.periods[day];
          toSign = { temp: forecast.temperature + " " + forecast.temperatureUnit, shortForecast: forecast.shortForecast };
          const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
        } catch(e) {
          console.log(e);
        }
        LitActions.setResponse({ response: JSON.stringify(toSign) });
      };

      fetchWeatherApiResponse();
    `;

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
    const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
    await litNodeClient.connect();
    const { response } = await litNodeClient.executeJs({
      code: litActionCode,
      authSig,
      jsParams: {
        day: parseInt(day),
        publicKey: "0x042f6737a869c67f8bd39e7479e16567707e4dd57fd6c409125fff132215c5fbe6031fd696b778bc516ebc342dbb340ed8b297f5ccb79d480ae9c250def4f16a6a",
        sigName: "sig1",
      },
    });

    setTemperature(response.temp);
    setForecast(response.shortForecast);
  };

  const getDayFromValue = (dayValue) => {
    let dayText;
    switch (dayValue) {
      case "0":
        dayText = "Today";
        break;
      case "2":
        dayText = "Tomorrow";
        break;
      case "4":
        dayText = "Day After";
        break;
      default:
        dayText = "";
        break;
    }
    return dayText;
  };

  return (
    <div className="App">
      <h1>Signed Response from Weather API using Lit Actions</h1>
      {
        day === "" ? (
          <h2>Select day & hit run</h2>
        ) : (
          <h2>Day: {getDayFromValue(day)}</h2>
        )
      }
      <h2>Temperature: {temperature}</h2>
      <h2>Forecast: {forecast}</h2>
      
      {/*
        The values of the select below is hardcoded based on the weather api result.
        To get the forecast for a particular day we select the array element:
          0: Today's forecast
          2: Tomorrow's
          4: Day after's
      */}
      <select onChange={e => setDay(e.target.value)}>
        <option value="">Select</option>
        <option value="0">Today</option>
        <option value="2">Tomorrow</option>
        <option value="4">Day After</option>
      </select>
      <button onClick={runLitAction}>Run Lit Actions</button>
    </div>
  );
}

export default App;
