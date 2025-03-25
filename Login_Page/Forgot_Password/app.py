from flask import Flask, request, jsonify
import smtplib
import openpyxl

app = Flask(__name__)


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Load user data from Excel
    users = load_user_data()

    # Check if user exists and password matches
    user = users.get(email)

    if not user:
        return jsonify({"message": "User not found!", "success": False}), 404

    if user['password'] != password:
        return jsonify({"message": "Incorrect password!", "success": False}), 401

    return jsonify({"message": "Login successful!", "success": True})

# Load user data from Excel file
def load_user_data():
    workbook = openpyxl.load_workbook("users.xlsx")
    sheet = workbook.active
    users = {}
    for row in sheet.iter_rows(min_row=2, values_only=True):
        email, name, password = row
        users[email] = {"name": name, "password": password}
    return users

# Home Route
@app.route('/')
def home():
    return "Welcome to the Password Reset Service!"

# Forgot Password Endpoint
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get("email")

    # Load user data from Excel
    users = load_user_data()
    user = users.get(email)

    if not user:
        return jsonify({"message": "User not found!"}), 404

    # Send Password Reset Email
    try:
        sender_email = "thegreatharesh@gmail.com"
        sender_password = "beatmeifyoucan"

        # Set up SMTP server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)

        # Email content
        subject = "Password Reset Request"
        body = f"Hello {user['name']},\n\nPlease click the link below to reset your password:\n\nhttp://localhost:5000/reset-password?email={email}\n\nThank you!"
        message = f"Subject: {subject}\n\n{body}"

        # Send email
        server.sendmail(sender_email, email, message)
        server.quit()

        return jsonify({"message": "Password reset email sent successfully!"})
    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to send email!"}), 500


if __name__ == '__main__':
    app.run(debug=True)
