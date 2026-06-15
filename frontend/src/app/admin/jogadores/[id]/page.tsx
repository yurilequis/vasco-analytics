'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Flag, Ruler, Shirt, Edit2, Check, X, ArrowLeft, Target } from 'lucide-react';
// 👇 1. Trocamos useSession por getSession
import { getSession } from 'next-auth/react'; 
import { traduzirPosicao, POSICOES_DISPONIVEIS, FUNCOES_POR_POSICAO } from '@/utils/posicaoHelper';

interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
  };
  accessToken?: string;
}

interface EquipeItem {
  id: number;
  nome: string;
  estado: string | null;
}

interface JogadorDetalhado {
  id: number;
  nomePopular: string;
  nomeCompleto: string | null;
  posicao: string;
  posicaoSecundaria: string | null;
  funcoes: string | null;
  alturaCm: number | null;
  peDominante: string | null;
  dataNascimento: string | null;
  numeroCamisa: number | null;
  categoria: string | null;
  fotoUrl: string | null;
  biografia: string | null;
  ativo: boolean;
  emprestado: boolean;
  tipoContrato: string | null;
  clubeEmprestimo: string | null;
}

const OPCOES_PE = ['Direito', 'Esquerdo', 'Ambidestro'];

const formatarDataBr = (dataIso?: string | null) => {
  if (!dataIso) return '';
  const d = new Date(dataIso);
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const calcularIdadeNumero = (dataIso?: string | null) => {
  if (!dataIso) return null;
  const hoje = new Date();
  const nascimento = new Date(dataIso);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

export default function PerfilJogadorAdminPage() {
  const params = useParams();
  const router = useRouter();
  const jogadorId = Number(params?.id);

  // 👇 2. O token agora vive em um estado
  const [tokenJwt, setTokenJwt] = useState<string | null>(null);

  const [jogador, setJogador] = useState<JogadorDetalhado | null>(null);
  const [equipes, setEquipes] = useState<EquipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState<Partial<JogadorDetalhado>>({});

  useEffect(() => {
    if (!jogadorId) return;

    const inicializarDados = async () => {
      try {
        // 👇 3. Buscamos a sessão dinamicamente sem precisar do SessionProvider!
        const session = await getSession();
        const token = (session as CustomSession)?.user?.accessToken || (session as CustomSession)?.accessToken;
        if (token) setTokenJwt(token);

        // Busca o jogador
        const query = `
          query GetJogadorDetalhadoAdmin($id: Int!) {
            jogador(id: $id) {
              id
              nomeCompleto
              posicao
              posicaoSecundaria
              funcoes
              alturaCm
              peDominante
              dataNascimento
              numeroCamisa
              categoria
              fotoUrl
              biografia
              ativo
              emprestado
              tipoContrato
              clubeEmprestimo
            }
            equipes {
              id
              nome
              estado
            }
          }
        `;

        const resposta = await fetch((process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables: { id: jogadorId } }),
        });

        const json = await resposta.json();
        if (json.errors) throw new Error(json.errors[0].message);
        
        setJogador(json.data.jogador);
        setEquipes(json.data.equipes || []);
        setFormData(json.data.jogador);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro de conexão com o banco de dados.');
      } finally {
        setLoading(false);
      }
    };

    inicializarDados();
  }, [jogadorId]);

  const handleIniciarEdicao = () => {
    if (!jogador) return;
    const dataFormatadaInput = jogador.dataNascimento 
      ? new Date(jogador.dataNascimento).toISOString().split('T')[0] 
      : '';

    setFormData({
      ...jogador,
      dataNascimento: dataFormatadaInput
    });
    setEditando(true);
  };

  const handleSalvarAlteracoes = async () => {
    if (!jogadorId || !tokenJwt) {
      alert("Sessão expirada ou token não encontrado.");
      return;
    }
    
    setSalvando(true);

    const MUTATION_ATUALIZAR = `
      mutation AtualizarJogadorPerfil(
        $id: Int!, 
        $nomePopular: String,
        $nomeCompleto: String,
        $posicao: String,
        $posicaoSecundaria: String,
        $funcoes: String,
        $numeroCamisa: Int, 
        $alturaCm: Int, 
        $peDominante: String,
        $dataNascimento: String,
        $biografia: String,
        $ativo: Boolean,
        $emprestado: Boolean,
        $tipoContrato: String,
        $clubeEmprestimo: String
      ) {
        atualizarJogadorAdmin(
          id: $id, 
          nomePopular: $nomePopular,
          nomeCompleto: $nomeCompleto,
          posicao: $posicao,
          posicaoSecundaria: $posicaoSecundaria,
          funcoes: $funcoes,
          numeroCamisa: $numeroCamisa, 
          alturaCm: $alturaCm, 
          peDominante: $peDominante,
          dataNascimento: $dataNascimento,
          biografia: $biografia,
          ativo: $ativo,
          emprestado: $emprestado,
          tipoContrato: $tipoContrato,
          clubeEmprestimo: $clubeEmprestimo
        ) {
          id
          nomePopular
          posicao
          posicaoSecundaria
          funcoes
          biografia
          ativo
          emprestado
          tipoContrato
          clubeEmprestimo
        }
      }
    `;

    const variables = {
      id: jogadorId,
      nomePopular: formData.nomePopular || null,
      nomeCompleto: formData.nomeCompleto || null,
      posicao: formData.posicao || null,
      posicaoSecundaria: formData.posicaoSecundaria || null,
      funcoes: formData.funcoes || null,
      numeroCamisa: formData.numeroCamisa ? Number(formData.numeroCamisa) : null,
      alturaCm: formData.alturaCm ? Number(formData.alturaCm) : null,
      peDominante: formData.peDominante || null,
      dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento).toISOString() : null,
      biografia: formData.biografia || null,
      ativo: formData.ativo,
      emprestado: formData.emprestado,
      tipoContrato: formData.tipoContrato || 'DEFINITIVO',
      clubeEmprestimo: formData.clubeEmprestimo || null,
    };

    try {
      const resposta = await fetch((process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJwt}`
        },
        body: JSON.stringify({ query: MUTATION_ATUALIZAR, variables }),
      });
      
      const resultado = await resposta.json();
      if (resultado.errors) throw new Error(resultado.errors[0].message);

      setJogador(prev => prev ? { ...prev, ...variables } as JogadorDetalhado : null);
      setEditando(false);
      alert('✅ Perfil atualizado com sucesso no banco de dados!');
    } catch (err) {
      console.error(err);
      alert(`❌ Erro ao salvar alterações: ${err instanceof Error ? err.message : 'Erro interno'}`);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 flex items-center justify-center min-h-screen bg-[#0b0c10]">Carregando painel de controle do atleta...</div>;
  if (error) return <div className="p-8 text-red-400 flex items-center justify-center min-h-screen bg-[#0b0c10]">Erro ao carregar dados: {error}</div>;
  if (!jogador) return <div className="p-8 text-slate-400 flex items-center justify-center min-h-screen bg-[#0b0c10]">Atleta não localizado.</div>;

  const idade = calcularIdadeNumero(jogador.dataNascimento);
  const dataNascFormatada = formatarDataBr(jogador.dataNascimento);

  const equipesPorEstado = equipes.reduce((acc, eq) => {
    const uf = eq.estado || 'Outros / Exterior';
    if (!acc[uf]) acc[uf] = [];
    acc[uf].push(eq);
    return acc;
  }, {} as Record<string, EquipeItem[]>);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 p-6 font-sans">
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between bg-[#13151a] p-4 rounded-2xl border border-slate-800/50 shadow-sm">
        <button 
          onClick={() => router.push('/admin/elenco')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-black border border-slate-800/50 px-4 py-2 rounded-xl hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Plantel
        </button>

        <div className="flex gap-2">
          {editando ? (
            <>
              <button 
                onClick={() => setEditando(false)}
                disabled={salvando}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-zinc-700"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
              <button 
                onClick={handleSalvarAlteracoes}
                disabled={salvando}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow"
              >
                <Check className="w-4 h-4" /> {salvando ? 'Salvando...' : 'Confirmar e Salvar'}
              </button>
            </>
          ) : (
            <button 
              onClick={handleIniciarEdicao}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow"
            >
              <Edit2 className="w-4 h-4" /> Editar Informações e Biografia
            </button>
          )}
        </div>
      </div>

      {/* HEADER DO JOGADOR */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 bg-[#13151a] border border-slate-800/50 p-8 rounded-[32px] mb-8 max-w-7xl mx-auto shadow-sm">
        <div className="w-36 h-36 bg-[#0b0c10] rounded-2xl overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center shadow-xl">
          {jogador.fotoUrl ? (
            <img src={jogador.fotoUrl} alt={jogador.nomePopular} className="w-full h-full object-cover" />
          ) : (
            <Shirt className="w-16 h-16 text-slate-700" />
          )}
        </div>

        <div className="flex-1 space-y-4 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center md:justify-start">
            {editando ? (
              <input 
                type="text" 
                value={formData.nomePopular || ''} 
                onChange={e => setFormData({...formData, nomePopular: e.target.value})}
                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-2xl font-bold text-white focus:border-zinc-500 outline-none w-64"
              />
            ) : (
              <h1 className="text-3xl font-bold text-white tracking-tight">{jogador.nomePopular}</h1>
            )}
            
            <div className="flex items-center justify-center gap-2">
              {editando ? (
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-sm">
                  <span className="text-zinc-500 mr-1 text-xs font-bold">N°</span>
                  <input 
                    type="number" 
                    value={formData.numeroCamisa ?? ''} 
                    onChange={e => setFormData({...formData, numeroCamisa: e.target.value === '' ? null : Number(e.target.value)})}
                    className="bg-transparent text-emerald-400 font-bold outline-none w-12"
                  />
                </div>
              ) : (
                jogador.numeroCamisa && (
                  <span className="w-fit bg-emerald-600 text-white text-sm font-bold px-2 py-0.5 rounded">
                    N° {jogador.numeroCamisa}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-slate-300">{traduzirPosicao(jogador.posicao).nome}</span>
            </div>

            <div className="text-white font-semibold flex items-center gap-1">
              <span>Vasco da Gama</span>
              <span className="text-slate-500 font-normal">({jogador.categoria || 'Profissional'})</span>
            </div>

            <div className="flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-slate-500" />
              <span>Brasil</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {idade ? `${idade} anos` : 'Idade -'} 
                {dataNascFormatada && <span className="text-slate-600 ml-1">({dataNascFormatada})</span>}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CORPO / PAINEL PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        <div className="col-span-1 space-y-6">
          <div className="bg-[#13151a] border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-800 pb-2">
              Informações pessoais
            </h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Nome Completo</p>
                {editando ? (
                  <input 
                    type="text" 
                    value={formData.nomeCompleto || ''} 
                    onChange={e => setFormData({...formData, nomeCompleto: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-slate-200 outline-none focus:border-zinc-700"
                  />
                ) : (
                  <p className="text-slate-200 font-medium">{jogador.nomeCompleto || jogador.nomePopular}</p>
                )}
              </div>

              {/* ATIVO E EMPRESTADO */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-xs font-medium mb-1">Status no Clube</p>
                  {editando ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.ativo || false} 
                        onChange={e => setFormData({...formData, ativo: e.target.checked})}
                        className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-200">{formData.ativo ? 'Ativo' : 'Inativo / Sem Clube'}</span>
                    </label>
                  ) : (
                    <p className={`font-medium text-sm ${jogador.ativo ? 'text-emerald-400' : 'text-red-400'}`}>
                      {jogador.ativo ? 'Ativo' : 'Inativo / Sem Clube'}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-slate-500 text-xs font-medium mb-1">Contrato</p>
                  {editando ? (
                    <select
                      value={formData.tipoContrato || 'DEFINITIVO'} 
                      onChange={e => setFormData({...formData, tipoContrato: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-slate-200 outline-none focus:border-zinc-700 text-xs"
                    >
                      <option value="DEFINITIVO">Definitivo</option>
                      <option value="EMPRESTIMO">Empréstimo (Vasco pegou)</option>
                      <option value="EMPRESTADO">Emprestado (Vasco cedeu)</option>
                    </select>
                  ) : (
                    <p className={`font-medium text-sm ${jogador.tipoContrato === 'DEFINITIVO' ? 'text-slate-200' : 'text-amber-400'}`}>
                      {jogador.tipoContrato === 'EMPRESTADO' ? 'Emprestado' : jogador.tipoContrato === 'EMPRESTIMO' ? 'Empréstimo' : 'Definitivo'}
                    </p>
                  )}
                </div>
              </div>

              {/* CLUBE DE EMPRÉSTIMO */}
              {(editando ? (formData.tipoContrato === 'EMPRESTIMO' || formData.tipoContrato === 'EMPRESTADO') : (jogador.tipoContrato === 'EMPRESTIMO' || jogador.tipoContrato === 'EMPRESTADO')) && (
                <div>
                  <p className="text-slate-500 text-xs font-medium mb-1">Clube de Empréstimo</p>
                  {editando ? (
                    <select
                      value={formData.clubeEmprestimo || ''} 
                      onChange={e => setFormData({...formData, clubeEmprestimo: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-slate-200 outline-none focus:border-zinc-700"
                    >
                      <option value="">Selecione um Clube</option>
                      {Object.entries(equipesPorEstado).sort(([a],[b]) => a.localeCompare(b)).map(([estado, times]) => (
                        <optgroup key={estado} label={estado}>
                          {times.sort((a,b) => a.nome.localeCompare(b.nome)).map(t => (
                            <option key={t.id} value={t.nome}>{t.nome}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <p className="text-amber-400 font-medium">{jogador.clubeEmprestimo || 'Não informado'}</p>
                  )}
                </div>
              )}
              
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Data de Nascimento</p>
                {editando ? (
                  <input 
                    type="date" 
                    value={formData.dataNascimento || ''} 
                    onChange={e => setFormData({...formData, dataNascimento: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-slate-200 outline-none focus:border-zinc-700 color-scheme-dark"
                  />
                ) : (
                  <p className="text-slate-200">
                    {idade ? `${idade} anos` : '-'} 
                    {dataNascFormatada && <span className="text-slate-500 text-xs ml-2">({dataNascFormatada})</span>}
                  </p>
                )}
              </div>

              <div>
                <p className="text-slate-500 text-xs font-medium mb-0.5">Posição Principal</p>
                {editando ? (
                  <select 
                    value={formData.posicao || ''} 
                    onChange={e => {
                      // Ao trocar a posição principal, limpamos as funções se elas não pertencerem mais à nova posição (opcional, aqui decidimos apenas resetar)
                      setFormData({...formData, posicao: e.target.value, funcoes: null});
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-slate-200 outline-none focus:border-zinc-700"
                  >
                    <option value="">Selecione uma Posição</option>
                    {POSICOES_DISPONIVEIS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                ) : (
                  <p className="text-slate-400 font-medium bg-zinc-950/40 border border-zinc-900 px-2 py-1 rounded w-fit">
                    {jogador.posicao ? jogador.posicao : '-'}
                  </p>
                )}
              </div>

              <div>
                <p className="text-slate-500 text-xs font-medium mb-0.5">Posições Secundárias</p>
                {editando ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {POSICOES_DISPONIVEIS.map(pos => {
                      const selecionadas = formData.posicaoSecundaria ? formData.posicaoSecundaria.split(', ') : [];
                      const ativa = selecionadas.includes(pos);
                      return (
                        <label key={pos} className={`flex items-center gap-2 text-xs p-1.5 rounded cursor-pointer border ${ativa ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-zinc-800 bg-zinc-950/50 text-slate-400 hover:bg-zinc-900'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={ativa}
                            onChange={(e) => {
                              const novas = e.target.checked ? [...selecionadas, pos] : selecionadas.filter(p => p !== pos);
                              setFormData({...formData, posicaoSecundaria: novas.length > 0 ? novas.join(', ') : null});
                            }}
                          />
                          <div className={`w-3 h-3 rounded-sm flex items-center justify-center border ${ativa ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-900 border-zinc-700'}`}>
                            {ativa && <Check className="w-2.5 h-2.5 text-black" />}
                          </div>
                          {pos}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 font-medium bg-zinc-950/40 border border-zinc-900 px-2 py-1 rounded w-fit">
                    {jogador.posicaoSecundaria ? jogador.posicaoSecundaria : '-'}
                  </p>
                )}
              </div>

              {/* FUNÇÕES */}
              {(editando && formData.posicao && FUNCOES_POR_POSICAO[formData.posicao]) || (!editando && jogador.funcoes) ? (
                <div>
                  <p className="text-slate-500 text-xs font-medium mb-0.5">
                    {editando ? `Funções para ${formData.posicao}` : 'Função Tática'}
                  </p>
                  {editando ? (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {FUNCOES_POR_POSICAO[formData.posicao!].map(funcao => {
                        const selecionadas = formData.funcoes ? formData.funcoes.split(', ') : [];
                        const ativa = selecionadas.includes(funcao);
                        return (
                          <label key={funcao} className={`flex items-center gap-2 text-xs p-1.5 rounded cursor-pointer border ${ativa ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-zinc-800 bg-zinc-950/50 text-slate-400 hover:bg-zinc-900'}`}>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={ativa}
                              onChange={(e) => {
                                const novas = e.target.checked ? [...selecionadas, funcao] : selecionadas.filter(f => f !== funcao);
                                setFormData({...formData, funcoes: novas.length > 0 ? novas.join(', ') : null});
                              }}
                            />
                            <div className={`w-3 h-3 rounded-sm flex items-center justify-center border ${ativa ? 'bg-blue-500 border-blue-500' : 'bg-zinc-900 border-zinc-700'}`}>
                              {ativa && <Check className="w-2.5 h-2.5 text-black" />}
                            </div>
                            {funcao}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 font-medium bg-zinc-950/40 border border-zinc-900 px-2 py-1 rounded w-fit">
                      {jogador.funcoes}
                    </p>
                  )}
                </div>
              ) : null}

              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Altura (cm)</p>
                {editando ? (
                  <input 
                    type="number" 
                    value={formData.alturaCm ?? ''} 
                    onChange={e => setFormData({...formData, alturaCm: e.target.value === '' ? null : Number(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-slate-200 outline-none focus:border-zinc-700"
                  />
                ) : (
                  <p className="text-slate-200 flex items-center gap-2 font-medium">
                    {jogador.alturaCm ? `${jogador.alturaCm} cm` : 'Não informada'}
                    <Ruler className="w-3.5 h-3.5 text-slate-600" />
                  </p>
                )}
              </div>

              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Pé Preferido</p>
                {editando ? (
                  <select 
                    value={formData.peDominante || ''} 
                    onChange={e => setFormData({...formData, peDominante: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-slate-200 outline-none focus:border-zinc-700"
                  >
                    <option value="">Não informado</option>
                    {OPCOES_PE.map(pe => <option key={pe} value={pe}>{pe}</option>)}
                  </select>
                ) : (
                  <p className="text-slate-200 font-medium">{jogador.peDominante || 'Não informado'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#13151a] border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-800 pb-2">
              Biografia do Atleta
            </h2>
            {editando ? (
              <textarea 
                value={formData.biografia || ''} 
                onChange={e => setFormData({...formData, biografia: e.target.value})}
                placeholder="Escreva conquistas, clubes anteriores e a história do atleta..."
                className="w-full h-44 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-slate-200 text-xs focus:border-zinc-600 outline-none resize-none leading-relaxed"
              />
            ) : (
              <p className={`text-xs leading-relaxed whitespace-pre-line ${jogador.biografia ? 'text-slate-300' : 'text-slate-600 italic font-medium'}`}>
                {jogador.biografia || "Sem biografia"}
              </p>
            )}
          </div>

        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-[#13151a] border border-slate-800/50 rounded-3xl p-8 min-h-[220px] flex flex-col shadow-sm">
            <div className="mb-6 border-b border-slate-800/50 pb-4">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                Carreira & Transferências
              </h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800/50 rounded-xl bg-[#0b0c10]/50 gap-3">
              <div className="p-3 bg-[#1a1c23] rounded-full">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Módulo em Desenvolvimento</p>
            </div>
          </div>

          <div className="bg-[#13151a] border border-slate-800/50 rounded-3xl p-8 min-h-[220px] flex flex-col shadow-sm">
            <div className="mb-6 border-b border-slate-800/50 pb-4">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                Resumo da Última Partida
              </h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800/50 rounded-xl bg-[#0b0c10]/50 gap-3">
              <div className="p-3 bg-[#1a1c23] rounded-full">
                <Target className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Estatísticas não integradas ainda</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}