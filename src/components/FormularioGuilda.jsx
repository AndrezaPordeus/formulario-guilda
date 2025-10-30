// src/components/FormularioGuilda.jsx

import React, { useState, useEffect } from 'react';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcDA6kOeZDt7sYt3Ca4pC8UB9K3NNw_Aeo9cmZJO_NBI8dDmuTlBb4_S4qihLLJvV-Jw/exec';

function FormularioGuilda() {
  // Toda a lógica para gerenciar os dados do formulário e a lista de membros
  const [formData, setFormData] = useState({
    nome: '', classe: '', funcao: '', nivel: '', disponibilidade: '', apresentacao: '',
  });

  const [membros, setMembros] = useState(() => {
    try {
      const membrosSalvos = localStorage.getItem('membrosGuilda');
      return membrosSalvos ? JSON.parse(membrosSalvos) : [];
    } catch (error) {
      console.error('Erro ao carregar membros do localStorage:', error);
      return [];
    }
  });

  const [ultimosMembros, setUltimosMembros] = useState([]);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('membrosGuilda', JSON.stringify(membros));
    } catch (error) {
      console.error('Erro ao salvar membros no localStorage:', error);
    }
  }, [membros]);

  useEffect(() => {
    const buscarUltimosMembros = async () => {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        setUltimosMembros(data.slice(-3)); // Pega os três últimos
      } catch (error) {
        console.error('Erro ao buscar últimos membros:', error);
      }
    };
    buscarUltimosMembros();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarFormulario = () => {
    const novosErros = {};
    if (!formData.nome) novosErros.nome = 'O nome é obrigatório.';
    if (!formData.classe) novosErros.classe = 'A classe é obrigatória.';
    if (!formData.funcao) novosErros.funcao = 'A função é obrigatória.';
    if (!formData.disponibilidade) novosErros.disponibilidade = 'A disponibilidade é obrigatória.';
    if (!formData.apresentacao) novosErros.apresentacao = 'A apresentação é obrigatória.';
    if (!formData.nivel) {
      novosErros.nivel = 'O nível é obrigatório.';
    } else if (formData.nivel < 1 || formData.nivel > 80) {
      novosErros.nivel = 'O nível deve ser entre 1 e 80.';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setEnviando(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setMembros([...membros, formData]);
      setFormData({ nome: '', classe: '', funcao: '', nivel: '', disponibilidade: '', apresentacao: '' });
      alert('Inscrição enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar para o Google Sheets:', error);
      alert('Ocorreu um erro ao enviar sua inscrição. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  // A parte visual do formulário, estilizada com Tailwind CSS
  return (
    <div className="max-w-2xl mx-auto bg-temple-purple p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-fel-green font-titulo mb-1">Formulário de Inscrição da Guilda</h1>
      <p className="text-blade-gray text-center font-body mb-6">
            Você não está preparado!
          </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* ... (resto do código JSX do formulário) ... */}
        <div className="mb-4">
          <label className="block text-spectral-white text-sm font-bold mb-2 font-text">Nome do Jogador:</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Illidan-Azralon" className="w-full bg-slate-700 text-blade-gray border border-slate-600 rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fel-green" />
          {erros.nome && <p className="text-red-400 text-xs italic mt-1">{erros.nome}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div className="mb-4">
            <label className="block text-spectral-white text-sm font-bold mb-2 font-text">Classe:</label>
            <select name="classe" value={formData.classe} onChange={handleChange} className="w-full bg-slate-700 text-blade-gray border border-slate-600 rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fel-green">
              <option value="">Selecione sua classe</option>
              <option value="Guerreiro">Guerreiro</option>
              <option value="Paladino">Paladino</option>
              <option value="Caçador">Caçador</option>
              <option value="Ladino">Ladino</option>
              <option value="Sacerdote">Sacerdote</option>
              <option value="Xamã">Xamã</option>
              <option value="Mago">Mago</option>
              <option value="Bruxo">Bruxo</option>
              <option value="Druida">Druida</option>
              <option value="Druida">Monge</option>
              <option value="Cavaleiro da Morte">Cavaleiro da Morte</option>
              <option value="Caçador de Demônios">Caçador de Demônios</option>
              <option value="Conjurante">Conjurante</option>
            </select>
            {erros.classe && <p className="text-red-400 text-xs italic mt-1">{erros.classe}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-spectral-white text-sm font-bold mb-2 font-text">Função Principal:</label>
            <select name="funcao" value={formData.funcao} onChange={handleChange} className="w-full bg-slate-700 text-blade-gray border border-slate-600 rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fel-green">
              <option value="">Selecione sua função</option>
              <option value="Tank">Tank</option>
              <option value="Healer">Healer</option>
              <option value="DPS">DPS</option>
            </select>
            {erros.funcao && <p className="text-red-400 text-xs italic mt-1">{erros.funcao}</p>}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-spectral-white text-sm font-bold mb-2 font-text">Nível (1-80):</label>
          <input type="number" name="nivel" value={formData.nivel} onChange={handleChange} min="1" max="80" className="w-full bg-slate-700 text-blade-gray border border-slate-600 rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fel-green" />
          {erros.nivel && <p className="text-red-400 text-xs italic mt-1">{erros.nivel}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-spectral-white text-sm font-bold mb-2 font-text">Disponibilidade de Jogo:</label>
          <input type="text" name="disponibilidade" value={formData.disponibilidade} onChange={handleChange} placeholder="Ex: Noites durante a semana" className="w-full bg-slate-700 text-blade-gray border border-slate-600 rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fel-green" />
          {erros.disponibilidade && <p className="text-red-400 text-xs italic mt-1">{erros.disponibilidade}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-spectral-white text-sm font-bold mb-2 font-text">Breve Apresentação:</label>
          <textarea name="apresentacao" value={formData.apresentacao} onChange={handleChange} className="w-full bg-slate-700 text-blade-gray border border-slate-600 rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fel-green h-24 resize-none"></textarea>
          {erros.apresentacao && <p className="text-red-400 text-xs italic mt-1">{erros.apresentacao}</p>}
        </div>
        <button type="submit" disabled={enviando} className="w-full bg-fel-green hover:bg-fel-green/80 text-wing-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300">
          {enviando ? 'Enviando...' : 'Enviar Inscrição'}
        </button>
      </form>
      <div className="mt-12 border-t border-fel-green pt-6">
        <h2 className="text-2xl font-bold text-center text-fel-green font-titulo mb-4">Últimos Membros Recrutados</h2>
        {ultimosMembros.length === 0 ? (
          <p className="text-center text-blade-gray">Nenhum membro inscrito recentemente.</p>
        ) : (
          <ul className="space-y-3">
            {ultimosMembros.map((membro, index) => (
              <li key={index} className="bg-slate-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                <p className="font-bold text-spectral-white">{membro.nome} - <span className="font-normal text-blade-gray">{membro.classe} {membro.funcao}</span></p>
                <p className="text-fel-green font-semibold">Nível {membro.nivel}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-12 border-t border-fel-green pt-6">
        <h2 className="text-2xl font-bold text-center text-fel-green font-titulo mb-4">Membros Recrutados Nesta Sessão</h2>
        {membros.length === 0 ? (
          <p className="text-center text-blade-gray">Nenhum membro inscrito nesta sessão.</p>
        ) : (
          <ul className="space-y-3">
            {membros.map((membro, index) => (
              <li key={index} className="bg-slate-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                <p className="font-bold text-spectral-white">{membro.nome} - <span className="font-normal text-blade-gray">{membro.classe} {membro.funcao}</span></p>
                <p className="text-fel-green font-semibold">Nível {membro.nivel}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FormularioGuilda;