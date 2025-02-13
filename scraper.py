import requests
from bs4 import BeautifulSoup
import json
import time

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

def update_ratings(book_titles):
    try:
        with open("ratings.json", "r") as file:
            ratings = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        ratings = {}

    for title in book_titles:
        if title not in ratings:
            print(f"Fetching rating for: {title}")
            rating = get_goodreads_rating(title)
            if rating:
                ratings[title] = rating
            time.sleep(2)  # Prevent being blocked

    with open("ratings.json", "w") as file:
        json.dump(ratings, file, indent=4)

# Example usage:
book_list = ["The Hobbit", "1984", "To Kill a Mockingbird"]
update_ratings(book_list)
