let params = getParams()

!(async () => {
    // 获取时间
    const traffic = (await httpAPI("/v1/traffic", "GET"));
    const dateNow = new Date();
    const dateTime = Math.floor(traffic.startTime * 1000);
    const startTime = timeTransform(dateNow, dateTime);

    if ($trigger === "button") {
        await httpAPI("/v1/profiles/reload");
    }

    $done({
        title: params.title || `Surge Ultra`,
        content: (params.content || `通透世界`) + `: ʚ|-${startTime}-|ɞ`,
        icon: params.icon || `crown.fill`,
        "icon-color": params.color || `#f6c970`
    });

})();

function timeTransform(dateNow, dateTime) {
    const dateDiff = dateNow - dateTime;
    // 计算出相差天数
    const days = Math.floor(dateDiff / (24 * 3600 * 1000));
    // 计算天数后剩余的毫秒数
    const leave1 = dateDiff % (24 * 3600 * 1000);
    // 计算出小时数
    let hours = Math.floor(leave1 / (3600 * 1000));
    // 计算相差分钟数
    const leave2 = leave1 % (3600 * 1000);
    let minutes = Math.floor(leave2 / (60 * 1000));
    // 计算相差秒数
    const leave3 = leave2 % (60 * 1000);
    let seconds = Math.round(leave3 / 1000);

    seconds = seconds < 10 ? ('0' + seconds) : seconds;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    hours = days * 24 + hours;
    hours = hours < 10 ? ('0' + hours) : hours;

    return `${hours}:${minutes}:${seconds}`;
}


function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}

function getParams() {
    if (typeof $argument === 'undefined') {
        return {}
    }
    return Object.fromEntries(
        $argument
            .split("&")
            .map((item) => item.split("="))
            .map(([k, v]) => [k, decodeURIComponent(v)])
    );
}
