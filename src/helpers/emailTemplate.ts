export const EmailTemplate = (username: string, confirmationLink: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #f0f0f0;
          padding: 16px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
        .body-text {
          color: #718096;
          font-size: 16px;
          margin: 16px 0;
        }
        .button {
          display: inline-block;
          width: 192px;
          margin: 24px auto;
          padding: 12px;
          text-align: center;
          background-color: #1e293b;
          color: blue;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
        }
        .button:hover {
          background-color: #fff;
          color: blue
        }
        .footer {
          text-align: center;
          color: #a0aec0; /* Tailwind text-gray-500 */
          font-size: 12px;
          padding: 16px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Todo App</div>
        
        <div>
          <p style="color: #2d3748; font-size: 18px;">Dear ${username},</p>
          <p class="body-text">
            Thank you for choosing our Todo App! We’re excited to have you on board and can’t wait to help you stay organized and productive. Whether you're managing your daily tasks or tracking long-term goals, we’re here to assist you every step of the way.
          </p>
          <p class="body-text">
            To get started and confirm your account, please click the button below:
          </p>
  
          <!-- Confirmation Button with Link -->
          <a href="${confirmationLink}" class="button">
            Confirm Your Account
          </a>
  
          <p class="body-text">
            If you have any questions or need assistance, feel free to reply to this email. We're here to help!
          </p>
          <p style="color: #2d3748; font-size: 16px;">Best regards,</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
