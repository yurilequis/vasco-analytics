import json
from sofascore import SofascoreScraper

scraper = SofascoreScraper()
res = scraper._fazer_requisicao("/unique-tournament/325/season/58766/standings/total")
print(json.dumps(res, indent=2))
