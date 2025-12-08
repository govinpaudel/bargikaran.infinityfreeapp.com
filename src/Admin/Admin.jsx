import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from 'react';
import {
  getAllOffices,
  getNapasByOfficeId,
  getGabisasByNapaId,
  getWardsByGabisaId,
  saveRecords
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';
import "./Admin.css";
import Navbar from "../Navbar/Navbar";
import { toast } from "react-toastify";
const Admin = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([])
  const [offices, setOffices] = useState([]);
  const [napas, setNapas] = useState([]);
  const [gabisas, setGabisas] = useState([]);
  const [wards, setWards] = useState([]);
  const defaultData = {
    id: 0,
    office_id: 0,
    office_name: "",
    napa_id: 0,
    napa_name: "",
    gabisa_id: 0,
    gabisa_name: "",
    ward_no: 0,
    kitta_no: 0,
    bargikaran: "",
    remarks: "",
    user: 0
  }
  const [data, setData] = useState(defaultData);
  const [localDetails, setLocalDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOffices = async () => {
    try {
      const res = await getAllOffices();
      setOffices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNapas = async () => {
    try {
      const res = await getNapasByOfficeId(data.office_id);
      setNapas(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGabisas = async () => {
    try {
      const res = await getGabisasByNapaId(data.office_id, data.napa_id);
      setGabisas(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWards = async () => {
    try {
      const res = await getWardsByGabisaId(data.office_id, data.napa_id, data.gabisa_id);
      setWards(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendtoserver = async (id) => {
    try {
      setLoading(true);
      let kittas = JSON.parse(localStorage.getItem("kittas")) || [];
      kittas = kittas.filter(o => o.id == id);
      const res = await saveRecords(kittas);
      if(res.data.status==true){
        toast.success(res.data.message);
        handleDelete(id);
      }     

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }
  // Fetch Effects
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user")) || [];
    setUserData(user);
    if (user.role != 2) {
      navigate("/search");
    } else {
      fetchOffices()
      setLocalDetails(JSON.parse(localStorage.getItem("kittas")) || []);
    }

  }, []);

  useEffect(() => { if (data.office_id > 0) fetchNapas() }, [data.office_id]);
  useEffect(() => { if (data.office_id > 0 && data.napa_id > 0) fetchGabisas(); }, [data.office_id, data.napa_id]);
  useEffect(() => { if (data.office_id > 0 && data.napa_id > 0 && data.gabisa_id > 0) fetchWards(); }, [data.office_id, data.napa_id, data.gabisa_id]);

  const handleSave = () => {
  let kittas = JSON.parse(localStorage.getItem("kittas")) || [];

  // Split comma separated kitta numbers from input
  const kittaList = data.kitta_no
    .split(",")
    .map(k => k.trim())
    .filter(k => k !== "");

  // --- DUPLICATE CHECK ---
  const existingKittas = kittas.map(k => k.kitta_no.toString().trim());

  // Find duplicates before inserting
  const duplicates = kittaList.filter(k => existingKittas.includes(k));

  if (duplicates.length > 0) {
    alert(`These Kitta Numbers Already Exist: ${duplicates.join(", ")}`);
    return;  // Stop saving
  }

  // --- UPDATE MODE (single record edit) ---
  if (data.id > 0) {
    const index = kittas.findIndex(o => o.id === data.id);
    if (index !== -1) {
      kittas[index] = { ...data };  
    }

    localStorage.setItem("kittas", JSON.stringify(kittas));
    setLocalDetails(kittas);
    setData(defaultData);
    return;
  }

  // --- INSERT MODE (multiple kitta insert) ---
  kittaList.forEach((kittaValue) => {
    const newId = kittas.length > 0
      ? kittas[kittas.length - 1].id + 1
      : 1;

    const newRecord = {
      ...data,
      id: newId,
      user: userData.id,
      kitta_no: kittaValue   // store single kitta number
    };

    kittas.push(newRecord);
  });

  localStorage.setItem("kittas", JSON.stringify(kittas));
  setLocalDetails(kittas);
  setData(defaultData);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    if (name == "office_id") {
      const text = e.target.options[e.target.selectedIndex].text;
      setData(prev => ({ ...prev, office_name: text }));
    }
    if (name == "napa_id") {
      const text = e.target.options[e.target.selectedIndex].text;
      setData(prev => ({ ...prev, napa_name: text }));
    }
    if (name == "gabisa_id") {
      const text = e.target.options[e.target.selectedIndex].text;
      setData(prev => ({ ...prev, gabisa_name: text }));
    }
  }
  const handleDelete = (id) => {
    let kittas = JSON.parse(localStorage.getItem("kittas")) || [];
    kittas = kittas.filter(o => o.id !== id);
    localStorage.setItem("kittas", JSON.stringify(kittas));
    setLocalDetails(kittas);
  }
  const handleEdit = (id) => {
    let kittas = JSON.parse(localStorage.getItem("kittas")) || [];
    const index = kittas.findIndex(o => o.id === id);
    if (index === -1) return;
    setData({ ...kittas[index] });
  }



  return (
    <section className="container my-4">
      <Navbar />
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <h4 className="text-success text-center mb-3">वर्गिकरण थप गर्नुहोस् । </h4>

      {/* Form Fields */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md">
          <select
            name="office_id"
            className="form-select"
            value={data.office_id}
            onChange={handleChange}          >
            <option value="0" disabled>--कार्यालय छान्नुहोस्--</option>
            {offices.map((o) => (
              <option key={o.office_id} value={o.office_id}>{o.office_name}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md">
          <select
            name="napa_id"
            className="form-select"
            value={data.napa_id}
            disabled={!offices.length}
            onChange={handleChange}
          >
            <option value="0" disabled>--पालिका छान्नुहोस्--</option>
            {napas.map((n) => (
              <option key={n.napa_id} value={n.napa_id}>{n.napa_name}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md">
          <select
            name="gabisa_id"
            className="form-select"
            value={data.gabisa_id}
            disabled={!napas.length}
            onChange={handleChange}          >
            <option value="0" disabled>--गा.वि.स छान्नुहोस्--</option>
            {gabisas.map((g) => (
              <option key={g.gabisa_id} value={g.gabisa_id}>{g.gabisa_name}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md">
          <select
            name="ward_no"
            className="form-select"
            value={data.ward_no}
            disabled={!gabisas.length}
            onChange={handleChange}
          >
            <option value="0" disabled>--वडा नं छान्नुहोस्--</option>
            {wards.map((w) => (
              <option key={w.ward_no} value={w.ward_no}>{w.ward_no}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md">
          <input
            name="kitta_no"
            type="text"
            className="form-control"
            placeholder="कित्ता नं"
            value={data.kitta_no}
            disabled={data.ward_no <= 0}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md">
          <input
            name="bargikaran"
            type="text"
            className="form-control"
            placeholder="वर्गिकरण"
            value={data.bargikaran}
            disabled={data.kitta_no <= 0}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md">
          <input
            name="remarks"
            type="text"
            className="form-control"
            placeholder="कैफियत"
            value={data.remarks}
            disabled={!data.bargikaran.length > 0}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md">
          <button onClick={handleSave} className='btn btn-primary'>{data.id == 0 ? 'नयाँ दर्ता गर्नुहोस्' : 'संशोधन सेभ गर्नुहोस्'}</button>
        </div>
      </div>

      {/* Results Table */}
      <div className="table-responsive mb-3">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>क्र.सं</th>
              <th>कार्यालय</th>
              <th>पालिका</th>
              <th>गा.वि.स</th>
              <th>वडा नं</th>
              <th>कित्ता नं</th>
              <th>वर्गिकरण</th>
              <th>कैफियत</th>
              <th colSpan={3}>कृयाकलाप</th>
            </tr>
          </thead>
          <tbody>
            {localDetails.map((i, index) => (
              <tr key={index}>
                <td>{i.id}</td>
                <td>{i.office_name}</td>
                <td>{i.napa_name}</td>
                <td>{i.gabisa_name}</td>
                <td>{i.ward_no}</td>
                <td>{i.kitta_no}</td>
                <td>{i.bargikaran}</td>
                <td>{i.remarks}</td>
                <td>
                  <button
                    onClick={() => handleEdit(i.id)}
                    className="btn btn-info"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </td><td>
                  <button
                    onClick={() => handleDelete(i.id)}
                    className="btn btn-danger"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faDeleteLeft} />
                  </button>
                </td><td>
                  <button
                    className="btn btn-primary"
                    onClick={() => sendtoserver(i.id)}
                    title="Send to Server"
                  >
                    <FontAwesomeIcon icon={faUpload} /> Send
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Admin;
