import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../redux/actions/authActions";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { fetchAllUsers } from "../redux/actions/alluserGet";
import { fetchAllContent } from "../redux/actions/allContentGet.js";
import CryptoJS from "crypto-js";

const Infoprofile = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const userData = useSelector((state) => state.auth.userData);
  const { content } = useSelector((state) => state.content);

  const { users, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllUsers());
    dispatch(fetchAllContent());
  }, [dispatch]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Filtering users with role "Partner"
  const partnerUsers = users
    ? users.filter((user) => user.roles && user.roles.includes("Partner"))
    : [];
  const cardClass = `${
    darkMode ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-black"
  }`;

  // Get userId from local storage
  let userId = null;
  const encryptedId = localStorage.getItem("userId");
  if (encryptedId) {
    const bytes = CryptoJS.AES.decrypt(
      encryptedId,
      "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
    );
    userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Extract challenges and modules
  const challenges = content?.data?.challenges || [];
  const modules = content?.data?.modules || [];

  // Combine both into a single array and filter by userId
  const allContents = [...challenges, ...modules];
  const userUploadedContents = allContents.filter(
    (item) => item.uploaded_by?._id === userId
  );

  // Total content count for user's uploads
  const totalContents = userUploadedContents.length;

  // Count approved content for user's uploads
  const totalApproved = userUploadedContents.filter(
    (item) => item.isApproved === "approved"
  ).length;

  // Calculate progress percentage for user's uploads
  const progress =
    totalContents > 0 ? (totalApproved / totalContents) * 100 : 0;

  return (
    <section
      className="gap-4 flex flex-col w-1/2"
      onClick={() => {
        localStorage.setItem("activeComponent", "Rolemanagement");
        window.location.reload();
      }}
    >
      <div className="flex gap-3 h-full">
        <div
          className={`card flex flex-col w-1/2 overflow-hidden p-5 relative ${cardClass}`}
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#D9AA58",
          }}
        >
          <span className="text-2xl font-bold text-white">
            {userData?.firstName || "N/A"} {userData?.lastName || ""}
          </span>
          <span className="text-2xl font-bold text-white">
            {userData?.roles?.[0] || "No Role"}
          </span>
          {userData?.image && (
            <img
              src={`${
                process.env.REACT_APP_STATIC_API_URL
              }${userData.image.replace(
                "/root/happme_adminuser_management",
                ""
              )}`}
              alt="Notification"
              className="w-[100px] absolute ml-[150px] "
            />
          )}

          <div className="pl-[20px] pr-[20px] pt-[15px] h-1/4 absolute bottom-0 left-0 w-full bg-[#FFFFFF] flex justify-between">
            {/* <div>
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="50" height="50" rx="6" fill="#D9D9D9" />
                            </svg>
                        </div> */}
            <div className="flex flex-col desination gap-2">
              <span>{userData?.department || "No Department"}</span>
              <span>{userData?.company || "No Company"}</span>
            </div>
          </div>
        </div>
        <div
          className={`card flex flex-col w-1/2 overflow-hidden items-center justify-center gap-10 relative ${cardClass}`}
        >
          <div className="flex flex-col h-full items-center pb-5 justify-evenly w-full">
            <h1 className="text-lg text-left">My Uploads</h1>
            <div className="relative w-[200px] ">
              <CircularProgressbar
                value={progress}
                strokeWidth={15} // Increased stroke width
                styles={buildStyles({
                  rotation: 0.6,
                  strokeLinecap: "butt",
                  pathColor: "#C0D838", // Approved color
                  trailColor: "#FF8C78", // Rejected color
                  textSize: "16px",
                })}
              />

              {/* Display text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-2xl  mt-[-50px]">
                <span>{totalContents}</span>
                <span className="text-xs">Total Content</span>
              </div>
              <div className="flex flex-row w-full">
                <div className="w-1/2 flex text-xs">Approved Content</div>
                <div className="w-1/2 flex text-xs">Rejected Content</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Infoprofile;
