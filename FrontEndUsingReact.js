import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

const ENDPOINT = "http://localhost:5000"; // Or your deployed server
const socket = socketIOClient(ENDPOINT);

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch initial data
    axios.get(`${ENDPOINT}/api/data`).then((res) => {
      setData(res.data);
    });

    // Real-time data listener
    socket.on("new-data", (newEntry) => {
      setData((prevData) => [newEntry, ...prevData.slice(0, 19)]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>IoT Live Dashboard</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Device</th>
            <th>Temp (°C)</th>
            <th>Humidity (%)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.deviceId}</td>
              <td>{entry.temperature}</td>
              <td>{entry.humidity}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
