const passwordUpdated = (email: string, name: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Updated - Octafiles</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
  
            body {
                background-color: #f5f5f5; /* Light gray background */
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #333333;
                line-height: 1.6;
            }
  
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 30px;
                background-color: #ffffff; /* White background for the email */
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                border: 1px solid rgb(207, 148, 85); /* Theme-colored border */
            }
  
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
  
            .message {
                font-size: 24px;
                font-weight: bold;
                color: rgb(107, 62, 31); /* Theme color */
                margin-bottom: 20px;
            }
  
            .body {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: left;
            }
  
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
  
            .highlight {
                font-weight: bold;
                color: rgb(107, 62, 31); /* Theme color */
            }
  
            a {
                color: rgb(107, 62, 31); /* Theme color */
                text-decoration: underline;
            }
  
            a:hover {
                text-decoration: none;
            }
  
            @media only screen and (max-width: 480px) {
                .container {
                    padding: 15px;
                }
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <a href="www.octafiles.com"><img class="logo"
                    src="../../assets/OctaFilesLogo.svg" alt="Octafiles Logo"></a>
            <div class="message">Password Update Confirmation</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us at
                <a href="mailto:info@octafiles.com">info@octafiles.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};

export default passwordUpdated;
