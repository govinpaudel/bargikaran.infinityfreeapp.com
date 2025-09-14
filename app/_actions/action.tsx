import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllOffices = async () => {
  const res = await axios.get(`${API_URL}/getAllOffices`);
  return res.data;
};

export const getAllNapas = async (office_id:any) => {
  const res = await axios.get(`${API_URL}/getAllNapas/${office_id}`);
  return res.data;
};




