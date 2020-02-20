 function* poissonDiscSampler(width, height, radius,p) {
    const k = 30; // maximum number of samples before rejection
    const radius2 = radius * radius;
    const cellSize = radius * Math.SQRT1_2;
    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);
    const grid = new Array(gridWidth * gridHeight);
    const queue = [];

    if(p){
        yield { add: sample(p[0], p[1], null) }
    }else{
        yield { add: sample(width / 2 + Math.random() * radius, height / 2 + Math.random() * radius, null) };
    }
    // Pick a random existing sample from the queue.
    pick: while (queue.length) {
        const i = Math.random() * queue.length | 0;
        const parent = queue[i];
        const seed = Math.random();
        const epsilon = 0.0000001;

        // Make a new candidate.
        for (let j = 0; j < k; ++j) {
            const a = 2 * Math.PI * (seed + j / k);
            const r = radius + epsilon;
            const x = parent[0] + r * Math.cos(a);
            const y = parent[1] + r * Math.sin(a);

            // Accept candidates that are inside the allowed extent
            // and farther than 2 * radius to all existing samples.
            if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) {
                yield { add: sample(x, y), parent };
                continue pick;
            }
        }

        // If none of k candidates were accepted, remove it from the queue.
        const r = queue.pop();
        if (i < queue.length) queue[i] = r;
        yield { remove: parent };
    }

    function far(x, y) {
        const i = x / cellSize | 0;
        const j = y / cellSize | 0;
        const i0 = Math.max(i - 2, 0);
        const j0 = Math.max(j - 2, 0);
        const i1 = Math.min(i + 3, gridWidth);
        const j1 = Math.min(j + 3, gridHeight);
        for (let j = j0; j < j1; ++j) {
            const o = j * gridWidth;
            for (let i = i0; i < i1; ++i) {
                const s = grid[o + i];
                if (s) {
                    const dx = s[0] - x;
                    const dy = s[1] - y;
                    if (dx * dx + dy * dy < radius2) return false;
                }
            }
        }
        return true;
    }

    function sample(x, y, parent) {
        const s = grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = [x, y];
        queue.push(s);
        return s;
    }
}

export const sampler = function(width, height, radius, point){
    const collection = [];

    let p, s = poissonDiscSampler(width,height, radius, point);

    while (p = s.next().value) {
        if (p.add) {
            collection.push(p.add)
        }
    }
    return collection;
}

