const container = document.getElementById("dataHere");

const sheetID = "1Mf0DVTj2_ovcdSzaXZeUjP-PmYiT0X7u82vzbNchjpA";
const tabName = "Sheet1";
const myURL = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

async function getData() {
    try {
        const response = await fetch(myURL);
        const data = await response.json();

        for (let dataPoint of data) {
            console.log("Data Point:", dataPoint); 

            if (!dataPoint.humidity || !dataPoint.temperature || !dataPoint.altitude) {
                console.warn("Missing essential data in dataPoint:", dataPoint);
                continue; 
            }

            let coffeeContainer = document.createElement("div");
            container.appendChild(coffeeContainer);
            coffeeContainer.classList.add("coffee-container");

            let wave = document.createElement("canvas");
            coffeeContainer.appendChild(wave);
            wave.classList.add("wave");

            let cssWidth = 1200;
            let cssHeight = 500;
            wave.style.width = `${cssWidth}px`;
            wave.style.height = `${cssHeight}px`;

            let devicePixelRatio = window.devicePixelRatio || 1;
            wave.width = cssWidth * devicePixelRatio;
            wave.height = cssHeight * devicePixelRatio;

            let ctx = wave.getContext("2d");
            ctx.scale(devicePixelRatio, devicePixelRatio);

            let { humidity, temperature, altitude, variety, process } = dataPoint;

            let segmentWidth = map(humidity, 73, 85, 100, 40); 
            let baseHeight = 130; 
            let layers = Math.round(map(altitude, 1.4, 1.7, 2, 10)); 
            let heightRange = map(altitude, 1.4, 1.7, 10, 100); 
            let roundness = map(temperature, 17, 20, 0.5, 3.0); 

            let firstLayerColor = mapVarietyToHex(variety);
            let lastLayerColor = mapProcessToHex(process);

            drawLayeredWaves(ctx, baseHeight, heightRange, roundness, segmentWidth, layers, firstLayerColor, lastLayerColor);
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

function mapVarietyToHex(variety) {
    switch (variety && variety.toLowerCase()) {
        case "heirloom":
            return "#c1a6d8"; 
        case "bourbon":
            return "#c6a182"; 
        case "typica":
            return "#d1a256"; 
        default:
            console.warn("Unknown variety:", variety);
            return "#000000"; 
    }
}

function mapProcessToHex(process) {
    switch (process && process.toLowerCase()) {
        case "natural anaerobic":
            return "#662035"; 
        case "x.o":
            return "#8f4f1f"; 
        case "honey":
            return "#a36228"; 
        case "natural":
            return "#b0222b"; 
        case "hybrid wash":
            return "#2d6c84";
        default:
            console.warn("Unknown process:", process);
            return "#FFFFFF"; 
    }
}

function drawLayeredWaves(ctx, baseHeight, heightRange, roundness, segmentWidth, layers, firstLayerColor, lastLayerColor) {
    let colors = [];
    for (let i = 0; i < layers; i++) {
        const factor = i / (layers - 1);
        colors.push(interpolateHexColor(firstLayerColor, lastLayerColor, factor));
    }

    for (let i = 0; i < layers; i++) {
        let layerHeight = baseHeight + i * 35; 
        let color = colors[i];

        drawSmoothWave(ctx, layerHeight, heightRange, roundness, segmentWidth, color);
    }
}

function interpolateHexColor(color1, color2, factor) {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function drawSmoothWave(ctx, baseHeight, heightRange, roundness, segmentWidth, color) {
    ctx.beginPath();
    ctx.moveTo(0, baseHeight);

    let x = 0;
    while (x < ctx.canvas.width) {
        let randomHeight = Math.random() * heightRange - heightRange / 2;

        let endX = x + segmentWidth;
        let endY = baseHeight + randomHeight;

        let cp1X = x + segmentWidth * roundness * 0.5; 
        let cp1Y = baseHeight - randomHeight * 0.5; 
        let cp2X = endX - segmentWidth * roundness * 0.5; 
        let cp2Y = endY + randomHeight * 0.5; 

        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

        x = endX; 
    }

    ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
    ctx.lineTo(0, ctx.canvas.height);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
}

function map(value, low1, high1, low2, high2) {
    if (value < low1) value = low1;
    if (value > high1) value = high1;
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

getData();




/* const container = document.getElementById("dataHere");

const sheetID = "1Mf0DVTj2_ovcdSzaXZeUjP-PmYiT0X7u82vzbNchjpA";
const tabName = "Sheet1";
const myURL = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

async function getData() {
    try {
        const response = await fetch(myURL);
        const data = await response.json();

        for (let dataPoint of data) {
            console.log("Data Point:", dataPoint); // Debugging

            // Check if essential properties exist
            if (!dataPoint.humidity || !dataPoint.temperature || !dataPoint.altitude) {
                console.warn("Missing essential data in dataPoint:", dataPoint);
                continue; // Skip this iteration if data is incomplete
            }

            let coffeeContainer = document.createElement("div");
            container.appendChild(coffeeContainer);
            coffeeContainer.classList.add("coffee-container");

            let wave = document.createElement("canvas");
            coffeeContainer.appendChild(wave);
            wave.classList.add("wave");

            // Set logical dimensions (CSS-controlled)
            let cssWidth = 1200; // Set CSS width
            let cssHeight = 500; // Set CSS height
            wave.style.width = `${cssWidth}px`;
            wave.style.height = `${cssHeight}px`;

            // Set physical resolution (accounting for pixel ratio)
            let devicePixelRatio = window.devicePixelRatio || 1;
            wave.width = cssWidth * devicePixelRatio;
            wave.height = cssHeight * devicePixelRatio;

            let ctx = wave.getContext("2d");
            ctx.scale(devicePixelRatio, devicePixelRatio); // Scale the context to match the pixel ratio

            let { humidity, temperature, altitude, variety, process } = dataPoint;

            let segmentWidth = map(humidity, 73, 85, 100, 40); 
            let baseHeight = 130; // Fixed base height for layers
            let layers = Math.round(map(altitude, 1.4, 1.7, 2, 10)); // Altitude = number of layers
            let heightRange = map(altitude, 1.4, 1.7, 10, 100); // Higher alti = more height variation
            let roundness = map(temperature, 17, 20, 0.2, 0.8); // temp controls roundness (higher = rounder)

            // Get hex colors for the first and last layers
            let firstLayerColor = mapVarietyToHex(variety);
            let lastLayerColor = mapProcessToHex(process);

            drawLayeredWaves(ctx, baseHeight, heightRange, roundness, segmentWidth, layers, firstLayerColor, lastLayerColor);
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

function mapVarietyToHex(variety) {
    // Map varieties to specific hex codes
    switch (variety && variety.toLowerCase()) {
        case "heirloom":
            return "#c1a6d8"; 
        case "bourbon":
            return "#c6a182"; 
        case "typica":
            return "#d1a256"; 
        default:
            console.warn("Unknown variety:", variety);
            return "#000000"; 
    }
}

function mapProcessToHex(process) {
    // Map processes to specific hex codes
    switch (process && process.toLowerCase()) {
        case "natural anaerobic":
            return "#662035"; 
        case "x.o":
            return "#8f4f1f"; 
        case "honey":
            return "#a36228"; 
        case "natural":
            return "#b0222b"; 
        case "hybrid wash":
            return "#2d6c84";
        default:
            console.warn("Unknown process:", process);
            return "#FFFFFF"; 
    }
}

function drawLayeredWaves(ctx, baseHeight, heightRange, roundness, segmentWidth, layers, firstLayerColor, lastLayerColor) {
    let colors = [];

    // Generate interpolated hex colors for all layers
    for (let i = 0; i < layers; i++) {
        const factor = i / (layers - 1); // Interpolation factor
        colors.push(interpolateHexColor(firstLayerColor, lastLayerColor, factor));
    }

    for (let i = 0; i < layers; i++) {
        let layerHeight = baseHeight + i * 35; // Offset each layer vertically
        let color = colors[i];

        drawRoundedWave(ctx, layerHeight, heightRange, roundness, segmentWidth, color);
    }
}

function interpolateHexColor(color1, color2, factor) {
    // Convert hex to RGB
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);

    // Interpolate RGB values
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    // Convert back to hex
    return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function drawRoundedWave(ctx, baseHeight, heightRange, roundness, segmentWidth, color) {
    ctx.beginPath();
    ctx.moveTo(0, baseHeight);

    let x = 0;
    while (x < ctx.canvas.width) {
        // Random height variation for peaks
        let randomHeight = Math.random() * heightRange - heightRange / 2;

        // End point of the current segment
        let endX = x + segmentWidth;
        let endY = baseHeight + randomHeight;

        // Control points for the Bézier curve
        let cp1X = x + segmentWidth * roundness; // Control point closer for rounder peaks
        let cp1Y = baseHeight; // Control point 1 Y (baseline)
        let cp2X = endX - segmentWidth * roundness; // Control point 2 X
        let cp2Y = endY; // Control point 2 Y (closer to the peak)

        // Draw the curve
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

        x = endX; // Move to the next segment
    }

    ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
    ctx.lineTo(0, ctx.canvas.height);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
}

// Mapping function
function map(value, low1, high1, low2, high2) {
    if (value < low1) value = low1;
    if (value > high1) value = high1;
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

getData(); */


