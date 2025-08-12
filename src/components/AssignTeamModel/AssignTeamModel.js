import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignTeams } from "../../redux/actions/AllteamAction";

const teamData = {
  "Behemoth Bears": "0cfa266c-092e-428f-a1db-3a9012c210e9",
  "Kindred Koalas": "16a5979c-4b64-40c3-84c8-6b06ab397c3f",
  "Precious Possums": "67665442-f588-46b4-aaf1-64552eeb2828",
  "Thundering Titans": "a9813da8-a9fe-4c2f-93ca-39c4f0bd4324",
  "Unstoppable Unicorns": "c1b945bd-31c0-4177-91e2-9b156425b30c",
  "Raging Rhinos": "6833f889-3040-463b-bb44-22bac6372672",
  "Voracious Wolves": "b52c5bec-7700-4253-886e-e4da4546ea43",
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
      <div
        className={`rounded-2xl border border-[#FFFFFF59] shadow-[0_1px_6px_rgba(230,230,230,0.35)] w-[400px] p-6 ${
          darkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-dark"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6 text-center font-[Figtree] text-[20px]">{message}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg bg-[#F48567] text-black w-[140px]`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border  w-[140px] ${
              darkMode
                ? "border-gray-600 bg-[#333333]"
                : "border-gray-300 bg-gray-200"
            }`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignTeamModal = ({ showModal, setShowModal, userId }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [newTeamName, setNewTeamName] = useState("");
  const [teams, setTeams] = useState(
    Object.entries(teamData).map(([name, id]) => ({
      id,
      name,
      selected: false,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTeamToggle = (id) => {
    setTeams(
      teams.map((team) =>
        team.id === id ? { ...team, selected: !team.selected } : team
      )
    );
  };

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
      setTeams([
        ...teams,
        {
          id: tempId,
          name: newTeamName,
          selected: false,
        },
      ]);
      setNewTeamName("");
    }
  };

  const handleAssignTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const selectedTeamNames = teams
        .filter((team) => team.selected)
        .map((team) => team.name);

      if (selectedTeamNames.length === 0) {
        setError("Please select at least one team");
        return;
      }

      // Use the same userId for both user and HR
      const result = await dispatch(
        assignTeams(userId, userId, selectedTeamNames)
      );

      if (result.success) {
        setSuccess("Teams assigned successfully!");
        setTimeout(() => {
          setShowModal(false);
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Failed to assign teams");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleAssignClick = () => {
    const selectedTeamNames = teams
      .filter((team) => team.selected)
      .map((team) => team.name);

    if (selectedTeamNames.length === 0) {
      setError("Please select at least one team");
      return;
    }

    setShowConfirmation(true);
  };

  return (
    <>
      {/* SVG Trigger */}
      <div onClick={() => setShowModal(true)} className="cursor-pointer">
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_b_4249_1934)">
            <rect
              x="0.1"
              y="0.1"
              width="45.8"
              height="45.8"
              rx="11.9"
              stroke="#F48567"
              strokeWidth="0.2"
            />
            <path
              d="M21.75 28V17.8125L18.5 21.0625L16.75 19.25L23 13L29.25 19.25L27.5 21.0625L24.25 17.8125V28H21.75ZM15.5 33C14.8125 33 14.2242 32.7554 13.735 32.2663C13.2458 31.7771 13.0008 31.1883 13 30.5V26.75H15.5V30.5H30.5V26.75H33V30.5C33 31.1875 32.7554 31.7763 32.2663 32.2663C31.7771 32.7563 31.1883 33.0008 30.5 33H15.5Z"
              fill="#F48567"
            />
          </g>
          <defs>
            <filter
              id="filter0_b_4249_1934"
              x="-4"
              y="-4"
              width="54"
              height="54"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_4249_1934"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_4249_1934"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-2xl border border-[#FFFFFF59] shadow-[0_1px_6px_rgba(230,230,230,0.35)] w-[460px] max-w-3xl p-8 relative flex flex-col ${
              darkMode ? "bg-[#1E1E1E] text-white" : "bg-[#fff] text-dark"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#C7C7C7]">
                Assign Team
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3261_1019)">
                    <path
                      d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z"
                      fill="#C7C7C7"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3261_1019">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center text-[#C7C7C7] mb-2">
                <span>
                  Add new team<span className="text-[red]">*</span>
                </span>
              </div>
              <div className="flex justify-between">
                <input
                  type="text"
                  placeholder="Enter additional team name"
                  className={`w-[284px] h-[40px] rounded-lg p-2 ${
                    darkMode ? "bg-[#333333] text-white" : "bg-white text-dark"
                  }`}
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <button
                  onClick={handleAddTeam}
                  className="w-[102px] h-[37px] text-black p-2 rounded-lg bg-[#F48567]"
                >
                  Add team
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-400 cursor-pointer gap-4"
                  onClick={() => handleTeamToggle(team.id)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center ${
                      team.selected ? " " : ""
                    }`}
                  >
                    {team.selected && (
                      <div className="w-2 h-2 rounded-full bg-[#F48567]" />
                    )}
                  </div>
                  <div className="flex justify-between w-full">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-white" : "text-dark"
                      }`}
                    >
                      {team.name}
                    </span>
                    <div className="flex gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.16"
                          d="M4.16683 13.3333L3.3335 16.6667L6.66683 15.8333L15.0002 7.5L12.5002 5L4.16683 13.3333Z"
                          fill="#C7C7C7"
                        />
                        <path
                          d="M12.5002 5.00001L15.0002 7.50001M10.8335 16.6667H17.5002M4.16683 13.3333L3.3335 16.6667L6.66683 15.8333L16.3218 6.17835C16.6343 5.8658 16.8098 5.44195 16.8098 5.00001C16.8098 4.55807 16.6343 4.13423 16.3218 3.82168L16.1785 3.67835C15.8659 3.36589 15.4421 3.19037 15.0002 3.19037C14.5582 3.19037 14.1344 3.36589 13.8218 3.67835L4.16683 13.3333Z"
                          stroke="#C7C7C7"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.4375 3.0625V3.375H10.5625V3.0625C10.5625 2.6481 10.3979 2.25067 10.1049 1.95765C9.81183 1.66462 9.4144 1.5 9 1.5C8.5856 1.5 8.18817 1.66462 7.89515 1.95765C7.60212 2.25067 7.4375 2.6481 7.4375 3.0625ZM6.1875 3.375V3.0625C6.1875 2.31658 6.48382 1.60121 7.01126 1.07376C7.53871 0.546316 8.25408 0.25 9 0.25C9.74592 0.25 10.4613 0.546316 10.9887 1.07376C11.5162 1.60121 11.8125 2.31658 11.8125 3.0625V3.375H16.5C16.6658 3.375 16.8247 3.44085 16.9419 3.55806C17.0592 3.67527 17.125 3.83424 17.125 4C17.125 4.16576 17.0592 4.32473 16.9419 4.44194C16.8247 4.55915 16.6658 4.625 16.5 4.625H15.5575L14.375 14.98C14.2878 15.7426 13.9230 16.4465 13.3501 16.9573C12.7772 17.4682 12.0363 17.7504 11.2687 17.75H6.73125C5.96366 17.7504 5.22279 17.4682 4.64991 16.9573C4.07702 16.4465 3.7122 15.7426 3.625 14.98L2.4425 4.625H1.5C1.33424 4.625 1.17527 4.55915 1.05806 4.44194C0.940848 4.32473 0.875 4.16576 0.875 4C0.875 3.83424 0.940848 3.67527 1.05806 3.55806C1.17527 3.44085 1.33424 3.375 1.5 3.375H6.1875ZM7.75 7.4375C7.75 7.27174 7.68415 7.11277 7.56694 6.99556C7.44973 6.87835 7.29076 6.8125 7.125 6.8125C6.95924 6.8125 6.80027 6.87835 6.68306 6.99556C6.56585 7.11277 6.5 7.27174 6.5 7.4375V13.6875C6.5 13.8533 6.56585 14.0122 6.68306 14.1294C6.80027 14.2467 6.95924 14.3125 7.125 14.3125C7.29076 14.3125 7.44973 14.2467 7.56694 14.1294C7.68415 14.0122 7.75 13.8533 7.75 13.6875V7.4375ZM10.875 6.8125C10.7092 6.8125 10.5503 6.87835 10.4331 6.99556C10.3158 7.11277 10.25 7.27174 10.25 7.4375V13.6875C10.25 13.8533 10.3158 14.0122 10.4331 14.1294C10.5503 14.2467 10.7092 14.3125 10.875 14.3125C11.0408 14.3125 11.1997 14.2467 11.3169 14.1294C11.4342 14.0122 11.5 13.8533 11.5 13.6875V7.4375C11.5 7.27174 11.4342 7.11277 11.3169 6.99556C11.1997 6.87835 11.0408 6.8125 10.875 6.8125Z"
                            fill="#DD441B"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center space-x-3">
              <button
                onClick={handleAssignClick}
                disabled={isLoading}
                className={`px-4 py-2 bg-[#F48567] text-black w-[184px] rounded-lg ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Assigning..." : "Assign"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setSuccess(null);
                }}
                disabled={isLoading}
                className={`px-4 py-2 border border-gray-600 w-[184px] text-black rounded-lg ${
                  darkMode ? "bg-[#C7C7C7]" : "bg-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleAssignTeams}
        message="Are you sure?"
        confirmText="Yes"
        darkMode={darkMode}
      />
    </>
  );
};

export default AssignTeamModal;
