function getFPS() {
    let FPS = 0;
    let dateBefore = Date.now();

    while (Date.now < dateBefore + 1000) {
        FPS++;
    }

    return FPS;
}

function debug() {
    ctx.font = "10px Arial";
    
    ctx.fillText(`${FPS}`, 10, 10);
    ctx.fillText(`${getFPS()}`, 10, 30);
    
    ctx.fillText(`${canvas.width}`, 10, 50);
    ctx.fillText(`${canvas.height}`, 10, 70);
}