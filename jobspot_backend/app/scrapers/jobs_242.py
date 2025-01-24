from app.scrapers.scraper import Scraper
from bs4 import BeautifulSoup
import requests
import re
from datetime import datetime

class Jobs242Scraper(Scraper):
    def __init__(self):
        self.base_url = "https://www.jobs242.com/jobs"
        self.name = "Jobs242"

    def scrape(self):
        try:
            page = requests.get(self.base_url)
            soup = BeautifulSoup(page.content, "html.parser")
            jobs = []

            job_listings = soup.find_all("div", class_="job-listing")

            for job in job_listings:
                title = job.find("h4", class_="job-title").text.strip()
                company = job.find("div", class_="company-name").text.strip()
                location = job.find("div", class_="location").text.strip()
                description = job.find("div", class_="description").text.strip()
                
                # Get the date and convert it to proper format
                date_posted = job.find("div", class_="date-posted").text.strip()
                date_posted = self.parse_date(date_posted)
                
                url = job.find("a", class_="job-link")["href"]
                
                job_data = {
                    "title": title,
                    "company": company,
                    "location": location,
                    "description": description,
                    "date_posted": date_posted,
                    "url": url,
                    "source": self.name
                }
                
                jobs.append(job_data)
                
            return jobs
            
        except Exception as e:
            print(f"Error scraping {self.name}: {str(e)}")
            return []

    def parse_date(self, date_string):
        # Convert the date string to datetime object
        try:
            # Add your date parsing logic here
            return datetime.now()  # Placeholder
        except Exception as e:
            print(f"Error parsing date: {str(e)}")
            return datetime.now()

def run_scraper():
    scraper = Jobs242Scraper()
    return scraper.scrape()
