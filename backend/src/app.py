import streamlit as st
from src.config import DEFAULT_SESSION_STATE
from src.database import init_db, get_conn, load_data
from src.ui.styles import CUSTOM_CSS
from src.ui.auth_views import render_login_page

# 1. Configure Streamlit Page Layout
st.set_page_config(page_title="StudyPilot", page_icon="✈️", layout="wide")

# 2. Inject Premium Light Theme CSS
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# 3. Initialize SQLite Database Tables
init_db()

# 4. Initialize Default Session States
for key, val in DEFAULT_SESSION_STATE.items():
    if key not in st.session_state:
        st.session_state[key] = val

# 5. Pre-load Users database on first run
if not st.session_state.get("users_loaded", False):
    try:
        with get_conn() as conn:
            rows = conn.execute("SELECT username, email, password FROM users").fetchall()
            st.session_state["user_db"] = {
                r["username"]: {"identity": r["email"], "password": r["password"]}
                for r in rows
            }
    except Exception:
        pass
    st.session_state["users_loaded"] = True

# 6. Route Application views
if st.session_state["logged_in"]:
    if st.session_state["current_view"] in ["landing", "login", "register", "forgot_password"]:
        st.session_state["current_view"] = "welcome_hub"
    from src.ui.dashboard import render_dashboard
    render_dashboard()
else:
    if st.session_state["current_view"] not in ["landing", "login", "register", "forgot_password"]:
        st.session_state["current_view"] = "landing"
    
    if st.session_state["current_view"] == "landing":
        from src.ui.landing_page import render_landing_page
        render_landing_page()
    else:
        from src.ui.auth_views import render_login_page
        render_login_page()
