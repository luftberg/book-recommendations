import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify

app = Flask(__name__)

# Function to scrape Goodreads for ratings
def get_goodreads_rating(book_title):
    search_url = f"https://www.goodreads.com/search?q={book_title.replace(' ', '+')}"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {book_title}: {e}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    rating_tag = soup.select_one("span.minirating")  # Look for the rating span

    if rating_tag:
        rating_text = rating_tag.text.strip()
        rating = rating_text.split("—")[0].strip()
        return rating
    else:
        return None

# API endpoint to fetch ratings for multiple books
@app.route('/getRatings', methods=['POST'])
def get_ratings():
    data = request.get_json()
    titles = data.get('titles', [])
    
    ratings = {}
    for title in titles:
        rating = get_goodreads_rating(title)
        if rating:
            ratings[title] = rating
    
    return jsonify({'ratings': ratings})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)  # Make the app available to all devices on the local network
