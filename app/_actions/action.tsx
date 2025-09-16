import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllOffices = async () => {
  const res = await axios.get(`${API_URL}/getAllOffices`);
  console.log(`${API_URL}/getAllOffices`)
  return res;
};

export const getNapasByOfficeId = async (office_id:any) => {
  const res = await axios.get(`${API_URL}/getNapasByOfficeId/${office_id}`);
  console.log(`${API_URL}/getNapasByOfficeId/${office_id}`)
  return res;
};

export const getGabisasByNapaId = async (office_id:any,napa_id:any) => {
  const res = await axios.get(`${API_URL}/getGabisasByNapaId/${office_id}/${napa_id}`);
  console.log(`${API_URL}/getGabisasByNapaId/${office_id}/${napa_id}`)
  return res;
};
export const getWardsByGabisaId = async (office_id:any,napa_id:any,gabisa_id:any) => {
  const res = await axios.get(`${API_URL}/getWardsByGabisaId/${office_id}/${napa_id}/${gabisa_id}`);
  console.log(`${API_URL}/getWardsByGabisaId/${office_id}/${napa_id}/${gabisa_id}`)
  return res;
};
export const getDetailsByKittaNo = async (office_id:any,napa_id:any,gabisa_id:any,ward_no:any,kitta_no:any) => {
  const res = await axios.get(`${API_URL}/getDetailsByKittaNo/${office_id}/${napa_id}/${gabisa_id}/${ward_no}/${kitta_no}`);
  console.log(`${API_URL}/getDetailsByKittaNo/${office_id}/${napa_id}/${gabisa_id}/${ward_no}/${kitta_no}`)
  return res;
};
export const getDataByDate = async (date: string) => {
  const res = await axios.get(`${API_URL}/getDataByDate/${date}`);
  console.log(`${API_URL}/getDataByDate/${date}`);
  return res;
};

export const sendRecordsToServer  = async (records: any) => {
  const res = await axios.post(`${API_URL}/saveRecords`, records);  
  console.log(`${API_URL}/saveRecords`,records);
  return res;
};





export const login = async (username: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res;
};

export const verifyToken = async (token: string) => {  
  const res = await axios.get(`${API_URL}/verifytoken`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};

export const setAuthToken = (token?: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};



