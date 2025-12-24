import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
const RECORDS_PER_PAGE = 50;
const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ================= FILE SELECT =================
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setSheetNames([]);
    setData([]);
    setHeaders([]);
    setSelectedSheet("");
    setPage(1);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      setSheetNames(workbook.SheetNames);
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // ================= SHEET SELECT =================
  const handleSheetSelect = (sheetName) => {
    if (!sheetName) return;

    setSelectedSheet(sheetName);
    setLoading(true);
    setPage(1);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: null,
      });

      setData(jsonData);
      setHeaders(Object.keys(jsonData[0] || {}));
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  // ================= UPLOAD WITH PROGRESS =================
  const uploadToServer = async () => {
    if (data.length === 0) {
      alert("No data to upload");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      await axios.post(
        `${API_URL}/saverecords`,
        { records: data },
        {
          headers: {
            "Content-Type": "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      alert("Upload successful");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= PAGINATION =================
  const totalPages = Math.ceil(data.length / RECORDS_PER_PAGE);
  const startIndex = (page - 1) * RECORDS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + RECORDS_PER_PAGE);

  return (
    <div className="container-fluid p-3">
      <Navbar />
      <h2 className="mb-3">Excel Upload & Preview</h2>
      <div className="row">
        <div className="col">
          <input
            type="file"
            className="form-control"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
        </div>
        <div className="col">
          {sheetNames.length > 0 && (
            
              <select
                className="form-select"
                value={selectedSheet}
                onChange={(e) => handleSheetSelect(e.target.value)}
              >
                <option value="">-- Select Sheet --</option>
                {sheetNames.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            
          )}
        </div>
        <div className="col">

          <button
            className="btn btn-primary"
            onClick={uploadToServer}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload to Server"}
          </button>

        </div>
      </div>
      {loading && (
        <div className="text-center py-5 fw-bold">
          Loading Excel data...
        </div>
      )}

      <div className="row">

        {uploading && (
          <div className="mb-3">
            <div className="progress" style={{ height: 20 }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row">
        {!loading && data.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead className="table-light">
                  <tr>
                    {headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row, i) => (
                    <tr key={i}>
                      {headers.map((h) => (
                        <td key={h}>{row[h]?.toString()}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center mt-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Prev
              </button>

              <span className="fw-semibold">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

};

export default UploadExcel;
