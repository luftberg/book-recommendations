let shownBookIds = [];  // Track shown book IDs

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
        resultsDiv.innerHTML = ""; 

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

        // Gather book titles to fetch ratings
        let bookTitles = topBooks.map(book => book.title);

        // Fetch ratings for books
        let ratings = await fetchRatings(bookTitles);

        topBooks.forEach(book => {
            let title = book.title || "Unknown Title";
            let author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
            let cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/128x192?text=No+Cover";

            // Get the rating from the fetched data
            let rating = ratings[title] || "No rating available";

            resultsDiv.innerHTML += `
                <div class="book">
                    <img src="${cover}" alt="Book Cover">
                    <div>
                        <p><strong>${title}</strong> by ${author}</p>
                        <p>Rating: ${rating} ⭐</p>
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

// Fetch ratings from scraper (from Python backend)
async function fetchRatings(bookTitles) {
    try {
        let response = await fetch('/getRatings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titles: bookTitles })
        });
        let data = await response.json();
        return data.ratings || {};
    } catch (error) {
        console.error("Error fetching ratings:", error);
        return {};
    }
}
