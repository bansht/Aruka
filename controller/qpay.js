const axios = require("axios")
const asyncHandler = require("../middleware/asyncHandle.js");
const invoiceModel = require("../models/Invoice.js");
const qpay = require("../middleware/qpay");
const userModel = require("../models/User");
const userWallet = require("../models/User.js");

exports.createqpay = asyncHandler(async (req, res) => {
    // console.log('=====' + req.body);
    // console.log('=====----' + req.params);

    try {
        const customer = await userModel.findById(req.body.userId);

        // console.log("customer checked", customer)

        const pendingInvoice = await invoiceModel.findById(req.params.id);
        const { price } = pendingInvoice;

        const qpay_token = await qpay.makeRequest();

        const { name, phone } = customer;

        const currentDateTime = new Date();

        const randomToo = Math.floor(Math.random() * 99999);

        const sender_invoice_no =
            currentDateTime.getFullYear() +
            "-" +
            ("0" + (currentDateTime.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + currentDateTime.getDate()).slice(-2) +
            "-" +
            ("0" + currentDateTime.getHours()).slice(-2) +
            "-" +
            ("0" + currentDateTime.getMinutes()).slice(-2) +
            "-" +
            ("0" + currentDateTime.getSeconds()).slice(-2) +
            "-" +
            ("00" + currentDateTime.getMilliseconds()).slice(-3) +
            randomToo;

        const invoice = {
            invoice_code: process.env.invoice_code,
            sender_invoice_no: sender_invoice_no,
            sender_branch_code: "branch",
            invoice_receiver_code: "terminal",
            invoice_receiver_data: {
                name: `${name}`,
                phone: `${phone}`,
            },
            invoice_description: process.env.invoice_description,
            callback_url: process.env.AppRentCallBackUrl + sender_invoice_no,
            lines: [],
        };
        const invoiceLine = {
            tax_product_code: `${randomToo}`,
            line_description: `Zar medee`,
            line_quantity: `1`,
            line_unit_price: `${price}`,
        };
        invoice.lines.push(invoiceLine);

        // console.log('----=====' + invoiceLine.line_quantity)

        const header = {
            headers: { Authorization: `Bearer ${qpay_token.access_token}` },
        };

        const response = await axios.post(
            process.env.qpayUrl + "invoice",
            invoice,
            header
        );

        // console.log(response.status);

        if (response.status === 200) {
            const invoiceUpdate = await invoiceModel.findByIdAndUpdate(
                req.params.id,
                {
                    sender_invoice_id: sender_invoice_no,
                    qpay_invoice_id: response.data.invoice_id,
                },
                { new: true }
            ); // Add { new: true } to get the updated document
            // console.log(invoiceUpdate);
            return res
                .status(200)
                .json({ success: true, invoice: invoiceUpdate, data: response.data });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

exports.callback = asyncHandler(async (req, res, next) => {
    try {
        const qpay_token = await qpay.makeRequest();
        const { access_token } = qpay_token;
        var sender_invoice_no = req.params.id;
        // console.log("sender code  :", sender_invoice_no);

        // console.log('-------' + req.body);

        const record = await invoiceModel.find({
            sender_invoice_id: sender_invoice_no,
        });
        // console.log("recorded", record);
        if (record.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        const { qpay_invoice_id, _id, price } = record[0];
        // console.log(record[0]);

        const rentInvoiceId = _id;
        // console.log("rent id : " + rentInvoiceId);
        // console.log(" invoice object id : ", qpay_invoice_id);
        // console.log(" qpay token : ", access_token);

        var request = {
            object_type: "INVOICE",
            object_id: qpay_invoice_id,
            offset: {
                page_number: 1,
                page_limit: 100,
            },
        };

        const header = {
            headers: { Authorization: `Bearer ${access_token}` },
        };

        //  төлбөр төлөглдөж байгааа
        const result = await axios.post(
            process.env.qpayUrl + "payment/check",
            request,
            header
        );

        if (
            result.data.count == 1 &&
            result.data.rows[0].payment_status == "PAID"
        ) {
            const invoiceData = await invoiceModel.findByIdAndUpdate(
                rentInvoiceId,
                { status: "paid" },
                { new: true }
            );
            try {
                const findUserWallet = await userModel.findOne({ user: req.body.userId });

                if (!findUserWallet) {
                    // const findUserWallet = await userWallet.create({ user: req.body.userId, inviteCode: '1' });

                    return res.status(404).json({ message: 'Wallet not found' });
                }

                // const { amount } = findUserWallet;
                // const testPrice = parseInt(price, 10);
                // const updatedBalance = testPrice + parseInt(amount, 10);

                // const wallet = await userWallet.findByIdAndUpdate(
                //     findUserWallet._id,
                //     {
                //         userId: req.userId,
                //         amount: updatedBalance
                //     },
                //     { new: true }
                // );

                if (findUserWallet) {
                    findUserWallet.isPaid = false;

                    await findUserWallet.save();

                    // console.log('Update successful:', wallet);
                    return res.status(200).json({
                        success: true,
                        message: "Төлөлт амжилттай",
                        data: invoiceData,
                        // userAccountBalance: wallet
                    });
                } else {
                    return res.status(500).json({ message: 'Failed to update wallet' });
                }
            } catch (error) {
                console.error('Error updating wallet:', error);
                return res.status(500).json({ message: 'Server error' });
            }



        } else {
            return res.status(401).json({
                success: false,
                message: "Төлөлт амжилтгүй",
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});