const axios = require("axios");

const API_KEY = "AIzaSyBrRBAmJH8RnUyCC_D3HM2lX79UU4dtkdE";
const URL = "";


const getLocationFromAddress = async (address) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);

  if (!response.data || response.data.status === "ZERO_RESULTS") return {errors: ["Could not find location for the specified address."]};
  return response.data.results[0].geometry.location;
};

module.exports = getLocationFromAddress;
