(() => {
    // Cegah pemasangan pemutar dua kali pada halaman yang sama.
    if (window.musicControllerReady) return;
    window.musicControllerReady = true;

    const isSyairPage = window.location.pathname
        .toLowerCase()
        .endsWith("syair-lagu.html");

    const player = document.createElement("iframe");
const musicPath = "music.html";
player.src = new URL(
    musicPath,
    window.location.href
).href;

    player.title = "Pemutar Musik";
    player.setAttribute("allow", "autoplay");

    player.style.cssText = `
        position: fixed;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        border: 0;
        left: 0;
        bottom: 0;
    `;

    document.body.appendChild(player);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "tombol-musik";
    button.textContent = "▶ Aktifkan Musik";

    button.className = "tombol-musik";

    button.style.cssText = `
        display: block;
        position: static;
        width: 100%;
        box-sizing: border-box;
        margin: 18px 0 8px;
        padding: 12px 10px;
        border: 1px solid #00a6a6;
        border-radius: 25px;
        background: linear-gradient(135deg, #009c9c, #007477);
        color: white;
        font-family: inherit;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
        transition: all 0.25s ease;
    `;
    
    button.addEventListener("mouseenter", () => {
    button.style.background =
        "linear-gradient(135deg, #00b8b8, #007477)";

    button.style.transform = "translateY(-3px)";

    button.style.boxShadow =
        "0 7px 14px rgba(0, 0, 0, 0.25)";
});

button.addEventListener("mouseleave", () => {
    button.style.background =
        "linear-gradient(135deg, #009c9c, #007477)";

    button.style.transform = "translateY(0)";

    button.style.boxShadow =
        "0 4px 10px rgba(0, 0, 0, 0.18)";
});

// Cari kolom Tautan eksternal.
const sidebar = document.querySelector(
    "table tr:nth-child(3) td:last-child"
);

if (sidebar) {
    sidebar.appendChild(button);
} else {
    button.style.position = "fixed";
    button.style.right = "16px";
    button.style.bottom = "16px";
    button.style.width = "auto";
    button.style.zIndex = "9999";

    document.body.appendChild(button);
}    
    
    
    let playing = false;

    button.addEventListener("click", () => {
        player.contentWindow.postMessage(
            { type: "MUSIC_PLAY" },
            window.location.origin
        );
    });

    window.addEventListener("message", event => {
        if (event.origin !== window.location.origin) return;

        const data = event.data;

        if (!data || data.type !== "MUSIC_STATE") return;

        playing = data.playing;

        button.textContent = playing
            ? "⏸ Jeda Musik"
            : "▶ Putar Musik";
    });

    player.addEventListener("load", () => {
        player.contentWindow.postMessage(
            {
                type: "MUSIC_TRACK",
                track: isSyairPage ? "syair" : "normal"
            },
            window.location.origin
        );
    });
        // Simpan posisi musik sebelum pindah halaman.
    window.addEventListener("pagehide", () => {
        try {
            player.contentWindow.postMessage(
                { type: "MUSIC_SAVE_STATE" },
                window.location.origin
            );
        } catch (error) {
            console.log("Posisi musik disimpan.");
        }
    });
})();