import datetime
import streamlit as st
from src.database import save_data, save_chat_immediately, delete_item_from_db
from src.ai_engines import get_chat_response, get_summary
from src.services.chat_service import start_new_chat, delete_chat, rename_chat
from src.services.planner_service import create_new_plan, delete_plan, generate_schedule
from src.ui.components.stitch_components import (
    render_sidebar, render_page_header, render_card,
    render_chat_ui, render_input_group, render_action_button
)

def _change_view(view_name: str):
    st.session_state["current_view"] = view_name
    st.rerun()

def render_dashboard():
    username = st.session_state["username"]
    email = st.session_state["user_db"].get(username, {}).get("identity", "N/A")
    view = st.session_state["current_view"]

    # Set up navigation helpers and history structures for sidebar routing
    history_dict = None
    active_id = ""
    new_action = None
    select_action = None
    rename_action = None
    delete_action = None

    if view == "chat":
        if not st.session_state["all_chats"]:
            default_id = f"chat_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
            st.session_state["all_chats"][default_id] = []
            st.session_state["active_chat_id"] = default_id
            save_chat_immediately(default_id, [], username)
        elif not st.session_state["active_chat_id"]:
            st.session_state["active_chat_id"] = list(st.session_state["all_chats"].keys())[0]

        history_dict = st.session_state["all_chats"]
        active_id = st.session_state["active_chat_id"]
        new_action = lambda: start_new_chat(username)
        select_action = lambda cid: st.session_state.update({"active_chat_id": cid})
        rename_action = rename_chat
        delete_action = lambda cid: st.session_state.update({"active_chat_id": delete_chat(cid, st.session_state["active_chat_id"])})

    elif view == "summary":
        if not st.session_state["all_summaries"]:
            st.session_state["all_summaries"]["summary_default"] = {
                "text": "", "summary": "", "word_count": 80,
                "format_style": "Plain Text", "title": "Untitled Summary",
            }
            st.session_state["active_summary_id"] = "summary_default"
            save_data()
        elif not st.session_state["active_summary_id"]:
            st.session_state["active_summary_id"] = list(st.session_state["all_summaries"].keys())[0]

        def new_summary():
            nid = f"summary_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
            st.session_state["all_summaries"][nid] = {
                "text": "", "summary": "", "word_count": 80,
                "format_style": "Plain Text", "title": "Untitled Summary",
            }
            st.session_state["active_summary_id"] = nid
            save_data()

        def delete_summary(sid):
            if sid in st.session_state["all_summaries"]:
                del st.session_state["all_summaries"][sid]
            delete_item_from_db("summary", sid)
            active = st.session_state["active_summary_id"]
            if active == sid:
                remaining = list(st.session_state["all_summaries"].keys())
                st.session_state["active_summary_id"] = remaining[0] if remaining else ""
            save_data()

        history_dict = st.session_state["all_summaries"]
        active_id = st.session_state["active_summary_id"]
        new_action = new_summary
        select_action = lambda sid: st.session_state.update({"active_summary_id": sid})
        rename_action = lambda sid, new_title: (st.session_state["all_summaries"][sid].update({"title": new_title}), save_data())
        delete_action = delete_summary

    elif view == "planner":
        if not st.session_state["all_plans"]:
            st.session_state["all_plans"]["planner_default"] = {
                "subjects": "", "weak": "", "mood": "", "schedule": [], "title": "Untitled Plan",
            }
            st.session_state["active_planner_id"] = "planner_default"
            save_data()
        elif not st.session_state["active_planner_id"]:
            st.session_state["active_planner_id"] = list(st.session_state["all_plans"].keys())[0]

        history_dict = st.session_state["all_plans"]
        active_id = st.session_state["active_planner_id"]
        new_action = create_new_plan
        select_action = lambda pid: st.session_state.update({"active_planner_id": pid})
        rename_action = lambda pid, new_title: (st.session_state["all_plans"][pid].update({"title": new_title}), save_data())
        delete_action = lambda pid: st.session_state.update({"active_planner_id": delete_plan(pid, st.session_state["active_planner_id"])})

    def logout_action():
        save_data()
        st.session_state["logged_in"]         = False
        st.session_state["username"]           = ""
        st.session_state["auth_view"]          = "welcome"
        st.session_state["current_view"]       = "landing"
        st.session_state["all_chats"]          = {}
        st.session_state["all_summaries"]      = {}
        st.session_state["all_plans"]          = {}
        st.session_state["active_chat_id"]     = ""
        st.session_state["active_summary_id"]  = ""
        st.session_state["active_planner_id"]  = ""
        st.session_state["nav_history_stack"]  = []
        st.rerun()

    # Render vertical navigation sidebar (handles profile, nav buttons, and active history)
    render_sidebar(
        active_view=view,
        on_change=_change_view,
        logged_in=True,
        username=username,
        email=email,
        history_dict=history_dict,
        active_id=active_id,
        new_action=new_action,
        select_action=select_action,
        rename_action=rename_action,
        delete_action=delete_action,
        logout_action=logout_action
    )

    # Render main content area strictly adhering to [Title -> Subtitle -> Primary Action -> Content]
    if view == "welcome_hub":
        render_page_header(
            title=f"Welcome back, {username}! 👋",
            subtitle="Ready to fly through your studies today? Select a tool from the sidebar or click a quick action card."
        )
        
        c1, c2, c3 = st.columns(3)
        with c1:
            with render_card("💬 Chat Assistant", "Get technical explanations on programming or computer science theory."):
                render_action_button("Open Chat →", "hub_go_chat", lambda: _change_view("chat"))
        with c2:
            with render_card("📝 Notes Summarizer", "Instantly condense textbook fragments and lecture transcripts."):
                render_action_button("Open Summarizer →", "hub_go_summary", lambda: _change_view("summary"))
        with c3:
            with render_card("📅 Adaptive Planner", "Plan study blocks and motivation checkers optimized for your energy."):
                render_action_button("Open Planner →", "hub_go_planner", lambda: _change_view("planner"))
        
        st.write("")
        st.write("")
        with render_card("💡 Empathy study tips", "Suggestions for maintaining healthy study routines"):
            st.markdown(
                """* **Consistent scheduling beats cramming:** Short, spaced review sessions boost semantic memory retention.
                * **Listen to your mood:** If you feel negative or stressed, pivot to Gentle study block structures.
                * **Prioritize sleep:** Memory consolidation occurs during deep sleep. Sacrificing sleep is a net negative.""",
                unsafe_allow_html=True
            )

    elif view == "chat":
        render_page_header(
            title="💬 Ask your Technical Questions",
            subtitle="Get simple explanations, algorithmic advice, and formatted code blocks."
        )

        active_chat = st.session_state["all_chats"].get(active_id, [])

        def handle_send(chat_input):
            with st.spinner("Thinking..."):
                ans, sentiment = get_chat_response(chat_input, active_chat)

            if sentiment["compound"] >= 0.05:
                st.toast("Positive vibes! 😊")
            elif sentiment["compound"] <= -0.05:
                st.toast("You seem stressed. Take it easy! 💙")

            active_chat.append({"role": "user",      "text": chat_input})
            active_chat.append({"role": "assistant", "text": ans})
            st.session_state["all_chats"][active_id] = active_chat
            save_chat_immediately(active_id, active_chat, username)
            st.rerun()

        # Render custom scrollable bubble viewport followed by compact bottom chat form
        render_chat_ui(active_chat, active_id, handle_send)

    elif view == "summary":
        render_page_header(
            title="📝 Notes Summarizer",
            subtitle="Condense raw transcripts and slides into structured study briefs."
        )

        node = st.session_state["all_summaries"].get(active_id)

        # Primary Action Card containing config forms
        with render_card(title="Generate Summary", subtitle="Specify input transcript and options"):
            raw_text = render_input_group("Input transcript / slides:", key="raw_summary_input", value=node["text"], type="textarea", placeholder="Paste your lecture notes here...")
            if raw_text.strip():
                st.caption(f"📄 Input: {len(raw_text.split())} words")

            cc, cf = st.columns(2)
            with cc:
                target_words = render_input_group("Target word count:", key="summary_wc", value=str(node.get("word_count", 80)), type="number", min_val=10, max_val=1000)
            with cf:
                fmt_options = ["Plain Text", "Bullet Points", "Essay", "Letter", "Email"]
                fmt = render_input_group("Output format:", key="summary_fmt", value=node.get("format_style", "Plain Text"), type="select", options=fmt_options)

            node["text"]         = raw_text
            node["word_count"]   = target_words
            node["format_style"] = fmt

            if render_action_button("✨ Generate Summary", key="gen_sum_btn"):
                if len(raw_text.strip()) < 20:
                    st.warning("Please paste more text first.")
                else:
                    with st.spinner(f"Generating ~{target_words} word {fmt} summary..."):
                        formatted, engine = get_summary(
                            raw_text, target_words, fmt, username
                        )
                        node["summary"]     = formatted
                        node["raw_summary"] = formatted
                        node["engine"]      = engine
                        if node["title"].startswith("Untitled"):
                            node["title"] = raw_text[:18] + "..."
                        st.session_state["all_summaries"][active_id] = node
                        save_data()
                        st.rerun()

        # Content Section
        if node["summary"]:
            st.write("")
            with render_card(title=node.get("title", "Summary Output")):
                st.markdown(node["summary"])
                
                # Document operations panel
                mc1, mc2 = st.columns(2)
                with mc1:
                    if st.button("📋  Copy Summary", key="cp_sum", use_container_width=True):
                        st.session_state["show_copy_summary"] = True
                        st.rerun()
                with mc2:
                    if st.button("↗  Share Summary", key="sh_sum", use_container_width=True):
                        st.toast("Link copied!")
                        st.rerun()

                if st.session_state.get("show_copy_summary", False):
                    st.code(node.get("raw_summary", node["summary"]), language="text")
                    if st.button("✕ Close Copy Tray", key="close_copy_sum"):
                        st.session_state["show_copy_summary"] = False
                        st.rerun()

    elif view == "planner":
        render_page_header(
            title="📅 Adaptive Study Planner",
            subtitle="Schedules customized to your stress levels to safeguard your wellbeing."
        )

        plan = st.session_state["all_plans"].get(active_id)

        # Primary Action Card containing scheduler settings form
        with render_card(title="Schedule Setup", subtitle="Enter schedule hours and motivational checks"):
            with st.form("planner_form", border=False):
                c1, c2 = st.columns(2)
                with c1:
                    subj = render_input_group("Subjects (comma separated):", key="plan_subj", value=plan["subjects"])
                    start_time = st.time_input("Start Time:", datetime.time(9, 0))
                with c2:
                    weak = render_input_group("Your Weak Subject:", key="plan_weak", value=plan["weak"])
                    end_time = st.time_input("End Time:", datetime.time(12, 0))

                mood = render_input_group("How are you feeling right now?", key="plan_mood", value=plan["mood"])
                gen = st.form_submit_button("🗓️  Generate My Schedule", use_container_width=True)

            if gen:
                res = generate_schedule(
                    active_id, 
                    subj, 
                    weak, 
                    start_time, 
                    end_time, 
                    mood
                )
                if res != "OK":
                    st.error(res)
                else:
                    st.rerun()

        # Content Section (Mood Check-in, Motivation, Table)
        if plan.get("schedule"):
            st.write("")
            mood_cat       = plan.get("mood_cat", "neutral")
            checkin        = plan.get("checkin", "")
            
            checkin_bg = {"positive": "#F0FDF4", "neutral": "#EFF6FF", "negative": "#FEF2F2"}
            checkin_border = {"positive": "#DCFCE7", "neutral": "#DBEAFE", "negative": "#FEE2E2"}
            checkin_text = {"positive": "#15803D", "neutral": "#1D4ED8", "negative": "#B91C1C"}
            checkin_icon   = {"positive": "🌟", "neutral": "🎯", "negative": "💙"}

            with render_card():
                st.markdown(
                    f"""<div style='background:{checkin_bg[mood_cat]};border:1px solid {checkin_border[mood_cat]};
                    border-radius:12px;padding:1.25rem;margin-bottom:1rem;'>
                    <span style='font-size:1.1rem;font-weight:700;color:{checkin_text[mood_cat]};'>{checkin_icon[mood_cat]} Mood Check-in</span>
                    <p style='color:{checkin_text[mood_cat]};margin:6px 0 0;font-size:0.95rem;line-height:1.5;'>{checkin}</p>
                </div>""",
                    unsafe_allow_html=True,
                )
                
                st.markdown(
                    f"""<div style='background:#FFFBEB;border:1px solid #FEF3C7;border-left:4px solid #F59E0B;
                    border-radius:12px;padding:1.25rem;margin-bottom:1rem;'>
                    <span style='color:#B45309;font-weight:700;'>✨ Your Motivation</span>
                    <p style='color:#92400E;margin:6px 0 0;font-size:0.95rem;font-style:italic;'>"{plan['boost']}"</p>
                </div>""",
                    unsafe_allow_html=True,
                )

                mode = plan.get("mode", "classic")
                if mode == "gentle":
                    st.warning("🌙 Gentle Mode: 20 min focus + 10 min recovery. You've got this, one small step at a time.")
                elif mode == "mellow":
                    st.warning("🌙 Mellow Mode: 25 min focus + 10 min recovery. Taking care of yourself is part of studying.")
                else:
                    st.success("⚡ Classic Mode: 25 min focus + 5 min breaks. You're sharp — let's make every session count!")

                total    = plan.get("total_minutes", 0)
                sessions = len(plan["schedule"])
                
                st.markdown(
                    f"""<div style='display:flex;gap:12px;margin:1.25rem 0;'>
                    <div style='background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:0.75rem 1rem;flex:1;text-align:center;'>
                        <div style='color:#2563EB;font-size:1.4rem;font-weight:800;'>{sessions}</div>
                        <div style='color:#64748B;font-size:0.8rem;font-weight:500;'>Sessions</div>
                    </div>
                    <div style='background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:0.75rem 1rem;flex:1;text-align:center;'>
                        <div style='color:#10B981;font-size:1.4rem;font-weight:800;'>{total}</div>
                        <div style='color:#64748B;font-size:0.8rem;font-weight:500;'>Total Minutes</div>
                    </div>
                    <div style='background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:0.75rem 1rem;flex:1;text-align:center;'>
                        <div style='color:#F59E0B;font-size:1.4rem;font-weight:800;'>{plan["schedule"][0]["break_len"]}</div>
                        <div style='color:#64748B;font-size:0.8rem;font-weight:500;'>Break Mins</div>
                    </div>
                </div>""",
                    unsafe_allow_html=True,
                )

                st.markdown("<h4 style='color:#0F172A;font-weight:700;margin-top:1.5rem;'>📋 Your Schedule</h4>", unsafe_allow_html=True)
                table_rows = ""
                for s in plan["schedule"]:
                    highlight = "#FFFBEB" if s["is_weak"] else "#FFFFFF"
                    badge = (
                        " <span style='background:#FEF3C7;color:#D97706;font-size:0.7rem;padding:2px 6px;"
                        "border-radius:4px;font-weight:700;'>WEAK</span>"
                        if s["is_weak"] else ""
                    )
                    table_rows += (
                        f"<tr style='border-bottom:1px solid #E2E8F0;background:{highlight};'>"
                        f"<td style='padding:10px 12px;color:#64748B;font-size:0.85rem;'>#{s['session']}</td>"
                        f"<td style='padding:10px 12px;color:#2563EB;font-weight:700;white-space:nowrap;'>{s['start']}</td>"
                        f"<td style='padding:10px 12px;color:#2563EB;font-weight:700;white-space:nowrap;'>{s['end']}</td>"
                        f"<td style='padding:10px 12px;color:#0F172A;font-weight:600;'>{s['subject']}{badge}</td>"
                        f"<td style='padding:10px 12px;color:#64748B;font-size:0.88rem;'>☕ {s['break_len']} min → {s['resume']}</td>"
                        f"</tr>"
                    )
                st.markdown(
                    f"""<div style='overflow-x:auto;border-radius:12px;border:1px solid #E2E8F0;margin-top:0.5rem;'>
                    <table style='width:100%;border-collapse:collapse;font-family:inherit;'>
                        <thead>
                            <tr style='background:#F8FAFC;border-bottom:2px solid #E2E8F0;'>
                                <th style='padding:10px 12px;text-align:left;color:#64748B;font-size:0.8rem;font-weight:600;text-transform:uppercase;'>#</th>
                                <th style='padding:10px 12px;text-align:left;color:#64748B;font-size:0.8rem;font-weight:600;text-transform:uppercase;'>Start</th>
                                <th style='padding:10px 12px;text-align:left;color:#64748B;font-size:0.8rem;font-weight:600;text-transform:uppercase;'>End</th>
                                <th style='padding:10px 12px;text-align:left;color:#64748B;font-size:0.8rem;font-weight:600;text-transform:uppercase;'>Subject</th>
                                <th style='padding:10px 12px;text-align:left;color:#64748B;font-size:0.8rem;font-weight:600;text-transform:uppercase;'>Break</th>
                            </tr>
                        </thead>
                        <tbody>{table_rows}</tbody>
                    </table>
                </div>""",
                    unsafe_allow_html=True,
                )

                if mood_cat == "negative":
                    st.markdown(
                        """<div style='background:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:1.25rem;margin-top:1.5rem;'>
                        <span style='color:#B91C1C;font-weight:700;'>💙 A Note For You</span>
                        <p style='color:#991B1B;margin:6px 0 0;font-size:0.9rem;line-height:1.5;'>
                        Remember — it's okay to not be okay. If at any point you feel overwhelmed,
                        step away from studying. Your mental health always comes first.
                        Even completing just one session today is a win. I'm proud of you for showing up. 🤍
                        </p>
                    </div>""",
                        unsafe_allow_html=True,
                    )
