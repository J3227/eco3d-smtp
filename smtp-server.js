require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com',

    port: 587,

    secure: false,

    auth: {
        user: 'eco.impresiones3d.smr@gmail.com',
        pass: process.env.SMTP_PASS
    },

    tls: {
        rejectUnauthorized: false
    }
});

app.post('/send-invoice', async (req, res) => {

    try {

        const {
            from_email,
            to_email,
            customer_name,
            order_id,
            total_price,
            delivery_date,
            invoice_html
        } = req.body;

        await transporter.sendMail({
            from: `"Eco3D" <${from_email}>`,
            to: to_email,
            subject: `Factura Eco3D - ${order_id}`,

            html: `
                <h1>Eco3D</h1>

                <p>Hola ${customer_name}</p>

                <p>Tu pedido ha sido procesado correctamente.</p>

                <p><strong>Pedido:</strong> ${order_id}</p>
                <p><strong>Total:</strong> ${total_price}</p>
                <p><strong>Entrega:</strong> ${delivery_date}</p>

                <hr>

                ${invoice_html}
            `
        });

        res.status(200).json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 8765;

app.listen(PORT, () => {
  console.log(`Servidor SMTP iniciado en puerto ${PORT}`);
});