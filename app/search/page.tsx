'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getAllOffices, getNapasByOfficeId, getGabisasByNapaId, getWardsByGabisaId, getDetailsByKittaNo } from "../_actions/action"

const Page = () => {
  const router = useRouter();

  const [offices, setOffices] = useState<any[]>([]);
  const [napas, setNapas] = useState<any[]>([]);
  const [gabisas, setGabisas] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [office_id, setOffice_id] = useState<number>(0);
  const [napa_id, setNapa_id] = useState<number>(0);
  const [gabisa_id, setGabisa_id] = useState<number>(0);
  const [ward_no, setWard_no] = useState<number>(0);
  const [kitta_no, setKitta_no] = useState<number>(0);
  const [details, setDetails] = useState<any[]>([]);
  const [cnt, setCnt] = useState<number>(0);

  useEffect(() => { fetchOffices(); }, []);
  useEffect(() => { if (office_id > 0) fetchNapas(office_id); }, [office_id]);
  useEffect(() => { if (office_id > 0 && napa_id > 0) fetchGabisas(office_id, napa_id); }, [napa_id]);
  useEffect(() => { if (office_id > 0 && napa_id > 0 && gabisa_id > 0) fetchWards(office_id, napa_id, gabisa_id); }, [gabisa_id]);
  useEffect(() => {
    if (office_id > 0 && napa_id > 0 && gabisa_id > 0 && ward_no > 0 && kitta_no > 0) {
      const timer = setTimeout(() => {
        fetchDetails(office_id, napa_id, gabisa_id, ward_no, kitta_no);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [kitta_no, office_id, napa_id, gabisa_id, ward_no]);

  const fetchOffices = async () => {
    try {
      const res = await getAllOffices();
      setOffices(res.data.data);
      setCnt(res.data.data1);
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  }
  const fetchNapas = async (office_id: any) => {
    try {
      const res = await getNapasByOfficeId(office_id);
      setNapas(res.data.data);
    } catch (error) {
      console.error("Error fetching napas:", error);
    }
  }
  const fetchGabisas = async (office_id: any, napa_id: any) => {
    try {
      const res = await getGabisasByNapaId(office_id, napa_id);
      setGabisas(res.data.data);
    } catch (error) {
      console.error("Error fetching gabisas:", error);
    }
  }
  const fetchWards = async (office_id: any, napa_id: any, gabisa_id: any) => {
    try {
      const res = await getWardsByGabisaId(office_id, napa_id, gabisa_id);
      setWards(res.data.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  }
  const fetchDetails = async (office_id: any, napa_id: any, gabisa_id: any, ward_no: any, kitta_no: any) => {
    try {
      const res = await getDetailsByKittaNo(office_id, napa_id, gabisa_id, ward_no, kitta_no);
      setDetails(res.data.data);
      setCnt(res.data.data1);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

  return (
    <section className="container my-4">
      <h4 className="text-success text-center mb-3">पालिकाले गरेको वर्गिकरण हेर्नुहोस्</h4>
      <div className="text-start mb-3">
        <button className="btn btn-secondary" onClick={() => router.push("/")}>
          ← गृह पृष्ठमा जानुहोस्
        </button>
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

      {/* Counter */}
      <h6 className="text-primary text-center">
        यहाँ {cnt} पटक वर्गिकरण खोजि गरिएको छ ।
      </h6>
    </section>
  )
}

export default Page
