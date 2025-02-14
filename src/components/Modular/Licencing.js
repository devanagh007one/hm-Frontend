import React, { useState, useMemo, useEffect } from "react";
import { fetchAllLicensing, toggleLicenseStatus, changeLicenseType } from '../../redux/actions/allLicensingGet.js';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from "../../redux/actions/notificationActions";
import { Table, Badge, Button, Switch, Pagination, Select, Spin } from "antd";
import CreateLincence from "../createCompany.js";
import CsvLincence from "../csvLicence.js";
import BarttForm from "./BarttForm.js";
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
    const { licensing, error } = useSelector((state) => state.licensing);
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [showDownloadForm, setshowDownloadForm] = useState(false);
    const [showEyeForm, setShowEyeForm] = useState(false);
    const [showImportForm, setshowImportForm] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [filter, setFilter] = useState("all");
    const [selectedRecordKey, setSelectedRecordKey] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState("");


    useEffect(() => {
        dispatch(fetchAllLicensing());
    }, [dispatch]);




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


    const [searchQuery, setSearchQuery] = useState('');
    const [specificSearchQuery, setSpecificSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);

    // Function to handle the display of the search box
    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handlesetSpecificSearchQueryChange = (e) => {
        setSpecificSearchQuery(e.target.value);
    };

    const filteredData = useMemo(() => {
        let filtered = [...licensing]; // Avoid mutating state
    
        // Apply global search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    
        // Apply organization, SPOC, or location-based search
        if (specificSearchQuery) {
            filtered = filtered.filter(item =>
                [item.organisationName, item.contactPersonName, item.city,item.state]
                    .some(val => val?.toLowerCase().includes(specificSearchQuery.toLowerCase()))
            );
        }
    
        // Apply sorting/filtering based on the selected filter option
        switch (filter) {
            case "newestFirst":
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
    
            case "ABCD":
                filtered.sort((a, b) => a.organisationName.localeCompare(b.organisationName));
                break;
    
            case "endDate":
                filtered.sort((a, b) => new Date(a.End_date) - new Date(b.End_date));
                break;
    
            case "startDate":
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
    
            case "licenceMinToMax":
                filtered.sort((a, b) => a.numberOfLicence - b.numberOfLicence);
                break;
    
            case "activeFirst":
                filtered.sort((a, b) => b.active - a.active);
                break;
    
            case "inactiveFirst":
                filtered.sort((a, b) => a.active - b.active);
                break;
    
            default:
                break;
        }
    
        return filtered;
    }, [filter, searchQuery, specificSearchQuery, licensing]);
    










    // Paginate data using useMemo to optimize calculations
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        return filteredData.slice(start, end);
    }, [currentPage, pageSize, filteredData]);

    const handleDownload = () => {
        // Use paginatedData or filteredData instead of data
        const selectedRows = paginatedData
            .filter((_, index) => selectedIndices.includes(index))
            .map((row) => {
                // Remove unnecessary fields
                const { _id, __v, passwordChangedAt, macAddresses, editLogs, ...filteredRow } = row;

                // Modify the logo path to be a full URL
                if (filteredRow.logo) {
                    filteredRow.logo = `${process.env.REACT_APP_STATIC_API_URL}${filteredRow.logo}`;
                }

                return filteredRow;
            });

        if (selectedFormat === ".pdf") {
            const doc = new jsPDF({ orientation: "landscape" });
            doc.setFontSize(8); // Set smaller font size for better fit

            // Get the logo from the first selected row (adjust if necessary)
            const logoUrl = selectedRows[0]?.logo; // Now this should be a full URL
            console.log(logoUrl); // Check if it's now a full URL

            if (logoUrl) {
                doc.addImage(logoUrl, 'JPEG', 5, 5, 30, 30); // Add image to the PDF
            }

            doc.text("HappMe License", 40, 15); // Text after the logo, adjust the position

            const tableHeaders = Object.keys(selectedRows[0] || {});
            const tableData = selectedRows.map((row) =>
                tableHeaders.map((header) => row[header] || "")
            );

            doc.autoTable({
                head: [tableHeaders],
                body: tableData,
                startY: 20, // Adjust for the logo and title
                margin: { left: 5, right: 5 },
                styles: { fontSize: 5 }, // Reduce table font size
                headStyles: { fillColor: [22, 160, 133] }, // Optional: Style headers
                bodyStyles: { textColor: [0, 0, 0] }, // Optional: Style body text
                theme: "striped", // Optional: Add stripes to rows
            });

            doc.save("HappMe-data.pdf");
        } else if ([".xls", ".xlsx"].includes(selectedFormat)) {
            const worksheet = XLSX.utils.json_to_sheet(selectedRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "HappMe Data");

            const fileType = selectedFormat === ".xls" ? "xls" : "xlsx";
            XLSX.writeFile(workbook, `HappMe-data.${fileType}`);
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
        const start = (currentPage - 1) * pageSize;
        const end = start + paginatedData.length;

        const pageIndices = paginatedData.map((_, i) => start + i); // Get absolute indices for this page

        setSelectedIndices((prev) => {
            const allSelected = pageIndices.every((index) => prev.includes(index));
            return allSelected
                ? prev.filter((index) => !pageIndices.includes(index)) // Deselect all on this page
                : [...new Set([...prev, ...pageIndices])]; // Select all on this page
        });
    };


    // Function to determine the background color for the status
    const getStatusBgColor = (status) => {
        if (status === "Active") return "#00FF0033"; // Green for active
        if (status === "Inactive") return "#DD441B33"; // Red for inactive
        return "transparent";
    };


    const [toggleStates, setToggleStates] = useState({}); // To manage toggle states for all rows

    const handleToggle = async (record) => {
        // Determine the new period based on the current state
        const newPeriod = record.period === "Subscription" ? "Trial" : "Subscription";

        // Optimistically update the local UI state
        setToggleStates((prevState) => ({
            ...prevState,
            [record._id]: !prevState[record._id], // Toggle the state for the specific record
        }));

        try {
            // Dispatch the changeLicenseType action
            await dispatch(changeLicenseType(record._id, newPeriod));

            // Show success notification
            dispatch(showNotification(`Changed ${record.organisationName} to ${newPeriod}`, "success"));

            // Refresh licensing data
            dispatch(fetchAllLicensing());
        } catch (error) {
            // Show error notification if something goes wrong
            dispatch(showNotification("Failed to change the organization", "error"));

            // Revert UI state in case of failure
            setToggleStates((prevState) => ({
                ...prevState,
                [record._id]: !prevState[record._id], // Revert back to previous state
            }));
        }
    };



    const [loadingRecordId, setLoadingRecordId] = useState(null);

    const handleToggleStatus = async (licenseId, currentStatus) => {
        try {
            await dispatch(toggleLicenseStatus(licenseId));
            console.log(`${currentStatus === "Active" ? "Deactivated" : "Activated"} license with ID: ${licenseId}`);
            dispatch(fetchAllLicensing()); // Refresh the user list after toggling
        } catch (error) {
            console.error("Failed to toggle status:", error.message);
        }
    };

    const columns = [
        {
            title: (
                <span className="flex items-center ">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "ABCD" ? "" : "ABCD"))} />
                    <span className="ml-2 ">Organization Name</span>
                </span>
            ),
            dataIndex: 'organisationName',
            key: 'organisationName',
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon
                        onClick={() =>
                            setFilter(prev => prev === "activeFirst"
                                ? "inactiveFirst"
                                : prev === "inactiveFirst"
                                    ? ""
                                    : "activeFirst"
                            )
                        }
                    />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Status</span>
                </div>
            ),
            dataIndex: "active",
            key: "active",
            render: (blocked, record) => {
                const status = blocked ? "Active" : "Inactive";
                const isLoading = loadingRecordId === record._id;

                return (
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
                );
            },
        },
        {
            title: (
                <span className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "licenceMinToMax" ? "" : "licenceMinToMax"))} />
                    <span className="ml-2">Licenses</span>
                </span>
            ),
            dataIndex: 'numberOfLicence',
            key: 'numberOfLicence',
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon onClick={() => setFilter(prev => (prev === "startDate" ? "" : "startDate"))} />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Start Date</span>
                </div>
            ),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => {
                if (!createdAt) return "N/A"; // Handle missing or undefined data

                const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
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
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>End Date</span>
                </div>
            ),
            dataIndex: "End_date",
            key: "End_date",
            render: (End_date) => {
                if (!End_date) return "N/A"; // Handle missing or undefined data

                const formattedDate = new Date(End_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });

                return formattedDate;
            },
        },
        {
            title: "TRIAL/PAID",
            dataIndex: 'period', // Ensure this corresponds to the correct field in your data
            key: 'period',
            render: (_, record) => {
                // Determine the current period and toggle it accordingly
                const isSubscription = toggleStates[record._id] !== undefined ? toggleStates[record._id] : (record.period === "Subscription");

                return (
                    <Switch
                        checked={isSubscription} // Set checked state based on the current toggle state
                        checkedChildren="P"
                        unCheckedChildren="T"
                        onChange={() => handleToggle(record)}
                        className="custom-switch" // Add custom class to apply custom styles
                    />
                );
            },
        },
        {
            title: (
                <span className="flex items-center">
                    <span className="ml-2">SPOC</span>
                </span>
            ),
            dataIndex: 'spoc',
            key: 'spoc',
            render: (text, record) => (
                <span className="flex items-center">

                    <>
                        <span className="w-16 overflow-hidden">{record.contactPersonName}</span>

                        <BarttForm data={record} />
                    </>

                </span>
            ),
        },
        {
            title: (
                <span className="flex items-center">
                    <span className="ml-2">Location</span>
                </span>
            ),
            dataIndex: 'state',
            key: 'state',
        },
    ];


    return (

        <>
        <div className={`flex justify-center content-center rounded-lg max-h-14 absolute right-[300px] top-[25px] ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'} transition-colors duration-300`}>
                    <input
                        value={specificSearchQuery}
                        onChange={handlesetSpecificSearchQueryChange}
                        type="text"
                        placeholder="Search by Organization, SPOC or Location"
                        className="px-4 py-3 pl-10 rounded-lg focus:outline-none bg-transparent w-96"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <IconSearch size={20} strokeWidth={1.5} className="" />
                    </div>
                </div>

            <div className='flex flex-col  p-5  thescreanhe'>


                {/* Page Header */}
                <div className={`flex justify-between items-center mb-6 px-12 py-3 rounded-lg mt- ${darkMode ? 'bg-[#333333]' : 'bg-[#f1f5f9]'}`}>
                    <h1 className="text-2xl ml-[-20px] text-[#F48567]">Licenses Management</h1>
                    <div className="flex gap-6">
                        <div
                            className={`text-[#F48567] gap-1 flex  bg-transparent hover:bg-transparent hover:text-[#F48567] rounded ${darkMode ? '#F48567' : '#F48567'}`}
                        >

                            {showSearchInput && (
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="bg-transparent text-white rounded border-solid focus:ring-0  mt-[-5px] "
                                />

                            )}


                            <Button
                                className={`text-[#F48567] border-none bg-transparent hover:bg-transparent hover:text-[#F48567] p-2 rounded ${darkMode ? '#F48567' : '#F48567'}`}
                                icon={
                                    <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:bg-[none]">
                                        <g filter="url(#filter0_b_3004_2000)">
                                            <rect x="0.1" y="0.6" width="45.8" height="45.8" rx="11.9" stroke="#F48567" stroke-width="0.2" />
                                            <path d="M29.1163 29.65L32.9663 33.5M31.8551 22.9763C31.8551 28.21 27.6263 32.4525 22.4113 32.4525C17.1951 32.4525 12.9663 28.21 12.9663 22.9775C12.9663 17.7412 17.1951 13.5 22.4101 13.5C27.6263 13.5 31.8551 17.7425 31.8551 22.9763Z" stroke="#F48567" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <filter id="filter0_b_3004_2000" x="-4" y="-3.5" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3004_2000" />
                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_3004_2000" result="shape" />
                                            </filter>
                                        </defs>
                                    </svg>
                                }
                                onClick={toggleSearchInput}  // Toggle search input on button click
                            />
                        </div>


                        <Button
                            className={`text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded ${darkMode ? 'bg-[#444444]' : 'bg-white'}`}
                            icon={
                                <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_b_3001_972)">
                                        <rect x="0.1" y="0.6" width="45.8" height="45.8" rx="11.9" stroke="#F48567" strokeWidth="0.2" />
                                        <path d="M30.5001 13.5H15.5001C14.1188 13.5 12.9676 14.6375 13.3088 15.975C13.6721 17.3924 14.3414 18.713 15.2695 19.8441C16.1976 20.9753 17.3622 21.8895 18.6813 22.5225C19.7101 23.015 20.5001 23.9825 20.5001 25.1225V32.7275C20.5002 32.9405 20.5547 33.1499 20.6585 33.3359C20.7623 33.5219 20.9119 33.6783 21.0931 33.7902C21.2743 33.9022 21.4811 33.966 21.6939 33.9756C21.9066 33.9851 22.1183 33.9402 22.3088 33.845L24.8088 32.595C25.0164 32.4913 25.1911 32.3318 25.3132 32.1344C25.4352 31.937 25.5 31.7096 25.5001 31.4775V25.1225C25.5001 23.9825 26.2901 23.015 27.3176 22.5225C28.6373 21.8898 29.8024 20.9758 30.7309 19.8446C31.6595 18.7135 32.3291 17.3926 32.6926 15.975C33.0313 14.6375 31.8788 13.5 30.5001 13.5Z" stroke="#F48567" strokeWidth="1.66667" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_b_3001_972" x="-4" y="-3.5" width="54" height="54" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3001_972" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_3001_972" result="shape" />
                                        </filter>
                                    </defs>
                                </svg>
                            }
                        />


                        <CsvLincence />

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
                                    </div>
                                    <div className="flex justify-around mb-6">
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
                                        className="w-full bg-[#F48567] text-white py-2 rounded-lg hover:bg-[#e57357] transition">
                                        Download
                                    </button>
                                </div>
                            </div>
                        )}






                        <CreateLincence />

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

                        {/* Table */}
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
                                                className={`headtable${index + 1} ${darkMode ? "bg-[#333333]" : "bg-white"} text-white`}
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
                                            className={`rounded-lg ${darkMode ? "bg-[#333333] text-white" : "bg-[#f1f5f9]"}  ${selectedIndices.includes(rowIndex) ? "bg-[#f486673a]" : ""} headoptions`}
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
                        <div className="absolute left-[-20px] bottom-0 flex flex-col items-center justify h-full pt-[59px]">
                            {paginatedData.map((_, index) => {
                                const absoluteIndex = (currentPage - 1) * pageSize + index; // Convert paginated index to absolute
                                return (
                                    <span key={absoluteIndex} className="h-[65px] flex justify-center items-center">
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