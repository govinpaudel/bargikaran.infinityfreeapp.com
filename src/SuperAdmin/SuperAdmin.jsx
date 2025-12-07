import { useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { downloadRecords, updateRecords,updateUser } from '../Actions/Action';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
const SuperAdmin = () => {
  const navigate = useNavigate();
  const [ddate, setDdate] = useState("");
  const [ip, setIp] = useState()
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [sdata, setSdata] = useState([]);
  const [userData,setUserData]=useState([])
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
      const data = {
        date: ddate
      }
      const res = await downloadRecords(data);
      if (res.data.status == true) {
        setData(res.data);
        toast.success('डाटा सफलतापुर्वक प्राप्त भयो ।')
      }

    } catch (error) {
      console.log(error);
    }
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

  const showEditForm = (id) => {
    console.log(id);
    setShow(true);
    const user = data.users.find(u => u.id === id);
    setSdata(user);
  }
  const handleChange = (e) => {
    setSdata({...sdata,[e.target.name]:e.target.value});
    console.log(sdata);
  }
  const handleSubmit =async(e)=>{
    e.preventDefault();
    sdata.updated_by_user_id=userData.id;
    console.log(sdata);
    try {
      const res=await updateUser(sdata);
      if(res.data.status==true){
        toast.success(res.data.message);
        setShow(false);
        showData();
      }
    } catch (error) {
      console.log(error);      
    }
  }
  return (
    <section className="container my-4">
      <Navbar />
      <div className="container">
        <div className='row'>
          <div className="col">
            <input className='form-control' type="date" value={ddate} name="from_date" onChange={(e) => setDdate(e.target.value)} />
          </div>
          <div className="col">
            <button className='btn btn-primary' onClick={showData}>डाटा देखाउनुहोस्</button>
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
          <div className="col-sm-2">
            <ul>
              <li>users: {data.users ? data.users.length : null} </li>
              <li>bargikaran: {data.details ? data.details.length : null}</li>
            </ul>
          </div>
          <div className="col-sm-10">
            <table className='table table-sm table-stripped'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Mobile</th>
                  <th>Nepali Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Login_Cnt</th>
                  <th>Expire_At</th>
                  <th>कृयाकलाप</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.users ?
                    data.users.map((item, i) => {
                      return (<tr key={i}>
                        <td>{item.id}</td>
                        <td>{item.mobileno}</td>
                        <td>{item.nepali_name}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td>{item.login_cnt}</td>
                        <td>{item.expire_at}</td>
                        <td><button onClick={() => showEditForm(item.id)}> <FontAwesomeIcon icon={faEdit} /></button></td>
                      </tr>)
                    }) : null
                }

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {show && (        
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">प्रयोगकर्ता संशोधन फाराम</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShow(false)}
                  />
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Id</label>
                      <input type="text" name='id' value={sdata.id} className="form-control" onChange={handleChange} readOnly />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">नाम</label>
                      <input type="text" name='nepali_name' value={sdata.nepali_name} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">ईमेल</label>
                      <input type="email" name='email' value={sdata.email} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">रोल</label>
                      <input type="number" name='role' value={sdata.role} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">लगईन अवस्था</label>
                      <input type="number" name='login_cnt' value={sdata.login_cnt} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">अन्तिम मिति</label>
                      <input type="text" name='expire_at' value={sdata.expire_at} onChange={handleChange} className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-success">
                      सेभ गर्नुहोस्
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
       
      )}
    </section>
  )
}

export default SuperAdmin
