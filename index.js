const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const cors = require("cors");
const { Client } = pg;

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Database connection
const client = new Client({
  user: "forms_96e3_user",
  password: "ha7v7JjCsEYaTzJM1IY4zKT5GgHyRGG9",
  host: "dpg-crhtcdrv2p9s73bfu8vg-a.singapore-postgres.render.com",
  port: "5432",
  database: "forms_96e3",
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect((err) => {
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
    const result = await client.query(
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

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
