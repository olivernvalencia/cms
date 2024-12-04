-- change data type from DATETIME to DATE
ALTER TABLE cbs_blotters MODIFY incident_date DATE;
ALTER TABLE cbs_blotter_hearings MODIFY hearing_date DATE;

-- re create foreign key on delete CASCADE
ALTER TABLE cbs_blotter_hearings DROP FOREIGN KEY cbs_blotter_hearings_ibfk_1;
ALTER TABLE cbs_blotter_hearings ADD CONSTRAINT cbs_blotter_hearings_ibfk_1 FOREIGN KEY (blotter_id) REFERENCES cbs_blotters (blotter_id) ON UPDATE RESTRICT ON DELETE CASCADE;
	
-- add unique key do avoid duplicate records
ALTER TABLE cbs_blotters ADD UNIQUE (incident_date, complainant_id, respondent_id, incident_type, barangay_id);

-- add new hearing
DELIMITER $$

CREATE OR REPLACE PROCEDURE AddBlotterHearing(
	IN p_hearing_date DATE,
	IN p_blotter_id INT,
	IN p_remarks VARCHAR(1024),
	IN p_status_id INT,
	IN p_official_id INT
)
BEGIN
	DECLARE v_hearing_date DATE;
	
	IF p_hearing_date is null THEN
		SET v_hearing_date = CURDATE();
	ELSE
		SET v_hearing_date = p_hearing_date;
	END IF;
	
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

-- update blotter
DELIMITER $$

CREATE or REPLACE PROCEDURE UpdateBlotter (
	IN p_blotter_id INT,
	IN p_witnesses TEXT,
	IN p_incident_location VARCHAR(255),
	IN p_incident_description TEXT,
	IN p_resolution TEXT,
	in p_notes TEXT
)
BEGIN
	UPDATE cbs_blotters 
	    SET witnesses = p_witnesses,
	        incident_location = p_incident_location,
	        incident_description = p_incident_description,
	        resolution = p_resolution,
			  notes = p_notes
		WHERE blotter_id = p_blotter_id;
		 
END $$

DELIMITER ;

-- update blotter hearing
DELIMITER $$

CREATE or REPLACE PROCEDURE UpdateBlotterHearing (
	IN p_iid INT,
	IN p_remarks VARCHAR(1024),
	IN p_status_id INT(10)
)
BEGIN
	UPDATE cbs_blotter_hearings 
	    SET remarks = p_remarks,
	        status_id = p_status_id
		WHERE iid = p_iid;
		 
END $$

DELIMITER ;


--