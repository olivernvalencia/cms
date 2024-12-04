-- Officials
ALTER TABLE cbs_officials ADD COLUMN committee varchar(200) AFTER position_rank;
ALTER TABLE cbs_officials ADD COLUMN contact_number VARCHAR(20) AFTER profile_image; 

DROP TABLE IF EXISTS cbs_officials;
CREATE TABLE cbs_officials (
official_id int(11) NOT NULL AUTO_INCREMENT,
official_type_id int(11) NOT NULL,
full_name VARCHAR(150) NOT NULL,
position_rank INT(2) NOT NULL DEFAULT '1',
committee varchar(200),
barangay_id INT(11) NOT NULL DEFAULT 0,
city_id INT(11) NOT NULL DEFAULT 0,
province_id INT(11) NOT NULL DEFAULT 0,
profile_image VARCHAR(150),
contact_number VARCHAR(20),
PRIMARY KEY (official_id),
FOREIGN KEY (official_type_id) REFERENCES cbs_official_types (iid),
FOREIGN KEY (barangay_id) REFERENCES ph_barangays (iid),
FOREIGN KEY (city_id) REFERENCES ph_cities (iid),
FOREIGN KEY (province_id) REFERENCES ph_provinces (iid)
);

insert into cbs_officials
(official_type_id, full_name, position_rank, committee, barangay_id, profile_image)
values 
(1, 'Aurelio A. Cruz', 1, null, 5628, '../assets/ArielCruz.png'),
(2, 'Noli M. Capulong', 1, 'Peace and Order, Public Safety, BADAC and BDRRM', 5628, '../assets/NoliCapulong.png'),
(2, 'Gaudencio M. Valencia', 2, 'Appropriation, Finance, Budget, Ways and Means', 5628, '../assets/GudingValencia.png'),
(2, 'Luisito G. Bautista', 3, 'Cooperative Development, Livelihood and Employment', 5628, '../assets/BadongBautista.png'),
(2, 'Romeo T. Ocampo', 4, 'Environmental Protection, Health, Sanitation and Social Services', 5628, '../assets/BennyOcanpo.png'),
(2, 'Hazelyn N. David', 5, 'Women and Family Welfare, Education and BCPC', 5628, '../assets/LhenDavid.png'),
(2, 'Herminio V. Agustin', 6, 'Public Works and Transportaion', 5628, '../assets/HermieAgustin.png'),
(2, 'Brigido T, Pascasio', 7, 'Human Rights, Justice and Agriculture', 5628, '../assets/FreddiePascasio.png'),
(3, 'Angelina V. Embile', 1, null, 5628, '../assets/TresColo.png'),
(4, 'Dhalie A. Acuna', 1, null, 5628, '../assets/Dhalie.png');