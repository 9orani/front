const getServerConfig = async (server) => {
    const protocolEndPoint = `${server}/config`;
    const createResponse = await fetch(protocolEndPoint);

    return await createResponse.json();
};

const getRTCConfiguration = () => {
    let config = {};

    config.sdpSemantics = 'unified-plan';
    config.iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];

    return config;
};

export { getServerConfig, getRTCConfiguration };
