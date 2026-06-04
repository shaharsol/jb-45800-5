const a = (b) => {
    let x = b;
    for (let i = 0; i < 20; i++) x = (x + b / x) / 2;
    return x;
};

const power = (x, y) => {
    let result = 1;
    for (let i = 0; i < y; i++) result = result * x;
    return result;
};

const mod = (a, b) => a % b;

function mod (a,b) {
    return a % b;
}