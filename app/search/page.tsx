'use client';
import React, { useEffect, useState } from 'react'
import { getAllOffices,getAllNapas } from "../_actions/action"

const page = () => {
        const [offices, setOffices] = useState<any[]>([]);
        const [napas, setNapas] = useState<any[]>([]);
        const [gabisas, setGabisas] = useState<any[]>([]);
        const [wards, setWards] = useState<any[]>([]);
        const [office_id, setOffice_id] = useState<number>(0);
        const [napa_id, setNapa_id] = useState<number>(0);
        const [gapa_id, setGapa_id] = useState<number>(0);
        const [ward_no, setWard_no] = useState<number>(0);
        const [kitta_no, setKitta_no] = useState<number>(0);

        useEffect(() => {
                fetchOffices();
        }, [])

        useEffect(() => {
                if(napa_id>0){
                fetchNapas(napa_id);        }
        }, [napa_id])

        const fetchOffices = async () => {
                try {
                        const res = await getAllOffices();
                        setOffices(res.data);
                } catch (error) {
                        console.error("Error fetching offices:", error);
                }
        }
        const fetchNapas=async (office_id:any)=>{
                try {
                        const res = await getAllNapas(office_id);
                        setNapas(res.data); 
                } catch (error) {
                        console.error("Error fetching offices:", error);
                }
        }


        return (
                <section className='container'>
                        <div className="row">
                                <label htmlFor="office_id" className='form-label'>कार्यालय</label>
                                <select name="office_id" className='form-control'>
                                        <option value="0" disabled>--कार्यालय छान्नुहोस्--</option>
                                        {offices ? offices.map((office) => (
                                                <option key={office.office_id} value={office.office_id}>
                                                        {office.office_name}
                                                </option>
                                        )) : null}
                                </select>
                        </div>
                        <div className="row">
                                <label htmlFor="napa_id" className='form-label'>पालिका</label>
                                <select name="napa_id" className='form-control'>
                                        <option value="0" disabled>--पालिका छान्नुहोस्--</option>
                                         {napas ? napas.map((napas) => (
                                                <option key={napas.napa_id} value={napas.napa_id}>
                                                        {napas.napa_name}
                                                </option>
                                        )) : null}
                                </select>
                        </div>
                        <div className="row">
                                <label htmlFor="gabisa_id" className='form-label'>गा.वि.स.</label>
                                <select name="gabisa_id" className='form-control'>
                                        <option value="0" disabled>--गा.वि.स छान्नुहोस्--</option>
                                </select>
                        </div>
                        <div className="row">
                                <label htmlFor="ward_no" className='form-label'>वडा नं</label>
                                <select name="gabisa_id" className='form-control'>
                                        <option value="0" disabled>--वडा नं छान्नुहोस्--</option>
                                </select>
                        </div>
                        <div className="row">
                                <label htmlFor="kitta_no" className='form-label'>कित्ता नं</label>
                                <input type="number" min={1} className="form-control" name="kitta_no" />
                        </div>


                </section>
        )
}

export default page