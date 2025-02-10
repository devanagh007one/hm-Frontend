import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProductivityCard = () => {
  const totalTasks = 200; // Example total task count
  const completedTasks = 78; // Example completed tasks
  const remainingTasks = totalTasks - completedTasks;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <div className="bg-zinc-800 text-zinc-300 text-white p-6 rounded-2xl shadow-lg w-[450px] h-[300px] relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg ">Productivity Level</h2>
        <span className="text-green-400 text-lg">+15%</span>
      </div>

      {/* Half Circular Progress */}
      <div className="relative w-full mt-4 flex justify-center">
        <div className=" h-[10rem] overflow-hidden">
          <CircularProgressbar
            value={progress}
            strokeWidth={10}
            styles={buildStyles({
              rotation: 0.73, // Rotates to create a semi-circle effect
              strokeLinecap: "butt", // Square stroke effect
              pathColor: "#C0D838",
              trailColor: "#FF8C78",
              textSize: "16px",
              textColor: "#fff",
            })}
          />
        </div>

        {/* Centered Text */}
        <div className="absolute top-1/2 transform -translate-y-1/2 text-center">
          <p className="text-3xl font-bold">{remainingTasks}</p>
          <p className="text-gray-400">Task remaining</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between text-sm text-gray-400 mt-6">
        <span className="text-green-400">Completed</span>
        <span className="text-red-400">Pending</span>
      </div>

      {/* Dropdown */}
      <div className="absolute top-4 right-4">
        <select className="bg-gray-700 px-3 py-1 rounded-md text-white">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
    </div>
  );
};

export default ProductivityCard;
