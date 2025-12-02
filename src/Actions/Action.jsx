import axios from "axios";
const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export const handleLogin = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  console.log(`${API_URL}/login`, data);
  return res;
}
export const handleSignup = async (data) => {
  const res = await axios.post(`${API_URL}/signup`, data);
  console.log(`${API_URL}/signup`, data);
  return res;
}
export const getAllOffices = async () => {
  const res = await axios.get(`${API_URL}/getAllOffices`);
  console.log(`${API_URL}/getAllOffices`);
  return res;
};
export const getNapasByOfficeId = async (office_id) => {
  const res = await axios.get(`${API_URL}/getNapasByOfficeId/${office_id}`);
  console.log(`${API_URL}/getNapasByOfficeId/${office_id}`)
  return res;
};
export const getGabisasByNapaId = async (office_id, napa_id) => {
  const res = await axios.get(`${API_URL}/getGabisasByNapaId/${office_id}/${napa_id}`);
  console.log(`${API_URL}/getGabisasByNapaId/${office_id}/${napa_id}`)
  return res;
};
export const getWardsByGabisaId = async (office_id, napa_id, gabisa_id) => {
  const res = await axios.get(`${API_URL}/getWardsByGabisaId/${office_id}/${napa_id}/${gabisa_id}`);
  console.log(`${API_URL}/getWardsByGabisaId/${office_id}/${napa_id}/${gabisa_id}`)
  return res;
};
export const getDetailsByKittaNo = async (office_id, napa_id, gabisa_id, ward_no, kitta_no) => {
  const res = await axios.get(`${API_URL}/getDetailsByKittaNo/${office_id}/${napa_id}/${gabisa_id}/${ward_no}/${kitta_no}`);
  console.log(`${API_URL}/getDetailsByKittaNo/${office_id}/${napa_id}/${gabisa_id}/${ward_no}/${kitta_no}`)
  return res;
};
export const saveRecords = async (data) => {
  const res = await axios.post(`${API_URL}/saverecords`, data);
  console.log(`${API_URL}/saverecords`, data);
  return res;
}