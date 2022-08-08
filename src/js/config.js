const getServerConfig = async (server) => {
    const protocolEndPoint = `${server}/config`;
    const createResponse = await fetch(protocolEndPoint);

    return await createResponse.json();
};

const getRTCConfiguration = () => {
    let config = {};

    config.sdpSemantics = 'unified-plan';
    config.iceServers = [
        { urls: ['stun:stun.l.google.com:19302'] },
        {
            urls: ['turn:27.96.131.42:3478?transport=tcp'], 
            username: 'gorani', 
            credential: 'gorani'
        }
    ];

    return config;
};

export { getServerConfig, getRTCConfiguration };
