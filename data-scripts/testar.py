import soccerdata as sd

espn = sd.ESPN(leagues="BRA-Serie A", seasons=2025)

print("Buscando calendário...")
schedule = espn.read_schedule()
print(schedule.head(10))