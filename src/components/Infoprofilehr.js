import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../redux/actions/authActions";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { fetchAllUsers } from "../redux/actions/alluserGet";
import { fetchAllContent } from "../redux/actions/allContentGet.js";
import CryptoJS from "crypto-js";
import { hrLicenseGet } from "../redux/actions/allLicensingGet.js";

const Infoprofile = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const userData = useSelector((state) => state.auth.userData);
  const { content } = useSelector((state) => state.content);

  const { users, error } = useSelector((state) => state.user);
  const { hrlicensing, error: licensingError } = useSelector(
    (state) => state.licensing
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllUsers());
    dispatch(fetchAllContent());
    dispatch(hrLicenseGet());
  }, [dispatch]);

  if (!userData) {
    return <div>Loading...</div>;
  }
  console.log(hrlicensing);

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
    <section className="gap-4 flex flex-col w-1/2">
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
            <div>
              {/* <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="50" height="50" rx="6" fill="#D9D9D9" />
                            </svg> */}
            </div>
            <div className="flex flex-col desination gap-2">
              <span>{userData?.department || "No Department"}</span>
              <span>{userData?.company || "No Company"}</span>
            </div>
          </div>
        </div>
        <div
          className={`card flex flex-col w-1/2 overflow-hidden items-start justify-center gap-4 relative text-xl `}
        >
          <span className="font-bold">
            Total Licenses : {hrlicensing?.totalLicenses}
          </span>
          <span className="font-bold">
            Licenses used : {hrlicensing?.assignedLicenses}
          </span>
          <span className="font-bold">
            Balance licenses : {hrlicensing?.remainingLicenses}
          </span>
          <span className="font-bold">License</span>
          <span className="text-[#F48567]">
            Alert Message Alert Message Alert Message
          </span>
          <div className="flex flex-col w-[70%]">
            <button className="bg-[#F48567] text-base px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#fff]">
              Contact Admin
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Infoprofile;
