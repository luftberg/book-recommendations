let shownBookIds = [];  // Track shown book IDs

async function findBooks() {
    let input = document.getElementById("keywordInput").value.trim().toLowerCase();
    let genre = document.getElementById("genreSelect").value.trim().toLowerCase();
    
    if (!input && !genre) return;

    // Combine genre with keywords for a better search
    let searchQuery = input;
    if (genre) searchQuery += ` ${genre}`;

    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=50`;  // Get more results

    try {
        let response = await fetch(url);
        let data = await response.json();

        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (data.docs.length === 0) {
            resultsDiv.innerHTML = "<p>No books found. Try different keywords.</p>";
            return;
        }

        // Filter out previously shown books
        let newBooks = data.docs.filter(book => !shownBookIds.includes(book.cover_i));

        if (newBooks.length === 0) {
            resultsDiv.innerHTML = "<p>No new books available. Try a different search or wait a while.</p>";
            return;
        }

        // Show the first 10 books that are not repeated
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
            `;

            // Add the shown book ID to the tracked list
            shownBookIds.push(book.cover_i);
        });

    } catch (error) {
        console.error("Error fetching books:", error);
        document.getElementById("results").innerHTML = "<p>Failed to fetch book data.</p>";
    }
}

async function findRandomBooks() {
    let url = `https://openlibrary.org/search.json?q=random&limit=50`;  // Random query to get random books

    try {
        let response = await fetch(url);
        let data = await response.json();

        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (data.docs.length === 0) {
            resultsDiv.innerHTML = "<p>No random books found. Try again.</p>";
            return;
        }

        // Filter out previously shown books
        let newBooks = data.docs.filter(book => !shownBookIds.includes(book.cover_i));

        if (newBooks.length === 0) {
            resultsDiv.innerHTML = "<p>No new books available. Try a different search or wait a while.</p>";
            return;
        }

        // Show the first 10 books that are not repeated
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
            `;

            // Add the shown book ID to the tracked list
            shownBookIds.push(book.cover_i);
        });

    } catch (error) {
        console.error("Error fetching random books:", error);
        document.getElementById("results").innerHTML = "<p>Failed to fetch random books.</p>";
    }
}
