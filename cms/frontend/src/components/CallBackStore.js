let setSuccessCallback = null;

export const setSetSuccessCallback = (callback) => {
    setSuccessCallback = callback;
};

export const getSetSuccessCallback = () => setSuccessCallback;
