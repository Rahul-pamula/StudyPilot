CUSTOM_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

#MainMenu { display:none !important; }
footer { display:none !important; }
header { display:none !important; }
[data-testid="stToolbar"] { display:none !important; }
[data-testid="stDecoration"] { display:none !important; }
[data-testid="stStatusWidget"] { display:none !important; }
[data-testid="collapsedControl"] { display:none !important; }
.viewerBadge_container__1QSob { display:none !important; }
div[data-testid="stSidebarNav"] { display:none !important; }
[data-testid="stSidebarHeader"] { display:none !important; }
section[data-testid="stSidebar"] > div:first-child { padding-top:1rem !important; }

/* Global Styling */
* { font-family:'Plus Jakarta Sans',sans-serif !important; }
.stApp { background:#FFFFFF !important; color:#0F172A !important; }
[data-testid="stSidebar"] { background:#F8FAFC !important; border-right:1px solid #E2E8F0 !important; }

/* Typography */
h1, h2, h3, h4, h5, h6, p, label, span { color:#0F172A !important; }
p, li { color:#64748B !important; }

/* Sidebar Specifics */
[data-testid="stSidebar"] p, [data-testid="stSidebar"] span, [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3 {
    color:#64748B !important;
}

/* Form inputs & selections */
.stTextInput>div>div>input, .stTextArea>div>div>textarea,
.stSelectbox>div>div>div, .stNumberInput>div>div>input {
    background:#FFFFFF !important; color:#0F172A !important;
    border:1px solid #E2E8F0 !important; border-radius:10px !important;
    font-size:0.95rem !important;
    padding:8px 12px !important;
}
.stTextInput>div>div>input:focus, .stTextArea>div>div>textarea:focus {
    border-color:#2563EB !important;
    box-shadow: 0 0 0 1px #2563EB !important;
}

/* Chat Bubbles */
.chat-msg {
    padding:0.85rem 1.25rem;
    border-radius:14px;
    font-size:0.95rem;
    line-height:1.6;
    word-wrap:break-word !important;
    overflow-wrap:break-word !important;
    margin-bottom:8px;
}
.user-bubble {
    background:linear-gradient(135deg,#2563EB,#3B82F6) !important;
    color:#FFFFFF !important;
    border-bottom-right-radius:2px !important;
    box-shadow: 0 4px 12px rgba(37,99,235,0.15) !important;
}
.user-bubble p, .user-bubble h1, .user-bubble h2, .user-bubble h3, .user-bubble strong, .user-bubble span {
    color:#FFFFFF !important;
}
.bot-bubble {
    background:#F8FAFC !important;
    color:#0F172A !important;
    border-bottom-left-radius:2px !important;
    border:1px solid #E2E8F0 !important;
}
.bot-bubble p  { color:#0F172A !important; margin:0.3rem 0 !important; }
.bot-bubble strong { color:#2563EB !important; font-weight:700 !important; }
.bot-bubble em { color:#6D28D9 !important; }
.bot-bubble h1,.bot-bubble h2,.bot-bubble h3,.bot-bubble h4 { color:#0F172A !important; margin:0.5rem 0 0.2rem !important; }
.bot-bubble ul, .bot-bubble ol { padding-left:1.3rem !important; margin:0.3rem 0 !important; }
.bot-bubble li { color:#64748B !important; margin:0.2rem 0 !important; }
.bot-bubble code { background:#E2E8F0 !important; color:#0F172A !important; padding:2px 5px !important; border-radius:4px !important; font-size:0.88em !important; }
.bot-bubble pre { background:#1E293B !important; border:1px solid #E2E8F0 !important; border-radius:8px !important; padding:0.6rem 1rem !important; overflow-x:auto !important; margin:0.4rem 0 !important; }
.bot-bubble pre code { background:transparent !important; color:#F1F5F9 !important; padding:0 !important; }
.bot-bubble blockquote { border-left:3px solid #2563EB !important; background:#F1F5F9 !important; padding:0.4rem 0.8rem !important; border-radius:0 6px 6px 0 !important; margin:0.4rem 0 !important; color:#2563EB !important; }

/* Custom SaaS Cards */
.saas-card {
    background:#FFFFFF !important;
    border:1px solid #E2E8F0 !important;
    border-radius:12px !important;
    padding:20px !important; /* Enforced 20px padding */
    box-shadow:0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05) !important; /* Soft light shadow */
    transition: all 0.2s ease-in-out !important;
    margin-bottom:16px !important; /* 16px spacing between elements */
}
.saas-card:hover {
    border-color:#CBD5E1 !important;
    box-shadow:0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05) !important;
}

/* Custom Spacing Helpers */
.section-gap {
    margin-bottom: 40px !important;
}
.element-gap {
    margin-bottom: 16px !important;
}

/* Navigations & Buttons */
.navbar-wrapper { padding:0.2rem; margin-bottom:0.5rem; }
.navbar-wrapper button { background:#FFFFFF !important; border:1px solid #E2E8F0 !important; color:#64748B !important; font-weight:600 !important; }
.navbar-wrapper button:hover { background:#F8FAFC !important; color:#0F172A !important; border-color:#CBD5E1 !important; }

.stButton>button {
    background:#FFFFFF !important; color:#0F172A !important;
    border-radius:10px !important; border:1px solid #E2E8F0 !important;
    font-weight:600 !important; height:2.4em !important;
    transition:all 0.15s !important;
}
.stButton>button:hover { background:#2563EB !important; color:#FFFFFF !important; border-color:#2563EB !important; }

button[key="nav_back"] {
    background:#FFFFFF !important; border:1px solid #E2E8F0 !important;
    color:#2563EB !important; font-weight:700 !important;
    font-size:0.9rem !important; border-radius:10px !important;
}
button[key="nav_back"]:hover { background:#F8FAFC !important; color:#1D4ED8 !important; border-color:#2563EB !important; }

button[key="profile_btn"] { color:#2563EB !important; font-weight:700 !important; text-align:left !important; background:#F8FAFC !important; border-color:#E2E8F0 !important; }
button[key="profile_btn"]:hover { background:#EFF6FF !important; color:#1D4ED8 !important; }

button[key="logout_btn"] { color:#DC2626 !important; border-color:#FEE2E2 !important; background:#FEF2F2 !important; }
button[key="logout_btn"]:hover { background:#DC2626 !important; color:#FFFFFF !important; border-color:#DC2626 !important; }

button[key^="sel_"] {
    background:transparent !important; border:none !important;
    color:#64748B !important; font-size:0.82rem !important;
    font-weight:500 !important; height:2em !important;
    min-height:0 !important; padding:4px 8px !important;
    text-align:left !important; justify-content:flex-start !important;
    box-shadow:none !important; border-radius:7px !important;
}
button[key^="sel_"]:hover { background:#F1F5F9 !important; color:#0F172A !important; }

button[key^="dots_"] {
    background:transparent !important; color:#94A3B8 !important;
    border:none !important; font-size:1.1rem !important;
    height:2em !important; padding:0 4px !important;
    box-shadow:none !important; min-height:0 !important;
}
button[key^="dots_"]:hover { color:#475569 !important; background:#E2E8F0 !important; border-radius:5px !important; }

button[key^="ren_"] {
    background:#FFFFFF !important; border:1px solid #E2E8F0 !important;
    color:#475569 !important; font-size:0.75rem !important;
    height:1.6em !important; min-height:0 !important;
    border-radius:6px !important; font-weight:500 !important;
    padding:0 6px !important; box-shadow:none !important;
}
button[key^="ren_"]:hover { background:#F8FAFC !important; color:#2563EB !important; border-color:#2563EB !important; }

button[key^="del_"] {
    background:#FFFFFF !important; border:1px solid #FEE2E2 !important;
    color:#DC2626 !important; font-size:0.75rem !important;
    height:1.6em !important; min-height:0 !important;
    border-radius:6px !important; font-weight:500 !important;
    padding:0 6px !important; box-shadow:none !important;
}
button[key^="del_"]:hover { background:#FEF2F2 !important; color:#DC2626 !important; border-color:#DC2626 !important; }

button[key^="cp_"], button[key^="sh_"] {
    background:#FFFFFF !important; border:1px solid #E2E8F0 !important;
    color:#475569 !important; font-size:0.8rem !important;
    height:1.8em !important; min-height:0 !important;
    border-radius:6px !important; font-weight:500 !important;
    padding:0 10px !important; box-shadow:0 4px 12px rgba(0,0,0,0.05) !important;
    margin-bottom:2px !important;
}
button[key^="cp_"]:hover, button[key^="sh_"]:hover { background:#2563EB !important; color:#FFFFFF !important; border-color:#2563EB !important; }

button[key^="new_"] {
    background:#EFF6FF !important; color:#2563EB !important;
    border:1px dashed #3B82F6 !important; font-weight:700 !important;
    font-size:0.82rem !important; height:2em !important;
}
button[key^="new_"]:hover { background:#2563EB !important; color:#FFFFFF !important; border-color:#2563EB !important; border-style:solid !important; }

[data-testid="stForm"] { border:none !important; background:transparent !important; padding:0 !important; }
.stAlert { border-radius:10px !important; border: 1px solid #E2E8F0 !important; }
</style>
"""
