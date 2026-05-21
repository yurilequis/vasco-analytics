import soccerdata as sd
import json
import os

def serializar(obj):
    """Converte tipos não serializáveis para JSON."""
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    if hasattr(obj, 'item'):  # numpy types
        return obj.item()
    return str(obj)

print("Iniciando coleta de dados do Vasco da Gama via Sofascore...")

try:
    # Sofascore — Brasileirão Série A 2025
    sofascore = sd.Sofascore(leagues="BRA-Série A", seasons=2025)

    print("Ligas disponíveis:")
    print(sd.Sofascore.available_leagues())

except Exception as e:
    print(f"Erro: {e}")
    raise