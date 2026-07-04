# 🏋️ Treino em Casa

App pessoal de exercícios físicos para fazer em casa, **sem equipamento**.
Feito com HTML, CSS e JavaScript puro — não precisa instalar nada nem ter servidor.

## ✨ Funcionalidades

- **Rotinas prontas** (Corpo todo, HIIT rápido, Core & Abdômen, Pernas & Glúteos)
- **Timer de execução e descanso** guiando o treino passo a passo, com bip sonoro
- **Biblioteca de exercícios** com descrição e dicas de segurança, filtrável por nível
- **Histórico e estatísticas** (treinos totais, últimos 7 dias, dias em sequência)
- **Funciona offline** — os dados ficam salvos no próprio aparelho (`localStorage`)
- **Layout mobile-first** e tema escuro, pensado para usar no celular

## 🚀 Como usar

**No computador:** basta abrir o arquivo `index.html` no navegador.

**Servindo localmente** (recomendado, evita restrições de alguns navegadores):

```bash
cd treino-em-casa
python3 -m http.server 8000
# abra http://localhost:8000 no navegador
```

**No celular:** publique a pasta no [GitHub Pages](https://pages.github.com/)
e acesse pelo navegador do celular. Dá até para "Adicionar à tela inicial"
e usar como um app.

## 📁 Estrutura

```
treino-em-casa/
├── index.html        # estrutura da página
├── css/
│   └── style.css     # estilos (tema escuro, responsivo)
└── js/
    ├── dados.js      # base de exercícios e rotinas (fácil de editar/expandir)
    └── app.js        # lógica: navegação, timer do treino e histórico
```

## 🛠️ Como personalizar

Quer adicionar exercícios ou criar suas próprias rotinas? Edite o arquivo
`js/dados.js` — está todo comentado. É só seguir o modelo dos itens existentes.

## 💡 Próximos passos possíveis

- Criar rotinas personalizadas pela própria interface
- Contagem regressiva por voz
- Gráfico de evolução ao longo das semanas
- Transformar em PWA instalável (com ícone e uso offline completo)
