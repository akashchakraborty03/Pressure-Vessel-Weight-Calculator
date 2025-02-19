const express = require('express');
const path = require('path');
const open = require('open').default;

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder.
app.use(express.static(path.join(__dirname, 'public')));

// GET route for the home page that shows the form.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route that processes the calculation.
app.post('/calculate', (req, res) => {
    // Read and convert inputs (in mm)
    let D = parseFloat(req.body.D);
    let H = parseFloat(req.body.H);
  
    if (isNaN(D) || isNaN(H)) {
      return res.send("Invalid input. Please enter numeric values for Diameter and Height.");
    }
  
    // --- Calculation based on provided formula ---
    // Shell thickness = 10 mm, Head thickness = 12 mm.
    // Volume of cylindrical shell (mm³):
    //   V_shell = π * D * (H - D) * 10
    const V_shell = Math.PI * D * (H - D) * 10;
  
    // Volume of two heads approximated as:
    //   V_heads = 83.8 * D²   (mm³)
    const V_heads = 83.8 * Math.pow(D, 2);
  
    // Total steel volume in m³ (1 m³ = 1e9 mm³)
    const V_total_m3 = (V_shell + V_heads) / 1e9;
  
    // Density of mild steel = 7860 kg/m³.
    const weight = 7860 * V_total_m3;
  
    // Send back a styled result page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Vessel Weight Calculator - Result</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Reset styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            height: 100%;
            font-family: 'Arial', sans-serif;
          }
          body {
            background: linear-gradient(135deg,rgb(198, 251, 255),rgb(141, 188, 255));
            display: flex;
            justify-content: center;
            align-items: center;
            color: #333;
          }
          .container {
            background: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
            text-align: center;
          }
          h1 {
            margin-bottom: 20px;
            font-size: 2em;
            color: #333;
          }
          p {
            margin-bottom: 10px;
            font-size: 1.1em;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            color: #007BFF;
            font-weight: bold;
            transition: color 0.3s;
          }
          a:hover {
            color: #0056b3;
          }
          @media (max-width: 600px) {
            .container {
              padding: 20px;
            }
            h1 {
              font-size: 1.5em;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Calculated Vessel Weight</h1>
          <p><strong>Diameter (mm):</strong> ${D}</p>
          <p><strong>Height (mm):</strong> ${H}</p>
          <p><strong>Weight (kg):</strong> ${weight.toFixed(2)}</p>
          <p><a href="/">Perform another calculation</a></p>
        </div>
      </body>
      </html>
    `);
  });
  

// Start the server and automatically open the browser.
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  open(`http://localhost:${port}`);
});
