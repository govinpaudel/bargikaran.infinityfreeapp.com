import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./app.css";
import { Circles } from "react-loader-spinner";

const DEBOUNCE_DELAY = 1000;

const App = () => {
  const debounceRef = useRef(null);
  const Url = import.meta.env.VITE_API_URL + "bargikaran/";
  const initialData = {
    type: "getalloffices",
    office_id: 0,
    napa_id: 0,
    gabisa_id: 0,
    ward_no: 0,
    kitta_no: "",
  };

  const [data, setData] = useState(initialData);
  const [offices, setOffices] = useState();
  const [napas, setNapas] = useState();
  const [gapas, setGapas] = useState();
  const [wards, setWards] = useState();
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("खोजिका लागी विवरण प्रविष्ट गर्नुहोस्");
  const [visit, setVisit] = useState(0);

  const handleRefresh = () => {
    setData(initialData);
    setDetails({});
  };

  const loadOffices = async () => {
    setLoading(true);
    const response = await axios.post(Url + "getlist.php", data);
    setOffices(response.data.data);
    setVisit(response.data.data1?.cnt || 0);
    setLoading(false);
  }

  const getnapabyoffices = async (e) => {
    setLoading(true);
    const updatedData = {
      ...data,
      [e.target.name]: e.target.value,
      type: "getnapabyoffices",
    };
    setData(updatedData); // update state
    const response = await axios.post(Url + "getlist.php", updatedData);
    console.log('sent', updatedData)
    console.log('received', response.data.data)
    setNapas(response.data.data);
    setLoading(false);
  };

  const getgapabyoffices = async (e) => {
    setLoading(true);
    const updatedData = {
      ...data,
      [e.target.name]: e.target.value,
      type: "getgapabyoffices",
    };
    setData(updatedData); // update state
    const response = await axios.post(Url + "getlist.php", updatedData);
    console.log('sent', data)
    console.log('received', response.data.data)
    setGapas(response.data.data);
setLoading(false);
  };

  const getwardbyoffices = async (e) => {
    setLoading(true);
    const updatedData = {
      ...data,
      [e.target.name]: e.target.value,
      type: "getwardbyoffices",
    };
    setData(updatedData); // update state
    const response = await axios.post(Url + "getlist.php", updatedData);
    console.log('sent', data)
    console.log('received', response.data.data)
    setWards(response.data.data);
    setLoading(false);
  };

  const handleWardChange = (e) => {
   const updatedData = {
      ...data,
      [e.target.name]: e.target.value,
      type: "getwardbyoffices",
    };
    setData(updatedData); // update state
  };

  const normalizeNepaliDigits = (value) => {
    const nepaliDigits = "०१२३४५६७८९";
    return value.replace(/[०१२३४५६७८९]/g, (d) => nepaliDigits.indexOf(d));
  };

  const handleKittaChange = (e) => {
    
    const { name, value } = e.target;
    const normalizedValue = normalizeNepaliDigits(value);

    // Validation
    if (data.office_id === 0) return toast.warning("कृपया कार्यालय छान्नुहोस्");
    if (data.napa_id === 0) return toast.warning("कृपया न.पा. छान्नुहोस्");
    if (data.gabisa_id === 0) return toast.warning("कृपया गा.वि.स छान्नुहोस्");
    if (data.ward_no === 0) return toast.warning("कृपया वडा छान्नुहोस्");

    // Update state and debounce API call
    setData((prev) => {
      const newData = {
        ...prev,
        [name]: normalizedValue,
        type: "getbargidetails",
      };

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        loaddata(newData);
      }, DEBOUNCE_DELAY);
      return newData;
    });
  
  };

  const loaddata = async (requestData = data) => {
    setLoading(true);
    try {
      const response = await axios.post(Url + "getlist.php", requestData);
      console.log("sentData", requestData);
      console.log("receivedData", response.data);      
        setDetails(response.data.data);
        setVisit(response.data.data1?.cnt || 0);
      
    } catch (error) {
      console.error(error);
      toast.error("डेटा लोड गर्न असफल भयो");
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    document.title = "वर्गिकरण खोजी";
    loadOffices();
  }, []);

  return (
    <section className="container">
      {loading && (
        <div className="fullscreen-loader">
          <div className="loader">
            <Circles height={150} width={150} color="navy" ariaLabel="loading" />
            <h2 className="loader-text navy">कृपया प्रतिक्षा गर्नुहोस् ।</h2>
          </div>
        </div>
      )}
      <div className="form text-center">
        <h5 className="text-center navy">पालिकाले गरेको वर्गिकरण हेर्नुहोस् ।</h5>
        <button onClick={handleRefresh} className="btn btn-success text-center">
          डाटा रिफ्रेस गर्नुहोस्
        </button>
      </div>

      <div className="row text-center">
        <div className="col-12 col-lg-auto">
          <select name="office_id" className="form-control" onChange={getnapabyoffices} value={data.office_id}>
            <option>कार्यालय छान्नुहोस्</option>
            {offices?.map((item) => (
              <option key={item.office_id} value={item.office_id}>
                {item.office_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-lg-auto">
          <select name="napa_id" className="form-control" onChange={getgapabyoffices} value={data.napa_id}>
            <option>नगरपालिका छान्नुहोस्</option>
            {napas?.map((item) => (
              <option key={item.napa_id} value={item.napa_id}>
                {item.napa_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-lg-auto">
          <select name="gabisa_id" className="form-control" onChange={getwardbyoffices} value={data.gabisa_id}>
            <option>गा.वि.स छान्नुहोस्</option>
            {gapas?.map((item) => (
              <option key={item.gabisa_id} value={item.gabisa_id}>
                {item.gabisa_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-lg-auto">
          <select name="ward_no" className="form-control" onChange={handleWardChange} value={data.ward_no}>
            <option>वडा नं छान्नुहोस्</option>
            {wards?.map((item) => (
              <option key={item.ward_no} value={item.ward_no}>
                {item.ward_no}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-lg-auto">
          <input
            className="form-control"
            type="text"
            name="kitta_no"
            placeholder="कित्ता नं प्रविष्ट गर्नुहोस्"
            onChange={handleKittaChange}
            value={data.kitta_no}
            required
            maxLength={5}
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="container text-center">
        <table className="table table-sm table-stripped table-bordered">
          {details && details.length > 0 && (
            <thead>
              <tr>
                <th>गा.वि.स</th>
                <th>वडा</th>
                <th>सिट</th>
                <th>कित्ता</th>
                <th>वर्गिकरण</th>
                <th>कैफियत</th>
              </tr>
            </thead>
          )}
          <tbody>
            {details
              ? details.length > 0
                ? details.map((item, i) => (
                  <tr key={i}>
                    <td>{item.gabisa_name}</td>
                    <td>{item.ward_no}</td>
                    <td>{item.sheet_no}</td>
                    <td>{item.kitta_no}</td>
                    <td>{item.bargikaran}</td>
                    <td>{item.remarks}</td>
                  </tr>
                ))
                : (
                  <tr>
                    <td colSpan="6">कुनै पनि रेकर्ड फेला परेन ।</td>
                  </tr>
                )
              : (
                <tr>
                  <td colSpan="6">{msg}</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div className="row">
        <h6 className="text-center text-success nepali">
          यहाँ {visit} पटक वर्गिकरण खोजि गरिएको छ ।
        </h6>
        <h6 className="text-center text-green">
          <a href="https://www.facebook.com/govinda.paudel.196711">
            डिजाईन तथा निर्माणः गोविन्द पौडेल । 9846805409
          </a>
        </h6>
      </div>
    </section>
  );
};

export default App;
