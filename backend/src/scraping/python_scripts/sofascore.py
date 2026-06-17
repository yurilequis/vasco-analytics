import json
import sys
from datetime import datetime
import tls_requests as requests

class SofascoreScraper:
    def __init__(self):
        self.base_url = "https://api.sofascore.com/api/v1"
        self.team_id = "1974" 
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
            "Cache-Control": "max-age=0",
            "Origin": "https://www.sofascore.com",
            "Referer": "https://www.sofascore.com/",
        }

    def _fazer_requisicao(self, endpoint: str):
        url = f"{self.base_url}{endpoint}"
        try:
            resposta = requests.get(url, headers=self.headers, impersonate="chrome120", timeout=15)
            if resposta.status_code == 200:
                return resposta.json()
            return None
        except Exception:
            return None

    def puxar_jogos(self):
        eventos = []
        for pagina in range(3):
            jogos_encerrados = self._fazer_requisicao(f"/team/{self.team_id}/events/last/{pagina}")
            if jogos_encerrados and "events" in jogos_encerrados:
                eventos.extend(jogos_encerrados["events"])
            else:
                break
        
        jogos_agendados = self._fazer_requisicao(f"/team/{self.team_id}/events/next/0")
        if jogos_agendados and "events" in jogos_agendados:
            eventos.extend(jogos_agendados["events"])
            
        return eventos

def comando_jogos():
    scraper = SofascoreScraper()
    eventos_brutos = scraper.puxar_jogos()
    if not eventos_brutos:
        print(json.dumps({"erro": "Falha ao buscar jogos"}))
        return

    jogos_limpos = []
    for evento in eventos_brutos:
        status_desc = evento.get("status", {}).get("description", "")
        if status_desc in ["Canceled", "Postponed", "Abandoned"]:
            continue
        
        status_code = evento.get("status", {}).get("code")
        status = "Encerrada" if status_code in [100, 120] else "Agendada"

        timestamp = evento.get("startTimestamp")
        if timestamp:
            data_formatada = datetime.fromtimestamp(timestamp).strftime("%d/%m/%Y %H:%M")
        else:
            data_formatada = "A definir"

        home_score = evento.get("homeScore", {})
        away_score = evento.get("awayScore", {})
            
        def extrair_placares(score_dict):
            penaltis = score_dict.get("penalty", score_dict.get("penalties"))
            tempo_normal = score_dict.get("normaltime")
            if tempo_normal is None:
                current = score_dict.get("current")
                if current is not None and penaltis is not None:
                    tempo_normal = int(current) - int(penaltis)
                else:
                    tempo_normal = current
            return tempo_normal, penaltis

        gols_m, penaltis_m = extrair_placares(home_score)
        gols_v, penaltis_v = extrair_placares(away_score)

        jogos_limpos.append({
            "event_id": evento.get("id"),
            "campeonato": evento.get("tournament", {}).get("name"),
            "data_partida": data_formatada,
            "mandante": evento.get("homeTeam", {}).get("name"),
            "visitante": evento.get("awayTeam", {}).get("name"),
            "gols_mandante": gols_m,
            "gols_visitante": gols_v,
            "gols_penaltis_mandante": penaltis_m,
            "gols_penaltis_visitante": penaltis_v,
            "status": status
        })
        
    print(json.dumps({"dados": jogos_limpos}))

def comando_detalhes(event_id):
    scraper = SofascoreScraper()
    
    detalhes_evento = scraper._fazer_requisicao(f"/event/{event_id}")
    if not detalhes_evento:
        print(json.dumps({"erro": "Partida nao encontrada"}))
        return
        
    evento = detalhes_evento.get("event", {})
    juiz = evento.get("referee", {}).get("name")
    estadio = evento.get("venue", {}).get("name")
    treinador_casa = evento.get("homeManager", {}).get("name")
    treinador_vis = evento.get("awayManager", {}).get("name")
    
    incidentes_brutos = scraper._fazer_requisicao(f"/event/{event_id}/incidents")
    linha_tempo = []
    if incidentes_brutos and "incidents" in incidentes_brutos:
        for inc in reversed(incidentes_brutos["incidents"]):
            tipo = inc.get("incidentType")
            if tipo in ["goal", "card", "substitution"]:
                linha_tempo.append({
                    "minuto": inc.get("time"),
                    "acrescimo": inc.get("addedTime", 0),
                    "periodo": "1T" if inc.get("isHome") else "2T",
                    "tipo": tipo.upper(),
                    "descricao": inc.get("text", ""),
                    "jogador_principal_id": inc.get("player", {}).get("id"),
                    "jogador_secundario_id": inc.get("assist1", {}).get("id") if tipo == "goal" else inc.get("playerIn", {}).get("id") if tipo == "substitution" else None,
                    "is_mandante": inc.get("isHome")
                })

    posicoes_brutas = scraper._fazer_requisicao(f"/event/{event_id}/average-positions")
    posicoes_medias = {}
    if posicoes_brutas:
        for lado in ["home", "away"]:
            for pos in posicoes_brutas.get(lado, []):
                player_id = pos.get("player", {}).get("id")
                posicoes_medias[player_id] = {
                    "x": pos.get("averageX"),
                    "y": pos.get("averageY")
                }

    lineups = scraper._fazer_requisicao(f"/event/{event_id}/lineups")
    escalacoes_formatadas = {"mandante": [], "visitante": []}
    
    if lineups and "home" in lineups:
        for lado in ["home", "away"]:
            chave_destino = "mandante" if lado == "home" else "visitante"
            dados_time = lineups.get(lado, {})
            
            for p in dados_time.get("players", []):
                player_obj = p.get("player", {})
                player_id = player_obj.get("id")
                stats = p.get("statistics", {})
                
                escalacoes_formatadas[chave_destino].append({
                    "sofascore_id": player_id,
                    "nome_completo": player_obj.get("name"),
                    "nome_popular": player_obj.get("shortName"),
                    "posicao_geral": player_obj.get("position"),
                    "posicao_partida": p.get("position"),
                    "titular": p.get("substitute") is False,
                    "numero_camisa": p.get("shirtNumber"),
                    "nota": stats.get("rating"),
                    "minutos_jogados": stats.get("minutesPlayed", 0),
                    "gols": stats.get("goals", 0),
                    "assistencias": stats.get("goalAssist", 0),
                    "chutes": stats.get("totalShots", 0),
                    "chutes_gol": stats.get("shotsOnTarget", 0),
                    "passes_tentados": stats.get("totalPass", 0),
                    "passes_completos": stats.get("accuratePass", 0),
                    "dribles_tentados": stats.get("totalContest", 0),
                    "dribles_completos": stats.get("wonContest", 0),
                    "desarmes": stats.get("totalTackle", 0),
                    "interceptacoes": stats.get("interceptionWon", 0),
                    "faltas_cometidas": stats.get("fouls", 0),
                    "faltas_sofridas": stats.get("wasFouled", 0),
                    "posicao_media": posicoes_medias.get(player_id, {"x": None, "y": None}),
                    "heatmap_url": f"https://api.sofascore.app/api/v1/event/{event_id}/player/{player_id}/heatmap"
                })

    
    estatisticas_equipes = {"mandante": {}, "visitante": {}}
    stats_brutas = scraper._fazer_requisicao(f"/event/{event_id}/statistics")
    if stats_brutas and "statistics" in stats_brutas:
        
        for section in stats_brutas["statistics"]:
            if section.get("period") == "ALL":
                for item in section.get("groups", []):
                    for stat in item.get("statisticsItems", []):
                        key = stat.get("name")
                        estatisticas_equipes["mandante"][key] = stat.get("home")
                        estatisticas_equipes["visitante"][key] = stat.get("away")

    print(json.dumps({
        "event_id": event_id,
        "arbitro": juiz,
        "estadio": estadio,
        "treinador_mandante": treinador_casa,
        "treinador_visitante": treinador_vis,
        "linha_do_tempo": linha_tempo,
        "escalacoes": escalacoes_formatadas,
        "estatisticas_equipes": estatisticas_equipes
    }))

def comando_classificacao(tournament_id, season_id):
    scraper = SofascoreScraper()
    endpoint = f"/unique-tournament/{tournament_id}/season/{season_id}/standings/total"
    resposta = scraper._fazer_requisicao(endpoint)
    
    if not resposta or "standings" not in resposta or len(resposta["standings"]) == 0:
        print(json.dumps({"erro": "Falha ao buscar classificação"}))
        return

    
    tabela_bruta = resposta["standings"][0].get("rows", [])
    tabela_limpa = []
    
    for row in tabela_bruta:
        team_info = row.get("team", {})
        tabela_limpa.append({
            "posicao": row.get("position"),
            "equipe_nome": team_info.get("name"),
            "equipe_id_sofascore": team_info.get("id"),
            "jogos": row.get("matches"),
            "vitorias": row.get("wins"),
            "empates": row.get("draws"),
            "derrotas": row.get("losses"),
            "gols_pro": row.get("scoresFor"),
            "gols_contra": row.get("scoresAgainst"),
            "saldo_gols": int(row.get("scoreDiffFormatted", 0).replace("+", "")),
            "pontos": row.get("points")
        })

    print(json.dumps({"dados": tabela_limpa}))

import base64

def comando_elenco(team_id):
    scraper = SofascoreScraper()
    endpoint = f"/team/{team_id}/players"
    resposta = scraper._fazer_requisicao(endpoint)
    
    if not resposta or "players" not in resposta:
        print(json.dumps({"erro": "Falha ao buscar elenco"}))
        return

    jogadores = []
    for p in resposta.get("players", []):
        player_obj = p.get("player", {})
        player_id = player_obj.get("id")
        
        foto_b64 = None
        if player_id:
            try:
                img_url = f"https://api.sofascore.app/api/v1/player/{player_id}/image"
                img_resp = requests.get(img_url, headers=scraper.headers, impersonate="chrome120", timeout=5)
                if img_resp.status_code == 200 and len(img_resp.content) > 0:
                    b64 = base64.b64encode(img_resp.content).decode("utf-8")
                    mime_type = "image/png"
                    if img_resp.content.startswith(b"RIFF"):
                        mime_type = "image/webp"
                    elif img_resp.content.startswith(b"\xff\xd8"):
                        mime_type = "image/jpeg"
                    foto_b64 = f"data:{mime_type};base64,{b64}"
            except Exception:
                pass

        jogadores.append({
            "sofascore_id": player_id,
            "nome_completo": player_obj.get("name"),
            "nome_popular": player_obj.get("shortName"),
            "posicao": player_obj.get("position"),
            "numero_camisa": player_obj.get("shirtNumber"),
            "nacionalidade": player_obj.get("country", {}).get("name"),
            "altura_cm": player_obj.get("height"),
            "pe_dominante": player_obj.get("preferredFoot"),
            "foto_url": foto_b64
        })

    print(json.dumps({"dados": jogadores}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"erro": "Nenhum comando fornecido"}))
        sys.exit(1)
        
    cmd = sys.argv[1]
    if cmd == "jogos":
        comando_jogos()
    elif cmd == "detalhes":
        if len(sys.argv) < 3:
            print(json.dumps({"erro": "ID da partida nao fornecido"}))
            sys.exit(1)
        comando_detalhes(int(sys.argv[2]))
    elif cmd == "classificacao":
        if len(sys.argv) < 4:
            print(json.dumps({"erro": "IDs de torneio e temporada nao fornecidos"}))
            sys.exit(1)
        comando_classificacao(sys.argv[2], sys.argv[3])
    elif cmd == "elenco":
        if len(sys.argv) < 3:
            print(json.dumps({"erro": "ID da equipe nao fornecido"}))
            sys.exit(1)
        comando_elenco(sys.argv[2])
    else:
        print(json.dumps({"erro": "Comando desconhecido"}))
