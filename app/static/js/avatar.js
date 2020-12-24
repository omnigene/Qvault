$(function () {
    try {
        genGraph($("#nav-avatar"),avatar_hash);
        genGraph($("#menu-avatar"),avatar_hash);
    }
    catch (e) {
        avatar_hash=undefined;
    }

// 图像生成函数
    function genGraph(el,hash) {
        var size=parseInt(el.css("width"));
        var [tl, t, tr, l, c, r, bl, b, br] = [[0, 0], [0.5, 0], [1, 0], [0, 0.5], [0.5, 0.5], [1, 0.5], [0, 1], [0.5, 1], [1, 1]].map(e => e.map(e => e * size / 3));
        var shape = [
            [tl, t, l], [t, l, c], [tl, l, c], [tl, t, c],
            [tl, b, bl], [tl, t, b], [tl, br, l], [tl, t, br],
            [tl, b, l], [tl, t, r], [tl, bl, c], [tl, r, bl],
            [tl, br, bl], [tl, r, b], [l, tr, c, br], [tl, l, r, b, t]
        ];
        block = $('<canvas class="block"></canvas>').attr({"width": size, "height": size});
        ctx = block[0].getContext("2d");
        ccolor = hash.substr(2, 6);
        vcolor = hash.substr(10, 6);
        ecolor = hash.substr(18, 6);
        hash = Array.from(hash).map(e => parseInt(e, 16));
        cblock = shape[hash[0]];
        vblock = shape[hash[8]];
        eblock = shape[hash[16]];
        // 生成中心块
        times = Math.max(4, hash[1] % 8);
        for (n = 0; n < times; n += 1) {
            ctx.clearRect(1 / 3 * size, 1 / 3 * size, 2 / 3 * size, 2 / 3 * size);
            ctx.translate(1 / 2 * size, 1 / 2 * size);
            ctx.rotate(2 / times * Math.PI);
            ctx.translate(-1 / 2 * size, -1 / 2 * size);
            drawGraph(ctx, cblock.map(e => e.map(e => e + 1 / 3 * size)), ccolor);
        }
        // 生成角块
        ctx.beginPath();
        for (i = 0; i < 4; i += 1) {
            ctx.translate(2 / 3 * size, 0);
            ctx.translate(1 / 6 * size, 1 / 6 * size);
            ctx.rotate(0.5 * Math.PI);
            drawGraph(ctx, vblock.map(e => e.map(e => e - 1 / 6 * size)), vcolor);
            drawGraph(ctx, vblock.map(e => e.map(e => e - 1 / 12 * size)), vcolor);
            ctx.translate(-1 / 6 * size, -1 / 6 * size);
        }
        // 生成边块
        ctx.beginPath();
        ctx.translate(0, 1 / 3 * size);
        for (i = 0; i < 4; i += 1) {
            ctx.translate(1 / 3 * size, -1 / 3 * size);
            ctx.translate(1 / 6 * size, 1 / 6 * size);
            ctx.rotate(0.5 * Math.PI);
            drawGraph(ctx, eblock.map(e => e.map(e => e - 1 / 6 * size)), ecolor);
            drawGraph(ctx, eblock.map(e => e.map(e => e + 1 / 12 * size)), ecolor);
            ctx.translate(-1 / 6 * size, -1 / 6 * size);
        }
        el.append(block);
    }
// 绘图函数
    function drawGraph(ctx, shape, color) {
        for (v = 0; v < shape.length; v += 1) {
            if (v === 0) {
                ctx.moveTo(shape[v][0], shape[v][1])
            } else {
                ctx.lineTo(shape[v][0], shape[v][1])
            }
        }
        ctx.closePath();
        ctx.fillStyle = "#" + color;
        ctx.fill("evenodd");
    }
})