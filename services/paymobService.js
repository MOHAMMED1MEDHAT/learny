require("dotenv").config({ path: __dirname + "../.env" });

exports.getPaymobPaymentLink = async ({ user, cost }) => {
    try {
        //A.4.1: first paymob api request
        const paymobFirstResponse = await fetch(
            "https://accept.paymob.com/api/auth/tokens",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: process.env.PAYMOB_API_KEY,
                }),
            }
        );
        const { token } = await paymobFirstResponse.json();
        //A.4.2: sconde paymob api request
        const paymobScondeRequest = await fetch(
            "https://accept.paymob.com/api/ecommerce/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    auth_token: token,
                    delivery_needed: "false",
                    amount_cents: cost.toString(),
                    currency: "EGP",
                    items: [],
                }),
            }
        );
        const { id } = await paymobScondeRequest.json();
        //A.4.3: third paymob api request
        const paymobThirdResponse = await fetch(
            "https://accept.paymob.com/api/acceptance/payment_keys",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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
                }),
            }
        );
        const secondToken = await paymobThirdResponse.json();

        return {
            iframeLink: `https://accept.paymob.com/api/acceptance/iframes/763553?payment_token=${secondToken.token}`,
            orderId: id,
        };
    } catch (error) {
        throw new Error("error in paymob payment service");
    }
};
