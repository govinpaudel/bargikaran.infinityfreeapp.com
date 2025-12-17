import { useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { listUsers, updateUser } from '../Actions/Action';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from '../Loading/LoadingOverlay';
const ListUser = () => {
  const navigate = useNavigate();  
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user")) || [];
    setUserData(user);
    if (user.role != 1) {
      navigate("/search")
    }
  }, [])
  const showData = async () => {    
    try {
      setLoading(true);      
      const res = await listUsers();
      if (res.data.status == true) {
        setData(res.data);
        toast.success('डाटा सफलतापुर्वक प्राप्त भयो ।')
      }

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
 const showEditForm = (data) => {
  setShow(true);
  setSelectedRow(data);
  console.log(data);
 }

const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await updateUser(selectedRow);
      if (res.data.status == true) {
        toast.success(res.data.message);
        setShow(false);
        showData();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
}

  
  return (
    <section className="container my-4">
      <Navbar />
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <div className="container">
        <div className='row'>          
          <div className="col">
            <button className='btn btn-primary' onClick={showData}>डाटा देखाउनुहोस्</button>
          </div>          
        </div>
      </div>
      <div className="container">        
        <div className="row">
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
                <th>created_At</th>
                <th>updated_At</th>
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
                      <td>{item.created_at}</td>
                      <td>{item.updated_at}</td>
                      <td><button onClick={() => showEditForm(item)}> <FontAwesomeIcon icon={faEdit} /></button></td>
                    </tr>)
                  }) : null
              }

            </tbody>
          </table>          
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
                    <input type="text" name='id' value={selectedRow.id} className="form-control" onChange={(e) => setSelectedRow({ ...selectedRow, id: e.target.value })} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">नाम</label>
                    <input type="text" name='nepali_name' value={selectedRow.nepali_name} onChange={(e) => setSelectedRow({ ...selectedRow, nepali_name: e.target.value })} className="form-control" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">ईमेल</label>
                    <input type="email" name='email' value={selectedRow.email} onChange={(e) => setSelectedRow({ ...selectedRow, email: e.target.value })} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">रोल</label>
                    <input type="number" name='role' value={selectedRow.role} onChange={(e) => setSelectedRow({ ...selectedRow, role: e.target.value })} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">लगईन अवस्था</label>
                    <input type="number" name='login_cnt' value={selectedRow.login_cnt} onChange={(e) => setSelectedRow({ ...selectedRow, login_cnt: e.target.value })} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">अन्तिम मिति</label>
                    <input type="text" name='expire_at' value={selectedRow.expire_at} onChange={(e) => setSelectedRow({ ...selectedRow, expire_at: e.target.value })} className="form-control" />
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

export default ListUser
