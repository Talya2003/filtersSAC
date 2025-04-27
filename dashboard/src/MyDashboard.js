import React, { useState, useRef } from 'react';
import './MyDashboard.css';

const iframeUrls = [
  'https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/BDAE63DB7638245C442E8573ECE1FC62/?mode=present',
  'https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/F3696576161D527ECEC5C32A4DF859B0/?mode=present',
  'https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/A557D9EB3FC671CA6AD5039E942D1022/?mode=present',
];

function MyDashboard() {
  const [filterValue, setFilterValue] = useState('DefaultValue');
  const iframeRefs = useRef([]);

  const applyFilter = () => {
    iframeRefs.current.forEach((iframe) => {
      if (iframe && iframe.contentWindow) {
        const filterPayload = {
          type: 'setFilter',
          data: {
            dataSource: 'dummyDataSource', // אפשר להחליף לדאטה סורס אמיתי אם תרצה
            selections: [
              {
                dimension: 'Product', // תחליף למימד שאתה רוצה
                members: [filterValue],
              },
            ],
          },
        };
        iframe.contentWindow.postMessage(filterPayload, '*');
      }
    });
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h2>הדשבורד שלי</h2>
        <input 
          type="text" 
          placeholder="הכנס ערך פילטר" 
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <button onClick={applyFilter}>החל פילטר</button>
      </header>

      <div className="dashboard-content">
        {iframeUrls.map((url, idx) => (
          <div key={idx} className="iframe-container">
            <iframe
              ref={(el) => iframeRefs.current[idx] = el}
              src={url}
              title={`Dashboard ${idx + 1}`}
              width="100%"
              height="350px"
              frameBorder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDashboard;
