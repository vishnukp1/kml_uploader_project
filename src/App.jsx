import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as toGeoJSON from "togeojson";
import * as turf from "@turf/turf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);
  const mapRef = useRef();


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parser = new DOMParser();
      const kml = parser.parseFromString(text, "text/xml");

      try {
        const geoJson = toGeoJSON.kml(kml);
        setGeoJsonData(geoJson);
        setSummary(null);
        setDetails(null);
        toast.success("KML file successfully uploaded!");
      } catch (error) {
        console.error("Error parsing KML:", error);
        toast.error("Invalid KML file. Please upload a valid one.");
      }
    };
    reader.readAsText(file);
  };

 
  const handleSummary = () => {
    if (!geoJsonData) return;
    const counts = {};
    geoJsonData.features.forEach((feature) => {
      const geomType = feature.geometry.type;
      counts[geomType] = (counts[geomType] || 0) + 1;
    });
    setSummary(counts);
    toast.info("Summary generated successfully!");
  };


  const handleDetailed = () => {
    if (!geoJsonData) return;
    const detailsData = {};
    geoJsonData.features.forEach((feature) => {
      const geomType = feature.geometry.type;
      if (geomType === "LineString" || geomType === "MultiLineString") {
        const length = turf.length(feature, { units: "kilometers" });
        detailsData[geomType] = (detailsData[geomType] || 0) + length;
      }
    });
    setDetails(detailsData);
    toast.info("Detailed analysis completed!");
  };

  
  useEffect(() => {
    if (geoJsonData && mapRef.current) {
      try {
        const bbox = turf.bbox(geoJsonData);
        const southWest = [bbox[1], bbox[0]];
        const northEast = [bbox[3], bbox[2]];
        mapRef.current.fitBounds([southWest, northEast], { padding: [20, 20] });
      } catch (error) {
        console.error("Error adjusting map bounds:", error);
      }
    }
  }, [geoJsonData]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="text-2xl font-bold text-gray-800 my-4">KML File Viewer</header>

      <div className="w-full max-w-lg bg-white shadow-md p-4 rounded-md">
        <input
          type="file"
          accept=".kml"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-between">
          <button onClick={handleSummary} className="bg-blue-500 text-white px-4 py-2 rounded-md">Summary</button>
          <button onClick={handleDetailed} className="bg-green-500 text-white px-4 py-2 rounded-md">Detailed</button>
        </div>
      </div>

      {summary && (
        <div className="mt-6 w-full max-w-md bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-semibold">Summary</h2>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Geometry Type</th>
                <th className="border p-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([type, count]) => (
                <tr key={type}>
                  <td className="border p-2">{type}</td>
                  <td className="border p-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {details && (
        <div className="mt-6 w-full max-w-md bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-semibold">Detailed (Total Length in KM)</h2>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Geometry Type</th>
                <th className="border p-2">Total Length (KM)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(details).map(([type, length]) => (
                <tr key={type}>
                  <td className="border p-2">{type}</td>
                  <td className="border p-2">{length.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 w-full max-w-3xl h-96">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          className="h-full w-full rounded-md shadow-md"
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoJsonData && <GeoJSON data={geoJsonData} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;