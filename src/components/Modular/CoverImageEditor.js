import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { editUserProfile } from "../../redux/actions/alluserGet";
import CryptoJS from "crypto-js";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { showNotification } from "../../redux/actions/notificationActions";

const CoverImageEditor = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const canvasRef = useRef(null);
  const dispatch = useDispatch();

  const handleViewPopup = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    setImage(null);
    setZoom(1);
    setHorizontalOffset(0);
    setVerticalOffset(0);
  };

  const handleImageUpload = (info) => {
    if (info.file) {
      setImage(info.file);
    }
  };

  const handleApply = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      // Set canvas size for cover image (wide format)
      const targetWidth = 1260;
      const targetHeight = 248;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling to cover the entire canvas
      const scale =
        Math.max(targetWidth / img.width, targetHeight / img.height) * zoom;

      // Calculate position with offsets
      const x = (targetWidth - img.width * scale) / 2 + horizontalOffset;
      const y = (targetHeight - img.height * scale) / 2 + verticalOffset;

      // Draw image
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Retrieve userId
      const encryptedId = localStorage.getItem("userId");
      let userId = null;

      if (encryptedId) {
        try {
          const bytes = CryptoJS.AES.decrypt(
            encryptedId,
            "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
          );
          userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
          console.error("Decryption error:", error);
          return;
        }
      }

      if (!userId) {
        console.error("Failed to retrieve userId");
        return;
      }

      // Convert to Blob and Send to Server
      canvas.toBlob((blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("coverImage", blob, "cover-image.png");

        dispatch(editUserProfile(userId, formData));
      }, "image/png");

      handleClosePopup();
      dispatch(
        showNotification("Cover Image Updated successfully!", "success")
      );

      localStorage.setItem("activeComponent", "ProfileSettings");

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };
  };

  return (
    <>
      <div
        onClick={handleViewPopup}
        className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer transition-all"
        title="Edit Cover Image"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.9536 6.64748L13.3225 4.13174C12.9872 3.72751 12.5069 3.5 11.9975 3.5H10.5025C9.99313 3.5 9.51283 3.72751 9.17747 4.13174L7.54637 6.64748C7.21101 7.05098 6.76444 7.3 6.28752 7.3H3.25C2.78587 7.3 2.34075 7.48437 2.01256 7.81256C1.68437 8.14075 1.5 8.58587 1.5 9.05V19.75C1.5 20.2141 1.68437 20.6592 2.01256 20.9874C2.34075 21.3156 2.78587 21.5 3.25 21.5H20.75C21.2141 21.5 21.6592 21.3156 21.9874 20.9874C22.3156 20.6592 22.5 20.2141 22.5 19.75V9.05C22.5 8.58587 22.3156 8.14075 21.9874 7.81256C21.6592 7.48437 21.2141 7.3 20.75 7.3H17.7125C17.2346 7.3 16.749 7.05098 16.4136 6.64748L14.9536 6.64748Z"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17.5C14.2091 17.5 16 15.7091 16 13.5C16 11.2909 14.2091 9.5 12 9.5C9.79086 9.5 8 11.2909 8 13.5C8 15.7091 9.79086 17.5 12 17.5Z"
            stroke="#333"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
        </svg>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="bg-[rgb(30,30,30)] w-[1100px] h-[90%] overflow-y-auto">
            <section className="flex items-center justify-between pl-8 pr-4 pt-5 pb-5 bg-[#333333]">
              <div className="text-2xl text-[#F48567]">
                Edit your cover photo
              </div>
              <div>
                <svg
                  onClick={handleClosePopup}
                  className="cursor-pointer"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.4 19.5L5 18.1L10.6 12.5L5 6.9L6.4 5.5L12 11.1L17.6 5.5L19 6.9L13.4 12.5L19 18.1L17.6 19.5L12 13.9L6.4 19.5Z"
                    fill="#F48567"
                  />
                </svg>
              </div>
            </section>

            <div className="flex p-8 flex-col">
              {image && (
                <div className="editor-controls">
                  <section className="w-full h-[350px] flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="relative"
                        style={{
                          width: "1000px",
                          height: "248px",
                          overflow: "hidden",
                          borderRadius: "12px",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transform: `scale(${zoom}) translate(${horizontalOffset}px, ${verticalOffset}px)`,
                            transformOrigin: "center center",
                          }}
                        />
                      </div>
                    </div>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                  </section>

                  {/* Controls */}
                  <div className="controls flex justify-between mt-8">
                    <div className="flex flex-col items-start gap-2">
                      <label>Zoom</label>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-orange-400 text-lg cursor-pointer"
                          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                          style={{ userSelect: "none" }}
                        >
                          –
                        </span>
                        <input
                          style={{ accentColor: "#F48567" }}
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="appearance-none w-[350px] bg-gray-300 rounded-lg focus:outline-none"
                        />
                        <span
                          className="text-orange-400 text-lg cursor-pointer"
                          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                          style={{ userSelect: "none" }}
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="controls flex justify-between mt-6">
                    {/* Horizontal Offset Control */}
                    <div className="flex flex-col items-start gap-2">
                      <label>Move Left/Right</label>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-orange-400 text-lg cursor-pointer"
                          onClick={() =>
                            setHorizontalOffset(
                              Math.max(-200, horizontalOffset - 10)
                            )
                          }
                          style={{ userSelect: "none" }}
                        >
                          –
                        </span>
                        <input
                          style={{ accentColor: "#F48567" }}
                          type="range"
                          min="-200"
                          max="200"
                          step="10"
                          value={horizontalOffset}
                          onChange={(e) =>
                            setHorizontalOffset(Number(e.target.value))
                          }
                          className="appearance-none w-[350px] bg-gray-300 rounded-lg focus:outline-none"
                        />
                        <span
                          className="text-orange-400 text-lg cursor-pointer"
                          onClick={() =>
                            setHorizontalOffset(
                              Math.min(200, horizontalOffset + 10)
                            )
                          }
                          style={{ userSelect: "none" }}
                        >
                          +
                        </span>
                      </div>
                    </div>

                    {/* Vertical Offset Control */}
                    <div className="flex flex-col items-start gap-2">
                      <label>Move Up/Down</label>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-orange-400 text-lg cursor-pointer"
                          onClick={() =>
                            setVerticalOffset(
                              Math.max(-200, verticalOffset - 10)
                            )
                          }
                          style={{ userSelect: "none" }}
                        >
                          –
                        </span>
                        <input
                          style={{ accentColor: "#F48567" }}
                          type="range"
                          min="-200"
                          max="200"
                          step="10"
                          value={verticalOffset}
                          onChange={(e) =>
                            setVerticalOffset(Number(e.target.value))
                          }
                          className="appearance-none w-[350px] bg-gray-300 rounded-lg focus:outline-none"
                        />
                        <span
                          className="text-orange-400 text-lg cursor-pointer"
                          onClick={() =>
                            setVerticalOffset(
                              Math.min(200, verticalOffset + 10)
                            )
                          }
                          style={{ userSelect: "none" }}
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5 mt-8 items-center justify-center">
                    <div className="flex flex-col w-40">
                      <button
                        onClick={handleApply}
                        className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="flex flex-col w-40">
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleImageUpload}
                      >
                        <Button icon={<UploadOutlined />}>
                          {image
                            ? image.name.length > 15
                              ? image.name.substring(0, 12) + "..."
                              : image.name
                            : "Upload Image"}
                        </Button>
                      </Upload>
                    </div>
                  </div>
                </div>
              )}
              {!image && (
                <div className="flex flex-col items-center justify-center h-[400px]">
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleImageUpload}
                  >
                    <Button icon={<UploadOutlined />} size="large">
                      Upload Cover Image
                    </Button>
                  </Upload>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoverImageEditor;
