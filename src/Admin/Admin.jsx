import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from 'react';
import {
  getAllOffices,
  getNapasByOfficeId,
  getGabisasByNapaId,
  getWardsByGabisaId
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';
import "./Admin.css";

const Search = () => {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [napas, setNapas] = useState([]);
  const [gabisas, setGabisas] = useState([]);
  const [wards, setWards] = useState([]);
  const [office_id, setOffice_id] = useState(0);
  const [office_name, setOffice_name] = useState("");
  const [napa_id, setNapa_id] = useState(0);
  const [napa_name, setNapa_name] = useState("");
  const [gabisa_id, setGabisa_id] = useState(0);
  const [gabisa_name, seGapa_name] = useState("");
  const [ward_no, setWard_no] = useState(0);
  const [kitta_no, setKitta_no] = useState(0);
  const [bargikaran, setBargikaran] = useState("");
  const [remarks, setRemarks] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Generic fetch wrapper to handle loading
  const fetchWithLoading = async (fetchFunc, ...args) => {
    setLoading(true);
    try {
      const res = await fetchFunc(...args);
      return res;
    } catch (err) {
      console.error("API Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (id) => {
  let kittas = JSON.parse(localStorage.getItem("kittas")) || [];
  const index = kittas.findIndex(o => o.id === id);
  if (index === -1) return;
  kittas[index].office_id = office_id;
  kittas[index].office_name = office_name;
  localStorage.setItem("kittas", JSON.stringify(kittas));
  setDetails(kittas);
}
  
  const handleDelete = (id) => {
  let offices = JSON.parse(localStorage.getItem("kittas")) || [];
  kittas = kittas.filter(o => o.id !== id);
  localStorage.setItem("kittas", JSON.stringify(kittas));
  setDetails(kittas);
}  
  const saveinlocal = () => {
    let kittas = JSON.parse(localStorage.getItem("kittas")) || [];

    // Auto increment ID
    const newId = kittas.length > 0
      ? kittas[kittas.length - 1].id + 1
      : 1;

    const newkittas = {
      id: newId,
      office_id: office_id,
      office_name: office_name,
      napa_id: napa_id,
      napa_name: napa_name,
      gabisa_id: gabisa_id,
      gabisa_name: gabisa_name,
      ward_no: ward_no,
      kitta_no: kitta_no,
      bargikaran: bargikaran,
      remarks: remarks
    };

    kittas.push(newkittas);
    localStorage.setItem("kittas", JSON.stringify(kittas));
    console.log(kittas)
    setDetails(kittas);
  }

  // Fetch Effects
  useEffect(
    () => {
      setDetails(JSON.parse(localStorage.getItem("kittas")) || []);
    }
    , []
  )
  useEffect(() => { fetchOffices(); }, []);
  useEffect(() => { if (office_id > 0) fetchNapas(office_id); }, [office_id]);
  useEffect(() => { if (office_id > 0 && napa_id > 0) fetchGabisas(office_id, napa_id); }, [office_id, napa_id]);
  useEffect(() => { if (office_id > 0 && napa_id > 0 && gabisa_id > 0) fetchWards(office_id, napa_id, gabisa_id); }, [office_id, napa_id, gabisa_id]);

  // Fetch Functions
  const fetchOffices = async () => {
    const res = await fetchWithLoading(getAllOffices);
    if (res) {
      setOffices(res.data.data);
    }
  };

  const fetchNapas = async (office_id) => {
    const res = await fetchWithLoading(getNapasByOfficeId, office_id);
    if (res) setNapas(res.data.data);
  };

  const fetchGabisas = async (office_id, napa_id) => {
    const res = await fetchWithLoading(getGabisasByNapaId, office_id, napa_id);
    if (res) setGabisas(res.data.data);
  };

  const fetchWards = async (office_id, napa_id, gabisa_id) => {
    const res = await fetchWithLoading(getWardsByGabisaId, office_id, napa_id, gabisa_id);
    if (res) setWards(res.data.data);
  };

  return (
    <section className="container my-4">
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <h4 className="text-success text-center mb-3">पालिकाले गरेको वर्गिकरण हेर्नुहोस्</h4>
      <div className="row">
        <div className="col-md-6 text-start">
          <button className="btn btn-secondary" onClick={() => navigate("/search")}>
            ← खोजिमा जानुहोस्
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md">
          <select
            className="form-select"
            value={office_id}
            onChange={(e) => {
              setOffice_id(Number(e.target.value));
              setOffice_name(e.target.options[e.target.selectedIndex].text)
            }}
          >
            <option value="0" disabled>--कार्यालय छान्नुहोस्--</option>
            {offices.map((o) => (
              <option key={o.office_id} value={o.office_id}>{o.office_name}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md">
          <select
            className="form-select"
            value={napa_id}
            disabled={!offices.length}
            onChange={e => setNapa_id(Number(e.target.value))}
          >
            <option value="0" disabled>--पालिका छान्नुहोस्--</option>
            {napas.map((n) => (
              <option key={n.napa_id} value={n.napa_id}>{n.napa_name}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md">
          <select
            className="form-select"
            value={gabisa_id}
            disabled={!napas.length}
            onChange={e => setGabisa_id(Number(e.target.value))}
          >
            <option value="0" disabled>--गा.वि.स छान्नुहोस्--</option>
            {gabisas.map((g) => (
              <option key={g.gabisa_id} value={g.gabisa_id}>{g.gabisa_name}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md">
          <select
            className="form-select"
            value={ward_no}
            disabled={!gabisas.length}
            onChange={e => setWard_no(Number(e.target.value))}
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
            type="text"
            className="form-control"
            placeholder="कित्ता नं"
            value={kitta_no}
            disabled={!ward_no}
            onChange={e => setKitta_no(Number(e.target.value))}
          />
        </div>
        <div className="col-12 col-md">
          <input
            type="text"
            className="form-control"
            placeholder="वर्गिकरण"
            value={bargikaran}
            disabled={!kitta_no}
            onChange={e => setBargikaran(e.target.value)}
          />
        </div>
        <div className="col-12 col-md">
          <input
            type="text"
            className="form-control"
            placeholder="कैफियत"
            value={remarks}
            disabled={!bargikaran}
            onChange={e => setRemarks(e.target.value)}
          />
        </div>
        <div className="col-12 col-md">
          <button onClick={saveinlocal} className='btn btn-sm btn-primary'>सेभ गर्नुहोस्</button>
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
              <th colSpan={2}>कृयाकलाप</th>
            </tr>
          </thead>
          <tbody>
            {details.map((i, index) => (
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
                    className="btn-edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  </td><td>
                  <button
                    onClick={() => handleDelete(i.id)}
                    className="btn-edit"
                  >
                    <FontAwesomeIcon icon={faDeleteLeft} />
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

export default Search;
