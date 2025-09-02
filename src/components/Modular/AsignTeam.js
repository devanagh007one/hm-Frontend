import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import { showNotification } from "../../redux/actions/notificationActions";

const initialTeamData = {
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

const RenameTeamModal = ({
  isOpen,
  onClose,
  onConfirm,
  teamName,
  darkMode,
}) => {
  const [newName, setNewName] = useState(teamName);

  useEffect(() => {
    setNewName(teamName);
  }, [teamName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onConfirm(newName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]">
      <div
        className={`rounded-2xl border border-[#FFFFFF59] shadow-[0_1px_6px_rgba(230,230,230,0.35)] w-[400px] p-6 ${
          darkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-dark"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#C7C7C7]">Rename Team</h2>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center text-[#C7C7C7] mb-2">
              <span>
                Team Name<span className="text-[red]">*</span>
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter team name"
              className={`w-full h-[40px] rounded-lg p-2 border ${
                darkMode
                  ? "bg-[#333333] text-white border-gray-600"
                  : "bg-white text-dark border-gray-300"
              }`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#F48567] text-black w-[140px]"
            >
              Edit Name
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border w-[140px] ${
                darkMode
                  ? "border-gray-600 bg-[#333333]"
                  : "border-gray-300 bg-gray-200"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EyeForm = ({ record }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [teamToRename, setTeamToRename] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [userCurrentTeam, setUserCurrentTeam] = useState(null);

  // Load teams from localStorage on component mount and set current team
  useEffect(() => {
    const savedTeams = localStorage.getItem("customTeams");
    const customTeams = savedTeams ? JSON.parse(savedTeams) : {};

    // Load selected team from localStorage
    const savedSelectedTeam = localStorage.getItem("selectedTeam");
    if (savedSelectedTeam) {
      setSelectedTeamId(savedSelectedTeam);
    }

    // Combine initial teams with custom teams
    const allTeams = { ...initialTeamData, ...customTeams };

    // Get user's current team from the record prop
    if (record && record.teams && record.teams.length > 0) {
      const userTeamId = record.teams[0]; // Assuming user can only be in one team
      const teamName =
        Object.keys(allTeams).find((key) => allTeams[key] === userTeamId) ||
        "Unknown Team";

      setUserCurrentTeam({
        id: userTeamId,
        name: teamName,
      });

      // Set the selected team to the user's current team
      setSelectedTeamId(userTeamId);
    }

    setTeams(
      Object.entries(allTeams).map(([name, id]) => ({
        id,
        name,
        selected: id === (record && record.teams && record.teams[0]),
      }))
    );
  }, [record]);

  // Save custom teams to localStorage
  const saveCustomTeamsToLocalStorage = (updatedTeams) => {
    const customTeams = {};
    updatedTeams.forEach((team) => {
      // Only save teams that are not in initial data (custom teams)
      if (!Object.values(initialTeamData).includes(team.id)) {
        customTeams[team.name] = team.id;
      }
    });
    localStorage.setItem("customTeams", JSON.stringify(customTeams));
  };

  const handleTeamToggle = (id) => {
    // Clear all selections first, then select the clicked one
    const updatedTeams = teams.map((team) => ({
      ...team,
      selected: team.id === id,
    }));

    setTeams(updatedTeams);
    setSelectedTeamId(id);

    // Save selected team to localStorage
    localStorage.setItem("selectedTeam", id);
  };

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
      const updatedTeams = [
        ...teams,
        {
          id: tempId,
          name: newTeamName.trim(),
          selected: false,
        },
      ];

      setTeams(updatedTeams);
      saveCustomTeamsToLocalStorage(updatedTeams);
      setNewTeamName("");
    }
  };

  const handleRenameTeam = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      setTeamToRename(team);
      setShowRenameModal(true);
    }
  };

  const handleRenameConfirm = (newName) => {
    if (teamToRename && newName.trim()) {
      const updatedTeams = teams.map((team) =>
        team.id === teamToRename.id ? { ...team, name: newName.trim() } : team
      );

      setTeams(updatedTeams);
      saveCustomTeamsToLocalStorage(updatedTeams);
      setShowRenameModal(false);
      setTeamToRename(null);
    }
  };

  const handleDeleteTeam = (teamId) => {
    setTeamToDelete(teamId);
    setShowConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    if (teamToDelete) {
      const updatedTeams = teams.filter((team) => team.id !== teamToDelete);
      setTeams(updatedTeams);
      saveCustomTeamsToLocalStorage(updatedTeams);
      setTeamToDelete(null);
    }
    setShowConfirmation(false);
  };

  const handleAssignTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const selectedTeam = teams.find((team) => team.selected);

      if (!selectedTeam) {
        setError("Please select a team");
        return;
      }

      const encryptedId = localStorage.getItem("userId");
      if (!encryptedId) {
        console.error("Encrypted user ID is missing.");
        return;
      }

      let hrUserId = null;
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedId,
          "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
        );
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
        teamNames: [selectedTeam.name], // Use array with single team name
      };

      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/teamops/assign-teams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      dispatch(showNotification(result.message, "success"));
      setSuccess("Team assigned successfully!");

      // Update the user's current team after assignment
      setUserCurrentTeam({
        id: selectedTeam.id,
        name: selectedTeam.name,
      });

      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to assign team");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleAssignClick = () => {
    const selectedTeam = teams.find((team) => team.selected);

    if (!selectedTeam) {
      setError("Please select a team");
      return;
    }

    setShowConfirmation(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      {/* Eye Icon to Open Modal */}
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer flex flex-row"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 16.2653L14.2821 18.9747L13.5128 18.2055L14.906 16.8123H9.65812V15.7183H14.906L13.5128 14.3252L14.2821 13.5559L17 16.2653ZM11.6667 17.9064L12.7607 19.0004H2V3.68413H6.37607C6.37607 3.38213 6.43305 3.10008 6.54701 2.83797C6.66097 2.57587 6.81766 2.34225 7.01709 2.13712C7.21652 1.93199 7.44729 1.77530 7.70940 1.66703C7.97151 1.55877 8.25641 1.50179 8.56410 1.49609C8.86610 1.49609 9.14815 1.55307 9.41026 1.66703C9.67236 1.78099 9.90598 1.93769 10.1111 2.13712C10.3162 2.33655 10.4729 2.56732 10.5812 2.82943C10.6895 3.09154 10.7464 3.37644 10.7521 3.68413H15.1282V12.8551L14.0342 11.7611V4.77815H12.9402V6.96618H4.18803V4.77815H3.09402V17.9064H11.6667ZM5.28205 4.77815V5.87216H11.8462V4.77815H9.65812V3.68413C9.65812 3.53028 9.62963 3.38783 9.57265 3.25678C9.51567 3.12572 9.43875 3.01176 9.34188 2.91490C9.24501 2.81803 9.12820 2.73826 8.99145 2.67558C8.85470 2.61290 8.71225 2.58441 8.56410 2.59011C8.41026 2.59011 8.26781 2.61860 8.13675 2.67558C8.00570 2.73256 7.89174 2.80948 7.79487 2.90635C7.69801 3.00322 7.61823 3.12003 7.55556 3.25678C7.49288 3.39353 7.46439 3.53598 7.47009 3.68413V4.77815H5.28205Z"
            fill="#C7C7C7"
          />
        </svg>
      </div>

      {/* Main Modal */}
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
                onClick={handleCloseModal}
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

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {teams.map((team) => {
                const isCurrentTeam = team.id === userCurrentTeam?.id;

                return (
                  <div
                    key={team.id}
                    className={`flex items-center p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-400 cursor-pointer gap-4 ${
                      isCurrentTeam ? " bg-opacity-20" : ""
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center"
                      onClick={() => handleTeamToggle(team.id)}
                    >
                      {team.selected && (
                        <div className="w-2 h-2 rounded-full bg-[#F48567]" />
                      )}
                    </div>
                    <div className="flex justify-between w-full items-center">
                      <span
                        className={`text-sm flex-1  ${
                          darkMode ? "text-white" : "text-dark"
                        }`}
                        onClick={() => handleTeamToggle(team.id)}
                      >
                        {team.name}
                        <span className="text-[#F48567] ml-2 text-xs">
                          {isCurrentTeam && " (Currently Assigned)"}
                        </span>
                      </span>
                      {!Object.values(initialTeamData).includes(team.id) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRenameTeam(team.id)}
                            className="hover:opacity-70 transition-opacity"
                          >
                            {/* Rename icon would go here */}
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="hover:opacity-70 transition-opacity"
                          >
                            {/* Delete icon would go here */}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
                onClick={handleCloseModal}
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

      {/* Rename Team Modal */}
      <RenameTeamModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setTeamToRename(null);
        }}
        onConfirm={handleRenameConfirm}
        teamName={teamToRename?.name || ""}
        darkMode={darkMode}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setTeamToDelete(null);
        }}
        onConfirm={teamToDelete ? handleDeleteConfirm : handleAssignTeams}
        title="Confirmation"
        message={
          teamToDelete
            ? "Are you sure you want to delete this team?"
            : "Are you sure you want to assign this team?"
        }
        confirmText={teamToDelete ? "Delete" : "Assign"}
        cancelText="Cancel"
        darkMode={darkMode}
      />
    </>
  );
};

export default EyeForm;
