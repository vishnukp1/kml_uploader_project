import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Summary = ({ summaryData }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!summaryData) return;

    const counts = {};
    summaryData.features.forEach((feature) => {
      const geomType = feature.geometry.type;
      counts[geomType] = (counts[geomType] || 0) + 1;
    });

    setSummary(counts);
    toast.info("Summary generated successfully!");
  }, [summaryData]);

  if (!summary) return null;

  return (
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
  );
};

export default Summary;
