import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./app.css";
import { Circles } from "react-loader-spinner";

const App = () => {
  const Url = import.meta.env.VITE_API_URL + "bargikaran/";
  const initialData={
    type: "getalloffices",
    office_id: 0,
    napa_id: 0,
    gabisa_id: 0,
    ward_no: 0,
    kitta_no: 0,
  }
  const [data, setData] = useState(initialData);
  const [offices, setOffices] = useState();
  const [napas, setNapas] = useState();
  const [gapas, setGapas] = useState();
  const [wards, setWards] = useState();
  const [details, setDetails] = useState();
  const [loading, setloading] = useState(false);
  const [msg,setmsg]=useState('खोजिका लागी विवरण प्रविष्ट गर्नुहोस्')

  const handleRefresh=()=>{
  setData(initialData);
  }
  
  function replaceNepaliDigits(e) { 
  const nepaliToEnglishMap = {
    '०': '0',
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9'
  };
  const item=e.target.value;
  const item1= item.replace(/[०१२३४५६७८९]/g, match => nepaliToEnglishMap[match]);
  console.log(item1)  
  setData({...data,"kitta_no":item1})
}
  const handleChange = (e) => {    
    if (e.target.name == "office_id") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getnapabyoffices",
      });
    } else if (e.target.name == "napa_id") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getgapabyoffices",
      });
    } else if (e.target.name == "gabisa_id") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getwardbyoffices",
      });
    } else if (e.target.name == "ward_no") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getkittabyoffices",
      });
    } else if (e.target.name == "kitta_no") {
      if (data.office_id == 0) {
        toast.warning("कृपया कार्यालय छान्नुहोस्");
        return;
      } else if (data.napa_id == 0) {
        toast.warning("कृपया नगरपालिका छान्नुहोस्");
        return;
      } else if (data.gabisa_id == 0) {
        toast.warning("कृपया गाविस छान्नुहोस्");
        return;
      } else if (data.ward_no == 0) {
        toast.warning("कृपया वडा छान्नुहोस्");
        return;
      } else if (data.kitta == "") {
        return;
      } else {
        setData({
          ...data,
          [e.target.name]: e.target.value,
          type: "getdetails",
        });
      }
    }
   
  };
  useEffect(() => {
    loaddata();
  }, [data]);

  const loaddata = async () => {
    setloading(true);
    const response = await axios({
      method: "post",
      url: Url + "getlist.php",
      data: data,
    });
    console.log("sentData", data);
    console.log("receivedData", response.data);
    if (data.type == "getalloffices") {
      setOffices(response.data.data);
    } else if (data.type == "getnapabyoffices") {
      setNapas(response.data.data);
    } else if (data.type == "getgapabyoffices") {
      setGapas(response.data.data);
    } else if (data.type == "getwardbyoffices") {
      setWards(response.data.data);
    } else if (data.type == "getdetails") {
      setDetails(response.data.data);
    }
     setloading(false);
  };
  useEffect(() => {
    document.title = "वर्गिकरण खोजी";
  }, []);

  return (
    <section className="container">
      {loading ?
        (
          <div className="fullscreen-loader">
            <div className="loader">
              <Circles height={150} width={150} color="navy" ariaLabel="loading" />
              <h2 className="loader-text navy" >कृपया प्रतिक्षा गर्नुहोस् ।</h2>
            </div>
          </div>
        ) : null
      }
      <div className="form text-center">
        <h5 className="text-center navy">
          पालिकाले गरेको वर्गिकरण हेर्नुहोस् ।
        </h5>
        <button onClick={handleRefresh} className="btn btn-success text-center">डाटा रिफ्रेस गर्नुहोस्</button>
      </div>
      <div className="row text-center">
      <div className="col-12 col-lg-auto">
        <select
          name="office_id"
          className="form-control"
          onChange={handleChange}
          value={data.office_id}
        >
          <option>कार्यालय छान्नुहोस्</option>
          {offices
            ? offices.map((data) => {
              return (
                <option key={data.office_id} value={data.office_id}>
                  {data.office_name}
                </option>
              );
            })
            : null}
        </select>
      </div>
      <div className="col-12 col-lg-auto">
        <select
          name="napa_id"
          className="form-control"
          onChange={handleChange}
          value={data.napa_id}
        >
          <option>नगरपालिका छान्नुहोस्</option>
          {napas
            ? napas.map((data) => {
              return (
                <option key={data.napa_id} value={data.napa_id}>
                  {data.napa_name}
                </option>
              );
            })
            : null}
        </select>
      </div>
      <div className="col-12 col-lg-auto">
        <select
          name="gabisa_id"
          className="form-control"
          onChange={handleChange}
          value={data.gabisa_id}
        >
          <option>गा.वि.स छान्नुहोस्</option>
          {gapas
            ? gapas.map((data) => {
              return (
                <option key={data.gabisa_id} value={data.gabisa_id}>
                  {data.gabisa_name}
                </option>
              );
            })
            : null}
        </select>
      </div>
      <div className="col-12 col-lg-auto">
        <select
          name="ward_no"
          className="form-control"
          onChange={handleChange}
          value={data.ward_no}
         
        >
          <option>वडा नं छान्नुहोस्</option>
          {wards
            ? wards.map((data) => {
              return (
                <option key={data.ward_no} value={data.ward_no}>
                  {data.ward_no}
                </option>
              );
            })
            : null}
        </select>
      </div>
      <div className="col-12 col-lg-auto">
        <input
          className="form-control"
          type="text"
          name="kitta_no"
          placeholder="कित्ता नं प्रविष्ट गर्नुहोस्"
          onChange={handleChange}
          value={data.kitta_no}
          onKeyUp={replaceNepaliDigits}
          required
        />
      </div>
</div>
      {details ? (
        details.length > 0 ? (
          details.map((data) => {
            return (
              <div className="container text-center">
              <div className="row">
                <div className="col-12 col-lg-auto">
                  साविक गा.वि.सः -{data.gabisa_name} ।
                </div>
                <div className="col-12 col-lg-auto">
                  वडा नंः - {data.ward_no} ।
                </div>
                <div className="col-12 col-lg-auto">
                  सिट नंः - {data.sheet_no} ।
                </div>
                <div className="col-12 col-lg-auto">
                  कित्ता नंः - {data.kitta_no} ।
                </div>
                <div className="col-12 col-lg-auto">
                  वर्गिकरणः - {data.bargikaran} ।
                </div>
                <div className="col-12 col-lg-auto">
                  कैफियत - {data.remarks} ।
                </div>
              </div>
              </div>
            );
          })
        ) : (
          <div className="bargikaran__result">
            <h5 className="col-12 col-lg-auto navy">
              कुनै पनि रेकर्ड फेला परेन ।
            </h5>
          </div>
        )
      ) : (
        <div className="row">
          <h6 className="text-center navy">
           {msg}
          </h6>
        </div>
      )
      }

    </section>
  );
};

export default App;
