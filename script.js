// Will store all gods from JSON
let gods = [];        

// Will store today's answer once we determine it
let answer = null; 

// ---------------------------------------------------------------------------------------------------------------------------------

// Load the JSON file when page loads
fetch('gods.json')
    .then(response => response.json())
    .then(data => {
        gods = data;

        // Get today's god once data is loaded
        answer = getDailyGod();

        // For testing, log the answer to console (remove later)
        console.log("Today's answer:", answer);
    });

// ---------------------------------------------------------------------------------------------------------------------------------

// Function to determine daily god
function getDailyGod() {
    // If gods not loaded yet, return null
    if (!gods || gods.length === 0) return null;

    // Fixed start date (important so everyone gets same rotation)
    const startDate = new Date("2026-04-24");

    // Get today's date
    const today = new Date();

    // Calculate difference in days, Get time difference in milliseconds
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diffTime = today - startDate;

    // Convert to days (can be negative if before start date)
    const diffDays = Math.floor(diffTime / MS_PER_DAY);

    // Use modulo to loop through gods and handle negative values safely
    const index = ((diffDays % gods.length) + gods.length) % gods.length;

    // Return the god for today
    return gods[index];
}

// ---------------------------------------------------------------------------------------------------------------------------------

// Called when user clicks "Guess"
function submitGuess() {
    const input = document.getElementById("guessInput").value.trim();

    // Find the god in our dataset
    const guessedGod = gods.find(g => g.name.toLowerCase() === input.toLowerCase());

    // If not found, alert user and exit
    if (!guessedGod)
    {
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