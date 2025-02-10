import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile } from "../../redux/actions/alluserGet";
import CryptoJS from "crypto-js";

const ImageEditor = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [zoom, setZoom] = useState(2);
    const [rotation, setRotation] = useState(0);
    const [tilt, setTilt] = useState(0);
    const canvasRef = useRef(null);
    const [verticalOffset, setVerticalOffset] = useState(2); // New state for vertical shift
    const dispatch = useDispatch();

    const handleViewPopup = () => setShowPopup(true);
    const handleClosePopup = () => {
        setShowPopup(false);
        setImage(null);
        setZoom(1);
        setRotation(0);
        setTilt(0);
        setVerticalOffset(0);
    };



    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // Store the File object instead of a base64 string
        }
    };


    const handleApply = () => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.src = URL.createObjectURL(image); // Create a temporary object URL

        img.onload = () => {
            const targetSize = 380; // Keep canvas size for circular cropping

            canvas.width = targetSize;
            canvas.height = targetSize;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2 + verticalOffset * 4); // Apply vertical shift
            ctx.rotate(((rotation + tilt) * Math.PI) / 180);
            ctx.scale(zoom, zoom);

            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
            ctx.restore();

            // Crop to circle
            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();

            // Convert the canvas to a blob and append to FormData
            canvas.toBlob((blob) => {
                if (!blob) return;

                const formData = new FormData();
                formData.append("image", image); // Maintain original file name

                // Retrieve and decrypt the userId
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
                const imageURL = URL.createObjectURL(image);
                console.log("Image URL:", imageURL);                 // Dispatch FormData with the user ID
                console.log(image);                 // Dispatch FormData with the user ID
                dispatch(editUserProfile(userId, formData));
            }, "image/png");
        };
    };

    return (
        <>
            <div onClick={handleViewPopup} className="text-white cursor-pointer">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" rx="15" fill="#C7C7C7"/>
<path d="M18.693 10.8078L17.6531 9.16484C17.434 8.90938 17.1336 8.75 16.7969 8.75H13.2031C12.8664 8.75 12.566 8.90938 12.3469 9.16484L11.307 10.8078C11.0879 11.0637 10.8055 11.25 10.4688 11.25H8.125C7.79348 11.25 7.47554 11.3817 7.24112 11.6161C7.0067 11.8505 6.875 12.1685 6.875 12.5V20C6.875 20.3315 7.0067 20.6495 7.24112 20.8839C7.47554 21.1183 7.79348 21.25 8.125 21.25H21.875C22.2065 21.25 22.5245 21.1183 22.7589 20.8839C22.9933 20.6495 23.125 20.3315 23.125 20V12.5C23.125 12.1685 22.9933 11.8505 22.7589 11.6161C22.5245 11.3817 22.2065 11.25 21.875 11.25H19.5703C19.2324 11.25 18.9121 11.0637 18.693 10.8078Z" stroke="#1E1E1E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 18.75C16.7259 18.75 18.125 17.3509 18.125 15.625C18.125 13.8991 16.7259 12.5 15 12.5C13.2741 12.5 11.875 13.8991 11.875 15.625C11.875 17.3509 13.2741 18.75 15 18.75Z" stroke="#1E1E1E" stroke-width="1.25" stroke-miterlimit="10"/>
<path d="M9.84375 11.1719V10.3125H8.90625V11.1719" stroke="#1E1E1E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="p-8 bg-[rgb(30,30,30)] w-[1100px] h-[800px] overflow-y-auto">
                        <input type="file" accept="image/*" onChange={handleImageUpload} />

                        {image && (
                            <div className="editor-controls">
                                <section className="w-full h-[500px] flex items-center justify-center">
                                    <img src={URL.createObjectURL(image)} className="imageback" alt="Preview" />
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                    <div className="image-container">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            className="imagecrop"
                                            alt="Preview"
                                            style={{
                                                transform: `scale(${zoom}) rotate(${rotation + tilt}deg) translateY(${verticalOffset}px)`,
                                            }}
                                        />

                                    </div>
                                </section>

                                {/* Controls */}
                                <div className="controls">
                                    <label>Zoom</label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => setZoom(e.target.value)}
                                    />

                                    <label>Rotate</label>
                                    <div className="rotate-buttons">
                                        <button onClick={() => setRotation(rotation - 90)}>↩ Left</button>
                                        <button onClick={() => setRotation(rotation + 90)}>↪ Right</button>
                                    </div>

                                    <label>Tilt (Fine Adjust)</label>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        step="1"
                                        value={tilt}
                                        onChange={(e) => setTilt(Number(e.target.value))}
                                    />
                                    <label>Move Up/Down</label>
                                    <input
                                        type="range"
                                        min="-100"
                                        max="100"
                                        step="5"
                                        value={verticalOffset}
                                        onChange={(e) => setVerticalOffset(Number(e.target.value))}
                                    />
                                </div>

                                <button onClick={handleApply} className="apply-btn">
                                    Apply
                                </button>
                            </div>
                        )}
                        <button onClick={handleClosePopup} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageEditor;
