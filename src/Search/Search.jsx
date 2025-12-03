import React, { useEffect, useState } from 'react';
import {
  getAllOffices,
  getNapasByOfficeId,
  getGabisasByNapaId,
  getWardsByGabisaId,
  getDetailsByKittaNo
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';

const Search = () => {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [napas, setNapas] = useState([]);
  const [gabisas, setGabisas] = useState([]);
  const [wards, setWards] = useState([]);
  const [office_id, setOffice_id] = useState(0);
  const [napa_id, setNapa_id] = useState(0);
  const [gabisa_id, setGabisa_id] = useState(0);
  const [ward_no, setWard_no] = useState(0);
  const [kitta_no, setKitta_no] = useState(0);
  const [details, setDetails] = useState([]);
  const [cnt, setCnt] = useState(0);
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

  // Fetch Effects
  useEffect(() => { fetchOffices(); }, []);
  useEffect(() => { if (office_id > 0) fetchNapas(office_id); }, [office_id]);
  useEffect(() => { if (office_id > 0 && napa_id > 0) fetchGabisas(office_id, napa_id); }, [office_id, napa_id]);
  useEffect(() => { if (office_id > 0 && napa_id > 0 && gabisa_id > 0) fetchWards(office_id, napa_id, gabisa_id); }, [office_id, napa_id, gabisa_id]);
  useEffect(() => {
    if (office_id > 0 && napa_id > 0 && gabisa_id > 0 && ward_no > 0 && kitta_no > 0) {
      const timer = setTimeout(() => {
        fetchDetails(office_id, napa_id, gabisa_id, ward_no, kitta_no);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [kitta_no, office_id, napa_id, gabisa_id, ward_no]);

  // Fetch Functions
  const fetchOffices = async () => {
    const res = await fetchWithLoading(getAllOffices);
    if (res) {
      setOffices(res.data.data);
      setCnt(res.data.data1);
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

  const fetchDetails = async (office_id, napa_id, gabisa_id, ward_no, kitta_no) => {
    const res = await fetchWithLoading(getDetailsByKittaNo, office_id, napa_id, gabisa_id, ward_no, kitta_no);
    if (res) {
      setDetails(res.data.data);
      setCnt(res.data.data1);
    }
  };

  return (
    <section className="container my-4">
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <h4 className="text-success text-center mb-3">पालिकाले गरेको वर्गिकरण हेर्नुहोस्</h4>
      <div className="row">
        <div className="col-md-6 text-center">
          <button className="btn btn-secondary" onClick={() => navigate("/logout")}>
            ← बाहिर जानुहोस्
          </button>
        </div>
        <div className="col-md-6 text-center">
          <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
            ← एडमिन लगईन
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md">
          <select
            className="form-select"
            value={office_id}
            onChange={e => setOffice_id(Number(e.target.value))}
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

        <div className="col-12 col-md">
          <input
            type="number"
            min={1}
            className="form-control"
            placeholder="कित्ता नं"
            value={kitta_no}
            disabled={!ward_no}
            onChange={e => setKitta_no(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="table-responsive mb-3">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>गा.वि.स</th>
              <th>वडा नं</th>
              <th>कित्ता नं</th>
              <th>वर्गिकरण</th>
              <th>कैफियत</th>
            </tr>
          </thead>
          <tbody>
            {details.map((i, index) => (
              <tr key={index}>
                <td>{i.gabisa_name}</td>
                <td>{i.ward_no}</td>
                <td>{i.kitta_no}</td>
                <td>{i.bargikaran}</td>
                <td>{i.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h6 className="text-primary text-center">
        यहाँ {cnt} पटक वर्गिकरण खोजि गरिएको छ ।
      </h6>
    </section>
  );
};

export default Search;
