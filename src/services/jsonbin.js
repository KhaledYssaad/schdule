import axios from 'axios';

// Replace these with your actual JSONBin credentials
const BIN_ID = 'YOUR_BIN_ID';
const API_KEY = 'YOUR_API_KEY';

const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const headers = {
  'X-Master-Key': API_KEY,
  'Content-Type': 'application/json',
};

export const fetchSchedule = async () => {
  try {
    const response = await axios.get(BASE_URL, { headers });
    return response.data.record;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return null;
  }
};

export const updateSchedule = async (data) => {
  try {
    await axios.put(BASE_URL, data, { headers });
  } catch (error) {
    console.error('Error updating schedule:', error);
  }
};
