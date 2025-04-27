// import React, { useEffect, useState, useRef } from 'react';
// import './App.css';
// import axios from 'axios';

// function App() {
//   const [dataSourceId, setDataSourceId] = useState(null);
//   const iframeRef = useRef(null);

//   // פונקציה לשליפת ה-DataSourceId מ-SAC
//   const fetchDataSource = async () => {
//     try {
//       const response = await axios.get('https://<your-sac-api-endpoint>/datasources', {
//         headers: {
//           'Authorization': 'Bearer <YOUR_ACCESS_TOKEN>',  // אם אתה משתמש ב- OAuth2 או API key
//           'Content-Type': 'application/json',
//         }
//       });

//       const dataSources = response.data;  // מניח שהתגובה היא מערך
//       if (dataSources.length > 0) {
//         setDataSourceId(dataSources[0].id);  // את יכולה לשנות את האינדקס לפי הצורך
//       }
//     } catch (error) {
//       console.error('Error fetching data source:', error);
//     }
//   };

//   useEffect(() => {
//     fetchDataSource();
//   }, []);

//   // שליחת פילטר ל-SAC
//   const sendFilterToSAC = () => {
//     if (!dataSourceId) {
//       console.log('No data source available');
//       return;
//     }

//     const filterPayload = {
//       type: 'setFilter',
//       data: {
//         dataSource: dataSourceId, // השתמש ב-ID של ה-DataSource
//         selections: [
//           {
//             dimension: 'Product',
//             members: ['P01', 'P02'], // ערכים לפילטר
//           },
//         ],
//       },
//     };

//     // שליחה ל-SAC
//     iframeRef.current.contentWindow.postMessage(filterPayload, '*');
//   };

//   // מאזין לקבלת תשובות
//   useEffect(() => {
//     window.addEventListener('message', (event) => {
//       if (event.origin === 'https://piba-qa.il30.hcs.cloud.sap') {
//         console.log('Data from SAC:', event.data);
//       }
//     });

//     return () => {
//       window.removeEventListener('message', () => {});
//     };
//   }, []);

//   return (
//     <div>
//       <iframe 
//         ref={iframeRef}
//         src="https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/A557D9EB3FC671CA6AD5039E942D1022/?mode=present"
//         width="50%"
//         height="350px"
//         title="SAC Dashboard"
//         frameBorder="0"
//       />

//       <br/>
      
//       <iframe 
//         ref={iframeRef}
//         src="https://piba-qa.il30.hcs.cloud.sap/sap/fpa/ui/app.html#/story2&/s2/F3696576161D527ECEC5C32A4DF859B0/?type=RESPONSIVE&mode=present"
//         width="50%"
//         height="350px"
//         title="SAC Dashboard"
//         frameBorder="0"
//       />
//       <button onClick={sendFilterToSAC}>Apply Filter</button>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import './App.css';
import MyDashboard from './MyDashboard'; // ייבוא הקומפוננטה שיצרנו

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <MyDashboard />; 
  }

  return (
    <div className="start-page">
      <h1>ברוכה הבאה!</h1>
      <p>כדי להתחיל, לחצי על הכפתור למטה</p>
      <button onClick={() => setShowDashboard(true)} className="start-button">
        עבור לדשבורד שלי
      </button>
    </div>
  );
}

export default App;