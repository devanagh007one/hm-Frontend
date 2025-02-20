import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Checkbox, Button } from 'antd';
import "../popup.css";
import CryptoJS from "crypto-js";
import { showNotification } from "../../redux/actions/notificationActions"; // Import showNotification


const EyeForm = ({ record }) => {
    const darkMode = useSelector((state) => state.theme.darkMode);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedTeamLabels, setSelectedTeamLabels] = useState([]); // New State


    const dispatch = useDispatch();

    const handleViewPopup = () => {
        setShowPopup(true);
        setSelectedTeams([]);
        setSelectedTeamLabels([]);
        console.log(record);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const teamOptions = [
        { label: "Behemoth Bears", value: "0cfa266c-092e-428f-a1db-3a9012c210e9" },
        { label: "Kindred Koalas", value: "16a5979c-4b64-40c3-84c8-6b06ab397c3f" },
        { label: "Precious Possums", value: "67665442-f588-46b4-aaf1-64552eeb2828" },
        { label: "Thundering Titans", value: "a9813da8-a9fe-4c2f-93ca-39c4f0bd4324" },
        { label: "Unstoppable Unicorns", value: "c1b945bd-31c0-4177-91e2-9b156425b30c" },
        { label: "Raging Rhinos", value: "6833f889-3040-463b-bb44-22bac6372672" },
        { label: "Voracious Wolves", value: "b52c5bec-7700-4253-886e-e4da4546ea43" }
    ];

    const handleTeamChange = (selectedValues) => {
        setSelectedTeams(selectedValues);
        
        // Get the labels of selected teams
        const selectedLabels = teamOptions
            .filter(team => selectedValues.includes(team.value))
            .map(team => team.label);
        
        setSelectedTeamLabels(selectedLabels);
    };


    const handleSave = async () => {
        const encryptedId = localStorage.getItem("userId");
        if (!encryptedId) {
            console.error("Encrypted user ID is missing.");
            return;
        }
    
        let hrUserId = null;
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedId, "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1");
            hrUserId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error("Error decrypting user ID:", error);
            return;
        }
    
        if (!record?.userId) {
            console.error("Target user ID is missing.");
            return;
        }
    
        const payload = {
            hrUserId,
            targetUserId: record.userId,
            teamNames: selectedTeamLabels, // Send selected team labels
        };
    
        console.log("Sending data:", payload);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_STATIC_API_URL}/api/teamops/assign-teams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            // console.log("Response from API:", result);
                dispatch(showNotification(result.message, "sucess"));
    
            // Optionally, close popup after successful submission
            setShowPopup(false);
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };
    

    return (
        <>
            <div onClick={handleViewPopup} className="cursor-pointer flex flex-row">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 16.2653L14.2821 18.9747L13.5128 18.2055L14.906 16.8123H9.65812V15.7183H14.906L13.5128 14.3252L14.2821 13.5559L17 16.2653ZM11.6667 17.9064L12.7607 19.0004H2V3.68413H6.37607C6.37607 3.38213 6.43305 3.10008 6.54701 2.83797C6.66097 2.57587 6.81766 2.34225 7.01709 2.13712C7.21652 1.93199 7.44729 1.7753 7.7094 1.66703C7.97151 1.55877 8.25641 1.50179 8.5641 1.49609C8.8661 1.49609 9.14815 1.55307 9.41026 1.66703C9.67236 1.78099 9.90598 1.93769 10.1111 2.13712C10.3162 2.33655 10.4729 2.56732 10.5812 2.82943C10.6895 3.09154 10.7464 3.37644 10.7521 3.68413H15.1282V12.8551L14.0342 11.7611V4.77815H12.9402V6.96618H4.18803V4.77815H3.09402V17.9064H11.6667ZM5.28205 4.77815V5.87216H11.8462V4.77815H9.65812V3.68413C9.65812 3.53028 9.62963 3.38783 9.57265 3.25678C9.51567 3.12572 9.43875 3.01176 9.34188 2.9149C9.24501 2.81803 9.1282 2.73826 8.99145 2.67558C8.8547 2.6129 8.71225 2.58441 8.5641 2.59011C8.41026 2.59011 8.26781 2.6186 8.13675 2.67558C8.0057 2.73256 7.89174 2.80948 7.79487 2.90635C7.69801 3.00322 7.61823 3.12003 7.55556 3.25678C7.49288 3.39353 7.46439 3.53598 7.47009 3.68413V4.77815H5.28205Z" fill="#C7C7C7" />
                </svg>
            </div>

            {showPopup && (
                <div className="popup-overlay asign-tem">
                    <div className={`rounded-xl border border-gray-600 shadow-lg w-[30%] overflow-y-auto p-8 relative flex flex-col max-h-[95%] ${darkMode ? 'bg-[#222222] text-white' : 'bg-white text-black'}`}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl mb-6">Select Teams</h2>
                            <svg className="cursor-pointer mt-1 mb-6" onClick={handleClosePopup}
                                width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_3261_1019)">
                                    <path d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z" fill="#C7C7C7" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3261_1019">
                                        <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <section>
                            <Checkbox.Group
                                options={teamOptions}
                                value={selectedTeams}
                                onChange={handleTeamChange}
                                className="mb-4 flex flex-col gap-3"
                            />
                        </section>
                        <div className="flex gap-4 mt-4 w-full">
                            <div className="flex flex-col w-full">
                                <button
                                    onClick={handleSave} className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                                >
                                    Save
                                </button>
                            </div>


                            <div className="flex flex-col w-full">
                                {/* Save Button */}
                                <button

                                    onClick={handleClosePopup}
                                    className="bg-[#C7C7C7] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                       
                    </div>
                </div>
            )}
        </>
    );
};

export default EyeForm;
