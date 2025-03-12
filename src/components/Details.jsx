import React, { useEffect, useState } from "react";
import * as turf from "@turf/turf";
import { toast } from "react-toastify";

const Details = ({ detailsData }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!detailsData) return;

    const detailsInfo = {};
    detailsData.features.forEach((feature) => {
      const geomType = feature.geometry.type;
      if (geomType === "LineString" || geomType === "MultiLineString") {
        const length = turf.length(feature, { units: "kilometers" });
        detailsInfo[geomType] = (detailsInfo[geomType] || 0) + length;
      }
    });

    setDetails(detailsInfo);
    toast.info("Detailed analysis completed!");
  }, [detailsData]);

  if (!details) return null;

  return (
    <div className="mt-6 w-full max-w-md bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold">Details (Total Length in KM)</h2>
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
  );
};

export default Details;
