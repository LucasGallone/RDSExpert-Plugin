/**
 * ************************************************
 * RDS Expert Plugin for FM-DX Webserver (v1.0)
 * ************************************************
 */

(() => {
    const plugin_name = 'RDSExpert';
    const plugin_version = '1.0';

    const currentProtocol = window.location.protocol;
    const currentOrigin = window.location.origin;
    let rdsExpertBaseUrl = (currentProtocol === 'https:') 
        ? 'https://lucasgallone.github.io/RDSExpert/' 
        : 'http://rdsexpert.fmdx-webserver.nl:8080/';

    const fullRdsUrl = `${rdsExpertBaseUrl}?url=${currentOrigin}`;

    // --- Window dimensions at startup (You can edit the values as you wish) ---
    // It is not recommended to use a value lower than 768 for the window width as this may break the display of certain values such as RT or the Groups Analyzer!
    const defW = 768;  // Window width
    const defH = 780;  // Window height
    const margin = 0; // Window margin in relation to the screen

    let isVisible = false;
    let container = null;

    const rdsExpCss = `
        #rds-expert-container {
            position: fixed; 
            z-index: 9999; 
            background: var(--color-bg, #111); 
            border: 1px solid var(--color-3, #444); 
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8); 
            display: none; 
            flex-direction: column; 
            overflow: hidden;
            width: ${defW}px; 
            height: ${defH}px; 
            top: ${margin}px;
            /* Right-side placement by default at startup */
            left: calc(100vw - ${defW}px - ${margin}px);
            min-width: 400px;
            min-height: 300px;
        }

        /* Window movement bar */
        .rds-exp-drag-zone { 
            height: 18px; 
            background: var(--color-2, #252525); 
            cursor: move; 
            width: 100%; 
            border-bottom: 1px solid var(--color-3, #333); 
            flex-shrink: 0; 
        }
        
        /* Closure button */
        .rds-exp-close-circle {
            position: absolute; top: 25px; right: 15px; z-index: 10001; cursor: pointer;
            background: rgba(0,0,0,0.6); color: var(--color-text, #ccc); 
            width: 26px; height: 26px; line-height: 24px;
            text-align: center; border-radius: 50%; font-size: 14px;
            border: 1px solid var(--color-3, rgba(255,255,255,0.2));
            backdrop-filter: blur(4px);
        }
        .rds-exp-close-circle:hover { background: #e74c3c; color: white; }

        #rds-expert-iframe { flex-grow: 1; border: none; background: #0b0e14; width: 100%; height: 100%; }

        .rds-exp-resizer {
            width: 20px; height: 20px; position: absolute; right: 0; bottom: 0;
            cursor: nwse-resize; background: linear-gradient(135deg, transparent 50%, var(--color-3, #444) 50%); z-index: 10002;
        }

        /* --- Sidebar button style --- */
        #rds-expert-button i { 
            color: var(--color-4);
            opacity: 1; 
        }
        #rds-expert-button.active i { 
            color: var(--color-4);
        }
    `;

    function createUI() {
        if (container) return;
        container = document.createElement('div');
        container.id = 'rds-expert-container';
        container.innerHTML = `
            <div class="rds-exp-drag-zone"></div>
            <div class="rds-exp-close-circle" title="Close">✕</div>
            <iframe id="rds-expert-iframe" src="${fullRdsUrl}"></iframe>
            <div class="rds-exp-resizer"></div>
        `;
        document.body.appendChild(container);
        container.querySelector('.rds-exp-close-circle').onclick = togglePlugin;

        setupDrag(container.querySelector('.rds-exp-drag-zone'), container);
        setupResize(container.querySelector('.rds-exp-resizer'), container);
    }

    function togglePlugin() {
        isVisible = !isVisible;
        const $btn = $('#rds-expert-button');

        if (isVisible) {
            createUI();
            // Forced reset of the window position and size at each startup
            const $cont = $('#rds-expert-container');
            $cont.css({
                'display': 'flex',
                'width': defW + 'px',
                'height': defH + 'px',
                'top': margin + 'px',
                'left': 'calc(100vw - ' + defW + 'px - ' + margin + 'px)'
            });
            $btn.addClass('active');
        } else {
            if (container) {
                container.remove();
                container = null; 
            }
            $btn.removeClass('active');
        }
    }

    function createButton(buttonId) {
        (function waitForFunction() {
            const observer = new MutationObserver((mutationsList, observer) => {
                if (typeof addIconToPluginPanel === 'function') {
                    observer.disconnect();
                    addIconToPluginPanel(buttonId, 'RDSExpert', 'solid', 'rss', 'Advanced RDS/RBDS decoder');
                    const buttonObserver = new MutationObserver(() => {
                        const $pluginButton = $(`#${buttonId}`);
                        if ($pluginButton.length > 0) {
                            $pluginButton.on('click', togglePlugin);
                            buttonObserver.disconnect();
                        }
                    });
                    buttonObserver.observe(document.body, { childList: true, subtree: true });
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        })();
        $("<style>").prop("type", "text/css").html(rdsExpCss).appendTo("head");
    }

    function setupDrag(handle, el) {
        let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
        handle.onmousedown = (e) => {
            p3 = e.clientX; p4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null; document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                p1 = p3 - e.clientX; p2 = p4 - e.clientY; p3 = e.clientX; p4 = e.clientY;
                let newTop = el.offsetTop - p2;
                if (newTop < 0) newTop = 0; 
                el.style.top = newTop + "px"; 
                el.style.left = (el.offsetLeft - p1) + "px";
            };
        };
    }

    function setupResize(handle, el) {
        handle.onmousedown = (e) => {
            e.preventDefault();
            window.onmousemove = (e) => {
                const w = e.clientX - el.offsetLeft; const h = e.clientY - el.offsetTop;
                if (w >= 350) el.style.width = w + "px"; 
                if (h >= 300) el.style.height = h + "px";
            };
            window.onmouseup = () => {
                window.onmousemove = null;
            };
        };
    }

    createButton('rds-expert-button');
})();
