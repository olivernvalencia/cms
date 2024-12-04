-- master table for certificate status
CREATE TABLE cbs_cert_request_statuses (
iid INT(10) PRIMARY KEY AUTO_INCREMENT,
iname VARCHAR(30),
comments VARCHAR(100),
UNIQUE (iname)
);

INSERT INTO cbs_cert_request_statuses (iname, comments)
VALUES
('New', 'New application'),
('For Approval', 'Pending for approval before release'),
('Approved', 'Ready for releasing'),
('Released', 'Document issued to applicant');


-- alter table
ALTER TABLE cbs_certification_requests RENAME COLUMN istatus TO status_id;
ALTER TABLE cbs_certification_requests modify status_id INT(10) default 1;
ALTER TABLE cbs_certification_requests ADD FOREIGN KEY (status_id) REFERENCES cbs_cert_request_statuses (iid);


-- add certificate
DELIMITER $$

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

DELIMITER ;

-- Update certificate
DELIMITER $$

CREATE or REPLACE PROCEDURE UpdateCertificateRequest (
	IN p_iid INT,
	IN p_istatus_id INT,
	IN p_issued_by INT,
	IN p_amount INT,
	IN p_purpose VARCHAR(500),
	in p_cert_file_path VARCHAR(100)
)
BEGIN
	DECLARE v_issued_by INT;
	DECLARE v_date_issued DATETIME;
	
	IF p_istatus_id = 4 THEN
		SET v_issued_by = p_issued_by;
		SET v_date_issued = now();
	ELSE
		SET v_issued_by = null;
		SET v_date_issued = null;
	END IF;
	
	
	UPDATE cbs_certification_requests 
	    SET istatus = p_istatus_id,
	        issued_by = v_issued_by,
	        date_issued = v_date_issued,
	        amount = p_amount,
	        purpose = p_purpose,
			cert_file_path = p_cert_file_path
		WHERE iid = p_iid;
		 
END $$

DELIMITER ;