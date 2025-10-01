import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Button, Dropdown, Menu } from "antd";
import { useSelector } from "react-redux";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const data = [
  { name: "Jan", active: 1, inactive: 1 },
  { name: "Feb", active: 1, inactive: 1 },
  { name: "Mar", active: 1, inactive: 1 },
  { name: "Apr", active: 1, inactive: 1 },
  { name: "May", active: 1, inactive: 1 },
  { name: "Jun", active: 1, inactive: 2 },
  { name: "Jul", active: 1, inactive: 1 },
  { name: "Aug", active: 1, inactive: 1 },
  { name: "Sep", active: 1, inactive: 1 },
  { name: "Oct", active: 1, inactive: 1 },
  { name: "Nov", active: 1, inactive: 1 },
  { name: "Dec", active: 1, inactive: 1 },
];

const UserActivityChart = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const cardClass = `${
    darkMode ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-black"
  }`;

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState("Last month");

  const menu = (
    <Menu
      onClick={(e) => setSelectedRange(e.key)}
      items={[
        { key: "Last month", label: "Last month" },
        { key: "Last 3 months", label: "Last 3 months" },
        { key: "Last year", label: "Last year" },
      ]}
    />
  );

  return (
    <section className="gap-4 flex flex-col w-1/2">
      <div
        title="User Activity"
        className={`card flex flex-col align-center p-4 pt-4 pb-4 justify-center w-full ${cardClass}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold ">Event Activity</h1>
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
                    {startDate
                      ? dayjs(startDate).format("YYYY-MM-DD")
                      : "Start Date"}
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
            <div
              className={` top-4 right-4 ${
                darkMode ? "bg-zinc-800 text-white" : "bg-slate-100 text-black"
              }`}
            >
              <select
                className={`px-3 py-1 rounded-md rounded-xl border border-gray-600 ${
                  darkMode
                    ? "bg-zinc-800 text-white"
                    : "bg-slate-100 text-black"
                }`}
              >
                <option value="daily">Last month</option>
                <option value="weekly">Last week</option>
                <option value="monthly">Last year</option>
              </select>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#ddd" strokeWidth={0.1} />
            <YAxis stroke="#ddd" strokeWidth={0.1} />
            <Tooltip />
            {/* <Legend /> */}
            <Bar
              dataKey="active"
              stackId="a"
              fill="#52c41a"
              stroke="none"
              barSize={5}
            />
            <Bar
              dataKey="inactive"
              stackId="a"
              fill="#ff7875"
              stroke="none"
              barSize={5}
            />
          </BarChart>
        </ResponsiveContainer>

        <div
          style={{
            color: "#52c41a",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: 16,
          }}
        >
          +2% <span style={{ color: "white" }}>Since last month</span>
        </div>
      </div>
    </section>
  );
};

export default UserActivityChart;
