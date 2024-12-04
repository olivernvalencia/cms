-- replace purok with purok_id
ALTER TABLE cbs_residents DROP COLUMN purok;
ALTER TABLE cbs_residents ADD COLUMN purok_id INT(10) NOT NULL after barangay_id;

-- Create index for barangay_id column 
CREATE INDEX idx_residents_brgy_id ON cbs_residents (barangay_id);
CREATE INDEX idx_blotters_brgy_id ON cbs_blotters (barangay_id);

-- Create master table for purok
CREATE TABLE ph_puroks (
iid INT(4) NOT NULL AUTO_INCREMENT,
iname VARCHAR(100) NOT NULL,
barangay_id INT(10) NOT NULL,
PRIMARY KEY (iid),
FOREIGN KEY (barangay_id) REFERENCES ph_barangays (iid),
UNIQUE INDEX `unique` (`iname`, `barangay_id`)
);

-- Insert purok (Barangay Colo)
INSERT INTO ph_puroks
(iname, barangay_id)
VALUES
('Centro', 5628),
('Purok 1', 5628),
('Purok 2', 5628),
('Purok 3', 5628);


-- 

DELIMITER $$


CREATE OR REPLACE PROCEDURE AddResident(
	IN p_first_name VARCHAR(100),
	IN p_last_name VARCHAR(100),
	IN p_middle_name VARCHAR(100),
	IN p_suffix VARCHAR(10),
	IN p_age INT,
	IN p_birthday DATE,
	IN p_birth_place VARCHAR(255),
	IN p_occupation VARCHAR(100),
	IN p_civil_status VARCHAR(50),
	IN p_gender VARCHAR(10),
	IN p_address VARCHAR(100),
	IN p_region_id INT,
	IN p_province_id INT,
	IN p_city_id INT,
	IN p_barangay_id INT,
	IN p_purok_id INT,
	IN p_is_local_resident INT,
	IN p_resident_type VARCHAR(50),
	IN p_contact_number VARCHAR(100),
	IN p_email VARCHAR(100),
	IN p_is_household_head INT,
	IN p_household_id VARCHAR(20),
	IN p_is_registered_voter INT,
	IN p_voter_id_number VARCHAR(20),
	IN p_is_juan_bataan_member INT,
	IN p_juan_bataan_id VARCHAR(20)
)
BEGIN
	INSERT INTO cbs_residents 
	    (first_name,
	     last_name,
	     middle_name,
	     suffix,
	     age,
	     birthday,
	     birth_place,
	     occupation,
	     civil_status,
	     gender,
	     address,
	     region_id,
	     province_id,
	     city_id,
	     barangay_id,
	     purok_id,
	     is_local_resident,
		 resident_type,
	     contact_number,
	     email,
	     is_household_head,
	     household_id,
	     is_registered_voter,
	     voter_id_number,
	     is_juan_bataan_member,
	     juan_bataan_id)
	VALUES
		(p_first_name, 
	     p_last_name, 
	     p_middle_name, 
	     p_suffix,
	     TIMESTAMPDIFF(YEAR, birthday, CURDATE()),
	     p_birthday, 
	     p_birth_place, 
	     p_occupation, 
	     p_civil_status, 
	     p_gender, 
	     p_address, 
	     p_region_id,
	     p_province_id,
	     p_city_id,
	     p_barangay_id,
	     p_purok_id,
	     p_is_local_resident,
		 p_resident_type,
	     p_contact_number,
	     p_email,
	     p_is_household_head,
	     p_household_id,
	     p_is_registered_voter,
	     p_voter_id_number,
	     p_is_juan_bataan_member,
	     p_juan_bataan_id);
		 
END $$

CREATE OR REPLACE PROCEDURE GetAllResidents(
	IN p_barangay_id INT
)
BEGIN
	SELECT r.resident_id, 
		r.first_name, 
		r.last_name, 
		r.middle_name, 
		r.suffix,
		r.age,
		r.birthday, 
		r.birth_place, 
		r.occupation, 
		r.civil_status, 
		r.gender, 
		r.address, 
		p.iname purok,
		a.brgy_name barangay,
		a.city_name city,
		a.province_name province,
		a.region_name region,
		r.is_local_resident,
		r.resident_type,
		r.contact_number, 
		r.email,
		r.is_household_head,
		r.household_id, 
		r.is_registered_voter,
		r.voter_id_number,
		r.is_juan_bataan_member,
		r.juan_bataan_id,
		r.when_created,
		r.last_updated
	from cbs_residents r
	JOIN ph_addresses_vw a
		ON (r.barangay_id=a.brgy_id) 
	JOIN ph_puroks p
		ON (r.purok_id = p.iid)
	WHERE r.barangay_id = p_barangay_id;
	
END $$

CREATE OR REPLACE PROCEDURE GetResident(
	IN p_resident_id INT
)
BEGIN
	SELECT r.resident_id, 
		r.first_name, 
		r.last_name, 
		r.middle_name, 
		r.suffix,
		r.age,
		r.birthday, 
		r.birth_place, 
		r.occupation, 
		r.civil_status, 
		r.gender, 
		r.address, 
		p.iname purok,
		a.brgy_name barangay,
		a.city_name city,
		a.province_name province,
		a.region_name region,
		r.is_local_resident,
		r.resident_type,
		r.contact_number, 
		r.email,
		r.is_household_head,
		r.household_id, 
		r.is_registered_voter,
		r.voter_id_number,
		r.is_juan_bataan_member,
		r.juan_bataan_id,
		r.when_created,
		r.last_updated
	from cbs_residents r
	JOIN ph_addresses_vw a
		ON (r.barangay_id=a.brgy_id) 
	JOIN ph_puroks p
		ON (r.purok_id = p.iid)
	WHERE r.resident_id = p_resident_id;

END $$


CREATE OR REPLACE PROCEDURE UpdateResident(
	IN p_resident_id INT,
	IN p_first_name VARCHAR(100),
	IN p_last_name VARCHAR(100),
	IN p_middle_name VARCHAR(100),
	IN p_suffix VARCHAR(10),
	IN p_age INT,
	IN p_birthday DATE,
	IN p_birth_place VARCHAR(255),
	IN p_occupation VARCHAR(100),
	IN p_civil_status VARCHAR(50),
	IN p_gender VARCHAR(10),
	IN p_address VARCHAR(100),
	IN p_region_id INT,
	IN p_province_id INT,
	IN p_city_id INT,
	IN p_barangay_id INT,
	IN p_purok_id INT,
	IN p_is_local_resident INT,
	IN p_resident_type VARCHAR(50),
	IN p_contact_number VARCHAR(100),
	IN p_email VARCHAR(100),
	IN p_is_household_head INT,
	IN p_household_id VARCHAR(20),
	IN p_is_registered_voter INT,
	IN p_voter_id_number VARCHAR(20),
	IN p_is_juan_bataan_member INT,
	IN p_juan_bataan_id VARCHAR(20)
)
BEGIN
	UPDATE cbs_residents 
	    SET first_name = p_first_name,
	        last_name = p_last_name,
	        middle_name = p_middle_name,
	        suffix = p_suffix,
	        age = TIMESTAMPDIFF(YEAR, birthday, CURDATE()),
	        birthday = p_birthday,
	        birth_place = p_birth_place,
	        occupation = p_occupation,
	        civil_status = p_civil_status,
	        gender = p_gender,
	        address = p_address,
	        region_id = p_region_id,
	        province_id = p_province_id,
	        city_id = p_city_id,
	        barangay_id = p_barangay_id,
	        purok_id = p_purok_id,
	        is_local_resident = p_is_local_resident,
			resident_type = p_resident_type,
	        contact_number = p_contact_number,
	        email = p_email,
	        is_household_head = p_is_household_head,
	        household_id = p_household_id,
	        is_registered_voter = p_is_registered_voter,
	        voter_id_number = p_voter_id_number,
	        is_juan_bataan_member = p_is_juan_bataan_member,
	        juan_bataan_id = p_juan_bataan_id,
			last_updated = now()
		WHERE resident_id = p_resident_id;
		 
END $$

CREATE OR REPLACE PROCEDURE GetResidentsCount(
	IN p_barangay_id INT
)
BEGIN
	SELECT count(*) NumberOfResidents 
	from cbs_residents 
	WHERE barangay_id = p_barangay_id
	and is_local_resident = 1;
	
END $$


DELIMITER ;