async function findBooks() {
    let input = document.getElementById("keywordInput").value.trim().toLowerCase();
    let genre = document.getElementById("genreSelect").value.trim().toLowerCase();
    
    if (!input && !genre) return;

    // Combine genre with keywords for a better search
    let searchQuery = input;
    if (genre) searchQuery += ` ${genre}`;

    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (data.docs.length === 0) {
            resultsDiv.innerHTML = "<p>No books found. Try different keywords.</p>";
            return;
        }

        data.docs.forEach(book => {
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
        });

    } catch (error) {
        console.error("Error fetching books:", error);
        document.getElementById("results").innerHTML = "<p>Failed to fetch book data.</p>";
    }
}