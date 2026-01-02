const ErrorHandler = require("./ErrorHandler");
const baseUrl = "https://nominatim.openstreetmap.org";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let lastRequestTime = 0;
const MIN_INTERVAL = 2100;

const geocode = async (location) => {
  try {
    const now = Date.now();
    const diff = now - lastRequestTime;

    if (diff < MIN_INTERVAL) {
      await sleep(MIN_INTERVAL - diff);
    }

    lastRequestTime = Date.now();

    const response = await fetch(
      `${baseUrl}/search?q=${encodeURIComponent(
        location
      )}&addressdetails=1&format=json&accept-language=id-ID`
    );
    const result = await response.json();
    return result[0];
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

const geometry = async (location) => {
  try {
    const { lat, lon } = await geocode(location);
    return { type: "Point", coordinates: [lat, lon] };
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

module.exports = {
  geocode,
  geometry,
};
