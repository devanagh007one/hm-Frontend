import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignTeams } from "../../redux/actions/AllteamAction";

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

const AssignTeamModal = ({
  showModal,
  setShowModal,
  userId,
  userTeams = [],
}) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
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

  // Helper function to get team name by ID
  const getTeamNameById = (teamId) => {
    const teamEntry = Object.entries(initialTeamData).find(
      ([name, id]) => id === teamId
    );
    return teamEntry ? teamEntry[0] : null;
  };

  // Load teams and set user's assigned teams as selected
  useEffect(() => {
    // Load custom teams from localStorage for this specific user
    const savedTeams = localStorage.getItem(`customTeams_${userId}`);
    const customTeams = savedTeams ? JSON.parse(savedTeams) : {};

    // Combine initial teams with custom teams
    const allTeams = { ...initialTeamData, ...customTeams };

    // Create team objects with selection based on user's teams from API
    const teamObjects = Object.entries(allTeams).map(([name, id]) => ({
      id,
      name,
      selected: userTeams.includes(id), // Select teams that user is assigned to
    }));

    setTeams(teamObjects);

    // Set the first assigned team as selected for UI purposes
    if (userTeams.length > 0) {
      setSelectedTeamId(userTeams[0]);
    }
  }, [userId, userTeams]);

  // Save custom teams to localStorage with user-specific key
  const saveCustomTeamsToLocalStorage = (updatedTeams) => {
    const customTeams = {};
    updatedTeams.forEach((team) => {
      // Only save teams that are not in initial data (custom teams)
      if (!Object.values(initialTeamData).includes(team.id)) {
        customTeams[team.name] = team.id;
      }
    });
    localStorage.setItem(`customTeams_${userId}`, JSON.stringify(customTeams));
  };

  // Clear teams on logout (call this function when user logs out)
  const clearCustomTeams = () => {
    localStorage.removeItem(`customTeams_${userId}`);
    setTeams(
      Object.entries(initialTeamData).map(([name, id]) => ({
        id,
        name,
        selected: userTeams.includes(id),
      }))
    );
  };

  const handleTeamToggle = (id) => {
    // For single selection mode
    const updatedTeams = teams.map((team) => ({
      ...team,
      selected: team.id === id,
    }));

    setTeams(updatedTeams);
    setSelectedTeamId(id);
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

      // Use array with single team name
      const result = await dispatch(
        assignTeams(userId, userId, [selectedTeam.name])
      );

      if (result.success) {
        setSuccess("Team assigned successfully!");
        setTimeout(() => {
          setShowModal(false);
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.error);
      }
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

  // Display current user's teams
  const currentUserTeamNames = userTeams
    .map((teamId) => getTeamNameById(teamId))
    .filter(Boolean)
    .join(", ");

  return (
    <>
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
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-400 cursor-pointer gap-4"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center ${
                      team.selected ? " " : ""
                    }`}
                    onClick={() => handleTeamToggle(team.id)}
                  >
                    {team.selected && (
                      <div className="w-2 h-2 rounded-full bg-[#F48567]" />
                    )}
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <span
                      className={`text-sm flex-1 ${
                        darkMode ? "text-white" : "text-dark"
                      } ${userTeams.includes(team.id) ? "font-semibold" : ""}`}
                      onClick={() => handleTeamToggle(team.id)}
                    >
                      {team.name}
                      {userTeams.includes(team.id) && (
                        <span className="text-[#F48567] ml-2 text-xs">
                          (Currently Assigned)
                        </span>
                      )}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRenameTeam(team.id)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        {/* Rename icon can be added here */}
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        {/* Delete icon can be added here */}
                      </button>
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
        message={teamToDelete ? "Are you sure ?" : "Are you sure ?"}
        confirmText={teamToDelete ? "Yes" : "Confirm"}
        darkMode={darkMode}
      />
    </>
  );
};

export default AssignTeamModal;
