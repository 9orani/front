export const getUniqueId = () => {
    return (
        new Date().getTime().toString(16) +
        Math.floor(1000 * Math.random()).toString(16)
    );
};

export const sleep = async (milisecond) => {
    return new Promise((resolve) => setTimeout(resolve, milisecond));
};
