import random
import datetime
import streamlit as st
from src.database import get_conn, load_data, hash_password
from src.services.auth_service import validate_email, send_otp_email, is_otp_expired
from src.ui.components.stitch_components import (
    render_sidebar, render_card, render_input_group, render_action_button
)

def render_login_page():
    # Render sidebar navigation for logged out state
    def go_to_landing():
        st.session_state["current_view"] = "landing"
        st.session_state["auth_view"] = "welcome"
        st.rerun()

    render_sidebar(
        active_view="login",
        on_change=lambda view: st.rerun(),
        logged_in=False
    )

    # Main content container
    _, col, _ = st.columns([1, 1.8, 1])
    with col:
        st.markdown(
            """<div style='text-align:center;margin:2rem 0 1rem;'>
            <div style='font-size:3rem;'>✈️</div>
            <h1 style='font-weight:900;font-size:2rem;margin:0;letter-spacing:-1px;color:#0F172A;'>StudyPilot</h1>
            <p style='color:#64748B;font-size:0.95rem;margin:4px 0 0;'>Empathetic Student Workspace</p>
        </div>""",
            unsafe_allow_html=True,
        )

        auth_view = st.session_state["auth_view"]

        if auth_view == "welcome":
            # Direct shortcut to login screen
            st.session_state["auth_view"] = "login"
            st.rerun()

        elif auth_view == "login":
            with render_card(title="Sign In", subtitle="Access your technical study assistants"):
                with st.form("login_form", border=False):
                    u = render_input_group("Username", key="login_username", placeholder="Enter username...")
                    p = render_input_group("Password", key="login_password", type="password", placeholder="••••••••")
                    sub = st.form_submit_button("Sign In →", use_container_width=True)
                
                if sub:
                    try:
                        with get_conn() as conn:
                            row = conn.execute(
                                "SELECT password FROM users WHERE username=?", (u.strip(),)
                            ).fetchone()
                        if row and row["password"] == hash_password(p.strip()):
                            st.session_state["logged_in"] = True
                            st.session_state["username"]  = u.strip()
                            load_data()
                            st.rerun()
                        else:
                            st.error("❌ Invalid username or password.")
                    except Exception:
                        st.error("❌ Database error. Please try again.")
            
            cl, cr = st.columns(2)
            with cl:
                render_action_button("⬅ Back to Home", key="back_login", action=go_to_landing)
            with cr:
                def go_register():
                    st.session_state["auth_view"] = "register"
                    st.session_state["reg_step"]  = "input_email"
                    st.rerun()
                render_action_button("Create Account", key="go_reg_btn", action=go_register)
            
            # Forgot password button centered below
            def go_forgot():
                st.session_state["auth_view"]   = "forgot_password"
                st.session_state["forgot_step"] = "verify_email"
                st.rerun()
            st.write("")
            render_action_button("Forgot Password?", key="forgot_btn", action=go_forgot)

        elif auth_view == "register":
            reg_step = st.session_state["reg_step"]
            
            if reg_step == "input_email":
                with render_card(title="Create Account", subtitle="Verify your email to get started"):
                    with st.form("reg_email_form", border=False):
                        ei = render_input_group("Your Email Address", key="reg_email_field", placeholder="student@example.com")
                        send = st.form_submit_button("Send Verification Code →", use_container_width=True)
                    
                    if send:
                        if not validate_email(ei.strip()):
                            st.error("❌ Enter a valid email.")
                        else:
                            existing_emails = [m["identity"] for m in st.session_state["user_db"].values()]
                            if ei.strip() in existing_emails:
                                st.error("❌ Email registered. Sign in instead.")
                            else:
                                otp = str(random.randint(100000, 999999))
                                ok, err = send_otp_email(ei.strip(), otp)
                                if ok:
                                    st.session_state.update({
                                        "generated_otp": otp,
                                        "otp_timestamp": datetime.datetime.now(),
                                        "temp_identity": ei.strip(),
                                        "reg_step":      "verify_otp",
                                    })
                                    st.success(f"✅ OTP sent to {ei.strip()}!")
                                    st.rerun()
                                else:
                                    st.error(f"❌ Failed: {err}")
                
                render_action_button("⬅ Cancel", key="cancel_reg", action=go_to_landing)

            elif reg_step == "verify_otp":
                with render_card(title="Enter OTP", subtitle=f"6-digit code sent to {st.session_state['temp_identity']}"):
                    if is_otp_expired():
                        st.error("⏰ OTP expired.")
                        def resend():
                            otp = str(random.randint(100000, 999999))
                            ok, _ = send_otp_email(st.session_state["temp_identity"], otp)
                            if ok:
                                st.session_state.update({
                                    "generated_otp": otp,
                                    "otp_timestamp": datetime.datetime.now(),
                                })
                                st.success("New OTP sent!")
                                st.rerun()
                        render_action_button("Resend OTP", key="resend_otp_reg", action=resend)
                    else:
                        with st.form("otp_form", border=False):
                            entered = render_input_group("Enter 6-Digit OTP", key="entered_otp_val", placeholder="123456")
                            verify  = st.form_submit_button("Verify →", use_container_width=True)
                        if verify:
                            if entered.strip() == st.session_state["generated_otp"]:
                                st.session_state["reg_step"] = "set_credentials"
                                st.rerun()
                            else:
                                st.error("❌ Incorrect OTP.")
                
                def back_email():
                    st.session_state["reg_step"] = "input_email"
                    st.rerun()
                render_action_button("⬅ Back", key="back_otp", action=back_email)

            elif reg_step == "set_credentials":
                with render_card(title="Set Credentials", subtitle=f"Set your login details for {st.session_state['temp_identity']}"):
                    with st.form("cred_form", border=False):
                        ru   = render_input_group("Choose a Username", key="reg_username", placeholder="username")
                        rp   = render_input_group("Choose a Password", key="reg_password", type="password", placeholder="••••••••")
                        rc   = render_input_group("Confirm Password", key="reg_confirm_password", type="password", placeholder="••••••••")
                        done = st.form_submit_button("Create Account →", use_container_width=True)
                    
                    if done:
                        existing_emails = [m["identity"] for m in st.session_state["user_db"].values()]
                        if len(ru.strip()) < 3:
                            st.error("❌ Username too short.")
                        elif ru.strip() in st.session_state["user_db"]:
                            st.error("❌ Username taken.")
                        elif st.session_state["temp_identity"] in existing_emails:
                            st.error("❌ Email registered. Sign in instead.")
                        elif rp != rc:
                            st.error("❌ Passwords don't match.")
                        elif len(rp) < 4:
                            st.error("❌ Password too short.")
                        else:
                            new_user = {
                                "identity": st.session_state["temp_identity"],
                                "password": hash_password(rp.strip()),
                            }
                            st.session_state["user_db"][ru.strip()] = new_user
                            try:
                                with get_conn() as conn:
                                    conn.execute(
                                        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                                        (ru.strip(), new_user["identity"], new_user["password"]),
                                    )
                            except Exception:
                                pass
                            st.session_state["logged_in"] = True
                            st.session_state["username"]  = ru.strip()
                            load_data()
                            st.rerun()

        elif auth_view == "forgot_password":
            forgot_step = st.session_state["forgot_step"]
            
            if forgot_step == "verify_email":
                with render_card(title="Reset Password", subtitle="Enter your email to receive recovery instructions"):
                    with st.form("forgot_form", border=False):
                        re_email = render_input_group("Registered Email", key="forgot_email_field", placeholder="student@example.com")
                        lookup   = st.form_submit_button("Send Reset OTP →", use_container_width=True)
                    
                    if lookup:
                        found = next(
                            (u for u, m in st.session_state["user_db"].items() if m["identity"] == re_email.strip()),
                            None,
                        )
                        if found:
                            otp = str(random.randint(100000, 999999))
                            ok, err = send_otp_email(re_email.strip(), otp)
                            if ok:
                                st.session_state.update({
                                    "recovery_target_user": found,
                                    "generated_otp":        otp,
                                    "otp_timestamp":        datetime.datetime.now(),
                                    "forgot_step":          "verify_otp",
                                })
                                st.success("✅ OTP sent!")
                                st.rerun()
                            else:
                                st.error(f"❌ {err}")
                        else:
                            st.error("❌ No account found with this email.")
                
                def back_login():
                    st.session_state["auth_view"] = "login"
                    st.rerun()
                render_action_button("⬅ Cancel", key="back_forgot", action=back_login)

            elif forgot_step == "verify_otp":
                with render_card(title="Enter OTP", subtitle="Check your email for code"):
                    if not is_otp_expired():
                        with st.form("forgot_otp_form", border=False):
                            rotp = render_input_group("6-Digit OTP", key="forgot_otp_val", placeholder="123456")
                            vrfy = st.form_submit_button("Verify →", use_container_width=True)
                        if vrfy:
                            if rotp.strip() == st.session_state["generated_otp"]:
                                st.session_state["forgot_step"] = "reset_password"
                                st.rerun()
                            else:
                                st.error("❌ Incorrect OTP.")
                    else:
                        st.error("⏰ OTP expired.")

            elif forgot_step == "reset_password":
                with render_card(title="Set New Password", subtitle="Update security credentials"):
                    with st.form("reset_form", border=False):
                        np1  = render_input_group("New Password", key="reset_pass1", type="password", placeholder="••••••••")
                        np2  = render_input_group("Confirm New Password", key="reset_pass2", type="password", placeholder="••••••••")
                        save = st.form_submit_button("Update Password →", use_container_width=True)
                    if save:
                        if np1 != np2:
                            st.error("❌ Passwords do not match.")
                        elif len(np1) < 4:
                            st.error("❌ Password too short.")
                        else:
                            target   = st.session_state["recovery_target_user"]
                            new_hash = hash_password(np1.strip())
                            st.session_state["user_db"][target]["password"] = new_hash
                            try:
                                with get_conn() as conn:
                                    conn.execute(
                                        "UPDATE users SET password=? WHERE username=?",
                                        (new_hash, target),
                                    )
                            except Exception:
                                pass
                            st.success("🔒 Updated! Sign in now.")
                            st.session_state["auth_view"] = "login"
                            st.rerun()
