drop table if EXISTS brg_ofc;
create table brg_ofc as (select distinct office_id,office_name from bargikaran order by office_id,office_name);
drop table if EXISTS brg_ofc_np;
create table brg_ofc_np as (select distinct office_id,office_name,napa_id,napa_name from bargikaran order by office_id,office_name,napa_id,napa_name);
drop table if EXISTS brg_ofc_np_gb;
create table brg_ofc_np_gb as (select distinct office_id,office_name,napa_id,napa_name,gabisa_id,gabisa_name from bargikaran order by office_id,office_name,napa_id,napa_name,gabisa_id,gabisa_name);
drop table if EXISTS brg_ofc_np_gb_wd;
create table brg_ofc_np_gb_wd as (select distinct office_id,office_name,napa_id,napa_name,gabisa_id,gabisa_name,ward_no from bargikaran order by office_id,office_name,napa_id,napa_name,gabisa_id,gabisa_name,ward_no);
CREATE INDEX idx_office_id ON brg_ofc_np(office_id);
CREATE INDEX idx_office_napa ON brg_ofc_np_gb(office_id, napa_id);
CREATE INDEX idx_office_napa_gabisa ON brg_ofc_np_gb_wd(office_id, napa_id, gabisa_id);
CREATE INDEX idx_full_path ON bargikaran(office_id, napa_id, gabisa_id, ward_no, kitta_no);

