let geoTimeout = undefined;

function sendLocationToActivity() {
    postMessage("send");
    setTimeout(sendLocationToActivity, 1000);
}

function stopSending() {
    clearTimeout(geoTimeout);
}

onmessage = (message) => {
    const { data } = message;
    if (data === 'start') {
        sendLocationToActivity();
    } else if (data === 'stop') {
        stopSending();
    }
}