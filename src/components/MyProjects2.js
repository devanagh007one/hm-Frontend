import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from '../redux/actions/allNotifications';

const ProductivityCard = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { dashboardData, error: licensingError } = useSelector((state) => state.dashnotifications);

  const totalTasks = dashboardData?.data?.tasks?.total || 0;
  const completedTasks = dashboardData?.data?.tasks?.completed || 0;
  const remainingTasks = dashboardData?.data?.tasks?.pending || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState("daily");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const last7Days = new Date();
    last7Days.setDate(new Date().getDate() - 7);
    const startDate = last7Days.toISOString().split("T")[0];

    let filterStartDate = today;
    if (selectedFilter === "monthly") {
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      filterStartDate = firstDayOfMonth.toISOString().split("T")[0];
    }

    dispatch(fetchDashboardData(filterStartDate, today));
  }, [dispatch, selectedFilter]);

  return (
    <div className={` p-6 rounded-2xl shadow-lg w-1/2 h-[300px] relative ${darkMode ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg ">Task Completions</h2>
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
            })}
          />
        </div>

        {/* Centered Text */}
        <div className="absolute top-1/2 transform -translate-y-1/2 text-center">
          <p className="text-3xl font-bold">{remainingTasks}</p>
          <p className="">Task remaining</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between text-sm  mt-6">
        <span className="text-green-400">Completed</span>
        <span className="text-red-400">Pending</span>
      </div>

      {/* Dropdown */}
      <div className={`absolute top-4 right-4 ${darkMode ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-black'}`}>
        <select className={`px-3 py-1 rounded-md rounded-xl border border-gray-600 ${darkMode ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-black'}`} value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
};

export default ProductivityCard;