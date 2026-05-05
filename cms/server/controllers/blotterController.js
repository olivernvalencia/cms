import db from "../config/database.js";

export const getAllBlotters = async (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetAllBlotters(?)";

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

export const getBlottersById = async (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetBlotter(?)";

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

export const addBlotter = async (req, res) => {
    try {
        const {
            incident_date,
            reporter_id,
            complainant_id,
            complainant_name,
            complainant_address,
            complainant_contact,
            defendants,
            defendantAddresses,
            defendantContacts,
            witnesses,
            incident_type,
            incident_location,
            incident_description,
            resolution,
            notes,
            barangay_id,
        } = req.body;

        const sql = `CALL AddBlotter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            incident_date || null,
            reporter_id,
            complainant_id || null,
            complainant_name || null,
            complainant_address || null,
            complainant_contact || null,
            JSON.stringify(witnesses) || null,
            incident_type || null,
            incident_location || null,
            incident_description || null,
            resolution || null,
            notes || null,
            JSON.stringify(defendants || []),
            JSON.stringify(defendantAddresses || []),
            JSON.stringify(defendantContacts || []),
            barangay_id
        ];

        const result = await new Promise((resolve, reject) => {
            db.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        res.status(201).json({
            message: 'Blotter added successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add blotter', error });
    }
}

export const updateBlotter = async (req, res) => {
    const { id } = req.params;

    const {
        complainant_name,
        complainant_address,
        complainant_contact,
        witnesses,
        incident_date,
        incident_type,
        incident_location,
        incident_description,
        resolution,
        notes,
        defendants,
        def_addresses,
        def_contacts,
    } = req.body;

    const sql = ` CALL UpdateBlotter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const values = [
            id,
            incident_date,
            complainant_name,
            complainant_address,
            complainant_contact,
            JSON.stringify(witnesses) || null,
            incident_type || null,
            incident_location,
            incident_description,
            resolution,
            notes,
            JSON.stringify(defendants),
            JSON.stringify(def_addresses),
            JSON.stringify(def_contacts),
        ];

        const result = await new Promise((resolve, reject) => {
            db.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });

        res.status(200).json({
            message: 'Blotter record updated successfully',
            result,
        });
    } catch (error) {
        console.error("Error updating blotter record:", error);
        res.status(500).json({ message: "Failed to update blotter record" });
    }
};

export const deleteBlotter = async (req, res) => {

    const { id } = req.params;
    try {
        const query = "CALL DeleteBlotter(?)";

        db.query(query, [Number(id)], (error, results) => {
            if (error) {
                console.error("Error deleting blotter record:", error);
                return res.status(500).json({ message: 'Error deleting blotter record' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'blotter record not found' });
            }

            res.status(200).json({ message: 'blotter record deleted successfully' });
        });
    } catch (error) {
        console.error("Error deleting blotter record:", error);
        res.status(500).json({ message: "Failed to delete blotter record" });
    }
};

//Hearings
export const getAllBlotterHearing = async (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetBlotterHearings(?)";

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });
        res.json(result[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve blotter hearings data",
            details: error.message,
        });
    }
}

export const getBlotterHearingById = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM cbs_blotter_hearings WHERE iid = ?;"

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });
        res.json(result[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve blotter hearings data",
            details: error.message,
        });
    }
};

export const getAllBlotterHearingStatuses = async (req, res) => {
    const sql = "SELECT * FROM cbs_hearing_statuses";

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve blotter hearing statuses",
            details: error.message,
        });
    }
};

export const addBlotterHearings = async (req, res) => {
    try {
        const {
            blotter_id,
            hearing_date,
            attendees,
            remarks,
            status_id,
            official_id,
        } = req.body;

        const sql = `CALL AddBlotterHearing(?, ?, ?, ?, ?, ?)`;

        const values = [
            blotter_id,
            hearing_date || null,
            JSON.stringify(attendees),
            remarks || null,
            status_id || null,
            official_id || null,
        ];

        const result = await new Promise((resolve, reject) => {
            db.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        res.status(201).json({
            message: 'Blotter hearing added successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add blotter hearing', error });
    }
}

export const updateBlotterHearing = async (req, res) => {
    const { id } = req.params;

    try {
        const {
            attendees,
            remarks,
            status_id,
            official_id,
        } = req.body;

        const sql = `CALL UpdateBlotterHearing(?, ?, ?, ?, ?)`;

        const values = [
            id,
            JSON.stringify(attendees),
            remarks || null,
            status_id || null,
            official_id || null,
        ];

        const result = await new Promise((resolve, reject) => {
            db.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });

        res.status(200).json({
            message: 'Blotter hearing updated successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update blotter hearing',
            error: error.message,
        });
    }
};

export const deleteBlotterHearings = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM cbs_blotter_hearings WHERE iid = ?';

        db.query(query, [id], (error, results) => {
            if (error) {
                console.error("Error deleting blotter hearing:", error);
                return res.status(500).json({ message: 'Error deleting blotter hearing' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'blotter hearing not found' });
            }

            res.status(200).json({ message: 'blotter hearing deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete blotter hearing', error });
    }
}