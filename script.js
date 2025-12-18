document.addEventListener("DOMContentLoaded", function() {
    const functionList = [
        "sin(x)", "cos(x)", "tan(x)", "exp(-x^2)", "sin(x)^2", "cos(x)^2", "x^2", "sqrt(x)", "x", "1/x",
        "log(x)", "x^3", "sin(x) + cos(x)", "sin(x) * cos(x)", "exp(x)", "sin(x) * exp(-x^2)", "sin(x) / x",
        "exp(-abs(x))", "cos(x) + 2*sin(x)", "sin(2*x)", "cos(2*x)", "x * cos(x)", "x * sin(x)", "sqrt(1 - x^2)",
        "x^2 * exp(-x)", "exp(x) / (1 + x^2)", "(sin(x))^2 + (cos(x))^2", "x^4 - 3*x^2 + 2", "exp(i * x)",
        "sin(x) + cos(x) + x"
    ];

    const functionListContainer = document.getElementById("functionList");
    const waveFunctionInput = document.getElementById("waveFunctionInput");

    functionList.forEach(function(func) {
        const li = document.createElement("li");
        li.textContent = func;
        li.addEventListener("click", function() {
            waveFunctionInput.value = func;
            plotWaveFunction();
        });
        functionListContainer.appendChild(li);
    });
});

function plotWaveFunction() {
    const waveFunctionStr = document.getElementById("waveFunctionInput").value;
    const errorElement = document.getElementById("error");
    const xMinInput = document.getElementById("xMinInput").value;
    const xMaxInput = document.getElementById("xMaxInput").value;

    errorElement.textContent = "";

    const xMin = xMinInput ? parseFloat(xMinInput) : -10;
    const xMax = xMaxInput ? parseFloat(xMaxInput) : 10;

    if (xMin >= xMax) {
        errorElement.textContent = "Error: x-min should be less than x-max.";
        return;
    }

    try {
        const xVals = math.range(xMin, xMax, 0.01).toArray();
        const waveFunction = math.compile(waveFunctionStr);

        const yValsPsi = xVals.map(x => waveFunction.evaluate({ x }));
        const yValsDensity = yValsPsi.map(y => math.abs(y) ** 2);

        const trace1 = {
            x: xVals,
            y: yValsPsi,
            mode: "lines",
            name: "ψ(x)",
            line: { color: "green" }
        };

        const layout1 = {
            title: "Wave Function (ψ(x))",
            xaxis: { title: "x", range: [xMin, xMax] },
            yaxis: { title: "ψ(x)", range: [xMin, xMax] },
            margin: { t: 50, l: 50, r: 50, b: 50 },
            showlegend: false
        };

        Plotly.newPlot("waveFunctionPlot", [trace1], layout1);

        const trace2 = {
            x: xVals,
            y: yValsDensity,
            mode: "lines",
            name: "|ψ(x)|²",
            line: { color: "blue" }
        };

        const layout2 = {
            title: "Probability Density (|ψ(x)|²)",
            xaxis: { title: "x", range: [xMin, xMax] },
            yaxis: { title: "|ψ(x)|²", range: [xMin, xMax] },
            margin: { t: 50, l: 50, r: 50, b: 50 },
            showlegend: false
        };

        Plotly.newPlot("probabilityDensityPlot", [trace2], layout2);
    } catch (err) {
        errorElement.textContent = `Error: ${err.message}`;
    }
}

// Call defaultPlot on page load
window.onload = defaultPlot;

// Function to set the operator when clicked
function applyOperator(operator) {
    selectedOperator = operator;
    //alert(`Selected operator: ${operator}`);
}

// Function to apply the selected operator
function applySelectedOperator() {
    const waveFunctionInput = document.getElementById("waveFunctionInput");
    const secondOperand = document.getElementById("secondOperand").value;

    if (!selectedOperator || !secondOperand) {
        alert("Please select an operator and enter a second value/function.");
        return;
    }
    // Combine the wave function with the selected operation and second operand
    const currentFunction = waveFunctionInput.value;
    waveFunctionInput.value = `(${currentFunction}) ${selectedOperator} (${secondOperand})`;

    // Reset the operator selection
    selectedOperator = null;

    // Plot the new function
    plotWaveFunction();
}

function defaultPlot() {
    const xVals = math.range(-10, 10, 0.01).toArray();
    const waveFunction = xVals.map(x => Math.sin(x));
    const density = waveFunction.map(y => Math.abs(y) ** 2);

    const trace1 = {
        x: xVals,
        y: waveFunction,
        mode: "lines",
        name: "ψ(x)",
        line: { color: "green" }
    };

    const layout1 = {
        title: "Wave Function (ψ(x))",
        xaxis: { title: "x" },
        yaxis: { title: "ψ(x)" }
    };

    const trace2 = {
        x: xVals,
        y: density,
        mode: "lines",
        name: "|ψ(x)|²",
        line: { color: "blue" }
    };

    const layout2 = {
        title: "Probability Density (|ψ(x)|²)",
        xaxis: { title: "x" },
        yaxis: { title: "|ψ(x)|²" }
    };

    Plotly.newPlot("waveFunctionPlot", [trace1], layout1);
    Plotly.newPlot("probabilityDensityPlot", [trace2], layout2);
}

// Call defaultPlot on page load
window.onload = defaultPlot;