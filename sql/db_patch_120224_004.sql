/*
Certification types
*/

DROP TABLE IF EXISTS cbs_certification_types;
CREATE TABLE cbs_certification_types (
iid INT(11) NOT NULL AUTO_INCREMENT,
iname varchar(50),
comments varchar(50),
amount int(11) NOT NULL default 0,
body_text varchar(1024) NOT NULL DEFAULT '<insert text here>',
lgu_type_id INT(11) NOT NULL DEFAULT '1',
PRIMARY KEY (iid),
FOREIGN KEY (lgu_type_id) REFERENCES lgu_types (iid),
UNIQUE (iname)
);

insert into cbs_certification_types (iname, lgu_type_id)
values
('Assistance Certification', 1),
('Business Permit Certification', 1),
('Business Closure Certification', 1),
('Calamity Certification', 1),
('Death Certification', 1),
('Indigency Certification', 1),
('Lot Certification', 1),
('Residence Certification', 1),
('Relationship Certification', 1),
('Requisition Certification', 1),
('Solo Parent Certification', 1),
('PSA Certification', 1),
('Unemployment Certification', 1),
('RA 11261 Certification', 1),
('Electrical Permit', 1),
('Fencing Certification', 1);


DELIMITER $$

CREATE OR REPLACE PROCEDURE GeBrgyCertificateTypes (
)
BEGIN
	SELECT * from cbs_certification_types ct
	WHERE lgu_type_id = 1;
	
END $$

CREATE OR REPLACE PROCEDURE AddBrgyCertificateTypes (
	IN p_iname varchar(50),
	IN p_comments varchar(50),
	IN p_amount int,
	IN p_body_text varchar(1024)
)
BEGIN
	INSERT INTO cbs_certification_types 
	    (iname,
		 comments,
		 amount,
		 amount,
		 body_text)
	VALUES
		 (p_iname,
		  p_comments,
		  p_amount,
		  p_amount,
		  p_body_text);
	
END $$

DELIMITER ;

/*
Certification request
*/

DROP TABLE IF EXISTS cbs_certification_requests;
CREATE TABLE cbs_certification_requests (
iid INT(11) NOT NULL AUTO_INCREMENT,
resident_id INT(20) NOT NULL,
certification_type_id INT(11) NOT NULL,
date_requested DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
istatus VARCHAR(100) NOT NULL DEFAULT 'New', 
date_issued DATETIME,
issued_by int(11),
amount int(11) not null default 0,
purpose VARCHAR(500),
barangay_id INT(11) NOT NULL DEFAULT 0,
cert_file_path VARCHAR(100),
PRIMARY KEY (iid),
FOREIGN KEY (barangay_id) REFERENCES ph_barangays (iid),
FOREIGN KEY (issued_by) REFERENCES cbs_users (id)
FOREIGN KEY (certification_type_id) REFERENCES cbs_certification_types (iid),
FOREIGN KEY (resident_id) REFERENCES cbs_residents (resident_id)
);

CREATE INDEX idx_cert_req_brgy_id ON cbs_certification_requests (barangay_id);


DELIMITER $$


CREATE or REPLACE PROCEDURE GetAllCertificateRequests (
	IN p_barangay_id INT
)
BEGIN
	SELECT cr.iid certification_id,
			 concat(r.first_name, ' ', r.last_name) applicant,
			 r.occupation,
			 ct.iname certification_type,
			 cr.purpose,
			 cr.amount,
			 cr.date_requested,
			 cr.istatus,
			 cr.date_issued,
			 u.fullname issued_by,
			 cr.cert_file_path
	from cbs_certification_requests cr
	join cbs_residents r ON (r.resident_id=cr.resident_id)
	JOIN cbs_certification_types ct ON (cr.certification_type_id=ct.iid)
	JOIN cbs_users u ON (cr.issued_by=u.id)
	WHERE r.barangay_id = p_barangay_id;
	
END $$


CREATE or REPLACE PROCEDURE GetCertificateRequest (
	IN p_certification_id INT
)
BEGIN
	SELECT cr.iid certification_id,
			 concat(r.first_name, ' ', r.last_name) applicant,
			 r.occupation,
			 ct.iname certification_type,
			 cr.purpose,
			 cr.amount,
			 cr.date_requested,
			 cr.istatus,
			 cr.date_issued,
			 u.fullname issued_by,
			 cr.cert_file_path
	from cbs_certification_requests cr
	join cbs_residents r ON (r.resident_id=cr.resident_id)
	JOIN cbs_certification_types ct ON (cr.certification_type_id=ct.iid)
	JOIN cbs_users u ON (cr.issued_by=u.id)
	WHERE cr.iid = p_certification_id;
	
END $$


CREATE or REPLACE PROCEDURE AddCertificateRequest (
	IN p_resident_id INT,
	IN p_certification_type_id INT,
	IN p_amount INT,
	IN p_purpose VARCHAR(500),
	IN p_barangay_id INT(11),
	IN p_cert_file_path VARCHAR(100)
)
BEGIN
	INSERT INTO cbs_certification_requests 
	    (resident_id,
		  certification_type_id,
		  amount,
		  purpose,
		  barangay_id,
		  cert_file_path)
	VALUES
		 (p_resident_id,
		  p_certification_type_id,
		  p_amount,
		  p_purpose,
		  p_barangay_id,
		  p_cert_file_path);
		 
END $$


CREATE or REPLACE PROCEDURE UpdateCertificateRequest (
	IN p_iid INT,
	IN p_istatus VARCHAR(100),
	IN p_issued_by INT,
	IN p_amount INT,
	IN p_purpose VARCHAR(500),
	in p_cert_file_path VARCHAR(100)
)
BEGIN
	DECLARE v_issued_by INT;
	DECLARE v_date_issued DATETIME;
	
	IF p_istatus = 'ISSUED' THEN
		SET v_issued_by = p_issued_by;
		SET v_date_issued = now();
	ELSE
		SET v_issued_by = null;
		SET v_date_issued = null;
	END IF;
	
	
	UPDATE cbs_certification_requests 
	    SET istatus = p_istatus,
	        issued_by = v_issued_by,
	        date_issued = v_date_issued,
	        amount = p_amount,
	        purpose = p_purpose,
			cert_file_path = p_cert_file_path
		WHERE iid = p_iid;
		 
END $$


DELIMITER ;
