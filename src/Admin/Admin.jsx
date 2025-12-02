import { useNavigate } from 'react-router-dom';
import { saveRecords } from '../Actions/Action';
import { toast } from "react-toastify";
import { useState } from 'react';
import LoadingOverlay from '../Loading/LoadingOverlay';

const Admin = () => {
  const navigate = useNavigate();  
  const [selectedDate, setSelectedDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedRecords, setFailedRecords] = useState([]); // new state

  const handleUpload = async () => {
    if (records.length === 0) {
      toast.info("No Data to update to server");
      return;
    }
    try {
      setLoading(true);
      const response = await saveRecords(records);
      if (response.data.status === true) {
        toast.success(response.data.message);
        // failed_records check
        if (response.data.failed_count > 0) {
          setFailedRecords(response.data.failed_records || []);
          toast.error(
            `${response.data.failed_count} records failed to update. Check table below.`
          );
        } else {
          setFailedRecords([]);
        }
      }
    } catch (err) {
      toast.error("अपडेट गर्न असफल भयो");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedDate) {
      toast.warning("कृपया मिति चयन गर्नुहोस् ।");
      return;
    }
    try {
      setLoading(true);
      setRecords([]); // clear existing data
      setFailedRecords([]); // clear failed list
      const response = await getDataByDate(selectedDate);
      setRecords(response.data.data || []);
      if (response.data.data?.length === 0) {
        toast.info("कुनै पनि डेटा फेला परेन ।");
      }
    } catch (err) {
      toast.error("डेटा ल्याउन असफल भयो");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 position-relative">
      {loading && <LoadingOverlay loading={loading} />}

      {/* Dashboard Header */}
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Admin Dashboard</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker + Button */}
      <div className="row mt-4">
        <div className="col-md-6 d-flex">
          <input
            type="date"
            className="form-control me-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-primary me-2" onClick={handleDownload} disabled={loading}>
            Download Data
          </button>
          <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
            Update to remote
          </button>
        </div>
      </div>

      {/* Table - Downloaded Records */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h5>Downloaded Records</h5>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Office</th>
                <th>Napa</th>
                <th>Gabisa</th>
                <th>Ward</th>
                <th>Kitta No</th>
                <th>Bargikaran</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((row, index) => (
                  <tr key={index}>
                    <td>{row.office_name}</td>
                    <td>{row.napa_name}</td>
                    <td>{row.gabisa_name}</td>
                    <td>{row.ward_no}</td>
                    <td>{row.kitta_no}</td>
                    <td>{row.bargikaran}</td>
                    <td>{row.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table - Failed Records */}
      {failedRecords.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-12">
            <h5 className="text-danger">Failed Records</h5>
            <table className="table table-bordered table-striped">
              <thead className="table-danger">
                <tr>
                  <th>Office</th>
                  <th>Napa</th>
                  <th>Gabisa</th>
                  <th>Ward</th>
                  <th>Kitta No</th>
                  <th>Bargikaran</th>
                  <th>Remarks</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {failedRecords.map((f, index) => (
                  <tr key={index}>
                    <td>{f.record.office_name}</td>
                    <td>{f.record.napa_name}</td>
                    <td>{f.record.gabisa_name}</td>
                    <td>{f.record.ward_no}</td>
                    <td>{f.record.kitta_no}</td>
                    <td>{f.record.bargikaran}</td>
                    <td>{f.record.remarks}</td>
                    <td className="text-danger">{f.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
