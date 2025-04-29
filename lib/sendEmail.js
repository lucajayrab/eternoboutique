import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Replace the welcomeEmailTemplate variable with the new template
const welcomeEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to ETERNO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta name="format-detection" content="date=no">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <style>
    :root {
      color-scheme: light only;
      supported-color-schemes: light only;
    }
    
    body, p, td, th, div, li, span {
      font-family: Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #666666 !important;
      line-height: 1.5;
      font-weight: 300;
      -webkit-text-fill-color: #666666 !important;
    }
    
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f6f6f6 !important;
    }
    
    table {
      border-collapse: collapse !important;
    }
    
    .paragraph-spacing {
      padding-bottom: 20px;
    }
    
    /* Force background colors */
    .header-bg {
      background-color: #d8d3c2 !important;
    }
    
    .content-bg {
      background-color: #f2f0e9 !important;
    }
    
    /* Force text colors */
    .text-color {
      color: #666666 !important;
      -webkit-text-fill-color: #666666 !important;
    }
    
    /* Force link colors */
    a {
      color: #666666 !important;
      -webkit-text-fill-color: #666666 !important;
    }
    
    @media only screen and (max-width: 480px) {
      .content-table {
        width: 100% !important;
      }
      .content-block {
        padding: 10px 15px !important;
      }
    }
  </style>
</head>
<body>
  <center>
    <table width="100%" style="max-width: 600px; background-color: #d8d3c2 !important;" class="header-bg">
      <!-- Header -->
      <tr>
        <td align="center" style="padding: 40px 20px;" class="header-bg">
          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MDAgNDUuNDgiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS41LjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMCBCdWlsZCAxMzcpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgZmlsbDogI2ZmZjsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTMzLjI4LDM1LjY3bC0uNDksOS4zNEgtLjE1di0uOThjMi4yMS0uNzQsMi43LTIuNywyLjctNy4zN1Y3LjlDMi41NSwzLjIyLDIuMDYsMS4yNi0uMTUuNTJWLS4yMmgzMC45N2wuNzQsOS4xaC0uOThDMjguMzYsMi40OSwyNC4xOC43NywxNy4wNi43N2gtNy42MnYxOS40Mmg2LjE1YzcuODcsMCwxMC4wOC0xLjcyLDExLjMxLTQuOTJoLjk4djExLjA2aC0uOThjLS45OC0zLjQ0LTMuNDQtNC45Mi0xMS4zMS00LjkyaC02LjE1djE5LjQyYzAsMi4yMSwxLjIzLDMuMiwzLjIsMy4yaDYuMTVjNi42NCwwLDExLjA2LTEuOTcsMTMuNTItOC42aC45OHYuMjVaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyMy4yNSw3LjY1aC0uNzRjLTIuNDYtNC45Mi01LjQxLTYuNjQtMTEuMDYtNi42NGgtMS45N3YzNS44OWMwLDQuNjcuNDksNi42NCwyLjcsNy4zN3YuOThoLTEyLjA1di0uOThjMi4yMS0uNzQsMi43LTIuNywyLjctNy4zN1YuNzdoLTEuOTdjLTUuNjUsMC04LjYsMS43Mi0xMS4wNiw2Ljg4aC0uNzRsLjQ5LTcuODdoMzMuNjhsLjQ5LDcuODdoLS40OVoiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjEyLjI0LDM1LjQzbC0uNDksOS4zNGgtMzIuNjl2LS45OGMyLjIxLS43NCwyLjctMi43LDIuNy03LjM3VjcuOWMwLTQuNjctLjQ5LTYuNjQtMi43LTcuMzdWLS4yMmgzMC45N2wuNzQsOS4xaC0uOThjLTIuNy02LjE1LTYuNjQtOC4xMS0xNC4wMS04LjExaC03LjYydjE5LjQyaDYuMTVjNy44NywwLDEwLjA4LTEuNzIsMTEuMzEtNC45MmguOTh2MTEuMDZoLS45OGMtLjk4LTMuNDQtMy40NC00LjkyLTExLjMxLTQuOTJoLTYuMTV2MTkuNDJjMCwyLjIxLDEuMjMsMy4yLDMuMiwzLjJoNi4xNWM2LjY0LDAsMTEuMDYtMS45NywxMy41Mi04LjZoMS4yM1oiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzAzLjkzLDQzLjc5Yy0yLjQ2LDAtMi45NS0xLjcyLTYuMzktMTAuMzItMy40NC04LjYtNC45Mi0xMS41NS0xMi4wNS0xMi4yOSw4LjYtLjk4LDEyLjU0LTUuNDEsMTIuNTQtMTEuMzFTMjk1LjMzLS4yMiwyODEuMzEtLjIyaC0xMy41MnYuOThjMi4yMS43NCwyLjcsMi43LDIuNyw3LjM3djI4LjUyYzAsNC42Ny0uNDksNi42NC0yLjcsNy4zN3YuOThoMTIuMDV2LS45OGMtMi4yMS0uNzQtMi43LTIuNy0yLjctNy4zN3YtMTVoMy45M2M1LjY1LDAsNS45LDMuMiw5LjgzLDEyLjU0LDMuMiw3LjYyLDQuMTgsMTAuODIsOS41OSwxMC44MnMyLjk1LDAsNC42Ny0uMjV2LS45OGgtMS4yM1pNMjgxLjA3LDIwLjY4aC0zLjY5VjEuMDFoMi45NWM4LjExLDAsMTEuMzEsNS42NSwxMS4zMSwxMC44MnMtMi43LDguODUtMTAuMDgsOC44NWgtLjQ5WiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zOTguODIuNTJjLTIuMjEuNzQtMi43LDIuNy0yLjcsNy4zN3YzNy4zNmgtLjk4bC0yOS45OS0zNy44NnYyNS41N2MwLDcuODcsMS43MiwxMC4wOCw0LjkyLDExLjA2di45OGgtOC42di0uOThjMi4yMS0uNzQsMi43LTIuNywyLjctNy4zN1Y3LjljMC00LjY3LS43NC02LjY0LTMuNDQtNy4zN1YtLjIyaDcuMzdsMjcuMDQsMzMuNjhWMTEuNThjMC03Ljg3LTEuNzItMTAuMDgtNC45Mi0xMS4wNlYtLjIyaDguNiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NzcuMjMtLjIyYy0xMy41MiwwLTIyLjYyLDkuODMtMjIuNjIsMjIuMzdzMTEuOCwyMi44NiwyMi42MiwyMi44NiwyMi42Mi03LjEzLDIyLjYyLTIyLjYyUzQ4Ny44LS4yMiw0NzcuMjMtLjIyTTQ4MS45LDQzLjI5Yy0xMC44MiwwLTE4LjY4LTEyLjI5LTE5LjY3LTI0LjgzLS43NC0xMC4wOCw0LjE4LTE2Ljk2LDEyLjc4LTE2Ljk2czE4LjQ0LDEyLjc4LDE5LjQyLDI2LjA2Yy40OSw4LjM2LTIuOTUsMTUuNzMtMTIuNTQsMTUuNzNoMFoiLz4KPC9zdmc+" alt="ETERNO" width="200" style="display: block; border: 0;">
        </td>
      </tr>

      <!-- Hero Image -->
      <tr>
        <td style="padding: 0; font-size: 0; line-height: 0;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-25%20at%2020.51.24-LJTGSPhQ84We1Eg1EnIjVYnkUk42Q6.png" width="600" alt="ETERNO Man on Boat" style="width: 100%; max-width: 600px; display: block;">
        </td>
      </tr>

      <!-- Email Content -->
      <tr>
        <td align="center" style="padding: 40px 30px 20px 30px; background-color: #f2f0e9 !important;" class="content-bg">
          <table width="100%" class="content-table">
            <tr>
              <td align="center" class="paragraph-spacing">
                <p style="margin: 0; color: #666666 !important; max-width: 540px; text-align: center;" class="text-color">
                  Thank you for registering your interest in our boutique linen tailoring services.
                </p>
              </td>
            </tr>
            
            <tr>
              <td align="center" class="paragraph-spacing">
                <p style="margin: 0; color: #666666 !important; max-width: 540px; text-align: center;" class="text-color">
                  We've received your details and are pleased to begin this journey with you. A member of our team will be in touch shortly via WhatsApp to better understand your personal preferences, along with any specific dates and times that suit you for your fitting.
                </p>
              </td>
            </tr>
            
            <tr>
              <td align="center" class="paragraph-spacing">
                <p style="margin: 0; color: #666666 !important; max-width: 540px; text-align: center;" class="text-color">
                  We look forward to crafting something timeless, just for you.
                </p>
              </td>
            </tr>
            
            <tr>
              <td align="center" class="paragraph-spacing">
                <p style="margin: 0; color: #666666 !important; text-align: center;" class="text-color">
                  Warm Regards,
                </p>
              </td>
            </tr>
            
            <tr>
              <td align="center" class="paragraph-spacing">
                <p style="margin: 0; color: #666666 !important; text-align: center;" class="text-color">
                  ETERNO
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="padding: 20px; font-size: 12px; background-color: #d8d3c2 !important;" class="header-bg">
          <p style="margin: 0 0 10px 0; color: #666666 !important;" class="text-color">&copy; 2024 ETERNO. All Rights Reserved.</p>
          <p style="margin: 0; color: #666666 !important;" class="text-color">
            <a href="mailto:enquiries@eternotailoring.com" style="color: #666666 !important; text-decoration: underline;" class="text-color">Contact Us</a>
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`

// Notification email HTML template
const notificationEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Registration Notification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style>
    body, p, td, th, div, li, span {
      font-family: Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #666666;
      line-height: 1.5;
      font-weight: 300;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f6f6f6;
    }
    table {
      border-collapse: collapse !important;
    }
    .customer-details {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .customer-details th {
      text-align: left;
      padding: 8px;
      background-color: #e8e4d9;
      border: 1px solid #d8d3c2;
    }
    .customer-details td {
      padding: 8px;
      border: 1px solid #d8d3c2;
    }
  </style>
</head>
<body>
  <center>
    <table width="100%" style="max-width: 600px; background-color: #d8d3c2;">
      <!-- Header -->
      <tr>
        <td align="center" style="padding: 30px 20px;">
          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MDAgNDUuNDgiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS41LjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMCBCdWlsZCAxMzcpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgZmlsbDogI2ZmZjsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTMzLjI4LDM1LjY3bC0uNDksOS4zNEgtLjE1di0uOThjMi4yMS0uNzQsMi43LTIuNywyLjctNy4zN1Y3LjlDMi41NSwzLjIyLDIuMDYsMS4yNi0uMTUuNTJWLS4yMmgzMC45N2wuNzQsOS4xaC0uOThDMjguMzYsMi40OSwyNC4xOC43NywxNy4wNi43N2gtNy42MnYxOS40Mmg2LjE1YzcuODcsMCwxMC4wOC0xLjcyLDExLjMxLTQuOTJoLjk4djExLjA2aC0uOThjLS45OC0zLjQ0LTMuNDQtNC45Mi0xMS4zMS00LjkyaC02LjE1djE5LjQyYzAsMi4yMSwxLjIzLDMuMiwzLjIsMy4yaDYuMTVjNi42NCwwLDExLjA2LTEuOTcsMTMuNTItOC42aC45OHYuMjVaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyMy4yNSw3LjY1aC0uNzRjLTIuNDYtNC45Mi01LjQxLTYuNjQtMTEuMDYtNi42NGgtMS45N3YzNS44OWMwLDQuNjcuNDksNi42NCwyLjcsNy4zN3YuOThoLTEyLjA1di0uOThjMi4yMS0uNzQsMi43LTIuNywyLjctNy4zN1YuNzdoLTEuOTdjLTUuNjUsMC04LjYsMS43Mi0xMS4wNiw2Ljg4aC0uNzRsLjQ5LTcuODdoMzMuNjhsLjQ5LDcuODdoLS40OVoiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjEyLjI0LDM1LjQzbC0uNDksOS4zNGgtMzIuNjl2LS45OGMyLjIxLS43NCwyLjctMi43LDIuNy03LjM3VjcuOWMwLTQuNjctLjQ5LTYuNjQtMi43LTcuMzdWLS4yMmgzMC45N2wuNzQsOS4xaC0uOThjLTIuNy02LjE1LTYuNjQtOC4xMS0xNC4wMS04LjExaC03LjYydjE5LjQyaDYuMTVjNy44NywwLDEwLjA4LTEuNzIsMTEuMzEtNC45MmguOTh2MTEuMDZoLS45OGMtLjk4LTMuNDQtMy40NC00LjkyLTExLjMxLTQuOTJoLTYuMTV2MTkuNDJjMCwyLjIxLDEuMjMsMy4yLDMuMiwzLjJoNi4xNWM2LjY0LDAsMTEuMDYtMS45NywxMy41Mi04LjZoMS4yM1oiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzAzLjkzLDQzLjc5Yy0yLjQ2LDAtMi45NS0xLjcyLTYuMzktMTAuMzItMy40NC04LjYtNC45Mi0xMS41NS0xMi4wNS0xMi4yOSw4LjYtLjk4LDEyLjU0LTUuNDEsMTIuNTQtMTEuMzFTMjk1LjMzLS4yMiwyODEuMzEtLjIyaC0xMy41MnYuOThjMi4yMS43NCwyLjcsMi43LDIuNyw3LjM3djI4LjUyYzAsNC42Ny0uNDksNi42NC0yLjcsNy4zN3YuOThoMTIuMDV2LS45OGMtMi4yMS0uNzQtMi43LTIuNy0yLjctNy4zN3YtMTVoMy45M2M1LjY1LDAsNS45LDMuMiw5LjgzLDEyLjU0LDMuMiw3LjYyLDQuMTgsMTAuODIsOS41OSwxMC44MnMyLjk1LDAsNC42Ny0uMjV2LS45OGgtMS4yM1pNMjgxLjA3LDIwLjY4aC0zLjY5VjEuMDFoMi45NWM4LjExLDAsMTEuMzEsNS42NSwxMS4zMSwxMC44MnMtMi43LDguODUtMTAuMDgsOC44NWgtLjQ5WiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zOTguODIuNTJjLTIuMjEuNzQtMi43LDIuNy0yLjcsNy4zN3YzNy4zNmgtLjk4bC0yOS45OS0zNy44NnYyNS41N2MwLDcuODcsMS43MiwxMC4wOCw0LjkyLDExLjA2di45OGgtOC42di0uOThjMi4yMS0uNzQsMi43LTIuNywyLjctNy4zN1Y3LjljMC00LjY3LS43NC02LjY0LTMuNDQtNy4zN1YtLjIyaDcuMzdsMjcuMDQsMzMuNjhWMTEuNThjMC03Ljg3LTEuNzItMTAuMDgtNC45Mi0xMS4wNlYtLjIyaDguNiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NzcuMjMtLjIyYy0xMy41MiwwLTIyLjYyLDkuODMtMjIuNjIsMjIuMzdzMTEuOCwyMi44NiwyMi42MiwyMi44NiwyMi42Mi03LjEzLDIyLjYyLTIyLjYyUzQ4Ny44LS4yMiw0NzcuMjMtLjIyTTQ4MS45LDQzLjI5Yy0xMC44MiwwLTE4LjY4LTEyLjI5LTE5LjY3LTI0LjgzLS43NC0xMC4wOCw0LjE4LTE2Ljk2LDEyLjc4LTE2Ljk2czE4LjQ0LDEyLjc4LDE5LjQyLDI2LjA2Yy40OSw4LjM2LTIuOTUsMTUuNzMtMTIuNTQsMTUuNzNoMFoiLz4KPC9zdmc+" alt="ETERNO" width="150" style="display: block; border: 0;">
        </td>
      </tr>

      <!-- Email Content -->
      <tr>
        <td align="center" style="padding: 30px; background-color: #f2f0e9;">
          <table width="100%" class="content-table">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <h1 style="margin: 0; color: #5a5a56; font-size: 24px; font-weight: 300;">New Registration</h1>
              </td>
            </tr>

            <tr>
              <td style="padding-bottom: 20px;">
                <p style="margin: 0; color: #666666;">
                  A new customer has registered interest with ETERNO. Please find their details below:
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <table class="customer-details">
                  <tr>
                    <th>Field</th>
                    <th>Information</th>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>{{firstName}} {{lastName}}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{{email}}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>{{phone}}</td>
                  </tr>
                  <tr>
                    <td>Country</td>
                    <td>{{country}}</td>
                  </tr>
                  <tr>
                    <td>City</td>
                    <td>{{city}}</td>
                  </tr>
                  <tr>
                    <td>Industry</td>
                    <td>{{industry}}</td>
                  </tr>
                  <tr>
                    <td>Date of Birth</td>
                    <td>{{dob}}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding-top: 20px;">
                <p style="margin: 0; color: #666666;">
                  Please follow up with this customer at your earliest convenience.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="padding: 20px; font-size: 12px; background-color: #d8d3c2;">
          <p style="margin: 0;">&copy; 2024 ETERNO. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`

// Update the sendWelcomeEmail function to use the new subject line
export async function sendWelcomeEmail(email, firstName = "") {
  try {
    // Personalize the welcome email if a first name is provided
    const html = welcomeEmailTemplate

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "ETERNO Tailoring <enquiries@eternotailoring.com>",
      to: [email],
      subject: "A Warm Welcome", // Updated subject line
      html: html,
    })

    if (error) {
      console.error("Error sending welcome email:", error)
      return { success: false, error }
    }

    console.log("Welcome email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Exception sending welcome email:", error)
    return { success: false, error }
  }
}

/**
 * Sends a notification email to the ETERNO team about a new registration
 * @param {Object} userData - The user's registration data
 */
export async function sendNotificationEmail(userData) {
  try {
    // Replace placeholders with actual data
    const html = notificationEmailTemplate
      .replace("{{firstName}}", userData.firstname || "")
      .replace("{{lastName}}", userData.lastname || "")
      .replace("{{email}}", userData.email || "")
      .replace("{{phone}}", userData.phonecontact || "")
      .replace("{{country}}", userData.countrylocation || "")
      .replace("{{city}}", userData.city || "")
      .replace("{{industry}}", userData.industrysector || "")
      .replace("{{dob}}", userData.dob || "")

    // Send the notification email
    const { data, error } = await resend.emails.send({
      from: "ETERNO Tailoring <enquiries@eternotailoring.com>",
      to: ["enquiries@eternotailoring.com"],
      subject: "New Registration: ETERNO",
      html: html,
    })

    if (error) {
      console.error("Error sending notification email:", error)
      return { success: false, error }
    }

    console.log("Notification email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Exception sending notification email:", error)
    return { success: false, error }
  }
}
