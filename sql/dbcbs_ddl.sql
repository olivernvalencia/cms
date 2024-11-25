CREATE TABLE `ph_regions` (
	`iid` INT(3) NOT NULL,
	`iname` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	`icode` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	PRIMARY KEY (`iid`) USING BTREE,
	UNIQUE INDEX `iname` (`iname`, `icode`) USING BTREE
)
COLLATE='utf8mb3_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `ph_provinces` (
	`iid` INT(4) NOT NULL AUTO_INCREMENT,
	`iname` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	`icode` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	`region_id` INT(4) NULL DEFAULT NULL,
	`province_logo` varchar(256),
	PRIMARY KEY (`iid`) USING BTREE,
	UNIQUE INDEX `iname` (`iname`, `icode`) USING BTREE,
	INDEX `region_id` (`region_id`) USING BTREE,
	CONSTRAINT `ph_provinces_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `ph_regions` (`iid`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb3_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=129
;

CREATE TABLE `ph_cities` (
	`iid` INT(4) NOT NULL AUTO_INCREMENT,
	`iname` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	`icode` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	`province_id` INT(4) NULL DEFAULT NULL,
	`city_logo` varchar(256),
	PRIMARY KEY (`iid`) USING BTREE,
	UNIQUE INDEX `iname` (`iname`, `icode`) USING BTREE,
	INDEX `province_id` (`province_id`) USING BTREE,
	CONSTRAINT `ph_cities_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `ph_provinces` (`iid`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb3_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=3695
;

CREATE TABLE `ph_barangays` (
	`iid` INT(4) NOT NULL AUTO_INCREMENT,
	`iname` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	`icode` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb3_general_ci',
	`city_id` INT(4) NULL DEFAULT NULL,
	`brgy_logo` varchar(256),
	PRIMARY KEY (`iid`) USING BTREE,
	UNIQUE INDEX `iname` (`iname`, `icode`, `city_id`) USING BTREE,
	INDEX `city_id` (`city_id`) USING BTREE,
	CONSTRAINT `ph_barangays_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `ph_cities` (`iid`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb3_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=42030
;


CREATE TABLE `cbs_users` (
	`iid` INT(11) NOT NULL AUTO_INCREMENT,
	`users` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`role` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`Barangay_ID` INT(10) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`Barangay_ID`) REFERENCES `ph_barangays` (`iid`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;


CREATE TABLE `cbs_residents` (
	`ResidentID` INT(11) NOT NULL AUTO_INCREMENT,
	`FirstName` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`LastName` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`MiddleName` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Age` INT(10) NOT NULL,
	`birthday` DATE NOT NULL,
	`Gender` VARCHAR(10) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Address` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`Province_ID` INT(10) NOT NULL,
	`City_ID` INT(10) NOT NULL,
	`Barangay_ID` INT(10) NOT NULL,
	`ContactNumber` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Email` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`CivilStatus` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`Occupation` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`HouseholdID` INT(11) NULL DEFAULT NULL,
	`JuanBataanID` INT(11) NULL DEFAULT NULL,
	`RegistrationDate` DATE NOT NULL,
	`Status` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_general_ci',
	`RegisteredVoter` TINYINT(1) NOT NULL,
	`VoterIDNumber` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_general_ci',
	`VotingPrecinct` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`ResidentID`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `cbs_blotters` (
	`blotter_id` INT(11) NOT NULL AUTO_INCREMENT,
	`incident_date` DATETIME NOT NULL,
	`reporter_id` INT(11),
	`complainant_id` INT(11),
	`respondent_id` INT(11),
	`witnesses` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`incident_type` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`incident_location` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`incident_description` TEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	`status` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`resolution` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`notes` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Barangay_ID` INT(10) NOT NULL,
	PRIMARY KEY (`blotter_id`),
	FOREIGN KEY (`complainant_id`) REFERENCES `cbs_residents` (`ResidentID`),
	FOREIGN KEY (`respondent_id`) REFERENCES `cbs_residents` (`ResidentID`),
	FOREIGN KEY (`reporter_id`) REFERENCES `cbs_users` (`id`),
	FOREIGN KEY (`Barangay_ID`) REFERENCES `ph_barangays` (`iid`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

