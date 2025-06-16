// services/emailService.ts
const ADMIN_EMAIL = 'info@muralinkai.com';

export interface EmailData {
    name: string;
    email: string;
    userType: string;
  }

export async function sendEmail(data: EmailData) {
    try {

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
}

export function generateUserEmailTemplate(name: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f8fafc;
          }
          .header {
            background: linear-gradient(to right, #2563eb, #7c3aed);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .logo {
            width: 150px;
            height: auto;
            margin-bottom: 15px;
          }
          .content {
            padding: 30px;
            background: white;
            border-radius: 10px;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .notification-container {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e8f5ff 100%);
            border-radius: 15px;
            border: 2px solid #2563eb;
          }
          .notification-icon {
            font-size: 48px;
            margin-bottom: 15px;
            color: #2563eb;
          }
          .launch-message {
            background: linear-gradient(to right, #2563eb, #7c3aed);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            margin: 15px 0;
            display: inline-block;
          }
          .features-grid {
            display: table;
            width: 100%;
            margin: 20px 0;
          }
          .feature {
            display: table-row;
            margin: 10px 0;
          }
          .feature-icon {
            display: table-cell;
            padding: 10px;
            color: #2563eb;
            font-size: 20px;
            vertical-align: middle;
          }
          .feature-text {
            display: table-cell;
            padding: 10px;
            vertical-align: middle;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .social-links {
            margin: 15px 0;
          }
          .social-link {
            color: #2563eb;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to MuralinkAI! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for your interest in MuralinkAI! We're thrilled to have you join our community of design enthusiasts.</p>
            
            <div class="notification-container">
              <div class="notification-icon">🚀</div>
              <h3>Get Ready for Launch!</h3>
              <div class="launch-message">
                You'll be notified once we launch the application
              </div>
              <p>Be among the first to experience the future of AI-powered design!</p>
            </div>

            <div class="features-grid">
              <div class="feature">
                <span class="feature-icon">🎨</span>
                <span class="feature-text">AI-Powered Design Solutions</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🚀</span>
                <span class="feature-text">Early Access to New Features</span>
              </div>
              <div class="feature">
                <span class="feature-icon">💡</span>
                <span class="feature-text">Innovative Space Transformation</span>
              </div>
            </div>

            <p>We're working hard to bring you an amazing experience and will keep you updated on our progress.</p>
            <p>Get ready to transform spaces with cutting-edge AI technology!</p>
            
            <br/>
            <p>Best regards,</p>
            <p>The MuralinkAI Team</p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="https://www.instagram.com/muralink_designs/" class="social-link">Instagram</a>
              <a href="https://www.linkedin.com/company/mura-link/posts/?feedView=all" class="social-link">LinkedIn</a>
            </div>
            <p>© 2024 MuralinkAI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}


export function generateAdminEmailTemplate(userData: EmailData) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .header {
            background: linear-gradient(to right, #2563eb, #7c3aed);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
          }
          .content {
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .user-info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
          }
          .user-info-table th {
            background: #f1f5f9;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
          }
          .user-info-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          .highlight {
            background-color: #f8fafc;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 15px;
            background: #dbeafe;
            color: #2563eb;
            font-weight: 500;
          }
          .timestamp {
            color: #64748b;
            font-size: 0.875em;
            margin-top: 20px;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Pre-Launch Registration 🚀</h1>
          </div>
          <div class="content">
            <table class="user-info-table">
              <tr>
                <th colspan="2">Registration Details</th>
              </tr>
              <tr>
                <td><strong>Name</strong></td>
                <td>${userData.name}</td>
              </tr>
              <tr class="highlight">
                <td><strong>Email</strong></td>
                <td>${userData.email}</td>
              </tr>
              <tr>
                <td><strong>Credits Reserved</strong></td>
                <td>25</td>
              </tr>
              <tr class="highlight">
                <td><strong>Registration Status</strong></td>
                <td><span class="status-badge">Pre-Launch Member</span></td>
              </tr>
            </table>

            <p><strong>Action Required:</strong> Please follow up with the user within 24 hours to discuss their needs and interests.</p>
            
            <div class="timestamp">
              Registration Time: ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}