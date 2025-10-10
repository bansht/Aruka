const axios = require("axios");

async function token() {
    console.log("qpay checked");
    var session_url = process.env.qpayUrl + "auth/token";
    console.log(session_url);
    await axios
        .post(
            session_url,
            {},
            {
                auth: {
                    username: 'ZAR_MEDEE',
                    password: '1WejtHqb',
                },
            }
        )
        .then((res) => {
            console.log("res.data");
            console.log(res.data);
            return res.data;
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            return res
                .status(500)
                .json({ status: 0, statusText: "Service iin aldaa garlaa orchuulah " });
        });
    console.log("555");
}

const makeRequest = async () => {
    try {
        const response = await axios.post(
            process.env.qpayUrl + "auth/token",
            {},
            {
                auth: {
                    username: 'ZAR_MEDEE',
                    password: '1WejtHqb',
                },
            }
        );
        if (response.status === 200) {
            // response - object, eg { status: 200, message: 'OK' }
            console.log("success stuff");
            return response.data;
        }
        return response.status;
    } catch (err) {
        console.error(err);
        return "error";
    }
};

module.exports = { token, makeRequest };