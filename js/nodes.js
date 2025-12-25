function getSocketPoint(socket, boardBox) {
    const r = socket.getBoundingClientRect();
    const isOutput = socket.classList.contains('output');

    const SOCKET_RADIUS = 5;   // 10px / 2
    const SOCKET_OFFSET = 8;  // alterado no olho mesmo

    const x = isOutput
        ? r.right - boardBox.left + SOCKET_OFFSET + SOCKET_RADIUS
        : r.left  - boardBox.left - SOCKET_OFFSET - SOCKET_RADIUS;

    const y = r.top + r.height / 2 - boardBox.top;

    return { x, y };
}

function drawConnections() {
    const svg = document.querySelector('.connections');
    const board = document.querySelector('.board');
    if (!svg || !board) return;

    svg.innerHTML = '';
    const boardBox = board.getBoundingClientRect();

    const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
    );
    svg.appendChild(defs);

    let gradIndex = 0;

    document.querySelectorAll('.socket[data-connect]').forEach(from => {
        const to = document.getElementById(from.dataset.connect);
        if (!to) return;

        const p1 = getSocketPoint(from, boardBox);
        const p2 = getSocketPoint(to, boardBox);

        const dx = Math.max(Math.abs(p2.x - p1.x) * 0.6, 40);

        // cores dos sockets
        const colorFrom = getComputedStyle(from, '::before').backgroundColor;
        const colorTo   = getComputedStyle(to,   '::before').backgroundColor;

        // gradient único
        const gradId = `grad-${gradIndex++}`;

        const gradient = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "linearGradient"
        );

        gradient.setAttribute("id", gradId);
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");
        gradient.setAttribute("x1", p1.x);
        gradient.setAttribute("y1", p1.y);
        gradient.setAttribute("x2", p2.x);
        gradient.setAttribute("y2", p2.y);

        const stop1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "stop"
        );
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", colorFrom);

        const stop2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "stop"
        );
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", colorTo);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);

        // path
        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        path.setAttribute(
            "d",
            `M ${p1.x} ${p1.y}
             C ${p1.x + dx} ${p1.y},
               ${p2.x - dx} ${p2.y},
               ${p2.x} ${p2.y}`
        );

        path.setAttribute("stroke", `url(#${gradId})`);
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");

        svg.appendChild(path);
    });
}


window.addEventListener('load', drawConnections);
window.addEventListener('resize', drawConnections);
