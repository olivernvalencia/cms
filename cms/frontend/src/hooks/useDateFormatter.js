import { useCallback } from 'react';

export const useDateFormatter = () => {
    const formatIncidentDate = useCallback((dateString, variant = 'default') => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return 'Invalid Date';
            }

            if (variant === 'yyyy-mm-dd') {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            // Default format: MM/DD/YYYY
            return date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    }, []);

    return { formatIncidentDate };
};
