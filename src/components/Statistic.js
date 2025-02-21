import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from '../redux/actions/allNotifications';
import { DatePicker } from "antd";
import dayjs from "dayjs";

const Statistic = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const cardClass = `${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`;
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
  console.log(dashboardData)


  return (
    <section className='gap-4 flex flex-col w-1/2 '>
      <div className={`card flex align-center p-4 pt-4 pb-4 justify-center w-full h-[300px] ${cardClass}`}>
        <section className='flex justify-between items-center w-full flex-col '>
          <div className=' flex flex-col justify-between items-center w-full h-full gap-3'>
            <div className="flex justify-between items-center mb-4 w-full">
              <h1 className="text-lg font-semibold ">KPI Stats</h1>
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
                    <option value="daily">Last 7 days</option>
                    <option value="weekly">Last month</option>
                    <option value="monthly">Last year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='w-full'>
              <svg width="auto" height="auto" viewBox="0 0 507 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M255 14.5L275.28 17.258C303.334 21.0734 330.857 28.0962 357.31 38.1886L379.75 46.75L444 75.5L501.5 93.5" stroke="url(#paint0_linear_296_207)" stroke-opacity="0.5" stroke-width="20" />
                <path d="M503.5 32L475.212 37.0919C460.763 39.6926 446.561 43.5124 432.757 48.5104L395.5 62L334.5 89L323.629 94.2392C303.469 103.955 281.379 109 259 109V109" stroke="url(#paint1_linear_296_207)" stroke-opacity="0.3" stroke-width="20" />
                <path d="M3 57L68.7432 77.5L127.016 89L180.805 100L223.5 107L259 109" stroke="url(#paint2_linear_296_207)" stroke-opacity="0.2" stroke-width="20" />
                <path d="M254.5 58L317 68.5L350 75.5L383 82L452.5 91.25L504 93.5" stroke="url(#paint3_linear_296_207)" stroke-width="21" />
                <path d="M4 58L115 62H123L189.5 59.5L257 58" stroke="url(#paint4_linear_296_207)" stroke-opacity="0.5" stroke-width="20" />
                <path d="M4 59.5L105.5 36L163.25 24.25L194.485 18.4012C215.414 14.4822 236.749 13.1718 258 14.5V14.5" stroke="url(#paint5_linear_296_207)" stroke-width="20" />
                <rect y="39" width="8" height="40" rx="4" fill="#F48567" />
                <rect x="255" width="4" height="30" rx="2" fill="#9FB8F7" />
                <rect x="255" y="43" width="4" height="30" rx="2" fill="#9FB8F7" />
                <rect x="255" y="94" width="4" height="30" rx="2" fill="#9FB8F7" />
                <rect x="499" y="70" width="8" height="40" rx="4" fill="#FFF27A" />
                <rect x="499" y="12" width="8" height="40" rx="4" fill="#FFF27A" />
                <defs>
                  <linearGradient id="paint0_linear_296_207" x1="255.5" y1="48.25" x2="503" y2="48.25" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#F48567" />
                    <stop offset="1" stop-color="#DD441B" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_296_207" x1="259" y1="70.5" x2="503.5" y2="70.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#9C810C" />
                    <stop offset="0.52" stop-color="#FFE266" />
                    <stop offset="1" stop-color="#9C810C" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_296_207" x1="6.98444" y1="88" x2="259" y2="88" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#F48567" />
                    <stop offset="1" stop-color="#DD441B" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_296_207" x1="254.5" y1="76.875" x2="504" y2="76.875" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#9C810C" />
                    <stop offset="0.52" stop-color="#FFE266" />
                    <stop offset="1" stop-color="#9C810C" />
                  </linearGradient>
                  <linearGradient id="paint4_linear_296_207" x1="5" y1="61.5" x2="254.5" y2="61.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#F48567" />
                    <stop offset="1" stop-color="#DD441B" />
                  </linearGradient>
                  <linearGradient id="paint5_linear_296_207" x1="7" y1="32.25" x2="258" y2="32.25" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6376B1" />
                    <stop offset="0.428166" stop-color="#9FB8F7" />
                  </linearGradient>
                </defs>
              </svg>

            </div>

            <div className="flex gap-4 mt-2 justify-center">
  {dashboardData?.data?.kpiStats.map((kpi, index) => {
    const colors = ["#F48567", "#9FB8F7", "#FFE266"]; // Define colors for KPIs
    return (
      <div key={index} className="flex items-center">
        <span
          className="h-4 w-4 inline-block rounded-md mr-2"
          style={{ background: colors[index] }}
        ></span>
        {kpi.name.replace(/KPI \d+ - /, "")} - {kpi.value}
      </div>
    );
  })}
</div>


          </div>
        </section>
      </div>
    </section>
  );
}

export default Statistic