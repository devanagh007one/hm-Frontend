import React from 'react';
import { useSelector } from 'react-redux';

const Statistic = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const cardClass = `${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`;

  return (
    <section className='gap-4 flex flex-col w-3/4'>
      <div className={`card flex align-center p-4 pt-4 pb-4 justify-center w-full ${cardClass}`}>
        <section className='flex justify-between items-center w-full flex-col'>
          <div className='justify-between items-center w-full'>
            <div className='text-3xl'>My Statistic</div>
<div className='text-xl pt-3 '>
KPi Statistic that shows nodos linked by flows. the
quantity of each flow being represented as its width. 
</div>
<div className='w-full'>
<svg width="auto" height="auto" viewBox="0 0 507 124" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M255 14.5L275.28 17.258C303.334 21.0734 330.857 28.0962 357.31 38.1886L379.75 46.75L444 75.5L501.5 93.5" stroke="url(#paint0_linear_296_207)" stroke-opacity="0.5" stroke-width="20"/>
<path d="M503.5 32L475.212 37.0919C460.763 39.6926 446.561 43.5124 432.757 48.5104L395.5 62L334.5 89L323.629 94.2392C303.469 103.955 281.379 109 259 109V109" stroke="url(#paint1_linear_296_207)" stroke-opacity="0.3" stroke-width="20"/>
<path d="M3 57L68.7432 77.5L127.016 89L180.805 100L223.5 107L259 109" stroke="url(#paint2_linear_296_207)" stroke-opacity="0.2" stroke-width="20"/>
<path d="M254.5 58L317 68.5L350 75.5L383 82L452.5 91.25L504 93.5" stroke="url(#paint3_linear_296_207)" stroke-width="21"/>
<path d="M4 58L115 62H123L189.5 59.5L257 58" stroke="url(#paint4_linear_296_207)" stroke-opacity="0.5" stroke-width="20"/>
<path d="M4 59.5L105.5 36L163.25 24.25L194.485 18.4012C215.414 14.4822 236.749 13.1718 258 14.5V14.5" stroke="url(#paint5_linear_296_207)" stroke-width="20"/>
<rect y="39" width="8" height="40" rx="4" fill="#F48567"/>
<rect x="255" width="4" height="30" rx="2" fill="#9FB8F7"/>
<rect x="255" y="43" width="4" height="30" rx="2" fill="#9FB8F7"/>
<rect x="255" y="94" width="4" height="30" rx="2" fill="#9FB8F7"/>
<rect x="499" y="70" width="8" height="40" rx="4" fill="#FFF27A"/>
<rect x="499" y="12" width="8" height="40" rx="4" fill="#FFF27A"/>
<defs>
<linearGradient id="paint0_linear_296_207" x1="255.5" y1="48.25" x2="503" y2="48.25" gradientUnits="userSpaceOnUse">
<stop stop-color="#F48567"/>
<stop offset="1" stop-color="#DD441B"/>
</linearGradient>
<linearGradient id="paint1_linear_296_207" x1="259" y1="70.5" x2="503.5" y2="70.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#9C810C"/>
<stop offset="0.52" stop-color="#FFE266"/>
<stop offset="1" stop-color="#9C810C"/>
</linearGradient>
<linearGradient id="paint2_linear_296_207" x1="6.98444" y1="88" x2="259" y2="88" gradientUnits="userSpaceOnUse">
<stop stop-color="#F48567"/>
<stop offset="1" stop-color="#DD441B"/>
</linearGradient>
<linearGradient id="paint3_linear_296_207" x1="254.5" y1="76.875" x2="504" y2="76.875" gradientUnits="userSpaceOnUse">
<stop stop-color="#9C810C"/>
<stop offset="0.52" stop-color="#FFE266"/>
<stop offset="1" stop-color="#9C810C"/>
</linearGradient>
<linearGradient id="paint4_linear_296_207" x1="5" y1="61.5" x2="254.5" y2="61.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#F48567"/>
<stop offset="1" stop-color="#DD441B"/>
</linearGradient>
<linearGradient id="paint5_linear_296_207" x1="7" y1="32.25" x2="258" y2="32.25" gradientUnits="userSpaceOnUse">
<stop stop-color="#6376B1"/>
<stop offset="0.428166" stop-color="#9FB8F7"/>
</linearGradient>
</defs>
</svg>

</div>

            <div className="flex gap-4 mt-2 justify-center">
              <div className="flex items-center">
                <span className='h-4 w-4 inline-block rounded-md mr-2' style={{ background: '#F48567' }}></span>
                Website
              </div>
              <div className="flex items-center">
                <span className='h-4 w-4 inline-block rounded-md mr-2' style={{ background: '#9FB8F7' }}></span>
                Health App
              </div>
              <div className="flex items-center">
                <span className='h-4 w-4 inline-block rounded-md mr-2' style={{ background: '#FFE266' }}></span>
                Crypto CRM
              </div>
              <div className="flex items-center">
                <span className='h-4 w-4 inline-block rounded-md mr-2' style={{ background: '#000' }}></span>
                Inactive
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Statistic