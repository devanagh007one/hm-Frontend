const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true, // Default to showing cancel button
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
          {showCancel && (
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
          )}
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;
