import React, { useEffect, useState } from 'react';
import {
  getAllOffices,
  getNapasByOfficeId,
  getGabisasByNapaId,
  getWardsByGabisaId,
  getDetailsByKittaNo,
  saveRecords
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';
import Navbar from '../Navbar/Navbar';
import { toast } from 'react-toastify';

const Search = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
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
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setUserData(JSON.parse(user));
    console.log(user);
  }, [])


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
  const handleEditClick = (row) => {
    setSelectedRow(row); // save row data to populate the form
    setShowModal(true);  // open modal
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };
  const handleSave = async(data) => {
    const res=await saveRecords(data);
    console.log(res);
    if(res.data.status==true){
      toast.success(res.data.message);
      handleCloseModal();
    }


  }
  return (
    <section className="container my-4">
      <Navbar />
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
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
              <th>सिट नं</th>
              <th>वर्गिकरण</th>
              <th>कैफियत</th>
              {Number(userData?.role) === 2 ?
                <th>कृयाकलाप</th>
                : null}
            </tr>
          </thead>
          <tbody>
            {details.map((i, index) => (
              <tr key={index}>
                <td>{i.gabisa_name}</td>
                <td>{i.ward_no}</td>
                <td>{i.kitta_no}</td>
                <td>{i.sheet_no}</td>
                <td>{i.bargikaran}</td>
                <td>{i.remarks}</td>
                {Number(userData?.role) === 2 ? <td><button onClick={() => handleEditClick(i)} className='btn btn-info'>Edit</button></td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h6 className="text-primary text-center">
        यहाँ {cnt} पटक वर्गिकरण खोजि गरिएको छ ।
      </h6>
      {showModal && selectedRow && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">वर्गिकरण संशोधन</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <div className="row">
                      <div className="col">
                        <select
                          className="form-select"
                          value={selectedRow.office_id}
                          onChange={(e) => setSelectedRow({ ...selectedRow, office_id: e.target.value })}
                        >
                          <option value="0" disabled>--कार्यालय छान्नुहोस्--</option>
                          {offices.map((o) => (
                            <option key={o.office_id} value={o.office_id}>{o.office_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <select
                          className="form-select"
                          value={selectedRow.napa_id}
                          onChange={(e) => setSelectedRow({ ...selectedRow, napa_id: e.target.value,napa_name:e.target.options[e.target.selectedIndex].text })}
                        >
                          <option value="0" disabled>--पालिका छान्नुहोस्--</option>
                          {napas.map((n) => (
                            <option key={n.napa_id} value={n.napa_id}>{n.napa_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <hr/>
                    <div className="mb-3">
                    <div className="row">
                      <div className="col">
                        <select
                          className="form-select"
                          value={selectedRow.gabisa_id}
                          onChange={(e) => setSelectedRow({ ...selectedRow, gabisa_id: e.target.value,gabisa_name:e.target.options[e.target.selectedIndex].text })}
                        >
                          <option value="0" disabled>--गा.वि.स छान्नुहोस्--</option>
                          {gabisas.map((g) => (
                            <option key={g.gabisa_id} value={g.gabisa_id}>{g.gabisa_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <select
                          className="form-select"
                          value={selectedRow.ward_no}
                          onChange={(e) => setSelectedRow({ ...selectedRow, ward_no: e.target.value })}
                        >
                          <option value="0" disabled>--वडा नं छान्नुहोस्--</option>
                          {wards.map((w) => (
                            <option key={w.ward_no} value={w.ward_no}>{w.ward_no}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                    <input type="text" className="form-control" value={selectedRow.kitta_no} onChange={(e) => setSelectedRow({ ...selectedRow, kitta_no: e.target.value })} />
                      </div>
                    </div>
                    </div>
                  </div>                  
                  <div className="mb-3">
                    <label className="form-label">वर्गिकरण</label>
                    <input type="text" className="form-control" value={selectedRow.bargikaran} onChange={(e) => setSelectedRow({ ...selectedRow, bargikaran: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">कैफियत</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedRow.remarks}
                      onChange={(e) => setSelectedRow({ ...selectedRow, remarks: e.target.value })}
                    />
                  </div>
                  {/* Add more fields here as needed */}
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => handleSave(selectedRow)}>Save changes</button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>                
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Search;
