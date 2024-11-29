import db from '../config/database.js';

export const getAllResidents = async (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetAllResidents(?)";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve blotter data",
            details: error.message,
        });
    }
};

export const addResident = async (req, res) => {
    try {
        const params = req.body;
        const sql = `
          CALL AddResident(
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `;

        console.log(params);
    
        const values = [
           params.FirstName,       
          params.LastName,       
          params.MiddleName,      
          params.Suffix,           
          params.Age,             
          params.birthday,       
          params.BirthPlace,    
          params.Occupation,      
          params.CivilStatus,   
          params.Gender,        
          params.Address,        
          params.Region_ID,     
          params.Province_ID,     
          params.City_ID,      
          params.Barangay_ID,   
          params.Purok,           
          params.IsLocalResident,
          params.ResidentType,  
          params.ContactNumber,   
          params.Email,         
          params.IsHouseholdHead,  
          params.HouseholdID,     
          params.IsRegisteredVoter,
          params.VoterIDNumber,  
          params.IsJuanBataanMember,
          params.JuanBataanID, 
        ];

        await db.query(sql, values);
        res.status(201).json({ message: 'Resident added successfully' });
    } catch (error) {
        console.error("Error adding resident:", error);
        res.status(500).json({ message: 'Failed to add resident' });
    }
};

export const updateResident = async (req, res) => {
    const { id: ResidentID } = req.params;
    const {
        FirstName, LastName, MiddleName, Suffix, Age, birthday, BirthPlace, Gender, Address, Region_ID,
        Province_ID, City_ID, Barangay_ID, purok, IsLocalResident, ContactNumber, Email, CivilStatus, Occupation,
        IsHouseholdHead, HouseholdID, IsRegisteredVoter, VoterIDNumber, IsJuanBataanMember, JuanBataanID, LastUpdated
    } = req.body;

    if (!ResidentID || !FirstName || !LastName || !Age || !Gender || !Address || !ContactNumber) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    try {
        const query = `
            UPDATE cbs_residents
            SET first_name = ?, last_name = ?, middle_name = ?, suffix = ?, age = ?, birthday = ?, 
                birth_place = ?, gender = ?, address = ?, region_id = ?, province_id = ?, city_id = ?, 
                barangay_id = ?, purok = ?, is_local_resident = ?, contact_number = ?, email = ?, 
                civil_status = ?, occupation = ?, is_household_head = ?, household_id = ?, 
                is_registered_voter = ?, voter_id_number = ?, is_juan_bataan_member = ?, juan_bataan_id = ?, 
                last_updated = ?
            WHERE resident_id = ?
        `;
        const values = [
            FirstName, LastName, MiddleName, Suffix, Age, birthday, BirthPlace, Gender, Address, Region_ID,
            Province_ID, City_ID, Barangay_ID, purok, IsLocalResident, ContactNumber, Email, CivilStatus, Occupation,
            IsHouseholdHead, HouseholdID, IsRegisteredVoter, VoterIDNumber, IsJuanBataanMember, JuanBataanID, LastUpdated,
            ResidentID
        ];

        const result = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Resident not found or no changes made' });
        }

        res.status(200).json({ message: 'Resident updated successfully' });
    } catch (error) {
        console.error("Error updating resident:", error);
        res.status(500).json({ message: 'Failed to update resident' });
    }
};

export const deleteResident = (req, res) => {
    const residentId = req.params.id;
    const query = 'DELETE FROM cbs_residents WHERE resident_id = ?';

    db.query(query, residentId, (error, results) => {
        if (error) {
            console.error("Error deleting resident:", error);
            return res.status(500).json({ message: 'Error deleting resident' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        res.status(200).json({ message: 'Resident deleted successfully' });
    });
};

export const getResidentCount = (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetResidentsCount(?)";

   db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching resident count:", err);
            return res.status(500).json({ message: 'Server error' });
        }
        const count = result[0]?.[0]?.NumberOfResidents || 0;

        res.status(200).json({ count });
    });
};

