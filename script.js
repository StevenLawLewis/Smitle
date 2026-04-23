let gods = [];        // Will store all gods from JSON
let answer = null;    // Today's correct god

// Load the JSON file when page loads
fetch('gods.json')
    .then(response => response.json())
    .then(data => {
        gods = data;

        // Pick today's god once data is loaded
        answer = getDailyGod();

        console.log("Today's answer:", answer); // You can remove later
    });


// Function to determine daily god
function getDailyGod() {
    // Fixed start date (important so everyone gets same rotation)
    const startDate = new Date("2024-01-01");
    const today = new Date();

    // Calculate difference in days
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Use modulo to loop through gods
    const index = diffDays % gods.length;

    return gods[index];
}


// Called when user clicks "Guess"
function submitGuess() {
    const input = document.getElementById("guessInput").value.trim();

    // Find the god in our dataset
    const guessedGod = gods.find(g => g.name.toLowerCase() === input.toLowerCase());

    if (!guessedGod) {
        alert("God not found!");
        return;
    }

    // Compare guess with answer
    const result = compareGuess(guessedGod, answer);

    // Add result to table
    addRow(guessedGod, result);
}


// Compare each category
function compareGuess(guess, answer) {
    return {
        name: guess.name === answer.name,
        gender: guess.gender === answer.gender,
        pantheon: guess.pantheon === answer.pantheon,
        role: guess.role === answer.role,
        range: guess.range === answer.range
    };
}


// Add a row to the table showing results
function addRow(guess, result) {
    const table = document.querySelector("#resultsTable tbody");
    const row = document.createElement("tr");

    // Helper function to create a cell with color
    function createCell(value, isCorrect) {
        const cell = document.createElement("td");
        cell.textContent = value;

        // Apply class based on correctness
        cell.className = isCorrect ? "correct" : "incorrect";

        return cell;
    }

    // Add each column
    row.appendChild(createCell(guess.name, result.name));
    row.appendChild(createCell(guess.gender, result.gender));
    row.appendChild(createCell(guess.pantheon, result.pantheon));
    row.appendChild(createCell(guess.role, result.role));
    row.appendChild(createCell(guess.range, result.range));

    table.appendChild(row);
}

/**
* Listen for typing in the input box
* and show matching gods in dropdown
*/
document.getElementById("guessInput").addEventListener("input", function () {
    const inputValue = this.value.toLowerCase();

    const listContainer = document.getElementById("autocompleteList");

    // Clear previous suggestions
    listContainer.innerHTML = "";

    // If input is empty, don't show anything
    if (!inputValue) return;

    // Filter gods based on user input
    const matches = gods.filter(god =>
        god.name.toLowerCase().includes(inputValue)
    );

    // Create a suggestion box for each match
    matches.forEach(god => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");

        item.textContent = god.name;

        // When clicked, fill input and clear suggestions
        item.addEventListener("click", function () {
            document.getElementById("guessInput").value = god.name;
            listContainer.innerHTML = "";
        });

        listContainer.appendChild(item);
    });
});


/**
 * Close dropdown when clicking outside
 */
document.addEventListener("click", function (e) {
    if (e.target.id !== "guessInput") {
        document.getElementById("autocompleteList").innerHTML = "";
    }
});