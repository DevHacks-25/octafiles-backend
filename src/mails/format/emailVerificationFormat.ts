const otpTemplate = (otp: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - Octafiles</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f5f5;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid rgb(207, 148, 85); /* Theme-colored border */
        }

        .email-header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
        }

        .company-logo {
            width: 180px;
            height: auto;
        }

        .email-body {
            padding: 40px 20px;
            background-color: #ffffff;
        }

        .email-heading {
            font-size: 24px;
            color: rgb(107, 62, 31); /* Darker shade of the theme color */
            margin-bottom: 20px;
            text-align: center;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 15px;
        }

        .otp-container {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #faf1e6; /* Light shade of the theme color */
            border-radius: 8px;
        }

        .otp-code {
            font-size: 32px;
            letter-spacing: 5px;
            color: rgb(107, 62, 31); /* Darker shade of the theme color */
            font-weight: bold;
            padding: 10px 20px;
            background-color: #ffffff;
            border: 2px solid rgb(207, 148, 85); /* Theme color */
            border-radius: 6px;
            display: inline-block;
        }

        .warning {
            font-size: 14px;
            color: #666;
            margin: 20px 0;
            padding: 15px;
            background-color: #f9e7d6; /* Very light shade of the theme color */
            border-radius: 4px;
        }

        .email-footer {
            margin-top: 30px;
            padding: 20px;
            background-color: #faf1e6; /* Light shade of the theme color */
            border-radius: 8px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }

        .support-link {
            color: rgb(107, 62, 31); /* Darker shade of the theme color */
            text-decoration: none;
        }

        .support-link:hover {
            text-decoration: underline;
        }

        @media only screen and (max-width: 480px) {
            .email-wrapper {
                padding: 10px;
            }
            
            .email-body {
                padding: 20px 15px;
            }

            .otp-code {
                font-size: 24px;
                letter-spacing: 3px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <img src="../../assets/OctaFilesLogo.svg" alt="Octafiles Logo" class="company-logo">
        </div>
        
        <div class="email-body">
            <h1 class="email-heading">Verify Your Account</h1>
            
            <p class="greeting">Hello !</p>
            
            <p>Thank you for signing up on Octafiles. To complete your account creation, please verify your email address using the following verification code:</p>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
                <p style="margin-top: 15px; color: #666;">This code will expire in 10 minutes</p>
            </div>
            
            <div class="warning">
                <strong>Security Notice:</strong> If you didn't request this verification code, please ignore this email or contact our support team immediately.
            </div>
            
            <p>Upon successful verification, you will unlock complete access to all features and services offered by Octafiles</p>
        </div>
        
        <div class="email-footer">
            <p>Need assistance? Contact us at <a href="mailto:support@octafiles.com" style="color: #003366;">support@octafiles.com</a></p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} OctaFiles</p>
        </div>
</div>
</body>
</html>
`;
};

export default otpTemplate;
