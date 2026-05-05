# CMS

## This is a description.


# Installation Guide
## Database setup
1. Install MariaDB
	mariadb-11.6.2-winx64.msi
	
2. Change mariadb variables (my.ini) and restart.

	[mysqld]
	event_scheduler=ON
	wait_timeout = 259200
	interactive_timeout = 259200
	server_id=1
	log_error = {MariaDB data directory}\mariadb_error.log

3. Restart MariaDB service

4. Create database by importing database dump file.
	
5. Recreate sequence

	drop table if exists control_number_seq;
	
	CREATE SEQUENCE control_number_seq
	START WITH 1
	increment BY 1
	CACHE 1;

	drop table if exists indengent_control_number_seq;
	
	CREATE SEQUENCE indengent_control_number_seq
	START WITH 1
	increment BY 1
	CACHE 1;


## Web server setup
1. Install nodejs
	node-v20.16.0-x64.msi
	
2. Set environment
	{install-directory}/nodejs/node_modules/npm/npmrc
	
3. Clone Or Download binaries folder to server local directory.
    https://github.com/Maaaaark07/cms/tree/main
	to
	c:\maya\cms
	
4. Install npm components
	cd c:\maya\cms\frontend\
	npm i 
	
5. Create softlink for uploads directory (server -> frontend)

	mklink /D <cmsdir>\frontend\src\assets\uploads <cmsdir>\server\uploads

	sample:
	mklink /D C:\Users\santo\OneDrive\Desktop\"CMBS 2026"\cms\frontend\src\assets\uploads C:\Users\santo\OneDrive\Desktop\"CMBS 2026"\cms\server\uploads

6. Change server ip address to static
	192.168.1.100		--> can be change depends on client

7. Add domain to hosts file
	192.168.1.100 	colo-cms.gov.ph		--> can be change depends on client

8. update config.json
	"DomainName": "colo-cms.gov.ph" 	--> can be change depends on client

9. Start server and frontend by running start_cms.bat


## Web login
http://colo-cms.gov.ph:5173/login or
http://192.168.1.100:5173/login
