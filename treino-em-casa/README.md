# 🏋️ Treino em Casa

App pessoal de exercícios físicos para fazer em casa, **sem equipamento ou com 1 halter**.
Feito com HTML, CSS e JavaScript puro — não precisa instalar nada nem ter servidor,
e funciona **offline**.

## ✨ Funcionalidades

- **Anamnese**: um questionário rápido (objetivo, nível, frequência, tempo, equipamento
  e limitações) que **monta um treino personalizado** para o seu perfil.
- **Exercícios com 1 halter**: rosca, desenvolvimento, remada, agachamento goblet,
  afundo, tríceps, RDL e mais — com sugestão de carga (**leve 4kg / médio 8kg / pesado 12kg**,
  pensadas para um halter com discos de 2×2kg + 2×4kg).
- **Animações de cada exercício**: um boneco animado em SVG mostra o movimento
  (tudo vetorial, sem imagens externas).
- **Rotinas prontas** (peso do corpo e com halter) + timer de execução e descanso com bip.
- **Biblioteca de exercícios** com descrição, dicas de segurança e filtro por equipamento.
- **Histórico e estatísticas** (treinos totais, últimos 7 dias, dias seguidos).
- Layout **mobile-first**, tema escuro, dados salvos no próprio aparelho (`localStorage`).

## 🚀 Como usar

**No computador:** abra o arquivo `index.html` no navegador.

**Servindo localmente** (recomendado):

```bash
cd treino-em-casa
python3 -m http.server 8000
# abra http://localhost:8000
```

**No celular:** publique a pasta no [GitHub Pages](https://pages.github.com/) e acesse
pelo navegador do celular. Dá para "Adicionar à tela inicial" e usar como um app.

## 📁 Estrutura

```
treino-em-casa/
├── index.html
├── css/
│   ├── style.css        # layout, tema escuro, anamnese
│   └── animacoes.css     # keyframes das animações dos exercícios
└── js/
    ├── dados.js          # exercícios (peso do corpo + halter) e rotinas
    ├── animacoes.js      # gera o boneco animado em SVG de cada movimento
    ├── anamnese.js        # questionário + gerador de treino personalizado
    └── app.js            # navegação, timer do treino e histórico
```

## 🛠️ Como personalizar

- **Exercícios e rotinas:** edite `js/dados.js` (todo comentado).
- **Cargas do halter:** ajuste o objeto `HALTER` em `js/dados.js`.
- **Regras do treino personalizado:** função `gerarPlano()` em `js/anamnese.js`.

## 💡 Próximos passos possíveis

- Criar rotinas personalizadas pela própria interface
- Contagem regressiva por voz
- Gráfico de evolução ao longo das semanas
- Transformar em PWA instalável (ícone + offline completo)

> ⚠️ Este app é uma ferramenta de organização de treino para uso pessoal e não
> substitui a orientação de um profissional de educação física.
