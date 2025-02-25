import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile } from "../../redux/actions/alluserGet";
import CryptoJS from "crypto-js";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { showNotification } from "../../redux/actions/notificationActions"; // Import showNotification



const ImageEditor = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [zoom, setZoom] = useState(1);
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



    const handleImageUpload = (info) => {
        if (info.file) {
            setImage(info.file); // Store the File object
        }
    };


    const handleApply = () => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.src = URL.createObjectURL(image); // Create a temporary object URL

        img.onload = () => {
            const targetSize = 600; // Canvas size for circular cropping
            canvas.width = img.width;  // Set full image size
            canvas.height = img.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2 + verticalOffset * 4); // Apply vertical shift
            ctx.rotate(((rotation + tilt) * Math.PI) / 180);
            ctx.scale(zoom || 1, zoom || 1); // Prevent accidental zooming

            ctx.drawImage(img, -img.width / (2 * zoom), -img.height / (2 * zoom), img.width, img.height);
            ctx.restore();

            // Apply Circular Crop
            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();

            // ✅ Retrieve userId before dispatching
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
                formData.append("image", blob, "edited-image.png");

                dispatch(editUserProfile(userId, formData)); // ✅ Now userId is defined
            }, "image/png");

            handleClosePopup()
            dispatch(showNotification('Image Updated successful!', 'success'));

            localStorage.setItem("activeComponent", "ProfileSettings"); // Store Licensing before reload

            // Refresh the page after 3 seconds
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        };
    };




    return (
        <>
            <div onClick={handleViewPopup} className="text-white cursor-pointer">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="30" rx="15" fill="#C7C7C7" />
                    <path d="M18.693 10.8078L17.6531 9.16484C17.434 8.90938 17.1336 8.75 16.7969 8.75H13.2031C12.8664 8.75 12.566 8.90938 12.3469 9.16484L11.307 10.8078C11.0879 11.0637 10.8055 11.25 10.4688 11.25H8.125C7.79348 11.25 7.47554 11.3817 7.24112 11.6161C7.0067 11.8505 6.875 12.1685 6.875 12.5V20C6.875 20.3315 7.0067 20.6495 7.24112 20.8839C7.47554 21.1183 7.79348 21.25 8.125 21.25H21.875C22.2065 21.25 22.5245 21.1183 22.7589 20.8839C22.9933 20.6495 23.125 20.3315 23.125 20V12.5C23.125 12.1685 22.9933 11.8505 22.7589 11.6161C22.5245 11.3817 22.2065 11.25 21.875 11.25H19.5703C19.2324 11.25 18.9121 11.0637 18.693 10.8078Z" stroke="#1E1E1E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15 18.75C16.7259 18.75 18.125 17.3509 18.125 15.625C18.125 13.8991 16.7259 12.5 15 12.5C13.2741 12.5 11.875 13.8991 11.875 15.625C11.875 17.3509 13.2741 18.75 15 18.75Z" stroke="#1E1E1E" stroke-width="1.25" stroke-miterlimit="10" />
                    <path d="M9.84375 11.1719V10.3125H8.90625V11.1719" stroke="#1E1E1E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </div>

            {showPopup && (
                <div className="popup-overlay">

                    <div className=" bg-[rgb(30,30,30)] w-[1100px] h-[90%] overflow-y-auto">
                        <section className="flex items-center justify-between pl-8 pr-4 pt-5 pb-5 bg-[#333333]">
                            <div className="text-2xl text-[#F48567]">Edit your cover photo</div>
                            <div><svg onClick={handleClosePopup} className="cursor-pointer" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.4 19.5L5 18.1L10.6 12.5L5 6.9L6.4 5.5L12 11.1L17.6 5.5L19 6.9L13.4 12.5L19 18.1L17.6 19.5L12 13.9L6.4 19.5Z" fill="#F48567" />
                            </svg>
                            </div>
                        </section>

                        <div className="flex p-8 flex-col">

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
                                    <div className="controls flex items-center justify-between">
                                        <div className="flex flex-col items-start gap-2">
                                            <label >Zoom</label>
                                            <div className="flex items-center gap-3">

                                                <span className="text-orange-400 text-lg cursor-pointer" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                                                    style={{
                                                        userSelect: "none",
                                                        WebkitUserSelect: "none",
                                                        MozUserSelect: "none",
                                                        msUserSelect: "none",
                                                        accentColor: "#F48567"
                                                    }}>
                                                    –
                                                </span>
                                                <input
                                                    style={{
                                                        accentColor: "#F48567"
                                                    }}
                                                    type="range"
                                                    min="0.5"
                                                    max="2"
                                                    step="0.1"
                                                    value={zoom}
                                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                                    className="appearance-none w-[350px] mb-[-5px] bg-gray-300 rounded-lg focus:outline-none slider-thumb"
                                                />
                                                <span className="text-orange-400 text-lg cursor-pointer" onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                                                    style={{
                                                        userSelect: "none",
                                                        WebkitUserSelect: "none",
                                                        MozUserSelect: "none",
                                                        msUserSelect: "none",
                                                        accentColor: "#F48567"
                                                    }}
                                                >
                                                    +
                                                </span>
                                            </div>
                                        </div>

                                        <div className="rotate-buttons flex gap-2 mt-9">
                                            <div onClick={() => setRotation(rotation + 90)}><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#F48567" />
                                                <path d="M20.4799 11.43C22.6081 11.4344 24.6675 12.1845 26.2999 13.55V10.35H27.9299V16.85H21.4299V15.21H25.6999C24.5732 14.1092 23.127 13.3933 21.5685 13.1648C20.01 12.9363 18.4191 13.207 17.0239 13.9381C15.6287 14.6692 14.5007 15.8232 13.8016 17.2347C13.1024 18.6462 12.868 20.2428 13.1319 21.7957C13.3958 23.3486 14.1445 24.7782 15.2707 25.8795C16.3968 26.9808 17.8427 27.6974 19.4011 27.9265C20.9596 28.1557 22.5505 27.8857 23.9461 27.1552C25.3416 26.4247 26.4701 25.2712 27.1699 23.86L28.6299 24.59C27.908 26.0446 26.8104 27.2797 25.4507 28.1676C24.0911 29.0555 22.5188 29.5638 20.8967 29.64C19.2747 29.7161 17.6617 29.3573 16.2249 28.6006C14.7881 27.844 13.5796 26.7171 12.7246 25.3365C11.8696 23.9559 11.3992 22.3719 11.362 20.7485C11.3249 19.125 11.7223 17.5212 12.5132 16.1029C13.3041 14.6847 14.4598 13.5036 15.8605 12.682C17.2612 11.8604 18.856 11.4282 20.4799 11.43Z" fill="#F48567" />
                                            </svg>
                                            </div>
                                            <div onClick={() => setRotation(rotation - 90)}><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#F48567" />
                                                <path d="M19.5201 11.43C17.3919 11.4344 15.3325 12.1845 13.7001 13.55V10.35H12.0701V16.85H18.5701V15.21H14.3001C15.4268 14.1092 16.873 13.3933 18.4315 13.1648C19.99 12.9363 21.5809 13.207 22.9761 13.9381C24.3713 14.6692 25.4993 15.8232 26.1984 17.2347C26.8976 18.6462 27.132 20.2428 26.8681 21.7957C26.6042 23.3486 25.8555 24.7782 24.7293 25.8795C23.6032 26.9808 22.1573 27.6974 20.5989 27.9265C19.0404 28.1557 17.4495 27.8857 16.0539 27.1552C14.6584 26.4247 13.5299 25.2712 12.8301 23.86L11.3701 24.59C12.092 26.0446 13.1896 27.2797 14.5493 28.1676C15.9089 29.0555 17.4812 29.5638 19.1033 29.64C20.7253 29.7161 22.3383 29.3573 23.7751 28.6006C25.2119 27.844 26.4204 26.7171 27.2754 25.3365C28.1304 23.9559 28.6008 22.3719 28.638 20.7485C28.6751 19.125 28.2777 17.5212 27.4868 16.1029C26.6959 14.6847 25.5402 13.5036 24.1395 12.682C22.7388 11.8604 21.144 11.4282 19.5201 11.43Z" fill="#F48567" />
                                            </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="controls flex justify-between">
                                        {/* Tilt Control */}
                                        <div className="flex flex-col items-start gap-2">
                                            <label>Tilt (Fine Adjust)</label>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="text-orange-400 text-lg cursor-pointer"
                                                    onClick={() => setTilt(Math.max(-10, tilt - 1))} // Adjusts Tilt
                                                    style={{
                                                        userSelect: "none",
                                                        WebkitUserSelect: "none",
                                                        MozUserSelect: "none",
                                                        msUserSelect: "none",
                                                        accentColor: "#F48567"
                                                    }}
                                                >
                                                    –
                                                </span>
                                                <input
                                                    style={{
                                                        accentColor: "#F48567"
                                                    }}
                                                    type="range"
                                                    min="-10"
                                                    max="10"
                                                    step="1"
                                                    value={tilt}
                                                    onChange={(e) => setTilt(Number(e.target.value))}
                                                    className="appearance-none w-[350px] bg-gray-300 rounded-lg focus:outline-none"
                                                />
                                                <span
                                                    className="text-orange-400 text-lg cursor-pointer"
                                                    onClick={() => setTilt(Math.min(10, tilt + 1))} // Adjusts Tilt
                                                    style={{
                                                        userSelect: "none",
                                                        WebkitUserSelect: "none",
                                                        MozUserSelect: "none",
                                                        msUserSelect: "none",
                                                        accentColor: "#F48567"
                                                    }}
                                                >
                                                    +
                                                </span>
                                            </div>
                                        </div>

                                        {/* Move Up/Down Control */}
                                        <div className="flex flex-col items-start gap-2">
                                            <label>Move Up/Down</label>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="text-orange-400 text-lg cursor-pointer"
                                                    onClick={() => setVerticalOffset(Math.max(-100, verticalOffset - 5))} // Adjusts Vertical Offset
                                                    style={{
                                                        userSelect: "none",
                                                        WebkitUserSelect: "none",
                                                        MozUserSelect: "none",
                                                        msUserSelect: "none",
                                                        accentColor: "#F48567"
                                                    }}
                                                >
                                                    –
                                                </span>
                                                <input
                                                    style={{
                                                        accentColor: "#F48567"
                                                    }}
                                                    type="range"
                                                    min="-100"
                                                    max="100"
                                                    step="5"
                                                    value={verticalOffset}
                                                    onChange={(e) => setVerticalOffset(Number(e.target.value))}
                                                    className="appearance-none w-[350px] bg-gray-300 rounded-lg focus:outline-none"
                                                />
                                                <span
                                                    className="text-orange-400 text-lg cursor-pointer"
                                                    onClick={() => setVerticalOffset(Math.min(100, verticalOffset + 5))} // Adjusts Vertical Offset
                                                    style={{
                                                        userSelect: "none",
                                                        WebkitUserSelect: "none",
                                                        MozUserSelect: "none",
                                                        msUserSelect: "none",
                                                        accentColor: "#F48567"
                                                    }}
                                                >
                                                    +
                                                </span>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="flex gap-5 mt-5 items-center justify-center">
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
                                                showUploadList={false} // Hide file list display
                                                beforeUpload={() => false} // Prevent auto-upload, handle manually
                                                onChange={handleImageUpload}
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}

                                                >
                                                    {image ? (image.name.length > 15 ? image.name.substring(0, 12) + "..." : image.name) : "Upload Image"}
                                                </Button>
                                            </Upload>

                                        </div>
                                    </div>
                                </div>
                            )}
                            {!image && (
                                <div>
                                    <Upload
                                        accept="image/*"
                                        showUploadList={false} // Hide file list display
                                        beforeUpload={() => false} // Prevent auto-upload, handle manually
                                        onChange={handleImageUpload}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                                    </Upload>

                                    {image && <p>{image.name}</p>} {/* Display selected file name */}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageEditor;
