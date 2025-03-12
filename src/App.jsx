import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import * as turf from "@turf/turf";
import { ToastContainer} from "react-toastify";
import FileUploader from "./components/FileUploader";
import Summary from "./components/Summary";
import Details from "./components/Details";

function App() {
  const [geoData, setGeoData] = useState(null);
  const [summaryInfo, setSummaryInfo] = useState(null);
  const [detailedInfo, setDetailedInfo] = useState(null);
  const mapInstance = useRef();

  useEffect(() => {
    if (geoData && mapInstance.current) {
      try {
        const bbox = turf.bbox(geoData);
        const southWest = [bbox[1], bbox[0]];
        const northEast = [bbox[3], bbox[2]];
        mapInstance.current.fitBounds([southWest, northEast], { padding: [20, 20] });
      } catch (error) {
        console.error("Error adjusting map bounds:", error);
      }
    }
  }, [geoData]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="text-2xl font-bold text-gray-800 my-4">KML File Viewer</header>

      <FileUploader onDataLoad={setGeoData} setSummary={setSummaryInfo} setDetails={setDetailedInfo} />

      <div className="flex justify-between mt-4">
        <button onClick={() => setSummaryInfo(geoData)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Show Summary
        </button>
        <button onClick={() => setDetailedInfo(geoData)} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Show Details
        </button>
      </div>

      {summaryInfo && <Summary summaryData={summaryInfo} />}
      {detailedInfo && <Details detailsData={detailedInfo} />}

      <div className="mt-6 w-full max-w-3xl h-96">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          className="h-full w-full rounded-md shadow-md"
          whenCreated={(map) => (mapInstance.current = map)}
        >
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
