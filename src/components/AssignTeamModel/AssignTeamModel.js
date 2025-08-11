import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignTeams } from "../../redux/actions/AllteamAction"; // Update the path to your action file

const teamData = {
  "Behemoth Bears": "0cfa266c-092e-428f-a1db-3a9012c210e9",
  "Kindred Koalas": "16a5979c-4b64-40c3-84c8-6b06ab397c3f",
  "Precious Possums": "67665442-f588-46b4-aaf1-64552eeb2828",
  "Thundering Titans": "a9813da8-a9fe-4c2f-93ca-39c4f0bd4324",
  "Unstoppable Unicorns": "c1b945bd-31c0-4177-91e2-9b156425b30c",
  "Raging Rhinos": "6833f889-3040-463b-bb44-22bac6372672",
  "Voracious Wolves": "b52c5bec-7700-4253-886e-e4da4546ea43",
};

const AssignTeamModal = ({ showModal, setShowModal, userId }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const auth = useSelector((state) => state.auth);
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

  const handleTeamToggle = (id) => {
    setTeams(
      teams.map((team) =>
        team.id === id ? { ...team, selected: !team.selected } : team
      )
    );
  };

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      // Generate a temporary UUID for the new team (in a real app, this would come from the backend)
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

      // Get the selected team IDs (filter out any temporary IDs if needed)
      const selectedTeamIds = teams
        .filter((team) => team.selected)
        .map((team) => team.id)
        .filter((id) => !id.startsWith("temp-")); // Filter out temporary IDs

      if (selectedTeamIds.length === 0) {
        setError("Please select at least one team");
        return;
      }

      // Call the assignTeams action with team IDs instead of names
      await dispatch(assignTeams(auth.user.id, userId, selectedTeamIds));

      setSuccess("Teams assigned successfully!");
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to assign teams");
    } finally {
      setIsLoading(false);
    }
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
          {/* ... existing SVG code ... */}
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
                  {/* ... existing close icon SVG ... */}
                </svg>
              </button>
            </div>

            {/* Status messages */}
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
                  <span
                    className={`text-sm ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                  >
                    {team.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center space-x-3">
              <button
                onClick={handleAssignTeams}
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
    </>
  );
};

export default AssignTeamModal;
