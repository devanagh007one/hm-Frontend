import React, { useState, useMemo, useEffect } from "react";
import CryptoJS from 'crypto-js';

import { fetchAllUsers, deleteUser, toggleUserStatus, changeUserRole } from '../../redux/actions/alluserGet';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Badge, Button, Space, Pagination, Select, Spin, Card } from "antd";
import RoleManagementForm from "../RoleManagementForm";
import CsvUser from "../csvUser.js";
import { showNotification } from "../../redux/actions/notificationActions"; // Import showNotification
import EyeForm from "./EyeForm.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { IconSearch } from '@tabler/icons-react';



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
            <path d="M6.35996 4.18999C6.29675 4.25232 6.26089 4.3372 6.26026 4.42597C6.25964 4.51474 6.2943 4.60012 6.35663 4.66333C6.41895 4.72654 6.50384 4.7624 6.5926 4.76302C6.68137 4.76365 6.76675 4.72899 6.82996 4.66666L8.08329 3.42666V9.38999C8.08329 9.4784 8.11841 9.56318 8.18092 9.6257C8.24344 9.68821 8.32822 9.72333 8.41663 9.72333C8.50503 9.72333 8.58982 9.68821 8.65233 9.6257C8.71484 9.56318 8.74996 9.4784 8.74996 9.38999V3.42666L9.98329 4.66666C10.0144 4.69752 10.0512 4.72196 10.0917 4.73858C10.1323 4.75519 10.1757 4.76367 10.2195 4.76351C10.2633 4.76336 10.3066 4.75458 10.347 4.73767C10.3874 4.72077 10.4241 4.69607 10.455 4.66499C10.4858 4.63391 10.5103 4.59706 10.5269 4.55654C10.5435 4.51601 10.552 4.47261 10.5518 4.42882C10.5517 4.38502 10.5429 4.34168 10.526 4.30127C10.5091 4.26087 10.4844 4.22419 10.4533 4.19333L8.41663 2.15666L6.35996 4.18999Z" fill="#F48567" />
            <path d="M6.90017 7.58667C6.90055 7.52046 6.88121 7.45564 6.84461 7.40046C6.80801 7.34529 6.75581 7.30227 6.69466 7.27688C6.63351 7.25149 6.56619 7.24488 6.50127 7.25791C6.43636 7.27093 6.37679 7.30299 6.33017 7.35L5.0835 8.58667V2.62667C5.0835 2.53826 5.04838 2.45348 4.98587 2.39096C4.92336 2.32845 4.83857 2.29333 4.75017 2.29333C4.66176 2.29333 4.57698 2.32845 4.51447 2.39096C4.45195 2.45348 4.41683 2.53826 4.41683 2.62667V8.58667L3.1735 7.35C3.14242 7.31914 3.10557 7.2947 3.06504 7.27808C3.02452 7.26147 2.98112 7.25299 2.93732 7.25315C2.89352 7.2533 2.85019 7.26208 2.80978 7.27899C2.76938 7.29589 2.7327 7.32059 2.70183 7.35167C2.67097 7.38275 2.64654 7.4196 2.62992 7.46012C2.6133 7.50065 2.60483 7.54405 2.60498 7.58785C2.6053 7.6763 2.64073 7.76101 2.7035 7.82333L4.75017 9.86L6.79683 7.82333C6.82893 7.79274 6.85461 7.75605 6.87235 7.71541C6.89009 7.67478 6.89955 7.63101 6.90017 7.58667Z" fill="#F48567" />
        </g>
        <defs>
            <clipPath id="clip0_3004_430">
                <rect width="12" height="12" fill="white" transform="matrix(0 -1 1 0 0.75 12)" />
            </clipPath>
        </defs>
    </svg>


);



const UserManagement = () => {
    const darkMode = useSelector((state) => state.theme.darkMode);
    const { users, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loadingRecordId, setLoadingRecordId] = useState(null);


    const [showForm, setShowForm] = useState(false);
    const [showDownloadForm, setshowDownloadForm] = useState(false);
    const [showEyeForm, setShowEyeForm] = useState(false);
    const [showImportForm, setshowImportForm] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filter, setFilter] = useState("all");
    const [selectedRecordKey, setSelectedRecordKey] = useState(null);

    const [selectedFormat, setSelectedFormat] = useState("");

    // Fetch users on mount
    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    // Handle delete action
    const handleDelete = async (userId) => {
        await dispatch(deleteUser([userId])); // Wait for the delete action
        dispatch(fetchAllUsers()); // Fetch updated users list
    };



    const handleShowImportForm = () => {
        setshowImportForm(true);
    };
    const handleHideImportForm = () => {
        setshowImportForm(false);
    };


    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to page 1 when the page size changes
    };


    const [specificSearchQuery, setSpecificSearchQuery] = useState('');
    const handlesetSpecificSearchQueryChange = (e) => {
        setSpecificSearchQuery(e.target.value);
    };



    const filteredData = useMemo(() => {
        let filtered = [...users]; // Avoid mutating state

        // Apply organization, SPOC, or location-based search
        if (specificSearchQuery) {
            filtered = filtered.filter(item =>
                [item.userName, item.company].some(val =>
                    val?.toLowerCase().includes(specificSearchQuery.toLowerCase())
                ) ||
                item.roles.some(role => role.toLowerCase().includes(specificSearchQuery.toLowerCase()))
            );
        }


        // Apply sorting/filtering based on the selected filter option
        switch (filter) {
            case "newestFirst":
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;

            case "1234":
                filtered.sort((a, b) => a.userId - b.userId);
                break;

            case "ABCD":
                filtered.sort((a, b) => a.userName.localeCompare(b.userName));
                break;

            case "role":
                const rolePriority = {
                    "Super Admin": 1,
                    "Admin": 2,
                    "Partner": 3,
                    "Hr": 4,
                    "End User": 5
                };

                filtered.sort((a, b) => {
                    return (rolePriority[a.roles[0]] || 99) - (rolePriority[b.roles[0]] || 99);
                });
                break;


            case "endDate":
                filtered.sort((a, b) => {
                    const getLastEditDate = (logs) => {
                        if (!Array.isArray(logs) || logs.length === 0) return new Date(0); // Default to oldest date
                        return new Date(logs[logs.length - 1].date); // Use the last element's date
                    };

                    return getLastEditDate(a.editLogs) - getLastEditDate(b.editLogs);
                });
                break;


            case "startDate":
                filtered.sort((b, a) => new Date(a.joinedAt) - new Date(b.joinedAt));
                break;

            case "inactiveFirst":
                filtered.sort((b, a) => {
                    return (a.blocked === b.blocked) ? 0 : a.blocked ? 1 : -1;
                });
                break;




            default:
                break;
        }

        return filtered;
    }, [filter, specificSearchQuery, users]);


    // Calculate Metrics
    const totalUsers = users?.length || 0;
    const activeUsers = users?.filter((user) => !user.blocked).length || 0; // Active users (not blocked)
    const inactiveUsers = users?.filter((user) => user.blocked).length || 0; // Inactive users (blocked)

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

    // Handle bulk delete
    const handleBulkDelete = async () => {
        const selectedUserIds = selectedIndices.map((index) => users[index]._id); // Get selected user IDs
        await dispatch(deleteUser(selectedUserIds)); // Dispatch delete action with multiple user IDs
        dispatch(fetchAllUsers()); // Fetch updated user list
        setSelectedIndices([]); // Clear selection after deletion
    };

    const handleDownload = () => {
        const selectedRows = filteredData
            .filter((_, index) => selectedIndices.includes(index))
            .map(({ _id, __v, passwordChangedAt, macAddresses, editLogs, ...row }) => row);
    
        if (selectedFormat === ".pdf") {
            const doc = new jsPDF({ orientation: "landscape" });
            doc.setFontSize(8);
            doc.text("HappMe", 5, 10);
    
            const tableHeaders = Object.keys(selectedRows[0] || {});
            const tableData = selectedRows.map((row) => tableHeaders.map((header) => row[header] || ""));
    
            doc.autoTable({
                head: [tableHeaders],
                body: tableData,
                startY: 15,
                margin: { left: 5, right: 5 },
                styles: { fontSize: 5 },
                headStyles: { fillColor: [22, 160, 133] },
                bodyStyles: { textColor: [0, 0, 0] },
                theme: "striped",
            });
    
            doc.save("HappMe-data.pdf");
        } else if ([".xls", ".xlsx"].includes(selectedFormat)) {
            const worksheet = XLSX.utils.json_to_sheet(selectedRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "HappMe Data");
    
            XLSX.writeFile(workbook, `HappMe-data.${selectedFormat.replace(".", "")}`);
        } else {
            alert("Please select a format.");
        }
    };
    

    const handleSelection = (index) => {
        const absoluteIndex = (currentPage - 1) * pageSize + index; // Convert paginated index to absolute index
        setSelectedIndices((prev) =>
            prev.includes(absoluteIndex)
                ? prev.filter((i) => i !== absoluteIndex) // Remove if already selected
                : [...prev, absoluteIndex] // Add if not selected
        );
    };

    const handleSelectAll = () => {
        setSelectedIndices((prev) => {
            const allSelected = prev.length === filteredData.length; // Check if all items are selected
            return allSelected ? [] : filteredData.map((_, i) => i); // Select all or deselect all
        });
    };
    
    

    const handleToggleStatus = async (userIds, currentStatus) => {
        try {
            await dispatch(toggleUserStatus(userIds));
            dispatch(fetchAllUsers());
        } catch (error) {
            dispatch(showNotification("Failed to toggle status", "error"));
        }
    };


    const handleRoleChange = async (userId, newRole) => {
        try {
            // Dispatch the action to change the user role
            const response = await dispatch(changeUserRole(userId, newRole));

            // If the role change is successful, refresh users and show success notification
            if (response?.success) {
                dispatch(fetchAllUsers());
                dispatch(showNotification(response.message || "Role updated successfully", "success"));
            } else {
                throw new Error(response?.message || "Failed to update role");
            }
        } catch (error) {
            // Handle failure scenario
            dispatch(fetchAllUsers());
            dispatch(showNotification(error.message, "error"));
        }
    };



    const rolesOptions = ["Admin", "Super Admin", "Partner", "HR", "End User"];

    // Retrieve encrypted roles from localStorage
    const encryptedRoles = localStorage.getItem("encryptedRoles");

    let userRoles = [];

    if (encryptedRoles) {
        try {
            const bytes = CryptoJS.AES.decrypt(
                encryptedRoles,
                "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
            );
            userRoles = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error("Error decrypting roles:", error);
        }
    }

    // Define valid roles for checking
    const validRoles = ["super admin", "admin", "partner", "hr"];
    const hasValidRole = userRoles.some((role) => validRoles.includes(role.toLowerCase()));

    // Check if the user is an Admin
    const isAdmin = userRoles.some((role) => role.toLowerCase() === "admin");

    // Filter rolesOptions to remove "Super Admin" if the user is an Admin
    const filteredRolesOptions = isAdmin
        ? rolesOptions.filter((role) => role !== "Super Admin")
        : rolesOptions;




    const columns = [
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "1234" ? "" : "1234"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>USER ID</span>
                </div>
            ),
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "ABCD" ? "" : "ABCD"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>USERNAME</span>
                </div>
            ),
            dataIndex: "userName",
            key: "userName",
            render: (text, record) => {
                const imageUrl = record.image
                    ? `${process.env.REACT_APP_STATIC_API_URL}${record.image.replace(/^.*happme_adminuser_management/, '')}`
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"; // Default image

                return (
                    <div className="flex items-center">
                        <img
                            src={imageUrl}
                            alt="user-icon"
                            className="w-6 h-6 mr-2 rounded-full object-cover"
                        />
                        <span>{text}</span>
                    </div>
                );
            }
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "role" ? "" : "role"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>ROLE</span>
                </div>
            ),
            dataIndex: "roles",
            key: "roles",
            render: (roles, record) => {
                const roleClass = Array.isArray(roles)
                    ? roles[0].toLowerCase().replace(/\s/g, "")
                    : roles.toLowerCase().replace(/\s/g, "");

                return (
                    <Select
                        mode="single"
                        className={`thereoledrop ${roleClass}`}
                        options={filteredRolesOptions.map((role) => ({ label: role, value: role }))}
                        value={roles[0]} // Ensure correct role is displayed
                        placeholder="Select roles"
                        onChange={(newRole) => handleRoleChange(record._id, newRole)} // Handle role change
                    />
                );
            },
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "startDate" ? "" : "startDate"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>UPLOADED DATA</span>
                </div>
            ),
            dataIndex: "uploadedBy",
            key: "uploadedBy",
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "startDate" ? "" : "startDate"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>DATA CATEGORY</span>
                </div>
            ),
            dataIndex: "joinedAt",
            key: "joinedAt",
            render: (joinedAt) => {
                if (!joinedAt) return "N/A"; // Handle missing or undefined data

                const formattedDate = new Date(joinedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });

                return formattedDate;
            },
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "endDate" ? "" : "endDate"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>LAST UPDATED</span>
                </div>
            ),
            dataIndex: "editLogs",
            key: "editLogs",
            render: (editLogs) => {
                if (!Array.isArray(editLogs) || editLogs.length === 0) return "N/A"; // Handle empty or invalid data

                const lastLog = editLogs[editLogs.length - 1]; // Get the last log entry
                const formattedDate = new Date(lastLog.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });

                return formattedDate;
            },
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "startDate" ? "" : "startDate"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>CREATED AT</span>
                </div>
            ),
            dataIndex: "joinedAt",
            key: "joinedAt",
            render: (joinedAt) => {
                if (!joinedAt) return "N/A"; // Handle missing or undefined data

                const formattedDate = new Date(joinedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });

                return formattedDate;
            },
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "inactiveFirst" ? "" : "inactiveFirst"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>STATUS</span>
                </div>
            ),
            dataIndex: "blocked",
            key: "blocked",
            render: (blocked, record) => {
                const status = blocked ? "Inactive" : "Active";
                const isLoading = loadingRecordId === record._id;

                return (
                    <div className="flex items-center justify-center">
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
                );
            },
        },
        {
            title: (
                <div className="flex items-center">
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>ACTIONS</span>
                </div>
            ),
            key: "actions",
            render: (_, record) => (
                <div className="flex items-center justify-center">
                    <Space>
                        <EyeForm data={record} />
                        {!isAdmin && ( // Hide the delete button if the user is an Admin
                            <div className="cursor-pointer" onClick={() => handleDelete(record._id)}>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                        fill="#DD441B"
                                    />
                                </svg>
                            </div>
                        )}
                    </Space>
                </div>
            ),
        },


    ];


    return (


        <>
            <div className={`flex justify-center content-center rounded-lg max-h-14 absolute right-[300px] top-[25px] ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'} transition-colors duration-300`}>
                <input
                    value={specificSearchQuery}
                    onChange={handlesetSpecificSearchQueryChange}
                    type="text"
                    placeholder="Search by Username, Role or Organization"
                    className="px-4 py-3 pl-10 rounded-lg focus:outline-none bg-transparent w-96"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <IconSearch size={20} strokeWidth={1.5} className="" />
                </div>
            </div>
            <div className='flex flex-col  p-5  thescreanhe'>


                {/* Page Header */}
                <div className={`flex justify-between items-center mb-6 px-12 py-3 rounded-lg mt- ${darkMode ? 'bg-[#333333]' : 'bg-[#f1f5f9]'}`}>
                    <h1 className="text-2xl ml-[-20px] text-[#F48567]">Roles</h1>
                    <div className="flex gap-6">
                        {!isAdmin && selectedIndices.length > 0 && (
                            <Button
                                className={`text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded ${darkMode ? 'bg-[#444444]' : 'bg-white'}`}
                                onClick={handleBulkDelete}
                                icon={
                                    <svg
                                        width="46"
                                        height="47"
                                        viewBox="0 0 46 47"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <path
                                            d="M34.0001 0.599998H12.0001C5.42791 0.599998 0.100098 5.92781 0.100098 12.5V34.5C0.100098 41.0722 5.42791 46.4 12.0001 46.4H34.0001C40.5723 46.4 45.9001 41.0722 45.9001 34.5V12.5C45.9001 5.92781 40.5723 0.599998 34.0001 0.599998Z"
                                            stroke="#F48567"
                                            strokeWidth="0.2"
                                        />
                                        <rect x="9" y="11" width="28" height="22" fill="url(#pattern0_201_740)" />
                                        <defs>
                                            <pattern
                                                id="pattern0_201_740"
                                                patternContentUnits="objectBoundingBox"
                                                width="1"
                                                height="1"
                                            >
                                                <use
                                                    xlinkHref="#image0_201_740"
                                                    transform="matrix(0.00785714 0 0 0.01 0.107143 0)"
                                                />
                                            </pattern>
                                            <image
                                                id="image0_201_740"
                                                width="100"
                                                height="100"
                                                xlinkHref="data:image/png;base64,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"
                                            />
                                        </defs>
                                    </svg>

                                }
                            />
                        )}




                        {!showImportForm && (
                            <Button
                                className="text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
                                icon={
                                    <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g filter="url(#filter0_b_3004_2007)">
                                            <rect x="0.1" y="0.6" width="45.8" height="45.8" rx="11.9" stroke="#F48567" stroke-width="0.2" />
                                            <path d="M23 28.5L16.75 22.25L18.5 20.4375L21.75 23.6875V13.5H24.25V23.6875L27.5 20.4375L29.25 22.25L23 28.5ZM15.5 33.5C14.8125 33.5 14.2242 33.2554 13.735 32.7663C13.2458 32.2771 13.0008 31.6883 13 31V27.25H15.5V31H30.5V27.25H33V31C33 31.6875 32.7554 32.2763 32.2663 32.7663C31.7771 33.2563 31.1883 33.5008 30.5 33.5H15.5Z" fill="#F48567" />
                                        </g>
                                        <defs>
                                            <filter id="filter0_b_3004_2007" x="-4" y="-3.5" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3004_2007" />
                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_3004_2007" result="shape" />
                                            </filter>
                                        </defs>
                                    </svg>
                                }
                                onClick={handleShowImportForm}
                            />
                        )}
                        {showImportForm && (
                            <div className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 ${darkMode ? 'bg-[#333333]' : 'bg-[#f1f5f9]'}`}>
                                <div className={`rounded-lg shadow-lg w-full max-w-xl p-8 relative ${darkMode ? 'bg-[#333333] text-dark' : 'bg-[#f1f5f9] text-dark'}`}>
                                    <div className="flex justify-between items">
                                        <h2 className="text-xl font-semibold mb-6 text-center">Download As</h2>
                                        <div onClick={handleHideImportForm} className="cursor-pointer">
                                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z" fill="#C7C7C7" />
                                            </svg>
                                        </div>
                                    </div>                                <div className="flex justify-around mb-6">
                                        {[".pdf", ".xls", ".xlsx"].map((format) => (
                                            <label key={format} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="format"
                                                    value={format}
                                                    checked={selectedFormat === format}
                                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                                    className="accent-[#F48567]"
                                                />
                                                <span>{format}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="w-full bg-[#F48567] text-white py-2 rounded-lg hover:bg-[#e57357] transition"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        )}



                        <CsvUser />
                        <RoleManagementForm />

                    </div>
                </div>


                <div className="flex-grow overflow-x-auto h-11 px-8 theusertab">
                    <div className={darkMode ? "dark-mode" : "light-mode"}></div>
                    <div className="relative">
                        {/* Select All Checkbox */}
                        <div className="absolute z-50 left-[-22px] top-6">
                        <input
                                className="custom-checkbox border-[#F48567] rounded-full"
                                type="checkbox"
                                checked={paginatedData.length > 0 && paginatedData.every((_, index) => selectedIndices.includes((currentPage - 1) * pageSize + index))} // Check if all on the page are selected
                                onChange={handleSelectAll}
                            />
                        </div>

                        <div className={`table-container ${darkMode ? "bg-[#333333]" : "bg-[#f1f5f9]"} rounded-lg`}>
                            <table
                                className={`custom-table ${darkMode ? "bg-[#18181b]" : "bg-white"}`}
                                style={{
                                    width: "100%",
                                    borderCollapse: "separate",
                                    borderSpacing: "0 10px",
                                }}
                            >

                                <thead className={`custom-table ${darkMode ? "bg-[#18181b]" : "bg-[#f1f5f9]"}`}>
                                    <tr className={`rounded-custom ${darkMode ? "bg-[#18181b]" : "bg-[#f1f5f9]"}`}>
                                        {columns.map((column, index) => (
                                            <th
                                                key={index}
                                                className={`headtextxx headtable${index + 1} ${darkMode ? "bg-[#333333]" : "bg-white"} text-white`}
                                                style={{
                                                    cursor: "default",
                                                    userSelect: "none",
                                                    backgroundColor: selectedIndices.length > 0
                                                        ? "#F48567"
                                                        : darkMode
                                                            ? "#333333"
                                                            : "#ffffff",
                                                    color: selectedIndices.length > 0 ? "#ffffff" : "#F48567",
                                                    padding: "10px",
                                                    border: "none",
                                                }}
                                            >
                                                {typeof column.title === "string" ? column.title : column.title}
                                            </th>
                                        ))}

                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((row, rowIndex) => (
                                        <tr
                                            key={row.key || rowIndex}
                                            className={`table-text rounded-lg ${darkMode ? "bg-[#333333] text-white" : "bg-[#f1f5f9]"}  ${selectedIndices.includes(rowIndex) ? "bg-[#f486673a]" : ""} headoptions`}
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




                        {/* Pagination */}
                        <div className="absolute left-[-20px] bottom-0 flex flex-col items-center justify h-full pt-[45px]">
                            {paginatedData.map((_, index) => {
                                const absoluteIndex = (currentPage - 1) * pageSize + index; // Convert paginated index to absolute
                                return (
                                    <span key={absoluteIndex} className="h-[60px] flex justify-center items-center">
                                        <input
                                            className="custom-checkbox peer/draft border-[#F48567] rounded-full"
                                            type="checkbox"
                                            checked={selectedIndices.includes(absoluteIndex)}
                                            onChange={() => handleSelection(index)}
                                        />
                                    </span>
                                );
                            })}

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
                            if (type === 'page') {
                                return (
                                    <span
                                        className={`inline-flex items-center justify-center w-8 h-8 cursor-pointer ${page === currentPage
                                            ? 'bg-[#F48567] text-white hover:text-white'
                                            : 'bg-transparent text-black hover:bg-[#F48567] hover:text-white'
                                            }`}
                                    >
                                        {page}
                                    </span>
                                );
                            }
                            if (type === 'prev') {
                                return (
                                    <span
                                        className={`inline-flex items-center justify-center w-20 h-8 cursor-pointer bg-[#333333] text-white border hover:bg-[#F48567] hover:text-white`}
                                    >
                                        Back
                                    </span>
                                );
                            }
                            if (type === 'next') {
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
                        <span className="text-sm text-gray-400 whitespace-nowrap">Results per page</span>
                        <Select
                            defaultValue={pageSize}
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            style={{ width: 100, backgroundColor: '#333333', color: '#fff' }}
                            options={[
                                { value: 10, label: '10' },
                                { value: 20, label: '20' },
                                { value: 30, label: '30' },
                                { value: 50, label: '50' },
                            ]}
                        />
                    </div>
                </div>



            </div>
        </>
    );
};

export default UserManagement;