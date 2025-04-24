import React, { useEffect, useRef } from 'react';

const SACDashboard = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const sendFilterToSAC = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // מוודאים שה־iframe מוכן
      iframe.onload = () => {
        // שולחים פקודת postMessage ל־SAC
        const filterPayload = {
          type: 'setFilter',
          data: {
            dataSource: 'YourDataSourceId',
            selections: [
              {
                dimension: 'SUM',      
                members: ['13'],    
              }
            ]
          }
        };

        iframe.contentWindow.postMessage(filterPayload, '*');
      };
    };

    sendFilterToSAC();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/A557D9EB3FC671CA6AD5039E942D1022/?mode=present"
      title="SAC Dashboard"
      width="100%"
      height="300px"
      style={{ border: 'none' }}
    />
  );
};

export default SACDashboard;
