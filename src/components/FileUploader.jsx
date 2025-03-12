import React from "react";
import * as toGeoJSON from "togeojson";
import { toast } from "react-toastify";

const FileUploader = ({ onDataLoad, setSummary, setDetails }) => {
  const processFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parser = new DOMParser();
      const kml = parser.parseFromString(text, "text/xml");

      try {
        const convertedGeoJSON = toGeoJSON.kml(kml);
        onDataLoad(convertedGeoJSON);
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

  return (
    <div className="w-full max-w-lg bg-white shadow-md p-4 rounded-md">
      <input type="file" accept=".kml" onChange={processFile} className="w-full p-2 border rounded-md mb-4" />
    </div>
  );
};

export default FileUploader;
