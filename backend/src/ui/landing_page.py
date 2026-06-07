import streamlit as st
from src.ui.components.stitch_components import render_sidebar, render_hero_section, render_feature_card

def render_landing_page():
    def go_to_auth():
        st.session_state["current_view"] = "login"
        st.session_state["auth_view"] = "login"
        st.rerun()

    # Render vertical sidebar for logged out state
    render_sidebar(
        active_view="landing",
        on_change=lambda view: go_to_auth(),
        logged_in=False
    )

    # Hero section (Main content)
    render_hero_section(
        title="Study Faster. Stress Less.",
        subtitle="StudyPilot is an AI-powered assistant that explains complex concepts, summarizes lectures, and adapts study schedules to your mood.",
        cta_label="Get Started Free →",
        cta_action=go_to_auth
    )

    st.write("")
    st.write("")

    # Feature grid
    st.markdown("<h3 style='text-align:center; font-weight:800; margin-bottom: 2rem; color:#0F172A;'>Built for modern, high-stress study cycles</h3>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    with c1:
        render_feature_card(
            icon="💬",
            title="AI Concept Explainer",
            description="Stuck on a tricky Python, algorithm, or engineering question? Ask anything and get simplified, clear breakdowns instantly."
        )
    with c2:
        render_feature_card(
            icon="📝",
            title="Lecture Summarizer",
            description="Paste long transcripts or raw textbook notes to get polished, concise summaries formatted to your exact length preferences."
        )
    with c3:
        render_feature_card(
            icon="📅",
            title="Adaptive Planner",
            description="Tell StudyPilot how you're feeling. It customizes Pomodoro intervals and breaks dynamically to combat burnout."
        )
