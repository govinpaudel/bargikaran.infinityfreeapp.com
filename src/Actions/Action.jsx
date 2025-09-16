import axios from "axios";
const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export const getAllOffices = async () => {
  const res = await axios.get(`${API_URL}/getAllOffices`);
  console.log(`${API_URL}/getAllOffices`)
  return res;
};

export const getNapasByOfficeId = async (office_id) => {
  const res = await axios.get(`${API_URL}/getNapasByOfficeId/${office_id}`);
  console.log(`${API_URL}/getNapasByOfficeId/${office_id}`)
  return res;
};

export const getGabisasByNapaId = async (office_id,napa_id) => {
  const res = await axios.get(`${API_URL}/getGabisasByNapaId/${office_id}/${napa_id}`);
  console.log(`${API_URL}/getGabisasByNapaId/${office_id}/${napa_id}`)
  return res;
};
export const getWardsByGabisaId = async (office_id,napa_id,gabisa_id) => {
  const res = await axios.get(`${API_URL}/getWardsByGabisaId/${office_id}/${napa_id}/${gabisa_id}`);
  console.log(`${API_URL}/getWardsByGabisaId/${office_id}/${napa_id}/${gabisa_id}`)
  return res;
};
export const getDetailsByKittaNo = async (office_id,napa_id,gabisa_id,ward_no,kitta_no) => {
  const res = await axios.get(`${API_URL}/getDetailsByKittaNo/${office_id}/${napa_id}/${gabisa_id}/${ward_no}/${kitta_no}`);
  console.log(`${API_URL}/getDetailsByKittaNo/${office_id}/${napa_id}/${gabisa_id}/${ward_no}/${kitta_no}`)
  return res;
};
export const getDataByDate = async (date) => {
  const res = await axios.get(`${API_URL}/getDataByDate/${date}`);
  console.log(`${API_URL}/getDataByDate/${date}`);
  return res;
};

export const sendRecordsToServer  = async (records) => {
  const res = await axios.post(`${API_URL}/saveRecords`, records);  
  console.log(`${API_URL}/saveRecords`,records);
  return res;
};