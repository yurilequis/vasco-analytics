import csv
import math
import requests
import json
import os
import unicodedata 
import re          

MAPA_CSV_PARA_BANCO = {
    'Técnica': 'tecnica', 'Desarme': 'desarme', 'Marcação de Penáltis': 'penaltis',
    'Passe': 'passe', 'Marcação': 'marcacao', 'Lançamentos Longos': 'laterais',
    'Remates de Longe': 'chutesLonge', 'Cabeceamento': 'cabeceamento',
    'Livres': 'cobrancaFalta', 'Primeiro Toque': 'primeiroToque',
    'Finalização': 'finalizacao', 'Finta': 'drible', 'Cruzamentos': 'cruzamento',
    'Cantos': 'escanteios', 'Força': 'forca', 'Resistência': 'resistencia',
    'Velocidade': 'velocidade', 'Aptidão Física': 'aptidaoNatural',
    'Impulsão': 'impulsao', 'Equilíbrio': 'equilibrio', 'Agilidade': 'agilidade',
    'Aceleração': 'aceleracao', 'Índice de Trabalho': 'indiceTrabalho',
    'Visão de Jogo': 'visaoJogo', 'Posicionamento': 'posicionamento',
    'Trabalho de Equipa': 'trabalhoEquipe', 'Sem Bola': 'semBola',
    'Liderança': 'lideranca', 'Imprevisibilidade': 'imprevisibilidade',
    'Determinação': 'determinacao', 'Decisões': 'decisoes',
    'Concentração': 'concentracao', 'Compostura': 'compostura',
    'Antecipação': 'antecipacao', 'Saídas a Punhos': 'socos',
    'Reflexos': 'reflexos', 'Pontapé': 'reposicao', 'Um Para Um': 'umContraUm',
    'Jogo de Mãos': 'jogoMaos', 'Comunicação': 'comunicacao',
    'Alcance Aéreo': 'alcanceAereo', 'Bravura': 'bravura',
    'Agressividade': 'agressividade', '(Tendência) para Saídas da Baliza': 'saidaGol',
    'Lançamentos': 'lancamentos'
}

MAPA_CLUBES = {
    'EC Bahia': 'Bahia',
    'RB Bragantino': 'Red Bull Bragantino',
    'Redbull Bragantino': 'Red Bull Bragantino',
    'Athletico-PR': 'Athletico Paranaense',
    'Atlético Mineiro': 'Atlético-MG',
}

def processar_nota(valor):
    valor = valor.strip() if valor else ""
    if not valor or valor == '-': return None
    if '-' in valor:
        partes = valor.split('-')
        media = (int(partes[0]) + int(partes[1])) / 2
        return math.floor(media)
    try: return int(valor)
    except: return None

FOTOS_USADAS = set()


def descobrir_foto_jogador(nome_jogador, nome_completo, pasta_base_script):
    if not nome_jogador: return None
    
    def gerar_variacoes(nome):
        nome_limpo = unicodedata.normalize('NFKD', nome).encode('ASCII', 'ignore').decode('utf-8')
        nome_limpo = nome_limpo.lower().strip()
        slug_completo = re.sub(r'\s+', '-', nome_limpo)
        partes_nome = nome_limpo.split()
        slug_primeiro = partes_nome[0] if partes_nome else ""
        slug_ultimo = partes_nome[-1] if partes_nome else ""
        return slug_completo, slug_primeiro, slug_ultimo

    possibilidades = []
    
    
    if nome_completo:
        sc, _, _ = gerar_variacoes(nome_completo)
        possibilidades.append(f"{sc}.png")
        
    
    sp_c, sp_p, sp_u = gerar_variacoes(nome_jogador)
    possibilidades.extend([
        f"{sp_c}.png",
        f"{sp_u}.png",
        f"{sp_p}.png"
    ])
    
    
    caminho_frontend = os.path.abspath(os.path.join(pasta_base_script, '..', '..', '..', '..', 'frontend', 'public', 'fotos-jogadores'))
    
    
    for nome_arquivo in possibilidades:
        
        if nome_arquivo in FOTOS_USADAS:
            continue
            
        caminho_fisico = os.path.join(caminho_frontend, nome_arquivo)
        if os.path.exists(caminho_fisico):
            FOTOS_USADAS.add(nome_arquivo)
            return f"/fotos-jogadores/{nome_arquivo}"
            
    return None
def processar_csv(caminho_arquivo):
    print("🚀 Iniciando Motor de Carga em Lote (Série A)...\n")
    sucessos = 0
    erros = 0
    
    pasta_atual = os.path.dirname(os.path.abspath(__file__))
    
    with open(caminho_arquivo, mode='r', encoding='utf-8') as arquivo:
        leitor = csv.DictReader(arquivo, delimiter=';')
        
        for linha in leitor:
            nome = linha.get('Jogador')
            clube_bruto = linha.get('Clube')
            clube = MAPA_CLUBES.get(clube_bruto, clube_bruto) 
            
            posicao_bruta = linha.get('Posição', 'Desconhecida')
            posicao_principal = posicao_bruta.split(',')[0].strip()
            
            if not nome: continue
            
            
            
            
            foto_url = descobrir_foto_jogador(nome, nome, pasta_atual)
            
            atributos_fm = {"jogadorId": 0}
            
            atributos_fm = {"jogadorId": 0}
            for coluna_csv, coluna_banco in MAPA_CSV_PARA_BANCO.items():
                nota_bruta = linha.get(coluna_csv)
                if nota_bruta: atributos_fm[coluna_banco] = processar_nota(nota_bruta)
                
            altura_bruta = linha.get('Altura', '')
            altura_cm = None
            if altura_bruta:
                numeros = ''.join(filter(str.isdigit, altura_bruta))
                if numeros: altura_cm = int(numeros)
                
            data_nasc = linha.get('Data Nasc.', None)
            pe_dominante = linha.get('Pé Preferido', None)
            
            
            query_graphql = """
            mutation ImportarMassa($nome: String!, $clube: String!, $posicao: String!, $dadosFM: AtualizarPerfilFMInput!, $alturaCm: Int, $dataNascimento: String, $peDominante: String, $fotoUrl: String) {
              importarMassaFM(nome: $nome, clube: $clube, posicao: $posicao, dadosFM: $dadosFM, alturaCm: $alturaCm, dataNascimento: $dataNascimento, peDominante: $peDominante, fotoUrl: $fotoUrl)
            }
            """
            
            
            
            payload = {
                "query": query_graphql,
                "variables": {
                    "nome": nome,
                    "clube": clube,
                    "posicao": posicao_principal,
                    "dadosFM": atributos_fm,
                    "alturaCm": altura_cm,
                    "dataNascimento": data_nasc,
                    "peDominante": pe_dominante,
                    "fotoUrl": foto_url
                }
            }
            
            try:
                resposta = requests.post("http://localhost:3001/graphql", json=payload)
                if resposta.status_code == 200 and "errors" not in resposta.json():
                    
                    status_foto = "📸" if foto_url else "👤"
                    print(f"✅ Injetado: {nome} ({clube}) {status_foto}")
                    sucessos += 1
                else:
                    print(f"❌ Erro ao salvar {nome}: {resposta.json().get('errors')}")
                    erros += 1
            except Exception as e:
                print(f"⚠️ Falha de rede no jogador {nome}: {e}")
                erros += 1
                
    print(f"\n🏁 CARGA CONCLUÍDA! Sucessos: {sucessos} | Erros: {erros}")

if __name__ == "__main__":
    pasta_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_absoluto_csv = os.path.join(pasta_atual, 'serie_a_fm.csv')
    processar_csv(caminho_absoluto_csv)