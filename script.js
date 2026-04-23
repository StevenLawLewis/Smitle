let gods = [];
let answer = null;

// Load data
fetch('gods.json')
    .then(res => res.json())
    .then(data => {
        gods = data;
        answer = gods[getDailyIndex(gods.length)];
    });

function getDailyIndex(total) {
    const start = new Date("2024-01-01");
    const today = new Date();
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return diffDays % total;
}

function submitGuess() {
    const input = document.getElementById("guessInput").value.trim();

    const guess = gods.find(g => g.name.toLowerCase() === input.toLowerCase());

    if (!guess) {
        alert("God not found");
        return;
    }

    displayResult(guess);
}

function displayResult(guess) {
    const table = document.getElementById("results");

    const row = document.createElement("tr");

    addCell(row, guess.name, guess.name === answer.name);
    addCell(row, guess.gender, guess.gender === answer.gender);
    addCell(row, guess.pantheon, guess.pantheon === answer.pantheon);
    addCell(row, guess.role, guess.role === answer.role);
    addCell(row, guess.range, guess.range === answer.range);

    table.appendChild(row);
}

function addCell(row, text, correct) {
    const cell = document.createElement("td");
    cell.textContent = text;
    cell.className = correct ? "correct" : "wrong";
    row.appendChild(cell);
}