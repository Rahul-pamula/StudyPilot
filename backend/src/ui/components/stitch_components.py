import streamlit as st
import datetime

def render_sidebar(
    active_view: str,
    on_change,
    logged_in: bool = False,
    username: str = "",
    email: str = "",
    history_dict: dict = None,
    active_id: str = "",
    new_action = None,
    select_action = None,
    rename_action = None,
    delete_action = None,
    logout_action = None
):
    with st.sidebar:
        # Title of app
        st.markdown("<h3 style='margin:0 0 1.5rem 0; color:#2563EB; font-weight:800; text-align:center;'>✈️ StudyPilot</h3>", unsafe_allow_html=True)
        
        if not logged_in:
            st.markdown("<p style='text-align:center;color:#64748B;'>Please sign in to continue.</p>", unsafe_allow_html=True)
            if st.button("🔐 Sign In", key="side_nav_signin", use_container_width=True):
                on_change("login")
            return

        # 1. Profile Tray
        if st.button(f"🧑‍🎓  {username}", use_container_width=True, key="profile_btn"):
            st.session_state["show_profile_tray"] = not st.session_state.get("show_profile_tray", False)
            st.rerun()

        if st.session_state.get("show_profile_tray", False):
            st.markdown(
                f"""<div style='background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;
                padding:12px 14px;margin:4px 0 12px 0;font-size:0.88rem;line-height:1.6;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);'>
                <span style='color:#64748B;font-weight:500;'>Username</span><br>
                <span style='color:#0F172A;font-weight:600;'>{username}</span><br>
                <span style='color:#64748B;font-weight:500;margin-top:6px;display:inline-block;'>Email</span><br>
                <span style='color:#0F172A;font-weight:600;'>{email}</span>
            </div>""",
                unsafe_allow_html=True,
            )

        st.write("---")

        # 2. Navigation List
        label_home = "▸ 🏠 Home" if active_view == "welcome_hub" else "🏠 Home"
        label_chat = "▸ 💬 Ask Anything" if active_view == "chat" else "💬 Ask Anything"
        label_summary = "▸ 📝 Summarize" if active_view == "summary" else "📝 Summarize"
        label_planner = "▸ 📅 Planner" if active_view == "planner" else "📅 Planner"

        if st.button(label_home, key="side_nav_home", use_container_width=True):
            on_change("welcome_hub")
        if st.button(label_chat, key="side_nav_chat", use_container_width=True):
            on_change("chat")
        if st.button(label_summary, key="side_nav_summary", use_container_width=True):
            on_change("summary")
        if st.button(label_planner, key="side_nav_planner", use_container_width=True):
            on_change("planner")

        st.write("---")

        # 3. View-Specific History List
        if active_view in ["chat", "summary", "planner"] and history_dict is not None:
            friendly_names = {"chat": "Chat", "summary": "Summary", "planner": "Planner"}
            friendly_name = friendly_names[active_view]
            render_sidebar_history(
                active_view, friendly_name, history_dict, active_id,
                new_action, select_action, rename_action, delete_action
            )

        st.write("")
        # 4. Logout Action
        if st.button("🚪 Log Out", use_container_width=True, key="logout_btn"):
            if logout_action:
                logout_action()

def render_page_header(title: str, subtitle: str = ""):
    if subtitle:
        st.markdown(
            f"""<div class='section-gap'>
                <h1 style='font-size: 2.25rem; font-weight: 800; color: #0F172A; letter-spacing: -1px; margin-bottom: 8px;'>{title}</h1>
                <p style='font-size: 1.1rem; color: #64748B; margin: 0; line-height: 1.5;'>{subtitle}</p>
            </div>""",
            unsafe_allow_html=True
        )
    else:
        st.markdown(
            f"""<div class='section-gap'>
                <h1 style='font-size: 2.25rem; font-weight: 800; color: #0F172A; letter-spacing: -1px; margin: 0;'>{title}</h1>
            </div>""",
            unsafe_allow_html=True
        )

def render_card(title: str = "", subtitle: str = ""):
    card = st.container(border=True)
    if title:
        card.markdown(f"<h3 style='margin:0 0 4px 0; color:#0F172A; font-weight:700; font-size:1.2rem;'>{title}</h3>", unsafe_allow_html=True)
    if subtitle:
        card.markdown(f"<p style='margin:0 0 16px 0; color:#64748B; font-size:0.9rem;'>{subtitle}</p>", unsafe_allow_html=True)
    return card

def render_chat_ui(messages, active_chat_id, on_send):
    # 1. Scrollable message area
    with st.container(height=450, border=False):
        for idx, msg in enumerate(messages):
            render_chat_bubble(msg["text"], msg["role"])
            
            # Copy/Share buttons
            msg_id = f"msg_{active_chat_id}_{idx}"
            col_b, col_m = st.columns([8, 2]) if msg["role"] == "user" else st.columns([2, 8])
            target_col = col_m if msg["role"] == "user" else col_b
            with target_col:
                if st.button("⋮", key=f"dots_chat_{msg_id}"):
                    st.session_state["active_bubble_menu_id"] = (
                        msg_id if st.session_state.get("active_bubble_menu_id") != msg_id else ""
                    )
                    st.rerun()

            if st.session_state.get("active_bubble_menu_id") == msg_id:
                mc_col = st.columns([7.5, 2.5])[1] if msg["role"] == "user" else st.columns([2.5, 7.5])[0]
                with mc_col:
                    if st.button("📋  Copy", key=f"cp_{msg_id}", use_container_width=True):
                        try:
                            pyperclip = __import__("pyperclip")
                            pyperclip.copy(msg["text"])
                        except Exception:
                            pass
                        st.toast("Copied! ✅")
                        st.session_state["active_bubble_menu_id"] = ""
                        st.rerun()
                    if st.button("↗  Share", key=f"sh_{msg_id}", use_container_width=True):
                        st.toast("Link copied!")
                        st.session_state["active_bubble_menu_id"] = ""
                        st.rerun()

    # 2. Fixed bottom input bar (outside the scrollable area)
    with st.form("chat_form", clear_on_submit=True):
        chat_input = render_input_group("", key="chat_input_val", placeholder="Type your message here...")
        send = st.form_submit_button("Send →", use_container_width=True)
        
    if send and chat_input.strip():
        on_send(chat_input)

def render_input_group(label: str, key: str, value: str = "", type: str = "text", placeholder: str = "", options: list = None, min_val: int = None, max_val: int = None) -> str:
    if type == "select" and options is not None:
        idx = options.index(value) if value in options else 0
        return st.selectbox(label, options, index=idx, key=key)
    elif type == "number" and min_val is not None and max_val is not None:
        val = int(value) if value else min_val
        return st.number_input(label, min_value=min_val, max_value=max_val, value=val, step=1, key=key)
    elif type == "textarea":
        return st.text_area(label, value=value, placeholder=placeholder, height=200, key=key, label_visibility="collapsed")
    elif type == "password":
        return st.text_input(label, value=value, type="password", key=key, placeholder=placeholder)
    else:
        return st.text_input(label, value=value, key=key, placeholder=placeholder)

def render_action_button(label: str, key: str, action=None, primary: bool = True) -> bool:
    clicked = st.button(label, key=key, use_container_width=True)
    if clicked and action:
        action()
    return clicked

def render_hero_section(title: str, subtitle: str, cta_label: str, cta_action):
    st.markdown(
        f"""<div style='text-align:center; padding: 4rem 1rem 3rem 1rem;'>
            <h1 style='font-size: 3.5rem; font-weight: 800; color: #0F172A; letter-spacing: -2px; margin-bottom: 12px;'>
                {title}
            </h1>
            <p style='font-size: 1.25rem; color: #64748B; max-width: 600px; margin: 0 auto 24px auto; line-height: 1.6;'>
                {subtitle}
            </p>
        </div>""",
        unsafe_allow_html=True
    )
    _, btn_col, _ = st.columns([4, 2, 4])
    with btn_col:
        if st.button(cta_label, key="hero_cta_btn", use_container_width=True):
            cta_action()

def render_feature_card(icon: str, title: str, description: str):
    st.markdown(
        f"""<div class="saas-card">
            <div style="font-size:2.5rem; margin-bottom:12px;">{icon}</div>
            <h3 style="margin:0 0 8px 0; color:#0F172A; font-weight:700; font-size:1.3rem;">{title}</h3>
            <p style="margin:0; color:#64748B; font-size:0.95rem; line-height:1.5;">{description}</p>
        </div>""",
        unsafe_allow_html=True
    )

def render_chat_bubble(text: str, role: str):
    if role == "user":
        _, cb, _ = st.columns([3.5, 6, 0.5])
        with cb:
            st.markdown(
                f"<div class='chat-msg user-bubble'>{text}</div>",
                unsafe_allow_html=True,
            )
    else:
        cb, _, _ = st.columns([6, 0.5, 3.5])
        with cb:
            st.markdown(
                f"<div class='chat-msg bot-bubble'>{text}</div>",
                unsafe_allow_html=True,
            )

def render_sidebar_history(
    feature_key: str, 
    friendly_name: str, 
    history_dict: dict, 
    active_id: str, 
    new_action, 
    select_action, 
    rename_action, 
    delete_action
):
    st.markdown(
        f"<p style='font-weight:700;font-size:0.75rem;color:#64748B;text-transform:uppercase;"
        f"letter-spacing:0.08em;margin:0 0 6px 0;'>{friendly_name} History</p>",
        unsafe_allow_html=True,
    )

    if st.button(f"＋ New {friendly_name}", use_container_width=True, key=f"new_{feature_key}"):
        if new_action:
            new_action()
            st.rerun()

    st.write("")

    if not history_dict:
        st.caption("No history yet.")
        return

    open_menu = st.session_state.get("active_menu_item_id", "")

    for item_id in list(history_dict.keys()):
        if feature_key == "chat":
            msgs  = history_dict[item_id]
            label = msgs[0]["text"][:22] + "…" if msgs else "New Chat"
        else:
            label = history_dict[item_id].get("title", "Untitled")[:22]

        is_active = item_id == active_id
        is_open   = open_menu == item_id

        col_sel, col_dot = st.columns([8, 2])

        with col_sel:
            prefix = "▸ " if is_active else ""
            if st.button(f"{prefix}{label}", key=f"sel_{item_id}_{feature_key}", use_container_width=True):
                if select_action:
                    select_action(item_id)
                    st.rerun()

        with col_dot:
            if st.button("⋮", key=f"dots_{item_id}_{feature_key}", use_container_width=True):
                st.session_state["active_menu_item_id"] = item_id if not is_open else ""
                st.rerun()

        if is_open:
            st.markdown(
                """<div style='
                    background:#F8FAFC;
                    border:1px solid #E2E8F0;
                    border-radius:8px;
                    padding:3px 4px;
                    margin:-4px 0 4px 0;
                '></div>""",
                unsafe_allow_html=True,
            )
            dc1, dc2 = st.columns(2)
            with dc1:
                if st.button("✏️ Rename", key=f"ren_{item_id}_{feature_key}", use_container_width=True):
                    st.session_state["editing_item_id"]       = item_id
                    st.session_state["rename_feature_target"] = feature_key
                    st.session_state["active_menu_item_id"]   = ""
                    st.rerun()
            with dc2:
                if st.button("🗑️ Delete", key=f"del_{item_id}_{feature_key}", use_container_width=True):
                    if delete_action:
                        delete_action(item_id)
                        st.session_state["active_menu_item_id"] = ""
                        st.rerun()

    eid = st.session_state.get("editing_item_id", "")
    if eid in history_dict and st.session_state.get("rename_feature_target") == feature_key:
        st.write("")
        with st.form(f"rename_form_{feature_key}"):
            new_title = st.text_input("New name", placeholder="Enter title…", label_visibility="collapsed")
            if st.form_submit_button("Save →", use_container_width=True):
                if new_title.strip() and rename_action:
                    rename_action(eid, new_title.strip())
                    st.session_state["editing_item_id"] = ""
                    st.rerun()
