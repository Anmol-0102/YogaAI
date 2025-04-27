export function drawSegment(ctx, [mx, my], [tx, ty], color = 'aqua') {
    if (!ctx || typeof mx !== 'number' || typeof my !== 'number') return;
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(tx, ty);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
}

export function drawPoint(ctx, x, y, r = 3, color = 'red') {
    if (!ctx || typeof x !== 'number' || typeof y !== 'number') return;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
