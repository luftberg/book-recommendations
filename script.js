let suggestionsList = [
    "philosophy", "fiction", "fantasy", "history", "science", 
    "biography", "mystery", "romance"
];
let shownBookIds = [];

function showSuggestions() {
    let input = document.getElementById("keywordInput").value.trim().toLowerCase();
    let suggestionsDiv = document.getElementById("suggestions");

    if (input === "") {
        suggestionsDiv.style.display = "none";  // Hide suggestions when input is empty
        return;
    }

    // Filter suggestions based on user input
    let filteredSuggestions = suggestionsList.filter(suggestion => suggestion.includes(input));
    
    // Limit to 3 suggestions
    filteredSuggestions = filteredSuggestions.slice(0, 3);

    // Show suggestions if there are any
    if (filteredSuggestions.length > 0) {
        suggestionsDiv.innerHTML = filteredSuggestions.map(suggestion => {
            return `<div class="suggestion-item">${suggestion}</div>`;
        }).join("");

        suggestionsDiv.style.display = "block";  // Show suggestions
    } else {
        suggestionsDiv.style.display = "none";  // Hide if no matching suggestions
    }
}

async function findBooks() {
    let input = document.getElementById("keywordInput").value.trim().toLowerCase();
    let genre = document.getElementById("genreSelect").value.trim().toLowerCase();
    
    if (!input && !genre) return;

    let searchQuery = input;
    if (genre) searchQuery += ` ${genre}`;

    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=50`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (data.docs.length === 0) {
            resultsDiv.innerHTML = "<p>No books found. Try different keywords.</p>";
            return;
        }

        let newBooks = data.docs.filter(book => !shownBookIds.includes(book.cover_i));

        if (newBooks.length === 0) {
            resultsDiv.innerHTML = "<p>No new books available. Try a different search or wait a while.</p>";
            return;
        }

        let topBooks = newBooks.slice(0, 10);
        topBooks.forEach(book => {
            let title = book.title || "Unknown Title";
            let author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
            let cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/128x192?text=No+Cover";

            resultsDiv.innerHTML += `
                <div class="book">
                    <img src="${cover}" alt="Book Cover">
                    <div>
                        <p><strong>${title}</strong> by ${author}</p>
                    </div>
                </div>
            `;

            shownBookIds.push(book.cover_i);
        });

    } catch (error) {
        console.error("Error fetching books:", error);
        document.getElementById("results").innerHTML = "<p>Failed to fetch book data.</p>";
    }
}
