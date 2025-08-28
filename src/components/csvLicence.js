import React, { useState, useEffect } from "react";
import { Button, Table, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { licencingUser } from "../redux/actions/allLicensingGet"; // Import your action here
import { showNotification } from "../redux/actions/notificationActions"; // Import showNotification
import Papa from "papaparse";
import * as XLSX from "xlsx"; // Import XLSX for handling Excel files

import "./popup.css";

const ParentComponent = () => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [formData, setFormData] = useState([]);
  const [editedRows, setEditedRows] = useState(new Set()); // Set to track edited rows

  useEffect(() => {
    dispatch(licencingUser());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      const fileType = file.name.split(".").pop().toLowerCase();

      reader.onload = (event) => {
        if (fileType === "csv") {
          Papa.parse(event.target.result, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const { data, meta } = result;

              // Log the raw data for debugging
              console.log("Parsed CSV data:", data);

              const columns = meta.fields.map((field) => ({
                title: field,
                dataIndex: field,
                key: field,
                editable: true,
              }));

              // Normalize TRUE/FALSE for 'active' field and convert to string
              const normalizedData = data.map((item) => {
                const normalizedItem = { ...item };

                // Log the active field before normalization
                console.log(
                  "Original active field value:",
                  normalizedItem.active
                );

                if (
                  normalizedItem.active === "TRUE" ||
                  normalizedItem.active === "true" ||
                  normalizedItem.active === true
                ) {
                  normalizedItem.active = "TRUE";
                } else if (
                  normalizedItem.active === "FALSE" ||
                  normalizedItem.active === "false" ||
                  normalizedItem.active === false
                ) {
                  normalizedItem.active = "FALSE";
                }

                // Log the normalized active field value
                console.log(
                  "Normalized active field value:",
                  normalizedItem.active
                );

                return normalizedItem;
              });

              setTableColumns(columns);
              setTableData(
                normalizedData.map((item, index) => ({ ...item, key: index }))
              );
              setFormData(normalizedData);
              setEditedRows(new Set());
            },
            error: (error) => {
              alert(`Error reading file: ${error.message}`);
            },
          });
        } else if (fileType === "xls" || fileType === "xlsx") {
          const workbook = XLSX.read(event.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheetData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );

          // Log the raw data for debugging
          console.log("Parsed Excel data:", sheetData);

          // Normalize TRUE/FALSE for 'active' field and convert to string
          const normalizedData = sheetData.map((item) => {
            const normalizedItem = { ...item };

            // Log the active field before normalization
            console.log("Original active field value:", normalizedItem.active);

            if (
              normalizedItem.active === "TRUE" ||
              normalizedItem.active === "true" ||
              normalizedItem.active === true
            ) {
              normalizedItem.active = "TRUE";
            } else if (
              normalizedItem.active === "FALSE" ||
              normalizedItem.active === "false" ||
              normalizedItem.active === false
            ) {
              normalizedItem.active = "FALSE";
            }

            // Log the normalized active field value
            console.log(
              "Normalized active field value:",
              normalizedItem.active
            );

            return normalizedItem;
          });

          const columns = Object.keys(normalizedData[0] || {}).map((field) => ({
            title: field,
            dataIndex: field,
            key: field,
            editable: true,
          }));

          setTableColumns(columns);
          setTableData(
            normalizedData.map((item, index) => ({ ...item, key: index }))
          );
          setFormData(normalizedData);
          setEditedRows(new Set());
        } else {
          alert(
            "Unsupported file type. Please upload a .csv, .xls, or .xlsx file."
          );
        }
      };

      if (fileType === "csv") {
        reader.readAsText(file);
      } else if (fileType === "xls" || fileType === "xlsx") {
        reader.readAsBinaryString(file);
      } else {
        alert(
          "Unsupported file type. Please upload a .csv, .xls, or .xlsx file."
        );
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    setIsUploaded(true);
  };

  const handleViewPopup = () => {
    setShowPopup(true);
    setIsUploaded(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFile(null);
    setTableData([]);
    setTableColumns([]);
  };

  const handleSave = (row) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setTableData(newData);
    // Add the row to editedRows if it's been modified
    setEditedRows((prev) => new Set(prev).add(row.key));
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(record[dataIndex] || "NA"); // Set default to "NA" if no data

    useEffect(() => {
      setValue(record[dataIndex] || "NA"); // Update value to "NA" if no data
    }, [record, dataIndex]);

    const toggleEdit = () => {
      setEditing(!editing);
    };

    const save = () => {
      setEditing(false);
      handleSave({ ...record, [dataIndex]: value });
    };

    return (
      <td {...restProps}>
        {editable ? (
          editing ? (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onPressEnter={save}
              onBlur={save}
            />
          ) : (
            <div onClick={toggleEdit} style={{ cursor: "pointer" }}>
              {children}
            </div>
          )
        ) : (
          children
        )}
      </td>
    );
  };

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const editableColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave, // Passing handleSave function to EditableCell
      }),
    };
  });

  const handleSendData = () => {
    const rowsToSend = tableData.map((row) => {
      // Convert 'active' to lowercase if it's a string
      if (typeof row.active === "string") {
        row.active = row.active.toLowerCase();
      }

      if (editedRows.has(row.key)) {
        return row; // Edited row
      } else {
        const originalRow = formData.find((item) => item.key === row.key); // Original row from formData
        return originalRow ? originalRow : row;
      }
    });

    if (rowsToSend.length === 0) {
      alert("No data to send. Please upload a file first.");
      return;
    }

    const isValidData = (data) => {
      const requiredFields = [
        "organisationName",
        "industryType",
        "organizationSize",
        "contactPersonName",
        "contactPersonEmail",
        "address1",
        "city",
        "state",
        "pinCode",
        "phoneNumber",
        "demoLicence",
        "numberOfLicence",
        "period",
        "active",
      ];

      let missingFields = [];

      // Collect missing or invalid required fields
      for (let field of requiredFields) {
        if (
          !data[field] ||
          (typeof data[field] === "string" && data[field].trim() === "")
        ) {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        // Notify user about missing fields one by one with a delay
        missingFields.forEach((field, index) => {
          setTimeout(() => {
            dispatch(
              showNotification(`${field} is required and missing`, "error")
            );
          }, index * 200); // 200ms delay for each notification
        });
        return false; // Mark as invalid
      }

      return true; // Data is valid
    };

    let allValid = true; // Flag to track if all rows are valid

    rowsToSend.forEach((data) => {
      if (!isValidData(data)) {
        allValid = false; // Mark as invalid if any row fails validation
      } else {
        const formattedData = {
          ...data,
          organisationName: data.organisationName,
          industryType: data.industryType,
          organizationSize: data.organizationSize,
          contactPersonName: data.contactPersonName,
          contactPersonEmail: data.contactPersonEmail,
          address1: data.address1,
          address2: data.address2 || "",
          city: data.city,
          state: data.state,
          pinCode: data.pinCode,
          phoneNumber: data.phoneNumber,
          logo: data.logo || "",
          demoLicence: data.demoLicence,
          numberOfLicence: data.numberOfLicence,
          period: data.period,
          comment: data.comment || "",
          active: data.active,
        };

        dispatch(licencingUser(formattedData));
      }
    });

    if (allValid) {
      handleClosePopup(); // Close popup only if all rows are valid
    }
  };

  return (
    <>
      <Button
        className="text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
        icon={
          <svg
            width="46"
            height="47"
            viewBox="0 0 46 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_b_3004_2010)">
              <rect
                x="0.1"
                y="0.6"
                width="45.8"
                height="45.8"
                rx="11.9"
                stroke="#F48567"
                stroke-width="0.2"
              />
              <path
                d="M21.75 28.5V18.3125L18.5 21.5625L16.75 19.75L23 13.5L29.25 19.75L27.5 21.5625L24.25 18.3125V28.5H21.75ZM15.5 33.5C14.8125 33.5 14.2242 33.2554 13.735 32.7663C13.2458 32.2771 13.0008 31.6883 13 31V27.25H15.5V31H30.5V27.25H33V31C33 31.6875 32.7554 32.2763 32.2663 32.7663C31.7771 33.2563 31.1883 33.5008 30.5 33.5H15.5Z"
                fill="#F48567"
              />
            </g>
            <defs>
              <filter
                id="filter0_b_3004_2010"
                x="-4"
                y="-3.5"
                width="54"
                height="54"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_3004_2010"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_3004_2010"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        }
        onClick={handleViewPopup} // Toggle search input on button click
      />

      {showPopup && (
        <div className="fixed inset-0 bg-[#222222] bg-opacity-70 flex justify-center items-center z-50">
          {!isUploaded ? (
            <div className="bg-[#222222] rounded-lg p-6 w-[400px] text-white shadow-lg relative">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-6 text-center">
                  Import file
                </h2>
                <svg
                  onClick={handleClosePopup}
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_3004_2840)">
                    <path
                      d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z"
                      fill="#C7C7C7"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3004_2840">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="mb-6">
                <div className="relative bg-gray-700 rounded-lg p-4 mb-4 flex items-center">
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <p className="text-gray-400">
                    {selectedFile
                      ? selectedFile.name
                      : "Upload .csv or .xls or .xlsx file"}
                  </p>
                  <AiOutlineUpload className="text-gray-400 text-xl ml-auto" />
                </div>
              </div>
              <button
                onClick={handleUpload}
                className="w-full bg-[#F48567] text-white py-2 rounded-lg hover:bg-[#e57357] transition"
              >
                Upload
              </button>
            </div>
          ) : (
            <div className="bg-[#222222] rounded-lg p-6 w-9/12 text-white shadow-lg relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-white hover:text-gray-400 text-2xl"
              >
                <AiOutlineClose />
              </button>
              {tableData.length > 0 && (
                <div className="flex-grow overflow-x-auto maintable-upl">
                  <h3 className="text-lg font-semibold mb-4">Uploaded CSV</h3>
                  <Table
                    components={components}
                    columns={editableColumns}
                    dataSource={tableData}
                    rowKey={(record) => record.key}
                    className={`rounded-lg the-uploardtable ${
                      darkMode ? "bg-[#333333]" : "bg-white"
                    } text-white`}
                    scroll={{ x: "max-content" }}
                    rowClassName={`rounded-lg ${
                      darkMode ? "bg-[#333333]" : "bg-white"
                    } text-white`}
                    pagination={false} // Disable pagination
                  />

                  <button
                    className="w-24 bg-[#F48567] text-white py-2 rounded-lg hover:bg-[#e57357] mt-3 transition"
                    onClick={handleSendData} // Send data when clicked
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ParentComponent;
