import React, { useState, useMemo, useEffect } from "react";
import {
  fetchAllUsers,
  deleteUser,
  toggleUserStatus,
} from "../../redux/actions/alluserGet";
import { fetchUsers } from "../../redux/actions/authActions";

import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Badge,
  Button,
  Space,
  Pagination,
  Select,
  Spin,
  Card,
} from "antd";
import UserManagementFormhr from "../UserManagementFormhr.js";
import { showNotification } from "../../redux/actions/notificationActions"; // Import showNotification
import EyeForm from "./EyeFormhr";
import AsignTeam from "./AsignTeam.js";
import EdituserForm from "../EdituserForm";
import CryptoJS from "crypto-js";

import { IconSearch } from "@tabler/icons-react";

const SvgIcon = ({ onClick }) => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick} // Add the onClick handler here
    style={{ cursor: "pointer" }} // Optional: Makes it clear it's clickable
  >
    <g clip-path="url(#clip0_3004_430)">
      <path
        d="M6.35996 4.18999C6.29675 4.25232 6.26089 4.3372 6.26026 4.42597C6.25964 4.51474 6.2943 4.60012 6.35663 4.66333C6.41895 4.72654 6.50384 4.7624 6.5926 4.76302C6.68137 4.76365 6.76675 4.72899 6.82996 4.66666L8.08329 3.42666V9.38999C8.08329 9.4784 8.11841 9.56318 8.18092 9.6257C8.24344 9.68821 8.32822 9.72333 8.41663 9.72333C8.50503 9.72333 8.58982 9.68821 8.65233 9.6257C8.71484 9.56318 8.74996 9.4784 8.74996 9.38999V3.42666L9.98329 4.66666C10.0144 4.69752 10.0512 4.72196 10.0917 4.73858C10.1323 4.75519 10.1757 4.76367 10.2195 4.76351C10.2633 4.76336 10.3066 4.75458 10.347 4.73767C10.3874 4.72077 10.4241 4.69607 10.455 4.66499C10.4858 4.63391 10.5103 4.59706 10.5269 4.55654C10.5435 4.51601 10.552 4.47261 10.5518 4.42882C10.5517 4.38502 10.5429 4.34168 10.526 4.30127C10.5091 4.26087 10.4844 4.22419 10.4533 4.19333L8.41663 2.15666L6.35996 4.18999Z"
        fill="#F48567"
      />
      <path
        d="M6.90017 7.58667C6.90055 7.52046 6.88121 7.45564 6.84461 7.40046C6.80801 7.34529 6.75581 7.30227 6.69466 7.27688C6.63351 7.25149 6.56619 7.24488 6.50127 7.25791C6.43636 7.27093 6.37679 7.30299 6.33017 7.35L5.0835 8.58667V2.62667C5.0835 2.53826 5.04838 2.45348 4.98587 2.39096C4.92336 2.32845 4.83857 2.29333 4.75017 2.29333C4.66176 2.29333 4.57698 2.32845 4.51447 2.39096C4.45195 2.45348 4.41683 2.53826 4.41683 2.62667V8.58667L3.1735 7.35C3.14242 7.31914 3.10557 7.2947 3.06504 7.27808C3.02452 7.26147 2.98112 7.25299 2.93732 7.25315C2.89352 7.2533 2.85019 7.26208 2.80978 7.27899C2.76938 7.29589 2.7327 7.32059 2.70183 7.35167C2.67097 7.38275 2.64654 7.4196 2.62992 7.46012C2.6133 7.50065 2.60483 7.54405 2.60498 7.58785C2.6053 7.6763 2.64073 7.76101 2.7035 7.82333L4.75017 9.86L6.79683 7.82333C6.82893 7.79274 6.85461 7.75605 6.87235 7.71541C6.89009 7.67478 6.89955 7.63101 6.90017 7.58667Z"
        fill="#F48567"
      />
    </g>
    <defs>
      <clipPath id="clip0_3004_430">
        <rect
          width="12"
          height="12"
          fill="white"
          transform="matrix(0 -1 1 0 0.75 12)"
        />
      </clipPath>
    </defs>
  </svg>
);

const UserManagement = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { users, error } = useSelector((state) => state.user);
  const userData = useSelector((state) => state.auth.userData); // Assuming the userData is in auth reducer
  const dispatch = useDispatch();
  const [loadingRecordId, setLoadingRecordId] = useState(null);

  const [showDownloadForm, setshowDownloadForm] = useState(false);
  const [showImportForm, setshowImportForm] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filter, setFilter] = useState("all");
  const [selectedRecordKey, setSelectedRecordKey] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers()); // Keep only this
  }, [dispatch]); // Remove userData from dependencies

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 when the page size changes
  };

  const [specificSearchQuery, setSpecificSearchQuery] = useState("");
  const handlesetSpecificSearchQueryChange = (e) => {
    setSpecificSearchQuery(e.target.value);
  };

  const filteredData = useMemo(() => {
    // First filter by company - only show users from the same company as logged-in user
    let filtered = users.filter((user) => {
      // Check if user has "End User" role AND belongs to same company
      const hasEndUserRole = user.roles.includes("End User");
      const sameCompany = user.company === userData?.company;
      return hasEndUserRole && sameCompany;
    });

    // Then apply status filter (active/inactive)
    if (filter === "active") {
      filtered = filtered.filter((user) => !user.blocked);
    } else if (filter === "inactive") {
      filtered = filtered.filter((user) => user.blocked);
    }

    // Apply search query filter
    if (specificSearchQuery) {
      const query = specificSearchQuery.toLowerCase();
      filtered = filtered.filter(
        ({ userName, company, roles }) =>
          (userName && userName.toLowerCase().includes(query)) ||
          (company && company.toLowerCase().includes(query)) ||
          (roles && roles.some((role) => role.toLowerCase().includes(query)))
      );
    }

    // Decrypt userId from localStorage and exclude current user
    let userId = null;
    const encryptedId = localStorage.getItem("userId");
    if (encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedId,
          "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
        );
        userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error("Failed to decrypt userId:", error);
      }
    }

    // Remove the current user from the filtered list
    if (userId) {
      filtered = filtered.filter((user) => user._id !== userId);
    }

    // Apply sorting based on filter
    const sorters = {
      newestFirst: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      1234: (a, b) => a.userId - b.userId,
      ABCD: (a, b) => (a.userName || "").localeCompare(b.userName || ""),
      location: (a, b) => (a.country || "").localeCompare(b.country || ""),
      Department: (a, b) =>
        (a.department || "").localeCompare(b.department || ""),
      Designation: (a, b) =>
        (a.designation || "").localeCompare(b.designation || ""),
      Email: (a, b) => (a.email || "").localeCompare(b.email || ""),
      Gender: (a, b) => (a.gender || "").localeCompare(b.gender || ""),
      Phone: (a, b) => a.mobile - b.mobile,
      startDate: (b, a) => new Date(a.joinedAt) - new Date(b.joinedAt),
      inactiveFirst: (b, a) =>
        a.blocked === b.blocked ? 0 : a.blocked ? 1 : -1,
    };

    if (sorters[filter]) filtered.sort(sorters[filter]);

    return filtered;
  }, [filter, specificSearchQuery, users, userData?.company]); // Added userData?.company to dependencies

  // Decrypt userId for metrics as well
  let currentUserId = null;
  const encryptedId = localStorage.getItem("userId");
  if (encryptedId) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedId,
        "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
      );
      currentUserId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Failed to decrypt userId:", error);
    }
  }

  // Calculate Metrics
  const filteredUsers =
    users?.filter(
      (user) => user.company === userData?.company && user._id !== currentUserId
    ) || [];

  const totalUsers = filteredUsers.length; // Total users for the company
  const activeUsers = filteredUsers.filter((user) => !user.blocked).length; // Active users (not blocked)
  const inactiveUsers = filteredUsers.filter((user) => user.blocked).length; // Inactive users (blocked)

  // Function to determine the background color for the status
  const getStatusBgColor = (status) => {
    if (status === "Active") return "#00FF0033"; // Green for active
    if (status === "Inactive") return "#DD441B33"; // Red for inactive
    return "transparent";
  };

  // Card data to map
  const cardData = [
    { title: "Total Users", value: totalUsers, filter: "all" },
    { title: "Active Users", value: activeUsers, filter: "active" },
    { title: "Inactive Users", value: inactiveUsers, filter: "inactive" },
  ];

  // Paginate data using useMemo to optimize calculations
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return filteredData.slice(start, end);
  }, [currentPage, pageSize, filteredData]);

  const handleToggleStatus = async (userIds, currentStatus) => {
    try {
      await dispatch(toggleUserStatus(userIds));
      dispatch(fetchAllUsers());
    } catch (error) {
      dispatch(showNotification("Failed to toggle status", "error"));
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() => setFilter((prev) => (prev === "ABCD" ? "" : "ABCD"))}
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Name</span>
        </div>
      ),
      dataIndex: "firstName", // Use one dataIndex to represent the key field
      key: "name", // Unique key for this column
      render: (text, record) => `${record.firstName} ${record.lastName}`, // Combine firstName and lastName
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>
            Organization
          </span>
        </div>
      ),
      dataIndex: "company",
      key: "company",
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "location" ? "" : "location"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Location</span>
        </div>
      ),
      dataIndex: "location",
      key: "location",
      render: (text, record) => {
        const address = record.address || "";
        const country = record.country || "";

        if (address && country) {
          return `${address}, ${country}`;
        } else if (address) {
          return address;
        } else if (country) {
          return country;
        } else {
          return "N/A";
        }
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "Department" ? "" : "Department"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>
            Department
          </span>
        </div>
      ),
      dataIndex: "department",
      key: "department",
    },
    // {
    //   title: (
    //     <div className="flex items-center">
    //       <SvgIcon
    //         onClick={() =>
    //           setFilter((prev) => (prev === "Designation" ? "" : "Designation"))
    //         }
    //       />
    //       <span style={{ color: "#F48567", marginLeft: "8px" }}>
    //         Designation
    //       </span>
    //     </div>
    //   ),
    //   dataIndex: "firstName, lastName",
    //   key: "firstName, lastName",
    // },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() => setFilter((prev) => (prev === "Role" ? "" : "Role"))}
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>
            Designation
          </span>
        </div>
      ),
      dataIndex: "roles",
      key: "roles",
      render: (roles) => (roles && roles.length > 0 ? roles.join(", ") : "N/A"),
    },

    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "Email" ? "" : "Email"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Email</span>
        </div>
      ),
      dataIndex: "email",
      key: "email",
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "Gender" ? "" : "Gender"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Gender</span>
        </div>
      ),
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "Phone" ? "" : "Phone"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Phone</span>
        </div>
      ),
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "startDate" ? "" : "startDate"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>DOJ</span>
        </div>
      ),
      dataIndex: "joinedAt",
      key: "joinedAt",
      render: (text) => {
        return text
          ? new Date(text).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A";
      },
    },
    {
      title: (
        <div className="flex items-center justify-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) =>
                prev === "inactiveFirst" ? "" : "inactiveFirst"
              )
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Status</span>
        </div>
      ),
      dataIndex: "blocked",
      key: "blocked",
      render: (blocked, record) => {
        const status = blocked ? "Inactive" : "Active";
        const isLoading = loadingRecordId === record._id;

        return (
          <div className="flex items-center gap-3">
            <div className="w-[80px]">
              <Badge
                color={status === "Active" ? "green" : "red"}
                text={
                  isLoading ? (
                    <Spin size="small" /> // Ant Design spinner
                  ) : (
                    status
                  )
                }
                style={{
                  backgroundColor: getStatusBgColor(status),
                  borderRadius: "10px",
                  padding: "7px",
                  color: darkMode ? "white" : "black",
                  display: "inline-block",
                  cursor: isLoading ? "not-allowed" : "pointer", // Disable click while loading
                }}
                onClick={async () => {
                  if (isLoading) return; // Prevent multiple clicks while loading
                  setLoadingRecordId(record._id); // Set loading state
                  try {
                    await handleToggleStatus(record._id, status); // Call your toggle function
                  } finally {
                    setLoadingRecordId(null); // Reset loading state
                  }
                }}
              />
            </div>
            <div>
              <Space>
                <EyeForm data={record} />
                <EdituserForm record={record} />
                <AsignTeam record={record} />
              </Space>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        className={`flex justify-center content-center rounded-lg max-h-14 absolute right-[300px] top-[25px] ${
          darkMode ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-black"
        } transition-colors duration-300`}
      >
        <input
          value={specificSearchQuery}
          onChange={handlesetSpecificSearchQueryChange}
          type="text"
          placeholder="Search by Username, Role or Contentt"
          className="px-4 py-3 pl-10 rounded-lg focus:outline-none bg-transparent w-96"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <IconSearch size={20} strokeWidth={1.5} className="" />
        </div>
      </div>

      <div className="flex flex-col  p-5  thescreanhe">
        {/* Page Header */}
        <div
          className={`flex justify-between items-center mb-6 px-12 py-3 rounded-lg mt- ${
            darkMode ? "bg-[#333333]" : "bg-[#f1f5f9]"
          }`}
        >
          <h1 className="text-2xl ml-[-20px] text-[#F48567]">Users</h1>
          <div className="flex space-x-8">
            {/* <CsvUser /> */}
            <UserManagementFormhr />
          </div>
        </div>

        {/* User Metrics Section */}
        <div className="flex justify-between space-x-4 mb-6 px-8">
          {cardData.map((card, index) => (
            <Card
              key={index}
              className={`flex-grow ${
                darkMode
                  ? "bg-[#1E1E1E] text-[#C7C7C7]"
                  : "bg-gray-100 text-black"
              } shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-[#f486673a]`}
              bordered={true}
              onClick={() => setFilter(card.filter)}
            >
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {card.title}
              </h2>
              <p className="text-3xl" style={{ color: "#F48567" }}>
                {card.value}
              </p>
            </Card>
          ))}
        </div>
        <div className="flex-grow overflow-x-auto h-11 px-8 theusertab">
          <div className={darkMode ? "dark-mode" : "light-mode"}></div>
          <div className="relative">
            {/* Select All Checkbox */}

            <div
              className={`table-container ${
                darkMode ? "bg-[#333333]" : "bg-[#f1f5f9]"
              } rounded-lg`}
            >
              <table
                className={`custom-table ${
                  darkMode ? "bg-[#18181b]" : "bg-white"
                }`}
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 10px",
                }}
              >
                <thead
                  className={`custom-table ${
                    darkMode ? "bg-[#18181b]" : "bg-[#f1f5f9]"
                  }`}
                >
                  <tr
                    className={`rounded-custom ${
                      darkMode ? "bg-[#18181b]" : "bg-[#f1f5f9]"
                    }`}
                  >
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={`headtextxx headtable${index + 1} ${
                          darkMode ? "bg-[#333333]" : "bg-white"
                        } text-white`}
                        style={{
                          cursor: "default",
                          userSelect: "none",
                          backgroundColor:
                            selectedIndices.length > 0
                              ? "#F48567"
                              : darkMode
                              ? "#333333"
                              : "#ffffff",
                          color:
                            selectedIndices.length > 0 ? "#ffffff" : "#F48567",
                          padding: "10px",
                          border: "none",
                        }}
                      >
                        {typeof column.title === "string"
                          ? column.title
                          : column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, rowIndex) => (
                    <tr
                      key={row.key || rowIndex}
                      className={`table-text rounded-lg ${
                        darkMode ? "bg-[#333333] text-white" : "bg-[#f1f5f9]"
                      }  ${
                        selectedIndices.includes(rowIndex)
                          ? "bg-[#f486673a]"
                          : ""
                      } headoptions`}
                      style={{ cursor: "pointer" }}
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          style={{
                            padding: "10px 10px",
                            border: "none",
                          }}
                        >
                          {column.render
                            ? column.render(row[column.dataIndex], row)
                            : row[column.dataIndex] || "N/A"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center gap-5 items-center mt-6 px-8">
          {/* Pagination Controls */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length} // Total number of items in your data
            onChange={handleChangePage}
            onShowSizeChange={(_, size) => handlePageSizeChange(size)}
            itemRender={(page, type, originalElement) => {
              if (type === "page") {
                return (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 cursor-pointer ${
                      page === currentPage
                        ? "bg-[#F48567] text-white hover:text-white"
                        : "bg-transparent text-black hover:bg-[#F48567] hover:text-white"
                    }`}
                  >
                    {page}
                  </span>
                );
              }
              if (type === "prev") {
                return (
                  <span
                    className={`inline-flex items-center justify-center w-20 h-8 cursor-pointer bg-[#333333] text-white border hover:bg-[#F48567] hover:text-white`}
                  >
                    Back
                  </span>
                );
              }
              if (type === "next") {
                return (
                  <span
                    className={`inline-flex items-center justify-center w-20 h-8 cursor-pointer bg-[#333333] text-white border hover:bg-[#F48567] hover:text-white`}
                  >
                    Next
                  </span>
                );
              }
              return originalElement;
            }}
          />

          {/* Page Size Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 whitespace-nowrap">
              Results per page
            </span>
            <Select
              defaultValue={pageSize}
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{ width: 100, backgroundColor: "#333333", color: "#fff" }}
              options={[
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 30, label: "30" },
                { value: 50, label: "50" },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
