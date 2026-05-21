import requests

url = "https://site.api.espn.com/apis/site/v2/sports/soccer/leagues"

r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
print("Status:", r.status_code)

data = r.json()
print("Chaves:", list(data.keys()))

leagues = data.get("leagues", [])
print(f"Total de ligas: {len(leagues)}")

for l in leagues:
    name = l.get("name", "")
    slug = l.get("slug", "")
    if "bra" in slug.lower() or "brazil" in name.lower() or "brasil" in name.lower():
        print(f"ENCONTRADO → slug: {slug} | nome: {name}")