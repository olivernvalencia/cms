import db from "../config/database.js";

export const getAllIncidents = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL GetAllIncidents(?)`;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve incident data",
            details: error.message,
        });
    }
};

export const getIncidentById = async (req, res) => {

    const { id } = req.params;
    const sql = "CALL GetIncident(?)";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve incident data",
            details: error.message,
        });
    }
};

export const addIncidentReport = async (req, res) => {
    try {
        const {
            incident_date,
            reporter_id,
            reporter_name,
            reporter_address,
            reporter_contact,
            incident_type,
            incident_location,
            incident_statement,
            barangay_id
        } = req.body;

        if (!incident_date || !reporter_id || !incident_type || !incident_statement || !barangay_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const sql = `CALL AddIncident(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            incident_date,
            reporter_id,
            reporter_name,
            reporter_address || null,
            reporter_contact || null,
            incident_type,
            incident_location,
            incident_statement,
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
            message: 'Incident report added successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add incident report', error });
    }
}

export const updateIncidentReport = async (req, res) => {
    const { id } = req.params;

    const {
        incident_id,
        incident_date,
        reporter_id,
        reporter_name,
        reporter_address,
        reporter_contact,
        incident_type,
        incident_location,
        incident_statement,
        barangay_id
    } = req.body;

    const sql = ` CALL UpdateIncident(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const values = [
            incident_id,
            incident_date,
            reporter_id,
            reporter_name,
            reporter_address || null,
            reporter_contact || null,
            incident_type,
            incident_location,
            incident_statement,
            barangay_id
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
            message: 'Incident record updated successfully',
            result,
        });
    } catch (error) {
        console.error("Error updating incident record:", error);
        res.status(500).json({ message: "Failed to update incident record" });
    }
};

export const deleteIncidentReport = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'CALL DeleteIncident(?)';

        db.query(sql, [id], (error, results) => {
            if (error) {
                console.error("Error deleting incident report:", error);
                return res.status(500).json({ message: 'Error deleting incident report' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'incident report not found' });
            }

            res.status(200).json({ message: 'incident report deleted successfully' })
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete blotter hearing', error });
    }
}