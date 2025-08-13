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
  const [lockedTeams, setLockedTeams] = useState([]);

  // Load teams from localStorage on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem("customTeams");
    const customTeams = savedTeams ? JSON.parse(savedTeams) : {};

    // Combine initial teams with custom teams
    const allTeams = { ...initialTeamData, ...customTeams };

    setTeams(
      Object.entries(allTeams).map(([name, id]) => ({
        id,
        name,
        selected: record?.teams?.includes(id) || false,
      }))
    );

    if (record?.teams) {
      setLockedTeams(record.teams);
    }
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
    // Don't allow toggling locked teams
    if (lockedTeams.includes(id)) return;

    setTeams(
      teams.map((team) =>
        team.id === id ? { ...team, selected: !team.selected } : team
      )
    );
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

      const selectedTeamNames = teams
        .filter((team) => team.selected)
        .map((team) => team.name);

      if (selectedTeamNames.length === 0) {
        setError("Please select at least one team");
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
        teamNames: selectedTeamNames,
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
      setSuccess("Teams assigned successfully!");
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
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
            d="M17 16.2653L14.2821 18.9747L13.5128 18.2055L14.906 16.8123H9.65812V15.7183H14.906L13.5128 14.3252L14.2821 13.5559L17 16.2653ZM11.6667 17.9064L12.7607 19.0004H2V3.68413H6.37607C6.37607 3.38213 6.43305 3.10008 6.54701 2.83797C6.66097 2.57587 6.81766 2.34225 7.01709 2.13712C7.21652 1.93199 7.44729 1.7753 7.7094 1.66703C7.97151 1.55877 8.25641 1.50179 8.5641 1.49609C8.8661 1.49609 9.14815 1.55307 9.41026 1.66703C9.67236 1.78099 9.90598 1.93769 10.1111 2.13712C10.3162 2.33655 10.4729 2.56732 10.5812 2.82943C10.6895 3.09154 10.7464 3.37644 10.7521 3.68413H15.1282V12.8551L14.0342 11.7611V4.77815H12.9402V6.96618H4.18803V4.77815H3.09402V17.9064H11.6667ZM5.28205 4.77815V5.87216H11.8462V4.77815H9.65812V3.68413C9.65812 3.53028 9.62963 3.38783 9.57265 3.25678C9.51567 3.12572 9.43875 3.01176 9.34188 2.9149C9.24501 2.81803 9.1282 2.73826 8.99145 2.67558C8.8547 2.6129 8.71225 2.58441 8.5641 2.59011C8.41026 2.59011 8.26781 2.6186 8.13675 2.67558C8.0057 2.73256 7.89174 2.80948 7.79487 2.90635C7.69801 3.00322 7.61823 3.12003 7.55556 3.25678C7.49288 3.39353 7.46439 3.53598 7.47009 3.68413V4.77815H5.28205Z"
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
                  className={`w-[284px] h-[40px] rounded-lg p-2 border ${
                    darkMode
                      ? "bg-[#333333] text-white border-gray-600"
                      : "bg-white text-dark border-gray-300"
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

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-400 cursor-pointer gap-4"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center ${
                      lockedTeams.includes(team.id) ? "opacity-50" : ""
                    }`}
                    onClick={() =>
                      !lockedTeams.includes(team.id) &&
                      handleTeamToggle(team.id)
                    }
                  >
                    {team.selected && (
                      <div className="w-2 h-2 rounded-full bg-[#F48567]" />
                    )}
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <span
                      className={`text-sm flex-1 ${
                        darkMode ? "text-white" : "text-dark"
                      } ${
                        lockedTeams.includes(team.id) ? "text-gray-500" : ""
                      }`}
                      onClick={() =>
                        !lockedTeams.includes(team.id) &&
                        handleTeamToggle(team.id)
                      }
                    >
                      {team.name}
                    </span>
                    {!lockedTeams.includes(team.id) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRenameTeam(team.id)}
                          className="hover:opacity-70 transition-opacity"
                        >
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
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="hover:opacity-70 transition-opacity"
                        >
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
                        </button>
                      </div>
                    )}
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
        title="Confirmation"
        message={
          teamToDelete
            ? "Are you sure you want to delete this team?"
            : "Are you sure you want to assign these teams?"
        }
        confirmText={teamToDelete ? "Delete" : "Assign"}
        cancelText="Cancel"
        darkMode={darkMode}
      />
    </>
  );
};

export default EyeForm;
