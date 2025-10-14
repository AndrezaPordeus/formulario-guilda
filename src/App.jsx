// src/App.jsx

import React from 'react';
import FormularioGuilda from './components/FormularioGuilda';

function App() {
  return (
    // Aqui criamos o container principal da página.
    // Usamos classes do Tailwind CSS para:
    // - Dar um fundo bem escuro: bg-slate-900
    // - Garantir que ele ocupe a altura toda da tela: min-h-screen
    // - Adicionar um espaçamento nas bordas para o conteúdo não ficar colado: p-4 sm:p-8
    <main className="bg-slate-900 min-h-screen p-4 sm:p-8">
      <FormularioGuilda />
    </main>
  );
}

export default App;