import re
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from src.config import GMAIL_ADDRESS, GMAIL_APP_PASSWORD
from src.database import hash_password

# In-memory OTP store: {email: {"otp": "123456", "ts": datetime}}
_otp_store: dict = {}

def validate_email(email: str) -> bool:
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email))

def store_otp(email: str, otp: str):
    _otp_store[email] = {"otp": otp, "ts": datetime.datetime.now()}

def verify_otp(email: str, entered: str) -> bool:
    record = _otp_store.get(email)
    if not record:
        return False
    elapsed = (datetime.datetime.now() - record["ts"]).seconds
    if elapsed > 600:
        return False
    return record["otp"] == entered.strip()

def clear_otp(email: str):
    _otp_store.pop(email, None)

def send_otp_email(recipient_email: str, otp_code: str) -> tuple[bool, str]:
    if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
        return False, "Gmail configuration credentials missing in environment (.env)"
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "StudyPilot — Your Verification Code"
        msg["From"] = f"StudyPilot <{GMAIL_ADDRESS}>"
        msg["To"] = recipient_email
        html_body = f"""<html><body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 0;">
                <tr><td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
                        <tr><td style="background:linear-gradient(135deg,#1D4ED8,#2563EB);padding:32px;text-align:center;">
                            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;">✈️ StudyPilot</h1>
                            <p style="margin:6px 0 0;color:#BFDBFE;font-size:13px;">Your Learning Assistant</p>
                        </td></tr>
                        <tr><td style="padding:36px 40px;">
                            <p style="color:#64748B;font-size:14px;margin:0 0 8px;">Your verification code is:</p>
                            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;text-align:center;margin:16px 0;">
                                <span style="font-size:42px;font-weight:900;color:#2563EB;letter-spacing:10px;">{otp_code}</span>
                            </div>
                            <p style="color:#64748B;font-size:13px;margin:16px 0 0;">Expires in <b style="color:#F59E0B;">10 minutes</b>. Do not share it.</p>
                        </td></tr>
                    </table>
                </td></tr>
            </table>
        </body></html>"""
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_ADDRESS, recipient_email, msg.as_string())
        return True, "OK"
    except Exception as e:
        return False, str(e)
