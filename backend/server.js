const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoint to humanize text
app.post('https://aitohuman.onrender.com/api/humanize', async (req, res) => {
    const { text, tone, intensity } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const apiUrl = process.env.HMAI_API_URL;
        
        // If an API URL is configured, use it
        if (apiUrl) {
            const response = await axios.post(apiUrl, {
                text,
                tone: tone || 'Casual',
                intensity: intensity || 'Medium'
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.HMAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Assume the API returns { humanizedText: "...", humanScore: 95 }
            return res.json(response.data);
        } else {
            // Mock Response for demonstration purposes (since no API endpoint was provided)
            setTimeout(() => {
                const words = text.split(' ').length;
                let intro = '';
                if (tone === 'Professional') intro = 'Based on our analysis, here is the revised content: ';
                else if (tone === 'Academic') intro = 'The synthesized iteration of the text is as follows: ';
                else intro = 'Hey, here is a more natural version: ';
                
                const mockHumanized = `${intro}${text} (Rewritten with ${intensity} intensity to sound more human).`;
                const humanScore = Math.floor(Math.random() * 15) + 85; // 85-99
                
                res.json({
                    success: true,
                    humanizedText: mockHumanized,
                    humanScore: humanScore
                });
            }, 2000); // 2 second delay to simulate network
        }
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to process text with HumanizeAI API" });
    }
});

// API Endpoint for Contact Form
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }

    try {
        // Configure nodemailer transporter
        // You MUST update your .env file with valid EMAIL_USER and EMAIL_PASS
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'vedantg546@gmail.com', // Sending the form to your personal email
            subject: `New Contact Form Submission from ${name}`,
            text: `You have received a new message from the HumanizeAI Contact Form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        res.status(500).json({ success: false, error: "Failed to send email. Please check your credentials." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
