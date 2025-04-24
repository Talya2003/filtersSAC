const axios = require('axios');

// פונקציה לשליפת DataSourceId מ-SAC
async function getDataSource() {
  try {
    const response = await axios.get('https://<your-sac-api-endpoint>/datasources', {
      headers: {
        'Authorization': 'Bearer <YOUR_ACCESS_TOKEN>',  // אם אתה משתמש ב- OAuth2 או API key
        'Content-Type': 'application/json',
      }
    });
    
    const dataSources = response.data; // כאן תוכל להמיר את התשובה בהתאם לצורך שלך
    console.log('Data Sources:', dataSources);

    // דוגמה לשימוש ב-DataSourceId:
    const dataSourceId = dataSources[0].id;  // זה תלוי במבנה של המידע ש-SAC מחזיר
    console.log('DataSourceId:', dataSourceId);

    return dataSourceId;  // תחזיר את ה-ID לצורך שליחה ל-React

  } catch (error) {
    console.error('Error fetching data sources:', error);
  }
}

getDataSource();