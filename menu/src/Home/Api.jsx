import React, { useEffect } from "react";
import axios from 'axios';

const Api = () => {
//   const fetchMenus = async () => {
//     const url = "http://16.171.227.54:8081/api/v1/menus";
//     const username = "admin";
//     const password = "admin123";

//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Basic ${btoa(`${username}:${password}`)}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Response Data:", data);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   };


// Define the credentials for Basic Auth
const username = 'admin';
const password = 'admin123';
const url = '/api/v1/menus';  // Use relative URL since it's proxied

const getMenus = async () => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(username + ":" + password)
      }
    });
    console.log(response.data);  // Process the data from the API
  } catch (error) {
    console.error('Error fetching menus:', error.response || error);
  }
};

// Call the function to get menus
getMenus();
//   useEffect(() => {
//     fetchMenus();
//   }, []);

  return <div>Check the console for API response.</div>;
};

export default Api;
