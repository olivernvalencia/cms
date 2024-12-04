ALTER TABLE ph_barangays ADD COLUMN brgy_doc_template varchar(100);

ALTER VIEW ph_addresses_vw AS 
SELECT 
b.iid brgy_id,
b.iname brgy_name,
b.icode brgy_icode,
b.brgy_logo brgy_logo,
b.brgy_doc_template doc_template,
c.iid city_id,
c.iname city_name,
c.icode city_icode,
c.city_logo city_logo,
p.iid province_id,
p.iname province_name,
p.icode province_icode,
p.province_logo province_logo,
r.iid region_id,
r.iname region_name,
r.icode region_icode
FROM ph_barangays b
JOIN ph_cities c ON (b.city_id=c.iid)
JOIN ph_provinces p ON (c.province_id=p.iid)
JOIN ph_regions r ON (p.region_id=r.iid) ;

-- Official types
DROP TABLE IF EXISTS cbs_official_types;
CREATE TABLE cbs_official_types (
iid int(11) NOT NULL AUTO_INCREMENT,
iname varchar(50),
comments varchar(50),
lgu_type_id INT(11) NOT NULL DEFAULT '1',
PRIMARY KEY (iid),
FOREIGN KEY (lgu_type_id) REFERENCES lgu_types (iid)
);

insert into cbs_official_types (iname, lgu_type_id)
values
('Barangay Chairman', 1),
('Barangay Councilor', 1),
('Barangay Treasurer', 1),
('Barangay Secretary', 1),
('Barangay Administrator', 1),
('SK Chairman', 1),
('SK Councilor', 1),
('Barangay Police Chief', 1),
('Barangay Police', 1),
('Mayor', 2),
('Vice Mayor', 2),
('Municipal Councilor', 2),
('Governor', 3),
('Vice Governor', 3);

-- Officials
DROP TABLE IF EXISTS cbs_officials;
CREATE TABLE cbs_officials (
official_id int(11) NOT NULL AUTO_INCREMENT,
official_type_id int(11) NOT NULL,
full_name VARCHAR(150) NOT NULL,
position_rank INT(2) NOT NULL DEFAULT '1',
barangay_id INT(11) NOT NULL DEFAULT 0,
city_id INT(11) NOT NULL DEFAULT 0,
province_id INT(11) NOT NULL DEFAULT 0,
profile_image VARCHAR(150),
contact_number VARCHAR(20)
PRIMARY KEY (official_id),
FOREIGN KEY (official_type_id) REFERENCES cbs_official_types (iid),
FOREIGN KEY (barangay_id) REFERENCES ph_barangays (iid),
FOREIGN KEY (city_id) REFERENCES ph_cities (iid),
FOREIGN KEY (province_id) REFERENCES ph_provinces (iid)
);

insert into cbs_officials
(official_type_id, full_name, position_rank, barangay_id, profile_image)
values 
(1, 'Ariel Cruz', 1, 5628, '../assets/ArielCruz.png'),
(2, 'Noli Capulong', 1, 5628, '../assets/NoliCapulong.png'),
(2, 'Guding Valencia', 2, 5628, '../assets/GudingValencia.png'),
(2, 'Badong Bautista', 3, 5628, '../assets/BadongBautista.png'),
(2, 'Benny Ocanpo', 4, 5628, '../assets/BennyOcanpo.png'),
(2, 'Lhen David', 5, 5628, '../assets/LhenDavid.png'),
(2, 'Hermie Agustin', 6, 5628, '../assets/HermieAgustin.png'),
(2, 'Freddie Pascasio', 7, 5628, '../assets/FreddiePascasio.png'),
(3, 'Tres Vispo', 1, 5628, '../assets/TresColo.png'),
(4, 'Sec Dhalie', 1, 5628, '../assets/Dhalie.png');


-- 
DELIMITER $$

CREATE or REPLACE PROCEDURE GetBarangayOfficials (
	IN p_barangay_id INT
)
BEGIN
	SELECT ot.iname cms_position,
		   o.full_name,
		   o.profile_image,
		   o.contact_number
	FROM cbs_officials o
	JOIN cbs_official_types ot
		ON (ot.iid=o.official_type_id)
	WHERE ot.lgu_type_id = 1
		AND o.barangay_id = p_barangay_id
	ORDER BY ot.iid, o.position_rank;
	
END $$

DELIMITER ;


ALTER TABLE cbs_blotters DROP COLUMN STATUS;

-- Mastert table for hearing statuses
DROP TABLE IF EXISTS cbs_hearing_statuses;
CREATE TABLE cbs_hearing_statuses (
iid INT(10) NOT NULL AUTO_INCREMENT,
iname VARCHAR(20),
comments VARCHAR(256),
PRIMARY KEY (iid),
UNIQUE (iname)
);

INSERT INTO cbs_hearing_statuses (iname)
VALUES
('New'),
('On going'),
('Moved to higher court'),
('Closed');

-- table for hearings
DROP TABLE IF EXISTS cbs_blotter_hearings;
CREATE TABLE cbs_blotter_hearings (
iid INT(10) NOT NULL AUTO_INCREMENT,
hearing_date DATETIME DEFAULT NOW(),
remarks VARCHAR(1024),
status_id INT(10) NOT NULL DEFAULT 1,
blotter_id INT(10) NOT NULL,
official_id INT(10),
PRIMARY KEY (iid),
FOREIGN KEY (blotter_id) REFERENCES cbs_blotters (blotter_id),
FOREIGN KEY (status_id) REFERENCES cbs_hearing_statuses (iid),
FOREIGN KEY (official_id) REFERENCES cbs_officials (official_id)
);

-- 

DELIMITER $$

CREATE OR REPLACE PROCEDURE GetAllBlotters(
	IN p_barangay_id INT
)
BEGIN
SELECT b.blotter_id,
	b.report_date,
	b.incident_date,
	u.fullname reporter,
	concat(r1.first_name, ' ', r1.last_name) complainant,
	concat(r2.first_name, ' ', r2.last_name) respondent,
	b.witnesses,
	b.incident_type,
	b.incident_location,
	b.incident_description,
	hs.iname status,
	b.resolution,
	b.notes,
	b.barangay_id
FROM cbs_blotters b 
JOIN cbs_users u ON (b.reporter_id = u.id)
JOIN cbs_residents r1 ON (b.complainant_id = r1.resident_id)
JOIN cbs_residents r2 ON (b.respondent_id  = r2.resident_id)
JOIN cbs_blotter_hearings bh ON (b.blotter_id = bh.blotter_id)
JOIN cbs_hearing_statuses hs ON (bh.status_id = hs.iid)
WHERE b.barangay_id = p_barangay_id 
AND bh.iid in (SELECT MAX(iid) FROM cbs_blotter_hearings GROUP BY blotter_id)
ORDER BY incident_date DESC;

END $$


CREATE OR REPLACE PROCEDURE GetBlotterHearings (
	IN p_blotter_id INT 
)
BEGIN
	SELECT 
		bh.hearing_date,
		bh.remarks,
		o.full_name in_charge, 
		hs.iname status
	FROM cbs_blotter_hearings bh 
	JOIN cbs_hearing_statuses hs ON (bh.status_id = hs.iid)
	JOIN cbs_officials o ON (bh.official_id = o.iid)
	WHERE bh.blotter_id = p_blotter_id;
	
END $$


CREATE OR REPLACE PROCEDURE GetHearing (
	IN p_hearing_id INT 
)
BEGIN
	SELECT 
		bh.hearing_date,
		bh.remarks,
		o.full_name in_charge, 
		hs.iname status
	FROM cbs_blotter_hearings bh 
	JOIN cbs_hearing_statuses hs ON (bh.status_id = hs.iid)
	JOIN cbs_officials o ON (bh.official_id = o.iid)
	WHERE bh.iid = p_hearing_id;
	
END $$


CREATE OR REPLACE PROCEDURE AddBlotter(
	IN p_incident_date DATETIME,
	IN p_reporter_id INT,
	IN p_complainant_id INT,
	IN p_respondent_id INT,
	IN p_witnesses TEXT,
	IN p_incident_type VARCHAR(50),
	IN p_incident_location VARCHAR(255),
	IN p_incident_description TEXT,
	IN p_resolution TEXT,
	IN p_notes TEXT,
	IN p_barangay_id INT
)
BEGIN
   DECLARE v_blotter_id INT;
   DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
   
	START TRANSACTION;
	
	INSERT INTO cbs_blotters 
		(incident_date, 
		 reporter_id, 
		 complainant_id, 
		 respondent_id, 
		 witnesses, 
		 incident_type, 
		 incident_location, 
		 incident_description, 
		 resolution, 
		 notes, 
		 barangay_id)
	VALUES
		(p_incident_date,
		 p_reporter_id,
		 p_complainant_id,
		 p_respondent_id,
		 p_witnesses,
		 p_incident_type,
		 p_incident_location,
		 p_incident_description,
		 p_resolution,
		 p_notes,
		 p_barangay_id)
	;
	
	SET v_blotter_id = LAST_INSERT_ID();
	
	INSERT INTO cbs_blotter_hearings
		(blotter_id)
	VALUES 
		(v_blotter_id);
	
	COMMIT;

	
END $$


CREATE OR REPLACE PROCEDURE AddHearing(
	IN p_hearing_date DATETIME,
	IN p_blotter_id INT,
	IN p_remarks VARCHAR(),
	IN p_status_id INT,
	IN p_official_id INT
)
BEGIN
	DECLARE v_hearing_date DATETIME;
	
	IF p_hearing_date IS null THEN
		v_hearing_date = now();
	ELSE
		v_hearing_date = p_hearing_date;
	end if;
	
	INSERT INTO cbs_blotter_hearings
		(hearing_date,
		 blotter_id,
		 remarks,
		 status_id,
		 official_id)
	VALUES 
		(p_blotter_id,
		 v_hearing_date,
		 p_remarks,
		 p_status_id,
		 p_official_id
		 );
	
END $$


DELIMITER ;

