import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ACTIVE_INDEX, SET_ACTIVE_COMPONENT } from '../redux/actions/index';
import Profilecreads from './Profilecreads'; // Make sure this component is correctly implemented

const Header = () => {
  const mainTitles = useSelector((state) => state.header.mainTitles);
  const profileTitles = useSelector((state) => state.header.profileTitles);
  const activeIndex = useSelector((state) => state.header.activeIndex);
  const activeComponent = useSelector((state) => state.header.activeComponent);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  const handleTitleClick = (index, component) => {
    dispatch({ type: SET_ACTIVE_INDEX, payload: index });
    dispatch({ type: SET_ACTIVE_COMPONENT, payload: component });
  };

  return (
    <header className="">
      <section className={`w-[270px] pr-[0px] h-screen flex flex-col justify-between min-w-64 gap-4 pt-8 pb-6 verticle-line ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}>
      <section style={{ height: 'calc(100% - 140px)' }}>
      <div className='justify-center flex mb-6'>
          <svg width="158" height="37" viewBox="0 0 158 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_3_4855)">
                <path d="M76.0686 7.78757C72.1147 7.78757 69.8218 10.0146 68.7666 12.6242H68.7275C68.7666 11.8112 68.5191 9.29047 68.2324 7.91736L65.7051 8.04716V36.9643H69.3007V24.907C70.6035 27.0042 72.8508 28.5003 75.8667 28.5003C81.5011 28.5003 85.2466 24.3878 85.2466 18.1849C85.2466 11.982 81.4946 7.78757 76.0686 7.78757ZM75.6582 25.3305C71.2158 25.3305 69.3007 21.6074 69.3007 18.5743V17.7614C69.3007 14.7624 71.3395 10.9642 75.4237 10.9642C79.2148 10.9642 81.5793 13.8743 81.5793 18.1917C81.5793 22.5092 79.2604 25.3373 75.6647 25.3373L75.6582 25.3305Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M97.8238 7.82324C93.8699 7.82324 91.5835 10.0503 90.5218 12.6598H90.4827C90.5218 11.8469 90.2808 9.32614 89.9942 7.95304L87.4668 8.08283V37H91.0494V24.9426C92.3522 27.0399 94.5994 28.5359 97.6219 28.5359C103.25 28.5359 106.995 24.4235 106.995 18.2206C106.995 12.0177 103.243 7.82324 97.8173 7.82324H97.8238ZM97.4199 25.3662C92.9775 25.3662 91.0494 21.6431 91.0494 18.61V17.797C91.0494 14.7981 93.0882 10.9998 97.1724 10.9998C100.97 10.9998 103.334 13.91 103.334 18.2274C103.334 22.5448 101.009 25.373 97.4199 25.373V25.3662Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M133.339 0.0341797L125.177 18.7794C124.688 19.9339 123.829 21.9834 123.633 22.7143H123.549C123.301 21.9834 122.526 19.9339 122.037 18.7794L113.875 0.0341797H109.837V28.275H113.55L113.465 10.9097C113.465 9.71422 113.341 7.44621 113.302 7.22761L113.465 7.18662C113.504 7.40522 113.752 8.73051 114.364 10.0968L122.435 28.3639H124.721L132.512 10.3974C132.844 9.6664 133.41 7.65115 133.534 7.18662L133.697 7.22761C133.658 7.44621 133.534 9.71422 133.534 10.9097L133.45 28.275H137.156V0.0341797H133.326H133.339Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M155.798 22.7078C154.938 23.9033 153.264 25.3583 150.333 25.3583C147.194 25.3583 144.992 23.7325 144.132 21.0341L147.845 21.0751C154.326 21.1161 157.883 18.8481 157.883 14.8722C157.883 10.6368 154.86 7.8154 149.597 7.8154C144.008 7.8154 140.009 11.962 140.009 18.2127C140.009 24.4634 143.891 28.5281 150.047 28.5281C153.349 28.5281 156.209 27.2848 158 24.805L155.805 22.7078H155.798ZM143.683 18.1717C143.683 13.5537 146.373 10.992 149.76 10.992C152.496 10.992 154.326 12.4471 154.326 14.6194C154.326 17.147 152.567 18.4313 147.474 18.3904L143.683 18.3494V18.1786V18.1717Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M38.3079 0H34.6016V28.2409H38.3079V0Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M19.1562 18.4507C14.3425 18.4507 9.79587 17.7744 6.35006 16.5516C1.15202 14.7071 0.064209 12.2 0.064209 10.4238H3.65985C3.65985 11.6603 9.09238 14.6798 19.1628 14.6798C29.2331 14.6798 34.6657 11.6603 34.6657 10.4238H38.2613C38.2613 12.2 37.1735 14.7071 31.9755 16.5516C28.5296 17.7744 23.9765 18.4507 19.1693 18.4507H19.1562Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M3.7194 0H0V28.2409H3.7194V0Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M58.6238 8.04719C58.3372 9.41346 58.0897 11.8044 58.1288 12.6242H58.0897C57.0735 9.88482 54.6699 7.7876 50.9961 7.7876C45.3682 7.7876 41.6162 11.8932 41.6162 18.0961C41.6162 24.299 45.3747 28.5003 50.7942 28.5003C54.2205 28.5003 56.5068 26.7856 57.7314 24.3878H57.8161V25.1119C57.8161 25.1871 57.8161 25.2554 57.8226 25.3305C57.8812 26.9291 58.6629 27.8513 59.8224 28.2407H61.1642V8.04719H58.6368H58.6238ZM57.5621 18.5265C57.5621 21.5255 55.5232 25.3237 51.4391 25.3237C47.648 25.3237 45.2835 22.4135 45.2835 18.0893C45.2835 13.765 47.6024 10.9505 51.1981 10.9505C55.6405 10.9505 57.5556 14.6668 57.5556 17.7067V18.5197L57.5621 18.5265Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                <path d="M61.1515 22.6865H57.8164V28.2404H61.1515V22.6865Z" fill={darkMode ? '#F48567' : '#1e1e1e'} />
              </g>
              <defs>
                <clipPath id="clip0_3_4855">
                  <rect width="158" height="37" fill={darkMode ? '#F48567' : '#1e1e1e'} />
                </clipPath>
              </defs>
            </svg>
          </div>
          <section className='flex flex-col justify-between h-full'>
          <div>
          <div className='ml-4 mt-4 mb-4'>MAIN MENU</div>
          <div className="flex flex-col gap-1">
            {mainTitles.map((item, index) => (
              <div
                key={index}
                className={`sidebartab flex items-center ${activeIndex === index && activeComponent === item.component ? 'active' : ''}`}
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
                className={`sidebartab flex items-center ${activeIndex === mainTitles.length + index && activeComponent === item.component ? 'active' : ''}`}
                onClick={() => handleTitleClick(mainTitles.length + index, item.component)}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </div>
            ))}
          </div>
          </section>
        </section>
        <Profilecreads />
      </section>
    </header>
  );
};

export default Header;
