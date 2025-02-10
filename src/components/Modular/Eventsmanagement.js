import React, { useState, useMemo, useEffect } from "react";
import { deleteUser, toggleUserStatus } from '../../redux/actions/alluserGet.js';
import { fetchAllEvents ,updateEventStatus } from '../../redux/actions/alleventGet.js';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Space, Pagination, Select, Spin, Card } from "antd";
import EventManagementForm from "../EventManagementForm";
import { showNotification } from "../../redux/actions/notificationActions.js"; // Import showNotification
import EyeForm from "./EyeForm.js";
import "jspdf-autotable";


const SvgIcon = () => (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const { events, error } = useSelector((state) => state.events);
    const dispatch = useDispatch();
    const [loadingRecordId, setLoadingRecordId] = useState(null);


    const [selectedIndices, setSelectedIndices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [filter, setFilter] = useState("all");

    // Fetch users on mount
    useEffect(() => {
        dispatch(fetchAllEvents());
        console.log(events)

    }, [dispatch]);

    // Handle delete action
    const handleDelete = async (userId) => {
        await dispatch(deleteUser([userId])); // Wait for the delete action
        dispatch(fetchAllEvents()); // Fetch updated users list
    };


    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to page 1 when the page size changes
    };






    const filteredData = useMemo(() => {
        let filtered = events || [];

        // Apply the filter for different event statuses
        if (filter && filter !== "all") {
            filtered = filtered.filter((event) => event.status?.toLowerCase() === filter.toLowerCase());
        }

        // Apply the search query filter (searching specific fields)

        return filtered;
    }, [filter, events]);


    // Calculate Metrics
    const totalEvents = events?.length || 0;
    const completedEvents = events?.filter((event) => event.status === "Completed").length || 0;
    const scheduledEvents = events?.filter((event) => event.status === "Scheduled").length || 0;
    const pendingEvents = events?.filter((event) => event.status === "Pending").length || 0;
    const cancelledEvents = events?.filter((event) => event.status === "Cancelled").length || 0;

    // Card data to map
    const cardData = [
        { title: "Total Events", value: totalEvents, filter: "all" },
        { title: "Completed Events", value: completedEvents, filter: "completed" },
        { title: "Scheduled Events", value: scheduledEvents, filter: "scheduled" },
        { title: "Pending Events", value: pendingEvents, filter: "pending" },
        { title: "Cancelled Events", value: cancelledEvents, filter: "cancelled" },
    ];

    // Helper functions
    const getStatusBgColor = (status) => {
        switch (status) {
            case "Pending":
                return "rgba(255, 165, 0, 0.2)"; // Orange background for Pending
            case "Approved":
                return "rgba(0, 255, 0, 0.2)"; // Green background for Approved
            case "Rejected":
                return "#E6394633"; // Red background for Rejected
            default:
                return "transparent";
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "orange";
            case "Approved":
                return "green";
            case "Rejected":
                return "red";
            default:
                return "gray";
        }
    };

    // Paginate data using useMemo to optimize calculations
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        return filteredData.slice(start, end);
    }, [currentPage, pageSize, filteredData]);




    // Handle row selection
    const handleRowSelection = (index) => {
        const newSelectedIndices = [...selectedIndices];
        if (newSelectedIndices.includes(index)) {
            newSelectedIndices.splice(newSelectedIndices.indexOf(index), 1); // Deselect
        } else {
            newSelectedIndices.push(index); // Select
        }
        setSelectedIndices(newSelectedIndices);
    };


    // Select all logic
    const handleSelectAll = () => {
        if (selectedIndices.length === paginatedData.length) {
            setSelectedIndices([]); // Deselect all
        } else {
            setSelectedIndices(paginatedData.map((_, index) => index)); // Select all on current page
        }
    };


    const handleToggleStatus = async (eventId, currentStatus) => {
        // Determine the next status
        let nextStatus;
        if (currentStatus === "Pending") {
            nextStatus = "Approved";
        } else if (currentStatus === "Approved") {
            nextStatus = "Rejected";
        } else if (currentStatus === "Rejected") {
            nextStatus = "Approved";
        }
    
        try {
            setLoadingRecordId(eventId); // Show spinner while updating
            await dispatch(updateEventStatus(eventId, nextStatus)); // Dispatch update
            dispatch(fetchAllEvents()); // Refresh event list
        } catch (error) {
            dispatch(showNotification("Failed to toggle status", "error"));
        } finally {
            setLoadingRecordId(null); // Reset loading state
        }
    };
    
    





    const columns = [
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Event ID</span>
                </div>
            ),
            key: "event_id",
            render: (_, __, index) => (typeof index === "number" ? index + 1 : "-"),
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Event Name</span>
                </div>
            ),
            dataIndex: "title",
            key: "title",
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Organized By</span>
                </div>
            ),
            dataIndex: "createdBy",
            key: "createdBy",
            render: (createdBy) => createdBy ? `${createdBy.firstName} ${createdBy.lastName}` : "N/A",
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Location</span>
                </div>
            ),
            dataIndex: "mode",
            key: "mode",

        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Track</span>
                </div>
            ),
            dataIndex: "typeOfEvent",
            key: "typeOfEvent",
        },
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Status</span>
                </div>
            ),
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const isLoading = loadingRecordId === record._id;
        
                return (
                    <Badge
                        color={getStatusColor(status)}
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
                            await handleToggleStatus(record._id, status); // Toggle status dynamically
                        }}
                    />
                );
            },
        },        
        {
            title: (
                <div className="flex items-center">
                    <SvgIcon />
                    <span style={{ color: "#F48567", marginLeft: "8px" }}>Actions</span>
                </div>
            ),
            key: "actions",
            render: (_, record) => (
                <div>
                    <Space>
                        <EyeForm data={record} />
                        <div className="cursor-pointer" onClick={() => handleDelete(record._id)}
                        > <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z" fill="#DD441B" />
                            </svg>
                        </div>
                    </Space>
                </div>
            ),
        }

    ];


    const [selectedCard, setSelectedCard] = useState(0);

    return (



        // <div className="w-[80%] flex flex-col h-full">
        <div className='flex flex-col  p-5  thescreanhe'>


            {/* Page Header */}
            <div className={`flex justify-between items-center mb-6 px-12 py-3 rounded-lg mt- ${darkMode ? 'bg-[#333333]' : 'bg-white'}`}>
                <h1 className="text-2xl ml-[-20px] text-[#F48567]">My Events</h1>
                <div className="flex gap-7">




                    <EventManagementForm />

                </div>
            </div>

            {/* User Metrics Section */}
            <div className="flex justify-between space-x-4 mb-6 px-8">
                {cardData.map((card, index) => (
                    <Card
                        key={index}
                        className={`flex-grow ${darkMode ? "bg-[#1E1E1E] text-[#C7C7C7]" : "bg-gray-100 text-black"
                            } shadow-lg rounded-lg transition-all duration-300 ease-in-out rounded-[10px]
                        ${selectedCard === index ? "bg-[#FFC9BB33] bg-opacity-30 border-[#F48567]" : "hover:bg-[#f486673a]"}`}
                        bordered={true}
                        onClick={() => {
                            setSelectedCard(selectedCard === index ? null : index); // Toggle the selected card
                            setFilter(card.filter);
                        }}
                    >
                        <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>{card.title}</h2>
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
                    <div className="absolute z-50 left-[-22px] top-6">
                        <input
                            className="custom-checkbox border-[#F48567] rounded-full"
                            type="checkbox"
                            checked={selectedIndices.length === paginatedData.length} // Check if all are selected
                            onChange={handleSelectAll} // Handler for toggling select all
                        />
                    </div>

                    <div className={`table-container ${darkMode ? "bg-[#333333]" : "bg-white"} rounded-lg`}>
                        <table
                            className="custom-table bg-[#18181b]"
                            style={{
                                width: "100%",
                                borderCollapse: "separate",
                                borderSpacing: "0 10px",
                            }}
                        >
                            <thead className="bg-[#18181b]">
                                <tr className="rounded-custom">
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className={`${darkMode ? "bg-[#333333]" : "bg-white"} text-white`}
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
                                {filteredData.map((row, rowIndex) => (
                                    <tr key={row.key || rowIndex} className={`${darkMode ? "bg-[#333333]" : "bg-white"} text-white`}>
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} style={{ padding: "10px", textAlign: column.align || "left" }}>
                                                {column.render
                                                    ? column.render(row[column.dataIndex], row, rowIndex) // Pass rowIndex manually
                                                    : row[column.dataIndex] || "N/A"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>




                    {/* Pagination */}
                    <div className="absolute left-[-20px] bottom-0 flex flex-col items-center justify h-full  pt-[59px]">
                        {paginatedData.map((_, index) => (
                            <span key={index} className="h-[65px] flex justify-center items-center">
                                <input
                                    className="custom-checkbox peer/draft border-[#F48567] rounded-full"
                                    type="checkbox"
                                    checked={selectedIndices.includes(index)}
                                    onChange={() => handleRowSelection(index)}
                                />
                            </span>
                        ))}
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

    );
};

export default UserManagement;