require("dotenv").config({ path: __dirname + "../.env" });

exports.getPaymobPaymentLink = async ({ user, cost }) => {
    try {
        const axios = require("axios");

        // A.4.1: First paymob API request
        const paymobFirstResponse = await axios.post(
            "https://accept.paymob.com/api/auth/tokens",
            {
                api_key: process.env.PAYMOB_API_KEY,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const { token } = paymobFirstResponse.data;

        // A.4.2: Second paymob API request
        const paymobSecondRequest = await axios.post(
            "https://accept.paymob.com/api/ecommerce/orders",
            {
                auth_token: token,
                delivery_needed: "false",
                amount_cents: cost.toString(),
                currency: "EGP",
                items: [],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const { id } = paymobSecondRequest.data;

        // A.4.3: Third paymob API request
        const paymobThirdResponse = await axios.post(
            "https://accept.paymob.com/api/acceptance/payment_keys",
            {
                auth_token: token,
                amount_cents: cost.toString(),
                expiration: 3600,
                order_id: id,
                billing_data: {
                    apartment: "NA",
                    email: user.email,
                    floor: "NA",
                    first_name: user.name,
                    street: "NA",
                    building: "NA",
                    phone_number: user.phone,
                    shipping_method: "NA",
                    postal_code: "NA",
                    city: "NA",
                    country: "NA",
                    last_name: user.name,
                    state: "NA",
                },
                currency: "EGP",
                integration_id: process.env.PAYMOB_PAYMENT_INTEGRATION_ID,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const secondToken = paymobThirdResponse.data.token;

        // A.4.4: Fourth paymob API request to make a wallet payment
        const response = await axios.post(
            "https://accept.paymob.com/api/acceptance/payments/pay",
            {
                source: {
                    identifier: "wallet mobile number",
                    subtype: "WALLET",
                },
                payment_token: secondToken,
            }
        );
        console.log(response);

        return {
            // iframeLink: `https://accept.paymob.com/api/acceptance/iframes/763553?payment_token=${secondToken}`,
            iframeLink: `${response.data.redirect_url}`,
            orderId: id,
        };
    } catch (error) {
        throw new Error(`Error in paymob payment service:${error}`);
    }
};
