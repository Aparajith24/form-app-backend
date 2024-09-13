const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const cors = require("cors");
const { google } = require("googleapis");
const { Client } = pg;

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Database connection
const dbClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

dbClient.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

// API endpoint for form submission
app.post("/api/submit-form", async (req, res) => {
  const { formType, name, countryCode, phoneNumber } = req.body;
  try {
    const result = await dbClient.query(
      "INSERT INTO form_submissions (form_type, name, country_code, phone_number) VALUES ($1, $2, $3, $4) RETURNING id",
      [formType, name, countryCode, phoneNumber],
    );
    res
      .status(200)
      .json({ message: "Form submitted successfully", id: result.rows[0].id });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Error submitting form" });
  }
});

// API endpoint for writing to Google Sheets
app.post("/api/update-sheets", async (req, res) => {
  try {
    const result = await dbClient.query(
      "SELECT * FROM form_submissions ORDER BY id",
    );
    const rows = result.rows;
    const values = rows.map((row) => [
      row.id.toString(),
      row.form_type,
      row.name,
      row.country_code,
      row.phone_number,
      row.submission_date.toISOString(),
    ]);
    const auth = new google.auth.GoogleAuth({
      scopes: "https://www.googleapis.com/auth/spreadsheets",
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        projectId: process.env.GOOGLE_PROJECT_ID,
      },
    });
    const sheetsClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: sheetsClient });
    const spreadsheetId = "1xKt69AUJI3FYW_sCpTFLD29T4Ust7itlUCVD8poDDHU";
    const range = "Sheet1!A2:F";
    const updateResponse = sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values },
    });

    res.status(200).json({
      message: "Google Sheets updated successfully",
    });
  } catch (error) {
    console.error("Error updating Google Sheets:", error);
    res.status(500).json({ message: "Error updating Google Sheets" });
  }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
