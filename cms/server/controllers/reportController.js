import db from "../config/database.js";

export const GetReportHouseholdHead = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL cbsReportBrgyHouseholdHead(?)`;

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
            error: "Failed to retrieve report household head data",
            details: error.message,
        });
    }
}

export const GetReportPurokResidents = async (req, res) => {
    const { id, purok_id } = req.params;
    const sql = `CALL cbsReportBrgyPrkResidents(?, ?)`;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(sql, [id, purok_id], (err, result) => {
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
            error: "Failed to retrieve report purok residents data",
            details: error.message,
        });
    }
}

export const GetReportPurokResidentsCount = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL cbsReportBrgyPrkResidentsCount(?)`;

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
            error: "Failed to retrieve report residents count data",
            details: error.message,
        });
    }
}

export const GetReportPWD = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL cbsReportBrgyPWD(?)`;

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
            error: "Failed to retrieve report barangay pwd data",
            details: error.message,
        });
    }
}

export const GetReportResidents = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL cbsReportBrgyResidents(?)`;

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
            error: "Failed to retrieve report residents data",
            details: error.message,
        });
    }
}

export const GetReportSoloParent = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL cbsReportBrgySoloParent(?)`;

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
            error: "Failed to retrieve report solo parents data",
            details: error.message,
        });
    }
}

export const GetReportSeniorCitizen = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL cbsReportBrgySrCitizen(?)`;

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
            error: "Failed to retrieve report senior citizen data",
            details: error.message,
        });
    }
}

export const GetReportYouth = async (req, res) => {
    const { id } = req.params;
    const sql = `CALL cbsReportBrgyYouth(?)`;

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
            error: "Failed to retrieve report youth data",
            details: error.message,
        });
    }
}
