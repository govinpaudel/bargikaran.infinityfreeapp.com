import { useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { downloadRecords, updateRecords } from '../Actions/Action';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from '../Loading/LoadingOverlay';
const SyncData = () => {
  const navigate = useNavigate();
  const [ddate, setDdate] = useState("");
  const [ip, setIp] = useState('127.0.0.1')
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user")) || [];
    setUserData(user);
    if (user.role != 1) {
      navigate("/search")
    }
  }, [])
  const showData = async () => {
    if (!ddate) {
      toast.warning('कृपया मिति छान्नुहोस्');
      return;
    }
    try {
      setLoading(true);
      const data = {
        date: ddate,
        tables: ['brg_cnt', 'brg_details', 'brg_ofc', 'brg_ofc_np', 'brg_ofc_np_gb', 'brg_ofc_np_gb_wd', 'brg_users']
      }
      const res = await downloadRecords(data);
      if (res.data.status == true) {
        setData(res.data.data);
        toast.success('डाटा सफलतापुर्वक प्राप्त भयो ।')
      }

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  const updateToLocal = async () => {
    if (!ip) {
      toast.warning('कृपया सर्भर Ip प्रविष्ट गर्नुहोस्');
      return;
    }
    const data1 = {
      ip: ip,
      data: data
    }
    console.log(data1);
    const res = await updateRecords(data1);
    if (res.data.status == true) {
      toast.success('डाटा सफलतापुर्वक अपडेट भयो ।')
    }
  }


  return (
    <section className="container my-4">
      <Navbar />
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <div className="container">
        <div className='row'>
          <div className="col">
            <input className='form-control' type="date" value={ddate} name="from_date" onChange={(e) => setDdate(e.target.value)} />
          </div>
          <div className="col">
            <button className='btn btn-primary' onClick={showData}>डाटा डाउनलोड गर्नुहोस्</button>
          </div>
          <div className="col">
            <input className='form-control' type="text" value={ip} name="server" required placeholder='Server Ip Address' onChange={(e) => setIp(e.target.value)} />
          </div>
          <div className="col">
            <button className='btn btn-success' onClick={updateToLocal}>डाटा अपडेट गर्नुहोस्</button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <ul className="list-unstyled">
            {data &&
              Object.entries(data).map(([tableName, records]) => (
                <li key={tableName} className="d-flex justify-content-between border-bottom py-1">
                  <span>{tableName}</span>
                  <span>{Array.isArray(records) ? records.length : 0}</span>
                </li>
              ))}
          </ul>

        </div>
      </div>

    </section>
  )
}

export default SyncData
