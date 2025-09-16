'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuthToken,getDataByDate,sendRecordsToServer } from '@/app/_actions/action';
import { toast } from "react-toastify";

export type BargikaranRecord = {
  id: number;
  office_id: number | null;
  office_name: string | null;
  napa_id: number | null;
  napa_name: string | null;
  gabisa_id: number | null;
  gabisa_name: string | null;
  ward_no: number | null;
  sheet_no: string | null;
  kitta_no: number | null;
  area: string | null;
  bargikaran: string | null;
  remarks: string | null;
  sno: number | null;
  created_at: string | null;
  created_by_user_id: number | null;
  updated_at: string | null;
  updated_by_user_id: number | null;
};

const ManagePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [records, setRecords] = useState<BargikaranRecord[]>([]);;

  useEffect(() => {
    const token = localStorage.getItem('api_token');
    const user = localStorage.getItem('username');
    
    if (!token || !user) {
      router.push('/admin'); // not logged in → go back to login
    } else {
      setUsername(user);
    }
  }, [router]);

  const handleUpload = async () =>{
    if(records.length==0){
      toast.info("No Data to update to server");
    }
    else{
    const response=await sendRecordsToServer(records);
    if(response.data.status==true){
      toast.success(response.data.message);
    }
  }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('username');
    clearAuthToken(); // remove from axios headers
    router.push('/admin'); // back to login
  };

  const handleDownload = async () => {
    if (!selectedDate) {
      toast.warning("कृपया मिति चयन गर्नुहोस् ।");
      return;
    }
    try {
      const response = await getDataByDate(selectedDate);
      setRecords(response.data.data || []);
      if (response.data.data?.length === 0) {
        toast.info("कुनै पनि डेटा फेला परेन ।");
      }
    } catch (err) {
      toast.error("डेटा ल्याउन असफल भयो");
    }
  };

  return (
    <div className="container mt-5">
      {/* Dashboard Header */}
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Admin Dashboard</h4>
              {username && (
                <p className="mb-0 text-success">
                  Welcome, <strong>{username}</strong> 🎉
                </p>
              )}
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
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
          <button className="btn btn-primary" onClick={handleDownload}>
            Download Data
          </button>
          <button className="btn btn-primary" onClick={handleUpload}>
            Update to remote
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="row mt-4">
        <div className="col-md-12">
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
    </div>
  );
};

export default ManagePage;
