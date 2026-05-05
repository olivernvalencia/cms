import db from '../config/database.js';

export const getAllCertificateRequest = async (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetAllCertificateRequests(?)";

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
            error: "Failed to retrieve certificate data",
            details: error.message,
        });
    }
};

export const getAllCertificateStatuses = async (req, res) => {
    const sql = "CALL GetCertRequestStatuses()";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Detailed Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve certificate data",
            details: error.message,
        });
    }
}

export const getAllCertificateTypes = async (req, res) => {
    const sql = "CALL GetBrgyCertificateTypes()";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Detailed Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve certificate data",
            details: error.message,
        });
    }
}

export const addCertificationRequest = async (req, res) => {
    const {
        resident_id,
        certification_type_id,
        status_id,
        issued_by,
        amount,
        purpose,
        barangay_id,
    } = req.body;

    const certificate = req.file
        ? `/uploads/certificates/${req.file.filename}`
        : null; // Set to null if no file is uploaded

    const sql = `CALL AddCertificateRequest(?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        await new Promise((resolve, reject) => {
            db.query(
                sql,
                [
                    resident_id,
                    certification_type_id,
                    status_id || 4,
                    issued_by,
                    amount,
                    purpose || null,
                    certificate,
                    barangay_id,
                ],
                (err, results) => {
                    if (err) {
                        console.error("Database error:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        res.status(201).json({ message: "Certification request added successfully" });
    } catch (error) {
        console.error("Error in addCertificationRequest:", error);
        res.status(500).json({
            error: "Failed to add certification request",
            details: error.message,
        });
    }
};

export const getAllCertificate = async (req, res) => {
    const sql = "CALL GetBrgyCertificateTypes()"; // No parameters passed

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.json(results[0]);
        console.log("result", results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve certificate data",
            details: error.message,
        });
    }
};

export const updateCertificationType = async (req, res) => {
    const { id } = req.params;
    const { 
        iname, 
        comments, 
        document_type_id, 
        amount, 
        body_text, 
        lgu_type_id 
    } = req.body;

    console.log("Request data:", req.body);

    const sql = "CALL UpdateCertificateType(?, ?, ?, ?, ?, ?, ?)";

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(
                sql, 
                [id, iname, comments, document_type_id, amount, body_text, lgu_type_id],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        res.status(200).json({ message: "Certification type updated successfully", result });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            message: "Failed to update certification type",
            error: error.message,
        });
    }
};

export const addCertificateType = async (req, res) => {
    const { iname, comments, document_type_id, amount, body_text, lgu_type_id } = req.body;

    console.log("add cert",req.body);

    const sql = "CALL AddCertificateTypes(?, ?, ?, ?, ?, ?)";

    try {
        if (!iname || !document_type_id || !amount || !lgu_type_id) {
            return res.status(400).json({
                error: "Required fields: iname, document_type_id, amount, and lgu_type_id.",
            });
        }

        const results = await new Promise((resolve, reject) => {
            db.query(
                sql,
                [iname, comments, document_type_id, amount, body_text, lgu_type_id],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        res.status(201).json({
            message: "Certificate type added successfully",
            data: results,
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to add certificate type",
            details: error.message,
        });
    }
};


export const deleteCertificate = (req, res) => {
    const {id} = req.params;
    const query = 'CALL DeleteCertificateTypes(?)';

    db.query(query, id, (error, results) => {
        if (error) {
            console.error("Error deleting resident:", error);
            return res.status(500).json({ message: 'Error deleting Purok' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Purok not found' });
        }

        res.status(200).json({ message: 'Purok deleted successfully' });
    });
};


export const getControlNumber = async (req, res) => {
    const sql = "CALL NextControlNumber()";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        console.log("Control number" + results[0][0])
        res.json(results[0][0]);
    } catch (error) {
        console.error("Detailed Database error:", error);
        res.status(500).json({
            error: "Failed to generate control number",
            details: error.message,
        });
    }
}


export const getIndigencyControlNumber = async (req, res) => {
    const sql = "CALL NextIndengencyControlNumber()";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Detailed Database error:", error);
        res.status(500).json({
            error: "Failed to generate control number",
            details: error.message,
        });
    }
}

export const getBarangayDetails = async (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetBarangayDetails(?)";

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
            error: "Failed to retrieve barangay details",
            details: error.message,
        });
    }
};