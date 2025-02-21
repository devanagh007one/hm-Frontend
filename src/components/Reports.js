import React, { useState } from "react";
import * as d3 from "d3";

import { useSelector } from 'react-redux';
import backgroundimage from '../Images/backgroundreport.png';
import { IconDownload } from '@tabler/icons-react';
import { DatePicker } from "antd";
import dayjs from "dayjs";

const Reports = () => {

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const cardClass = `${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`;


  // Data points for the line chart
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Data points for the line chart
  const svgWidth = 550; // Total width of the SVG
  const totalPoints = 7; // Number of data points
  const spacing = svgWidth / (totalPoints + 1); // Calculate even spacing

  const dataPoints = [
    // { y: 120, value: 200, label: "Sun" },
    // { y: 90, value: 450, label: "Mon" },
    // { y: 70, value: 350, label: "Tue" },
    // { y: 110, value: 400, label: "Wed" },
    // { y: 150, value: 250, label: "Thu" },
    // { y: 100, value: 300, label: "Fri" },
    // { y: 130, value: 350, label: "Sat" },
    { y: 100, value: 0, label: "Sun" },
    { y: 100, value: 0, label: "Mon" },
    { y: 100, value: 0, label: "Tue" },
    { y: 100, value: 0, label: "Wed" },
    { y: 100, value: 0, label: "Thu" },
    { y: 100, value: 0, label: "Fri" },
    { y: 100, value: 0, label: "Sat" },
  ].map((point, index) => ({
    ...point,
    x: (index + 1) * spacing, // Assign dynamic x positions
  }));


  const handleMouseEnter = (point) => {
    setHoveredPoint(point);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const generatePath = (points) => {
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5)); // Adjust alpha for sharpness

    return lineGenerator(points);
  };


  return (
    <div className={`datepicker p-6 rounded-2xl shadow-lg w-[480px] h-[300px] relative ${darkMode ? 'bg-zinc-800 ' : 'bg-slate-100 text-black'}`}>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold ">User Update</h1>
        <div className="flex gap-2">
          <div className="flex gap-4">
            {/* Start Date Button */}
            <div className="flex gap-4">
              {/* Start Date Button */}
              <div>
                <button
                  className="text-sm rounded-lg border p-1"
                  onClick={() => setOpenStart(true)}
                >
                  {startDate ? dayjs(startDate).format("YYYY-MM-DD") : "Start Date"}
                </button>
                {openStart && (
                  <DatePicker
                    open={openStart}
                    onOpenChange={(open) => setOpenStart(open)}
                    onChange={(date) => {
                      setStartDate(date);
                      setOpenStart(false); // Close calendar after selection
                    }}
                  />
                )}
              </div>

              {/* End Date Button */}
              <div>
                <button
                  className="text-sm rounded-lg border p-1"
                  onClick={() => setOpenEnd(true)}
                >
                  {endDate ? dayjs(endDate).format("YYYY-MM-DD") : "End Date"}
                </button>
                {openEnd && (
                  <DatePicker
                    open={openEnd}
                    onOpenChange={(open) => setOpenEnd(open)}
                    onChange={(date) => {
                      setEndDate(date);
                      setOpenEnd(false); // Close calendar after selection
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={` top-4 right-4 ${darkMode ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-black'}`}>
            <select className={`px-3 py-1 rounded-md rounded-xl border border-gray-600 ${darkMode ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-black'}`} >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Line graph */}
        <svg
          viewBox="0 0 550 200"
          className="w- h-48 ml-[-50px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Line path */}
          <path
            d={generatePath(dataPoints)}
            fill="none"
            stroke="#FF855A"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#FF855A"
              onMouseEnter={() => handleMouseEnter(point)}
              onMouseLeave={handleMouseLeave}
              className="cursor-pointer"
            />
          ))}
        </svg>
        {/* Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              top: `${hoveredPoint.y - 30}px`,
              left: `${hoveredPoint.x - 40}px`,
            }}
            className="absolute bg-orange-500 text-xs px-2 py-1 rounded-lg shadow-md"
          >
            {hoveredPoint.value}
          </div>
        )}
      </div>
      <div className="flex justify-between text-sm mt-0">
        {dataPoints.map((point, index) => (
          <span key={index}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

export default Reports;
