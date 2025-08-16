const express = require('express');
const router = express.Router();
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Payment initialization route
router.post('/initialize', async (req, res) => {
    try {
        const payload = req.body;

        const paymentData = {
            tx_ref: payload.tx_ref, 
            amount: payload.amount,
            currency: 'NGN', // Or your desired currency
            redirect_url: "http://localhost:3000/api/payments/callback", // Replace with your success page URL
            customer: {
                email: payload.email,
                phonenumber: payload.phone,
                name: payload.name,
            },
            customizations: {
                title: 'Car Rental Service',
                description: 'Payment for car rental'
            }
        };

        const response = await flw.Payment.initiate(paymentData);

        if (response.data.link) {
            res.status(200).json({ link: response.data.link });
        } else {
            res.status(400).json({ message: 'Could not initialize payment' });
        }

    } catch (error) {
        console.error("Payment initialization error:", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// A route to handle Flutterwave's callback (for verification)
router.get('/callback', async (req, res) => {
    try {
        const { status, tx_ref, transaction_id } = req.query;

        if (status === 'successful') {
            const transactionDetails = await flw.Transaction.verify({ id: transaction_id });

            if (transactionDetails.data.status === 'successful' && transactionDetails.data.tx_ref === tx_ref) {
                // Payment is verified. Now you can update your database.
                // For example: Find the rental record by tx_ref and mark it as paid.

                res.status(200).json({ message: 'Payment successful and verified!' });

            } else {
                res.status(400).json({ message: 'Payment verification failed.' });
            }
        } else {
            res.status(400).json({ message: 'Payment failed or was canceled.' });
        }
    } catch (error) {
        console.error("Payment callback error:", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
