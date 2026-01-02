// ==========================
// CONSTANTES E CACHE GLOBAL
// ==========================

const SVG_NS = "http://www.w3.org/2000/svg";

const SOCKET_RADIUS = 5;
const SOCKET_OFFSET = 8;

const svg   = document.querySelector('.connections');
const board = document.querySelector('.board');

const colorCache    = new WeakMap(); // socket -> color
const gradientCache = new Map();     // "colorA|colorB" -> gradientId

let resizeScheduled = false;


// ==========================
// UTILIDADES
// ==========================

function getSocketColor(socket) {
    if (colorCache.has(socket)) {
        return colorCache.get(socket);
    }

    const color = getComputedStyle(socket, '::before').backgroundColor;
    colorCache.set(socket, color);
    return color;
}

function getSocketPoint(socket, boardBox) {
    const rect = socket.getBoundingClientRect();
    const isOutput = socket.classList.contains('output');

    return {
        x: isOutput
            ? rect.right - boardBox.left + SOCKET_OFFSET + SOCKET_RADIUS
            : rect.left  - boardBox.left - SOCKET_OFFSET - SOCKET_RADIUS,
        y: rect.top + rect.height * 0.5 - boardBox.top
    };
}

function getOrCreateGradient(defs, p1, p2, colorFrom, colorTo) {
    const key = `${colorFrom}|${colorTo}`;

    if (gradientCache.has(key)) {
        return gradientCache.get(key);
    }

    const id = `grad-${gradientCache.size}`;

    const gradient = document.createElementNS(SVG_NS, 'linearGradient');
    gradient.setAttribute('id', id);
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradient.setAttribute('x1', p1.x);
    gradient.setAttribute('y1', p1.y);
    gradient.setAttribute('x2', p2.x);
    gradient.setAttribute('y2', p2.y);

    const stopStart = document.createElementNS(SVG_NS, 'stop');
    stopStart.setAttribute('offset', '0%');
    stopStart.setAttribute('stop-color', colorFrom);

    const stopEnd = document.createElementNS(SVG_NS, 'stop');
    stopEnd.setAttribute('offset', '100%');
    stopEnd.setAttribute('stop-color', colorTo);

    gradient.append(stopStart, stopEnd);
    defs.appendChild(gradient);

    gradientCache.set(key, id);
    return id;
}


// ==========================
// DESENHO PRINCIPAL
// ==========================

function drawConnections() {
    if (!svg || !board) return;

    // limpa tudo sem innerHTML
    svg.replaceChildren();
    gradientCache.clear();

    const boardBox = board.getBoundingClientRect();

    const defs = document.createElementNS(SVG_NS, 'defs');
    svg.appendChild(defs);

    const fragment = document.createDocumentFragment();

    const sockets = document.querySelectorAll('.socket[data-connect]');

    for (const from of sockets) {
        const to = document.getElementById(from.dataset.connect);
        if (!to) continue;

        const p1 = getSocketPoint(from, boardBox);
        const p2 = getSocketPoint(to, boardBox);

        const dx = Math.max(Math.abs(p2.x - p1.x) * 0.6, 40);

        const colorFrom = getSocketColor(from);
        const colorTo   = getSocketColor(to);

        const gradientId = getOrCreateGradient(
            defs,
            p1, p2,
            colorFrom, colorTo
        );

        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute(
            'd',
            `M ${p1.x} ${p1.y}
             C ${p1.x + dx} ${p1.y},
               ${p2.x - dx} ${p2.y},
               ${p2.x} ${p2.y}`
        );

        path.setAttribute('stroke', `url(#${gradientId})`);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');

        fragment.appendChild(path);
    }

    svg.appendChild(fragment);
}


// ==========================
// RESIZE / RAF THROTTLE
// ==========================

function scheduleDraw() {
    if (resizeScheduled) return;

    resizeScheduled = true;

    requestAnimationFrame(() => {
        resizeScheduled = false;
        drawConnections();
    });
}


// ==========================
// EVENTOS
// ==========================

window.addEventListener('DOMContentLoaded', drawConnections);
window.addEventListener('resize', scheduleDraw);