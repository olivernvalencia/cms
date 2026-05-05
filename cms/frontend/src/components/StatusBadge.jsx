const statusStyles = {
    New: {
        backgroundColor: "#34ACFF",
        color: "#fff",
    },
    "On going": {
        backgroundColor: "#FFAB00BF",
        color: "#fff",
    },
    "Moved to higher court": {
        backgroundColor: "#E5553C",
        color: "#fff",
    },
    Settled: {
        backgroundColor: "#36B37E",
        color: "#fff",
    },
    Closed: {
        backgroundColor: "#acacac",
        color: "#fff",
    },
    Hearing: {
        backgroundColor: "#5D5BB4",
        color: "#fff",
    },
    Reconciled: {
        backgroundColor: "#0078D4",
        color: "#fff",
    },
};

const StatusBadge = ({ status }) => {
    if (!status) return "N/A";

    const style = statusStyles[status] || {};

    return (
        <div
            className="px-4 py-2 rounded-3xl text-center"
            style={style}
        >
            {status}
        </div>
    );
};

export default StatusBadge;
