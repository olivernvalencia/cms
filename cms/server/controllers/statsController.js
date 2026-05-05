import db from '../config/database.js';

export const getRegisteredVoters = (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetRegisteredVoterCount(?)";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Database error" });
        }

        const numberOfRegisteredVoters = results[0][0].NumberOfRegisteredVoters;
        return res.json({ NumberOfRegisteredVoters: numberOfRegisteredVoters });
    });
};

export const getPopulationStats = (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetPopulationStats(?)";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ Error: 'Database error' });
        }

        // Stored procedure results are typically wrapped in two layers
        if (results && results[0]) {
            const { male, female, seniorCitizens, youth, totalPopulation } = results[0][0]; // Access the first row of the first result set
            return res.json({ male, female, seniorCitizens, youth, totalPopulation });
        } else {
            return res.status(404).json({ Error: 'No data found' });
        }
    });
};

export const getResidentCount = (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetResidentsCount(?)";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ Error: "Database error" });
        }

        const numberOfResidents = results[0][0]?.NumberOfResidents || 0;
        return res.json({ NumberOfResidents: numberOfResidents });
    });
};


export const getHouseholdCount = (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetHouseholdCount(?)";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ Error: "Database error" });
        }
        console.log(results);
        // Ensure results[0] and its content exist
        if (results && results[0] && results[0][0]) {
            const NumberOfHousehold = results[0][0].NumberOfHousehold;
            return res.json({ NumberOfHousehold });
        } else {
            console.warn("Unexpected results format:", results);
            return res.json({ NumberOfHousehold: 0 });
        }
    });
};

export const getPwdCount = (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetPopulationStats(?)";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ Error: "Database error" });
        }

        // MySQL stored procedures return results in a specific format
        // First element is the result set, second element is the affected rows info
        if (results && Array.isArray(results) && results[0] && Array.isArray(results[0])) {
            const stats = results[0][0]; // Get the first row of the first result set
            const NumberOfPWD = stats?.NumberOfPWD ?? 0; // Use nullish coalescing for safety
            return res.json({ NumberOfPWD });
        } else {
            console.warn("Invalid results format:", results);
            return res.json({ NumberOfPWD: 0 });
        }
    });
};

export const getAllPopulationStats = async (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetPopulationStats(?)";

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

        if (results && Array.isArray(results) && results[0] && Array.isArray(results[0])) {
            const stats = results[0][0];

            const safeStats = Object.keys(stats).reduce((acc, key) => {
                acc[key] = stats[key] ?? 0;
                return acc;
            }, {});

            return res.json(safeStats);
        } else {
            console.warn("Invalid results format:", results);
            return res.status(500).json({ error: "Invalid data format" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to retrieve population stats",
            details: error.message,
        });
    }
}