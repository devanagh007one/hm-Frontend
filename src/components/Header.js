import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ACTIVE_INDEX, SET_ACTIVE_COMPONENT } from "../redux/actions/index";
import Profilecreads from "./Profilecreads";
import { setActiveComponent } from "../redux/actions/index.js";
import EyeForm from "./Modular/ProfileModel.js";

const Header = ({ onProfileSettingsClick }) => {
  const dispatch = useDispatch();

  // Get stored active component from localStorage
  const storedComponent = localStorage.getItem("activeComponent");

  // Get active state from Redux
  const mainTitles = useSelector((state) => state.header.mainTitles);
  const profileTitles = useSelector((state) => state.header.profileTitles);
  const activeIndex = useSelector((state) => state.header.activeIndex);
  const activeComponent = useSelector((state) => state.header.activeComponent);
  const darkMode = useSelector((state) => state.theme.darkMode);

  // Only update Redux state if it's not already set
  useEffect(() => {
    if (!activeComponent && storedComponent) {
      dispatch(setActiveComponent(storedComponent));
    }
    setTimeout(() => {
      localStorage.removeItem("activeComponent");
    }, 100);
  }, [dispatch, activeComponent, storedComponent]);

  const handleTitleClick = (index, component) => {
    dispatch({ type: SET_ACTIVE_INDEX, payload: index });
    dispatch({ type: SET_ACTIVE_COMPONENT, payload: component });

    // Store active component in localStorage before reload
    localStorage.setItem("activeComponent", component);
  };

  return (
    <header className="">
      <section
        className={`w-[270px] pr-[0px] h-screen flex flex-col justify-between min-w-64 gap-4 pt-8 pb-6 verticle-line ${
          darkMode ? "border-gray-500" : "border-gray-200"
        }`}
      >
        <section style={{ height: "calc(100% - 140px)" }}>
          <div className="justify-center flex mb-6">
            <svg
              width="158"
              height="37"
              viewBox="0 0 158 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_3_4855)">
                <path
                  d="M76.0686 7.78757C72.1147 7.78757 69.8218 10.0146 68.7666 12.6242H68.7275C68.7666 11.8112 68.5191 9.29047 68.2324 7.91736L65.7051 8.04716V36.9643H69.3007V24.907C70.6035 27.0042 72.8508 28.5003 75.8667 28.5003C81.5011 28.5003 85.2466 24.3878 85.2466 18.1849C85.2466 11.982 81.4946 7.78757 76.0686 7.78757ZM75.6582 25.3305C71.2158 25.3305 69.3007 21.6074 69.3007 18.5743V17.7614C69.3007 14.7624 71.3395 10.9642 75.4237 10.9642C79.2148 10.9642 81.5793 13.8743 81.5793 18.1917C81.5793 22.5092 79.2604 25.3373 75.6647 25.3373L75.6582 25.3305Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M97.8238 7.82324C93.8699 7.82324 91.5835 10.0503 90.5218 12.6598H90.4827C90.5218 11.8469 90.2808 9.32614 89.9942 7.95304L87.4668 8.08283V37H91.0494V24.9426C92.3522 27.0399 94.5994 28.5359 97.6219 28.5359C103.25 28.5359 106.995 24.4235 106.995 18.2206C106.995 12.0177 103.243 7.82324 97.8173 7.82324H97.8238ZM97.4199 25.3662C92.9775 25.3662 91.0494 21.6431 91.0494 18.61V17.797C91.0494 14.7981 93.0882 10.9998 97.1724 10.9998C100.97 10.9998 103.334 13.91 103.334 18.2274C103.334 22.5448 101.009 25.373 97.4199 25.373V25.3662Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M133.339 0.0341797L125.177 18.7794C124.688 19.9339 123.829 21.9834 123.633 22.7143H123.549C123.301 21.9834 122.526 19.9339 122.037 18.7794L113.875 0.0341797H109.837V28.275H113.55L113.465 10.9097C113.465 9.71422 113.341 7.44621 113.302 7.22761L113.465 7.18662C113.504 7.40522 113.752 8.73051 114.364 10.0968L122.435 28.3639H124.721L132.512 10.3974C132.844 9.6664 133.41 7.65115 133.534 7.18662L133.697 7.22761C133.658 7.44621 133.534 9.71422 133.534 10.9097L133.45 28.275H137.156V0.0341797H133.326H133.339Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M155.798 22.7078C154.938 23.9033 153.264 25.3583 150.333 25.3583C147.194 25.3583 144.992 23.7325 144.132 21.0341L147.845 21.0751C154.326 21.1161 157.883 18.8481 157.883 14.8722C157.883 10.6368 154.86 7.8154 149.597 7.8154C144.008 7.8154 140.009 11.962 140.009 18.2127C140.009 24.4634 143.891 28.5281 150.047 28.5281C153.349 28.5281 156.209 27.2848 158 24.805L155.805 22.7078H155.798ZM143.683 18.1717C143.683 13.5537 146.373 10.992 149.76 10.992C152.496 10.992 154.326 12.4471 154.326 14.6194C154.326 17.147 152.567 18.4313 147.474 18.3904L143.683 18.3494V18.1786V18.1717Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M38.3079 0H34.6016V28.2409H38.3079V0Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M19.1562 18.4507C14.3425 18.4507 9.79587 17.7744 6.35006 16.5516C1.15202 14.7071 0.064209 12.2 0.064209 10.4238H3.65985C3.65985 11.6603 9.09238 14.6798 19.1628 14.6798C29.2331 14.6798 34.6657 11.6603 34.6657 10.4238H38.2613C38.2613 12.2 37.1735 14.7071 31.9755 16.5516C28.5296 17.7744 23.9765 18.4507 19.1693 18.4507H19.1562Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M3.7194 0H0V28.2409H3.7194V0Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M58.6238 8.04719C58.3372 9.41346 58.0897 11.8044 58.1288 12.6242H58.0897C57.0735 9.88482 54.6699 7.7876 50.9961 7.7876C45.3682 7.7876 41.6162 11.8932 41.6162 18.0961C41.6162 24.299 45.3747 28.5003 50.7942 28.5003C54.2205 28.5003 56.5068 26.7856 57.7314 24.3878H57.8161V25.1119C57.8161 25.1871 57.8161 25.2554 57.8226 25.3305C57.8812 26.9291 58.6629 27.8513 59.8224 28.2407H61.1642V8.04719H58.6368H58.6238ZM57.5621 18.5265C57.5621 21.5255 55.5232 25.3237 51.4391 25.3237C47.648 25.3237 45.2835 22.4135 45.2835 18.0893C45.2835 13.765 47.6024 10.9505 51.1981 10.9505C55.6405 10.9505 57.5556 14.6668 57.5556 17.7067V18.5197L57.5621 18.5265Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
                <path
                  d="M61.1515 22.6865H57.8164V28.2404H61.1515V22.6865Z"
                  fill={darkMode ? "#F48567" : "#1e1e1e"}
                />
              </g>
              <defs>
                <clipPath id="clip0_3_4855">
                  <rect
                    width="158"
                    height="37"
                    fill={darkMode ? "#F48567" : "#1e1e1e"}
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <section className="flex flex-col justify-between h-full">
            <div>
              <div className="ml-4 mt-4 mb-4">MAIN MENU</div>
              <div className="flex flex-col gap-1">
                {mainTitles.map((item, index) => (
                  <div
                    key={index}
                    className={`sidebartab flex items-center ${
                      (activeIndex === index &&
                        activeComponent === item.component) ||
                      storedComponent === item.component
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleTitleClick(index, item.component)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {profileTitles.map((item, index) => (
                <div
                  key={index}
                  className={`sidebartab flex items-center ${
                    (activeIndex === mainTitles.length + index &&
                      activeComponent === item.component) ||
                    storedComponent === item.component
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleTitleClick(mainTitles.length + index, item.component)
                  }
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </div>
              ))}
            </div>
          </section>
        </section>
        {/* <div className="flex items-center ml-8">
          <div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0002 11.6667V13.3333C8.67408 13.3333 7.40231 13.8601 6.46463 14.7978C5.52695 15.7355 5.00016 17.0073 5.00016 18.3333H3.3335C3.3335 16.5652 4.03588 14.8695 5.28612 13.6193C6.53636 12.3691 8.23205 11.6667 10.0002 11.6667ZM10.0002 10.8333C7.23766 10.8333 5.00016 8.59584 5.00016 5.83334C5.00016 3.07084 7.23766 0.833344 10.0002 0.833344C12.7627 0.833344 15.0002 3.07084 15.0002 5.83334C15.0002 8.59584 12.7627 10.8333 10.0002 10.8333ZM10.0002 9.16668C11.8418 9.16668 13.3335 7.67501 13.3335 5.83334C13.3335 3.99168 11.8418 2.50001 10.0002 2.50001C8.1585 2.50001 6.66683 3.99168 6.66683 5.83334C6.66683 7.67501 8.1585 9.16668 10.0002 9.16668ZM12.1627 15.6758C12.0568 15.2315 12.0568 14.7685 12.1627 14.3242L11.336 13.8467L12.1693 12.4033L12.996 12.8808C13.3279 12.5667 13.7289 12.3349 14.1668 12.2042V11.25H15.8335V12.2042C16.2768 12.3358 16.6768 12.5708 17.0043 12.8808L17.831 12.4033L18.6643 13.8467L17.8385 14.3242C17.9443 14.7685 17.9443 15.2315 17.8385 15.6758L18.6643 16.1533L17.831 17.5967L17.0043 17.1192C16.6725 17.4333 16.2714 17.6651 15.8335 17.7958V18.75H14.1668V17.7958C13.7289 17.6651 13.3279 17.4333 12.996 17.1192L12.1693 17.5967L11.336 16.1533L12.1627 15.6758ZM15.0002 16.25C15.3317 16.25 15.6496 16.1183 15.884 15.8839C16.1185 15.6495 16.2502 15.3315 16.2502 15C16.2502 14.6685 16.1185 14.3505 15.884 14.1161C15.6496 13.8817 15.3317 13.75 15.0002 13.75C14.6686 13.75 14.3507 13.8817 14.1163 14.1161C13.8819 14.3505 13.7502 14.6685 13.7502 15C13.7502 15.3315 13.8819 15.6495 14.1163 15.8839C14.3507 16.1183 14.6686 16.25 15.0002 16.25Z"
                fill="#C7C7C7"
              />
            </svg>
          </div>
          <div className="ml-4 mt-4 mb-4 cursor-pointer">
            <EyeForm></EyeForm>
          </div>
        </div> */}
        <Profilecreads />
      </section>
    </header>
  );
};

export default Header;
