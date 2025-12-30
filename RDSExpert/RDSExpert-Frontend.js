/**
 * ************************************************
 * RDS Expert Plugin for FM-DX Webserver (v1.1)
 * ************************************************
 */

(() => {
    const plugin_name = 'RDSExpert';
    const plugin_version = '1.1';

    const currentProtocol = window.location.protocol;
    const currentOrigin = window.location.origin;
    let rdsExpertBaseUrl = (currentProtocol === 'https:') 
        ? 'https://lucasgallone.github.io/RDSExpert/' 
        : 'http://rdsexpert.fmdx-webserver.nl:8080/';

    const fullRdsUrl = `${rdsExpertBaseUrl}?url=${currentOrigin}`;

    // --- Default window dimensions (Don't change these values unless you really want to, favor the placement memorization option!) ---
    const defW = 768; 
    const defH = 800; 
    const margin = 0; 

    let isVisible = false;
    let container = null;

    // CSS styling for the plugin interface, including the container, settings bar, and custom scrollbar/buttons
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
            left: calc(100vw - ${defW}px - ${margin}px);
            min-width: 400px;
            min-height: 300px;
        }

        .rds-exp-drag-zone { 
            height: 18px; 
            background: var(--color-2, #252525); 
            cursor: move; 
            width: 100%; 
            border-bottom: 1px solid var(--color-3, #333); 
            flex-shrink: 0; 
        }

        .rds-exp-settings-bar {
            background: #1a1a1a;
            padding: 5px 10px;
            display: flex;
            gap: 15px;
            font-size: 11px;
            color: #ccc;
            border-bottom: 1px solid #333;
            align-items: center;
        }
        .rds-exp-settings-bar label { cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .rds-exp-settings-bar input { cursor: pointer; margin: 0; }
        
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

        #rds-expert-button i { color: var(--color-4); opacity: 1; }
        #rds-expert-button.active i { color: var(--color-4); }
    `;

    // LocalStorage helpers to keep user preferences (placement, size, and settings)
    function savePref(key, val) { localStorage.setItem('rds_exp_' + key, val); }
    function getPref(key) { return localStorage.getItem('rds_exp_' + key); }

    // Generates the DOM elements for the plugin interface
    function createUI() {
        if (container) return;
        container = document.createElement('div');
        container.id = 'rds-expert-container';

        const remChecked = getPref('remember') === 'true' ? 'checked' : '';
        const allowChecked = getPref('allow_small') === 'true' ? 'checked' : '';

        container.innerHTML = `
            <div class="rds-exp-drag-zone"></div>
            <div class="rds-exp-settings-bar">
                <label><input type="checkbox" id="rds-rem-pos" ${remChecked}> Remember the window placement/size</label>
                <label><input type="checkbox" id="rds-allow-small" ${allowChecked}> Enable width adjustment (May break the display!)</label>
            </div>
            <div class="rds-exp-close-circle" title="Close">✕</div>
            <iframe id="rds-expert-iframe" src="${fullRdsUrl}"></iframe>
            <div class="rds-exp-resizer"></div>
        `;
        document.body.appendChild(container);
        
        container.querySelector('.rds-exp-close-circle').onclick = togglePlugin;
        container.querySelector('#rds-rem-pos').onchange = (e) => savePref('remember', e.target.checked);
        container.querySelector('#rds-allow-small').onchange = (e) => savePref('allow_small', e.target.checked);

        setupDrag(container.querySelector('.rds-exp-drag-zone'), container);
        setupResize(container.querySelector('.rds-exp-resizer'), container);
    }

    // Handles opening/closing logic. Completely removes the container when closed to stop the iframe process.
    function togglePlugin() {
        isVisible = !isVisible;
        const $btn = $('#rds-expert-button');

        if (isVisible) {
            createUI();
            const $cont = $('#rds-expert-container');
            
            // Apply saved dimensions if 'Remember' is enabled, otherwise use default values
            if (getPref('remember') === 'true' && getPref('w')) {
                $cont.css({
                    'display': 'flex',
                    'width': getPref('w') + 'px',
                    'height': getPref('h') + 'px',
                    'top': getPref('t') + 'px',
                    'left': getPref('l') + 'px'
                });
            } else {
                let safeH = Math.min(defH, window.innerHeight - margin);
                $cont.css({
                    'display': 'flex',
                    'width': defW + 'px',
                    'height': safeH + 'px',
                    'top': margin + 'px',
                    'left': 'calc(100vw - ' + defW + 'px - ' + margin + 'px)'
                });
            }
            $btn.addClass('active');
        } else {
            // Container removal to ensure background activity stops when the plugin is stopped
            if (container) {
                container.remove();
                container = null;
            }
            $btn.removeClass('active');
        }
    }

    // Plugin icon injection into the webserver header
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

    // Handles window movement with strict 4-way screen boundary protection
    function setupDrag(handle, el) {
        let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
        handle.onmousedown = (e) => {
            p3 = e.clientX; p4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null; document.onmousemove = null;
                if (getPref('remember') === 'true') {
                    savePref('t', el.offsetTop);
                    savePref('l', el.offsetLeft);
                }
            };
            document.onmousemove = (e) => {
                p1 = p3 - e.clientX; p2 = p4 - e.clientY; p3 = e.clientX; p4 = e.clientY;
                let newTop = el.offsetTop - p2;
                let newLeft = el.offsetLeft - p1;
                
                let maxTop = window.innerHeight - el.offsetHeight;
                let maxLeft = window.innerWidth - el.offsetWidth;

                // Security feature that prevents the window from exceeding the screen limits
                if (newTop < 0) newTop = 0; 
                if (newTop > maxTop) newTop = Math.max(0, maxTop);
                if (newLeft < 0) newLeft = 0;
                if (newLeft > maxLeft) newLeft = Math.max(0, maxLeft);

                el.style.top = newTop + "px"; 
                el.style.left = newLeft + "px";
            };
        };
    }

    /**
     * Handles manual resizing of the window:
     * 1. Controls width based on user preference (Locked at 768px or free).
     * 2. Enforces screen boundary security for both right and bottom edges.
     * 3. Maintains a minimum height of 300px for usability.
     * 4. Keep new dimensions if the 'Remember' option is enabled.
     */
    function setupResize(handle, el) {
        handle.onmousedown = (e) => {
            e.preventDefault();
            window.onmousemove = (e) => {
                const isAllowWidthChange = document.getElementById('rds-allow-small').checked;

                // Width management
                if (isAllowWidthChange) {
                    let w = e.clientX - el.offsetLeft;
                    let maxW = window.innerWidth - el.offsetLeft;
                    if (w >= 400 && w <= maxW) el.style.width = w + "px";
                    else if (w > maxW) el.style.width = maxW + "px";
                } else {
                    el.style.width = defW + "px";
                }

                // Height management
                let h = e.clientY - el.offsetTop;
                let maxH = window.innerHeight - el.offsetTop;
                if (h >= 300 && h <= maxH) el.style.height = h + "px";
                else if (h > maxH) el.style.height = maxH + "px";
            };
            window.onmouseup = () => {
                // Cleanup and save dimensions
                window.onmousemove = null;
                if (getPref('remember') === 'true') {
                    savePref('w', el.offsetWidth);
                    savePref('h', el.offsetHeight);
                    savePref('t', el.offsetTop);
                    savePref('l', el.offsetLeft);
                }
            };
        };
    }

    createButton('rds-expert-button');
})();