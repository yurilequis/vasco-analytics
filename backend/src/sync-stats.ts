import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function runPythonScraper(command: string, arg?: string): Promise<any> {
  const venvPath = path.join(process.cwd(), 'python_venv', 'Scripts', 'python.exe');
  const scriptPath = path.join(process.cwd(), 'src', 'scraping', 'python_scripts', 'sofascore.py');
  
  let execCmd = `"${venvPath}" "${scriptPath}" ${command}`;
  if (arg) {
    execCmd += ` ${arg}`;
  }

  const { stdout } = await execAsync(execCmd);
  return JSON.parse(stdout);
}

function parseStat(val: any) {
  if (typeof val === 'string' && val.includes('%')) {
    return parseFloat(val.replace('%', ''));
  }
  return parseInt(val) || 0;
}

async function main() {
  console.log('--- Iniciando Sincronização de Estatísticas (Script Direto) ---');
  
  try {
    const respostaJogos = await runPythonScraper('jogos');
    if (respostaJogos.erro) {
      console.error(respostaJogos.erro);
      return;
    }

    const jogos = respostaJogos.dados;
    for (const jogo of jogos) {
      if (jogo.status === 'Encerrada' && jogo.event_id) {
        console.log(`Processando detalhes para jogo ID ${jogo.event_id}: ${jogo.mandante} x ${jogo.visitante}`);
        
        try {
          const detalhes = await runPythonScraper('detalhes', jogo.event_id.toString());
          
          if (detalhes.estatisticas_equipes) {
            // Buscar a partida no banco
            const dataHoraObj = parsarData(jogo.data_partida);
            const partida = await prisma.partida.findFirst({
                where: { eventId: jogo.event_id }
            });

            if (partida) {
                const { mandante, visitante } = detalhes.estatisticas_equipes;
                
                // Salvar stats mandante
                await prisma.estatisticaEquipe.upsert({
                    where: { partidaId_equipeId: { partidaId: partida.id, equipeId: partida.equipeCasaId } },
                    update: {
                        posseBola: parseStat(mandante['Ball possession']),
                        xG: parseFloat(mandante['Expected goals']) || 0,
                        grandesChances: parseStat(mandante['Big chances']) || (parseStat(mandante['Big chances scored']) + parseStat(mandante['Big chances missed'])),
                        chutes: parseStat(mandante['Total shots']),
                        chutesGol: parseStat(mandante['Shots on target']),
                        chutesFora: parseStat(mandante['Shots off target']),
                        chutesNaTrave: parseStat(mandante['Hit woodwork']),
                        defesasGoleiro: parseStat(mandante['Goalkeeper saves']),
                        escanteios: parseStat(mandante['Corner kicks']),
                        faltas: parseStat(mandante['Fouls']),
                        impedimentos: parseStat(mandante['Offsides']),
                        passesTentados: parseStat(mandante['Total passes'] || mandante['Passes']),
                        passesCompletos: parseStat(mandante['Accurate passes']),
                        cartoesAmarelos: parseStat(mandante['Yellow cards']),
                        cartoesVermelhos: parseStat(mandante['Red cards']),
                    },
                    create: {
                        partidaId: partida.id,
                        equipeId: partida.equipeCasaId,
                        posseBola: parseStat(mandante['Ball possession']),
                        xG: parseFloat(mandante['Expected goals']) || 0,
                        grandesChances: parseStat(mandante['Big chances']) || (parseStat(mandante['Big chances scored']) + parseStat(mandante['Big chances missed'])),
                        chutes: parseStat(mandante['Total shots']),
                        chutesGol: parseStat(mandante['Shots on target']),
                        chutesFora: parseStat(mandante['Shots off target']),
                        chutesNaTrave: parseStat(mandante['Hit woodwork']),
                        defesasGoleiro: parseStat(mandante['Goalkeeper saves']),
                        escanteios: parseStat(mandante['Corner kicks']),
                        faltas: parseStat(mandante['Fouls']),
                        impedimentos: parseStat(mandante['Offsides']),
                        passesTentados: parseStat(mandante['Total passes'] || mandante['Passes']),
                        passesCompletos: parseStat(mandante['Accurate passes']),
                        cartoesAmarelos: parseStat(mandante['Yellow cards']),
                        cartoesVermelhos: parseStat(mandante['Red cards']),
                    }
                });

                // Salvar stats visitante
                await prisma.estatisticaEquipe.upsert({
                    where: { partidaId_equipeId: { partidaId: partida.id, equipeId: partida.equipeVisitanteId } },
                    update: {
                        posseBola: parseStat(visitante['Ball possession']),
                        xG: parseFloat(visitante['Expected goals']) || 0,
                        grandesChances: parseStat(visitante['Big chances']),
                        chutes: parseStat(visitante['Total shots']),
                        chutesGol: parseStat(visitante['Shots on target']),
                        chutesFora: parseStat(visitante['Shots off target']),
                        chutesNaTrave: parseStat(visitante['Hit woodwork']),
                        defesasGoleiro: parseStat(visitante['Goalkeeper saves']),
                        escanteios: parseStat(visitante['Corner kicks']),
                        faltas: parseStat(visitante['Fouls']),
                        impedimentos: parseStat(visitante['Offsides']),
                        passesTentados: parseStat(visitante['Total passes'] || visitante['Passes']),
                        passesCompletos: parseStat(visitante['Accurate passes']),
                        cartoesAmarelos: parseStat(visitante['Yellow cards']),
                        cartoesVermelhos: parseStat(visitante['Red cards']),
                    },
                    create: {
                        partidaId: partida.id,
                        equipeId: partida.equipeVisitanteId,
                        posseBola: parseStat(visitante['Ball possession']),
                        xG: parseFloat(visitante['Expected goals']) || 0,
                        grandesChances: parseStat(visitante['Big chances']),
                        chutes: parseStat(visitante['Total shots']),
                        chutesGol: parseStat(visitante['Shots on target']),
                        chutesFora: parseStat(visitante['Shots off target']),
                        chutesNaTrave: parseStat(visitante['Hit woodwork']),
                        defesasGoleiro: parseStat(visitante['Goalkeeper saves']),
                        escanteios: parseStat(visitante['Corner kicks']),
                        faltas: parseStat(visitante['Fouls']),
                        impedimentos: parseStat(visitante['Offsides']),
                        passesTentados: parseStat(visitante['Total passes'] || visitante['Passes']),
                        passesCompletos: parseStat(visitante['Accurate passes']),
                        cartoesAmarelos: parseStat(visitante['Yellow cards']),
                        cartoesVermelhos: parseStat(visitante['Red cards']),
                    }
                });
                console.log(`✅ Estatísticas salvas para ${jogo.mandante} x ${jogo.visitante}`);
            } else {
                console.warn(`⚠️ Partida não encontrada no banco para eventId ${jogo.event_id}`);
            }
          }
        } catch (e) {
          console.error(`Erro ao processar jogo ${jogo.event_id}:`, e);
        }
      }
    }
  } catch (error) {
    console.error('Erro geral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function parsarData(dataString: string | null): Date {
    if (!dataString || dataString === 'A definir') return new Date();
    try {
      const [data, hora] = dataString.split(' ');
      const [dia, mes, ano] = data.split('/');
      const [h, m] = (hora || '00:00').split(':');
      return new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(h),
        Number(m),
      );
    } catch {
      return new Date();
    }
}

main();
