document.addEventListener("DOMContentLoaded", function () {
    // 1. Inject Master CSS & Theme Variables
    const styleBlock = document.createElement("style");
    styleBlock.innerHTML = `
        :root {
            --bg-color: #0f1115;
            --surface-color: #161920;
            --surface-border: #21262d;
            --text-main: #c9d1d9;
            --text-muted: #8b949e;
            --link-blue: #58a6ff;
            --link-yellow: #e3b341;
            --topbar-height: 56px;
            --sidebar-width: 260px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: var(--bg-color); color: var(--text-main); display: flex; flex-direction: column; min-height: 100vh; }

        .topbar { position: fixed; top: 0; left: 0; right: 0; height: var(--topbar-height); background-color: var(--surface-color); border-bottom: 1px solid var(--surface-border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 100; }
        .topbar-brand { font-weight: 600; font-size: 1.1rem; color: var(--text-main); display: flex; align-items: center; gap: 10px; }
        .topbar-links { display: flex; gap: 20px; list-style: none; }
        .topbar-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
        .topbar-links a:hover { color: var(--link-blue); }

        .app-container { display: flex; margin-top: var(--topbar-height); flex: 1; }

        .sidebar { width: var(--sidebar-width); background-color: var(--surface-color); border-right: 1px solid var(--surface-border); padding: 20px 10px; position: fixed; top: var(--topbar-height); bottom: 0; left: 0; overflow-y: auto; }
        .sidebar-section { margin-bottom: 24px; }
        .sidebar-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); padding: 0 12px 8px; }
        .sidebar-menu { list-style: none; }

        .sidebar-menu li a { display: flex; align-items: center; gap: 10px; padding: 10px 12px; text-decoration: none; border-radius: 6px; font-size: 0.9rem; transition: background-color 0.2s, color 0.2s; }

        /* External Links -> Blue */
        .sidebar-menu li a.external-link { color: var(--link-blue); }
        .sidebar-menu li a.external-link:hover { background-color: rgba(88, 166, 255, 0.1); color: #79c0ff; }

        /* Internal / Repository / Page Links -> Yellow */
        .sidebar-menu li a.internal-link { color: var(--link-yellow); }
        .sidebar-menu li a.internal-link:hover { background-color: rgba(227, 179, 65, 0.1); color: #f1e05a; }

        .sidebar-menu li.active a.internal-link,
        .sidebar-menu li.active a.external-link {
            background-color: rgba(227, 179, 65, 0.15);
            color: #f1e05a;
            font-weight: 500;
        }

        .main-content { margin-left: var(--sidebar-width); flex: 1; padding: 40px; max-width: 1000px; }
        h1 { font-size: 1.8rem; margin-bottom: 12px; }
        p { color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }
        .card { background-color: var(--surface-color); border: 1px solid var(--surface-border); border-radius: 8px; padding: 20px; margin-top: 20px; }
        .changelog-version { font-size: 1.1rem; font-weight: 600; color: var(--link-yellow); margin-bottom: 6px; }
        .changelog-date { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; }
        .changelog-list { padding-left: 20px; color: var(--text-main); }
        .changelog-list li { margin-bottom: 6px; }

        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 20px; }
        }
    `;
    document.head.appendChild(styleBlock);

    // 2. Determine Current Page File Name & Topbar Title
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const customTitle = document.currentScript?.getAttribute('data-title') || "⚡ Kodyris-Blackforge";

    // 3. Inject Topbar
    const header = document.createElement("header");
    header.className = "topbar";
    header.innerHTML = `
        <div class="topbar-brand">
            <span>⚡</span> ${customTitle}
        </div>
        <ul class="topbar-links">
            <li><a href="https://github.com/Kodyris-Blackforge" target="_blank">Organization GitHub</a></li>
            <li><a href="#">Docs</a></li>
        </ul>
    `;
    document.body.prepend(header);

    // 4. Ensure App Container Wrapper Exists
    let appContainer = document.querySelector(".app-container");
    if (!appContainer) {
        appContainer = document.createElement("div");
        appContainer.className = "app-container";
        const mainContent = document.querySelector("main") || document.body.children[1];
        if (mainContent) {
            appContainer.appendChild(mainContent);
        }
        document.body.appendChild(appContainer);
    }

    // 5. Inject the Exact Unified Sidebar Structure
    const nav = document.createElement("nav");
    nav.className = "sidebar";
    nav.innerHTML = `
        <div class="sidebar-section">
            <div class="sidebar-title">Overview</div>
            <ul class="sidebar-menu">
                <li id="nav-index"><a href="index.html" class="internal-link">Home Portal</a></li>
                <li><a href="#" class="internal-link">Projects</a></li>
            </ul>
        </div>
        <div class="sidebar-section">
            <div class="sidebar-title">Repositories</div>
            <ul class="sidebar-menu">
                <li><a href="#" class="external-link">Modded DataPacks</a></li>
                <li><a href="#" class="external-link">Custom Roblox Loader</a></li>
                <li><a href="#" class="external-link">Project &lt;CLASSIFIED&gt;</a></li>
                <li><a href="#" class="external-link">Project RCM Rewrite</a></li>
                <li id="nav-bot"><a href="Community-Management-bot.html" class="internal-link">Community Management Bot</a></li>
            </ul>
        </div>
    `;
    appContainer.prepend(nav);

    // 6. Automatically Highlight Active Sidebar Link based on current file name
    if (currentPath === "" || currentPath === "index.html") {
        document.getElementById("nav-index")?.classList.add("active");
    } else if (currentPath.includes("Community-Management-bot")) {
        document.getElementById("nav-bot")?.classList.add("active");
    }
});
