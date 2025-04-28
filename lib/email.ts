/**
 * Email utility functions for sending emails via Resend
 */

interface SendEmailProps {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

/**
 * Sends an email using the Resend API
 */
export async function sendEmail({ to, subject, html, from }: SendEmailProps) {
  try {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        from,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email")
    }

    return data
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

/**
 * Sends a welcome email to a new user
 */
export async function sendWelcomeEmail(email: string, firstName: string) {
  const subject = "Welcome to ETERNO"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #5a5a56;">Welcome to ETERNO</h1>
      <p>Dear ${firstName},</p>
      <p>Thank you for registering your interest with ETERNO. We're delighted to welcome you to our community of discerning individuals who appreciate Mediterranean sophistication and bespoke tailoring.</p>
      <p>We'll be in touch shortly to discuss your preferences and arrange a fitting at our Mayfair atelier or a location of your choosing.</p>
      <p>In the meantime, if you have any questions, please don't hesitate to contact us at <a href="mailto:enquiries@eternotailoring.com">enquiries@eternotailoring.com</a>.</p>
      <p>Warm regards,</p>
      <p>The ETERNO Team</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
  })
}

/**
 * Sends a notification email to the ETERNO team about a new registration
 */
export async function sendRegistrationNotification(userData: {
  email: string
  firstname: string
  lastname: string
  phonecontact?: string
  countrylocation?: string
  city?: string
}) {
  const subject = "New Registration: ETERNO"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #5a5a56;">New Registration</h1>
      <p>A new user has registered interest with ETERNO:</p>
      <ul>
        <li><strong>Name:</strong> ${userData.firstname} ${userData.lastname}</li>
        <li><strong>Email:</strong> ${userData.email}</li>
        ${userData.phonecontact ? `<li><strong>Phone:</strong> ${userData.phonecontact}</li>` : ""}
        ${userData.countrylocation ? `<li><strong>Country:</strong> ${userData.countrylocation}</li>` : ""}
        ${userData.city ? `<li><strong>City:</strong> ${userData.city}</li>` : ""}
      </ul>
      <p>Please follow up with this customer at your earliest convenience.</p>
    </div>
  `

  return sendEmail({
    to: "enquiries@eternotailoring.com",
    subject,
    html,
  })
}
