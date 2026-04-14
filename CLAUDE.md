# CLAUDE.md — Gerar Vida (Aplicativo Gestante Clínica)

Contexto do projeto para uso nas conversas de desenvolvimento. Atualizar sempre que houver mudanças significativas.

---

## Visão Geral

Aplicativo mobile-first de acompanhamento pré-natal chamado **Gerar Vida**, voltado para gestantes em atendimento privado em clínicas. É um protótipo de alta fidelidade construído em **HTML/CSS/JS puro**, sem frameworks ou dependências externas.

---

## Stack Tecnológica

- **HTML5 + CSS3 + JavaScript Vanilla** — sem frameworks, sem build step, sem npm
- **Sem arquivos CSS separados** — todo o CSS é inline dentro de style nas próprias páginas
- **Google Fonts:** Inter (400, 500, 600, 700, 800)
- **APIs nativas usadas:** Canvas API, Touch Events, localStorage, requestAnimationFrame
- **Idioma:** Português (pt-BR)
- **Plataforma alvo:** Mobile (iOS + Android), com suporte a mouse/wheel para preview no desktop

---

## Estrutura de Arquivos

- CLAUDE.md — Este arquivo
- index.html — Ponto de entrada (redireciona para login.html)
- home.html — Dashboard principal da paciente
- onboarding.html — Fluxo de onboarding (3 slides)
- chat.html — Chat com equipe de saúde
- area_medica.html — Área médica (exames, medicamentos)
- perfil.html — Perfil do usuário
- nomes.html — Seletor de nomes com gráfico de popularidade
- feto3d.html — Visualizador 3D interativo do feto
- consultas.html — Consultas/agendamentos com confirmação e remarcação
- contracoes.html — Contador de contrações com timer
- glicose.html — Monitor de glicose com histórico e gráfico de evolução
- pressao.html — Mapa da pressão arterial com histórico e gráfico de evolução
- avisos.html — Avisos da clínica com accordion e filtros por categoria
- prontuario.html — Prontuário gestacional completo da paciente
- dashboard_medico.html — Dashboard do médico (agenda + lista de pacientes)
- medico_pacientes.html — Lista de pacientes do médico com busca e filtros
- paciente_detalhe.html — Detalhe clínico de paciente (para o médico)
- dashboard_secretaria.html — Dashboard da secretaria (agenda + gestão)
- assets/ — Imagens PNG (avatar_agente, avatar_maria, feto_realista, feto3d, fetus_3d, gestante_composicao, gestante_fundo_verde, avocado, onboarding_*)

---

## Design System (CSS Variables)

Variáveis usadas em todas as páginas:

- --bg: #F4F6F4 — Fundo verde-menta claro
- --primary: #8DAA91 — Verde-sálvia primário
- --primary-light: #C5D5C8 — Verde-sálvia mais claro
- --primary-dk: #5E7E63 — Verde-sálvia escuro (usado em subpáginas)
- --accent: #E5987D — Coral/pêssego de destaque
- --dark-card: #301B28 — Ameixa escura (cards dark)
- --text: #2D312E — Quase-preto
- --text-secondary: #8DAA91 — Verde-sálvia (texto secundário)
- --text-mid: #6B7471 — Cinza médio (usado em subpáginas)
- --text-inactive: #A0AAB2 — Cinza (inativo/desabilitado)
- --white: #ffffff
- --radius: 20px — Border radius padrão

---

## Contexto do Produto

O app foi pivotado de SUS/UBS para **atendimento privado em clínicas**. O modelo de negócio é **SaaS white-label**: vender o app para várias clínicas, cada uma personalizando logo e cores. Há 3 perfis distintos: paciente, médico(a) e secretaria.

**Estratégia atual:** usar o HTML como demo interativo para fechar as primeiras clínicas. Após validar demanda, migrar para Next.js + Supabase.

---

## Páginas e Funcionalidades

### home.html — Dashboard da Paciente (página principal)

- Verifica localStorage[onboarded] ao carregar; redireciona para onboarding.html se não existir
- Header fixo: saudação + semana atual (semana 24) + avatar
- Barra de progresso da gravidez (24/42 semanas = 57.14%)
- Carrossel de 2 cards: card escuro com feto 3D (link para feto3d.html) + card nutricional (abacate)
- Swipe touch + drag mouse + dots indicadores + setas arrow-btn
- Atalhos Rápidos (8 botões em scroll horizontal): Exames, Chat, Meus Meds, Consultas, Nomes, Contrações, Pressão, Glicose
- Card de Prontuário (link para prontuario.html) logo abaixo da upcoming-card, mesmo estilo com ícone verde
- Seção "Avisos da Clínica" abaixo de Dicas da Semana: mostra 2 avisos mais recentes com badge "Novo" + link "Ver todos" → avisos.html
- Card de próxima consulta (link para consultas.html)
- Seção Dicas da Semana (4 cards horizontais)
- Seção Dicas de Especialistas (5 video-cards horizontais com modal bottom sheet por vídeo)
- Modal de vídeo: thumb colorida, categoria, título, descrição, profissional, botão Assistir agora (url null = alerta placeholder)
- Bottom navigation (Home, Perfil)

NOTA: index.html era o dashboard antes do pivô para login. O dashboard real da paciente é home.html.

### onboarding.html — Onboarding

- 3 slides: boas-vindas, funcionalidades 3D, benefícios da clínica (Médico Dedicado / Resultados Online / Canal 24h)
- Navegação por swipe ou botões
- Dots indicadores
- Salva localStorage[onboarded] = true ao concluir

### chat.html — Chat

- Conversa com equipe de saúde (Oi, Dra. Ana)
- Balões de mensagem: usuária (direita, cor accent) + equipe (esquerda, com avatar)
- Quick reply chips contextuais
- Indicador de digitação animado (1.8s delay para auto-resposta)
- Textarea que cresce automaticamente
- Envio com Enter, nova linha com Shift+Enter
- Função escapeHtml() para prevenção de XSS

### area_medica.html — Área Médica

- Tabs: Exames e Medicamentos
- Lista de registros médicos

### perfil.html — Perfil

- Card de perfil: avatar + nome (Maria da Silva) + semana 24 + Prontuário 2024-00847
- Card da clínica com nome da médica (Dra. Ana Lima — Obstetra)
- Menus: Documentos & Dados, Preferências
- Modal bottom sheet de configurações com toggles de notificação

### nomes.html — Nomes

- Lista de nomes em 2 colunas (meninas / meninos) com filtro de gênero
- Card de cada nome: nome, badge de gênero, origem, significado
- Modal bottom sheet ao clicar: detalhes + gráfico de popularidade em Canvas (2015-2024)
- Botão Guardar no Top 1

### feto3d.html — Feto 3D

- Fundo escuro (ameixa #301B28)
- Imagem do feto com sobreposição de iluminação
- Hotspots clicáveis com info card (bottom sheet)
- Zoom com botões +/-, wheel do mouse, pinch touch
- Pan com drag (mouse ou 1 dedo)
- Double-tap para resetar escala/posição
- Scale clampada entre 0.8x e 3.2x

### consultas.html — Consultas

- Próxima consulta em card --primary com detalhes
- **Confirmação de presença:** botão "Confirmar presença" vira badge "✓ Presença confirmada"; estado persistido em localStorage key 'gv_consulta_proxima_status'
- **Remarcação:** botão "Solicitar remarcação" abre bottom sheet com 4 chips de motivo selecionáveis + campo observação; ao enviar vira badge "⏳ Remarcação solicitada"; estado persistido
- Ao carregar, verifica localStorage e renderiza estado correto (renderApptActions())
- Histórico com botão "Ver detalhes" em cada card → bottom sheet com dados mockados (tipo, data, médico, local, observações)
- Botão Agendar Nova ao final da lista

### contracoes.html — Contador de Contrações (NOVO)

- Stats row: total de contrações, duração média, intervalo médio
- Botão circular grande (180px) com press-and-hold para cronometrar a contração
  - Estado inativo: verde com anéis pulsantes lentos (@keyframes ring-idle)
  - Estado ativo: coral com anéis pulsantes rápidos (@keyframes ring-active); timer conta segundos
  - Ao soltar: registra duração e intervalo desde a contração anterior
- Hint text contextual acima do botão
- Mensagem última gravada aparece após primeiro registro
- Lista de contrações: índice, horário, duração, intervalo
- Botão Limpar para resetar a sessão
- Dados persistidos em localStorage
- Sem bottom navigation — header com botão voltar

### glicose.html — Monitor de Glicose

- Stats row: total de medições, última leitura (mg/dL), status atual
- **Gráfico de evolução (Canvas):** linha --primary, área preenchida, linha tracejada --accent em 95 mg/dL ("limite normal"), dados do localStorage ou mock de 5 pontos; redesenha via drawChart() ao salvar
- Histórico em lista: valor, momento da medição, observação, badge de classificação
- Classificação automática: Normal / Atenção / Alto (baseada em valor e contexto — jejum vs pós-refeição)
- Modal Registrar Glicose: campo numérico mg/dL, select de momento, observação opcional (máx 80 chars)
- Dados persistidos em localStorage (chave storageKey)
- FAB coral para abrir modal
- Sem bottom navigation — header com botão voltar

### pressao.html — Mapa da Pressão

- Stats row: total de medições, média sistólica, média diastólica, pico máximo
- **Gráfico de evolução duplo (Canvas):** linha sistólica --primary, linha diastólica --accent, linha tracejada vermelha em 140 mmHg ("limite hipertensão"), legenda inline; dados do localStorage ou mock de 5 pontos; redesenha ao salvar
- Histórico em lista: sistólica/diastólica, momento, pulso (bpm) opcional, badge de classificação
- Classificação automática: Normal / Atenção / Alto (risco pré-eclâmpsia)
- Modal Registrar Pressão: campos sistólica e diastólica, pulso opcional, select de momento
- Dados persistidos em localStorage (chave storageKey)
- FAB coral para abrir modal
- Sem bottom navigation — header com botão voltar

### avisos.html — Avisos da Clínica (NOVO)

- Header com botão voltar para home.html + bottom nav Home/Perfil
- Filtros horizontais por categoria: Todos / Agenda / Saúde / Clínica / Geral
- Lista de 5 avisos mock em cards brancos com accordion (expand/collapse por clique)
- Cada aviso: ícone colorido por categoria, título, descrição curta, data relativa, badge "Novo" para não lidos
- Expand mostra texto completo via max-height transition
- Apenas um aviso expandido por vez (os demais colapsam)
- 2 avisos marcados como novos (Recesso de Carnaval e Campanha de Vacinação)

### prontuario.html — Meu Prontuário (NOVO)

- Header com botão voltar, sem bottom nav (subpágina)
- Card escuro (dark-card) no topo: nome, prontuário, DUM, DPP, semana atual, tipo sanguíneo, alergias
- Seção "Evolução do Peso": tabela de 6 entradas mock (semanas 12–24)
- Seção "Altura Uterina": tabela de 4 entradas mock (semanas 16–24)
- Seção "Posição do Bebê": card com posição "Cefálico" e data de registro pela médica
- Seção "Intercorrências": 2 cards mock com barra colorida por severidade (Atenção/Leve)
- FAB coral "+ Registrar peso" → bottom sheet com input numérico e botão salvar (mock, só fecha)

### dashboard_medico.html — Dashboard do Médico

- Header: nome da médica + data + avatar
- Clinic badge: nome da clínica e especialidade
- Stats: consultas hoje / pacientes ativas / exames pendentes
- Agenda do dia: timeline com status (Realizada / Em curso / Próxima)
- Lista de pacientes: badge semana gestacional, indicador de risco (baixo/atenção/alto), alertas de exames
- Bottom nav: Início, Pacientes, Agenda, Chat

### medico_pacientes.html — Lista de Pacientes (Médico) (NOVO)

- Barra de busca por nome ou prontuário
- Filtros por risco (Todos / Baixo / Atenção / Alto)
- Cards de pacientes com semana gestacional, indicador de risco e próxima consulta
- Bottom nav: Início, Pacientes, Agenda, Chat

### paciente_detalhe.html — Detalhe de Paciente (Médico)

2 abas: **Cartão** e **Sinais Vitais**. Tab ativa ao abrir: Cartão.

**Aba Cartão** — prontuário digital completo, todos os campos editáveis pela médica, salvos em localStorage (key: `gv_cartao_1498`):
- **Seção 1 — Identificação:** Nome do bebê, acompanhante, hospital, classificação de risco (select com borda verde/vermelha), altura + peso inicial + IMC calculado (badge automático), nº de fetos, paridade, fatores de risco, DPP, previsão de cesárea
- **Seção 2 — Dados Clínicos:** Alergias, medicamentos, doenças crônicas, cirurgias anteriores, histórico ginecológico, antecedentes familiares, profissão, vícios e hábitos, observações
- **Seção 3 — Exames Especiais:** Tipo sanguíneo (badge colorido), NIPT, TOTG/Curva glicêmica (3 inputs com validação de limite + badge Normal/Alterado), Estreptococo do Grupo B (toggle 3 estados)
- **Seção 4 — Consultas:** Botão "+ Nova Consulta" expande formulário colapsável (data, IG calculada, PA, peso, BCF, AU, toque, movimentação, apresentação, edema, observações, conduta, CID). Histórico de 3 consultas mock colapsáveis com badge de risco por PA. Salvo em `gv_consultas_1498`
- **Seção 5 — Ultrassonografias:** Botão "+ Novo USG" expande formulário (tipo, data, IG calculada, apresentação, placenta, LA, BCF, peso fetal, percentil, obs). 3 USGs mock colapsáveis. Salvo em `gv_usg_1498`
- **Seção 6 — Exames Laboratoriais:** Botão "+ Nova Coleta" expande formulário (data, Hb/Ht, plaquetas, glicemia jejum, TSH, ferritina, vitamina D, B12, EAS, urocultura, sorologias com toggles Reagente/Não reagente para 10 tipos). 2 coletas mock colapsáveis. Salvo em `gv_exames_1498`
- **Seção 7 — Vacinas:** Botão "+ Registrar Vacina" expande formulário (vacina select, data, dose, status toggle 3 estados, reações). Lista de 4 vacinas mock com badges de status. Salvo em `gv_vacinas_1498`
- **Seção 8 — Notas da Médica:** Fundo amarelado + borda coral esquerda. Ícone de cadeado + aviso "Conteúdo privado". Textarea com auto-save debounce 800ms + timestamp. Salvo em `gv_notas_medica_1498`
- Cada seção tem botão "Salvar alterações" com feedback visual (borda verde 1.5s)

**Aba Sinais Vitais** — 3 sub-seções colapsáveis (clique no header para expandir/colapsar):
- **Contrações** (fechada por padrão): stats row 4 colunas, botão circular press-and-hold com timer e animações ring-idle/ring-active, lista de contrações do dia, botão Limpar sessão
- **Pressão Arterial** (aberta): stats row 4 colunas, alerta de hipertensão, lista com badges, botão inline "Registrar Pressão" → modal bottom sheet
- **Glicose** (aberta): stats row 4 colunas, alerta glicose elevada, lista com badges, botão inline "Registrar Glicose" → modal bottom sheet
- loadContracoes(), loadPressao(), loadGlicose() chamadas ao abrir a aba Sinais Vitais

### dashboard_secretaria.html — Dashboard da Secretaria

- Header escuro (dark-card): nome, data, notificações
- Stats: consultas do dia, confirmadas, pendentes, total de pacientes
- Barra de busca de pacientes
- Ações rápidas (grid 2x2): Novo Agendamento, Cadastrar Paciente, Enviar Lembrete, Relatório do Dia
- Agenda do dia: timeline com médica responsável e status (Realizada / Em curso / Confirmada / Pendente)
- Lista de pacientes com prontuário e semana gestacional
- FAB coral para novo agendamento
- Bottom nav: Início, Agenda, Pacientes, Relatórios

---

## Padrões de Código

### CSS

- Inline dentro de style em cada HTML
- BEM-like com kebab-case: .modal-overlay, .quick-btn, .nav-item-text
- Safe areas iOS: env(safe-area-inset-top), env(safe-area-inset-bottom)
- Viewport height dinâmica: 100dvh
- Scrollbar hiding: ::-webkit-scrollbar { display: none }
- will-change: transform no track do carrossel

### JavaScript

- Funções globais em camelCase: openModal, sendMessage, applyTransform
- IDs descritivos: carouselTrack, chatScroll, modalOverlay
- Event handlers inline (onclick, oninput) para ações simples
- addEventListener para lógica mais complexa (touch, mouse, wheel)
- requestAnimationFrame para animações e desenho de canvas
- passive: true em listeners de scroll/touch
- localStorage para persistência em glicose, pressão e contrações

### Componentes Reutilizados

- Card branco (.card) — múltiplas páginas
- Botão de ação rápida (.quick-btn) — home.html
- Bottom sheet modal (.modal-overlay + .modal-sheet) — nomes, perfil, feto3d, glicose, pressão
- Bottom navigation (.nav-item) — maioria das páginas
- Balão de chat (.bubble variantes) — chat.html
- Header com voltar — subpáginas
- Stats row (.stats-row + .stat-box) — contracoes, glicose, pressao
- FAB coral — glicose, pressao, consultas, secretaria

---

## Navegação entre Páginas

Navegação via links HTML simples (href=pagina.html), sem roteador.

- index/login → home: seleção de perfil Paciente
- onboarding → home: botão Começar (salva localStorage)
- home → chat: botão Chat
- home → area_medica: botões Exames / Meus Meds
- home → nomes: botão Nomes
- home → consultas: botão Consultas
- home → contracoes: botão Contrações
- home → glicose: botão Glicose
- home → pressao: botão Pressão
- home → avisos: botão Avisos (com badge "2" vermelho)
- home → prontuario: botão Prontuário
- home → feto3d: botão VER EM 3D no card escuro
- home / perfil entre si: bottom navigation
- qualquer subpágina → home: botão voltar no header

---

## Mudanças SUS → Clínica Privada (já aplicadas)

- perfil.html: CNS → Prontuário 2024-00847; Minha UBS → Minha Clínica; Agente Roberto → Dra. Ana Lima (Obstetra)
- chat.html: Chat com Equipe; Agente de Saúde → Equipe de Saúde; Oi Roberto → Oi, Dra. Ana
- home.html: Atalhos Rápidos UBS → Atalhos Rápidos; Chat Agente → Chat; UBS Centro → Clínica Gerar Vida
- onboarding.html: App UBS → Gerar Vida; slide 3 reescrito (Médico Dedicado / Resultados Online / Canal 24h)
- consultas.html: UBS Centro da Cidade → Clínica Gerar Vida

---

## Problemas Conhecidos e Workarounds Históricos

Bugs já corrigidos — evitar reintroduzir:

1. iOS scroll snap causava margin-left: 0 forçado → removido scroll-snap do carrossel
2. Margem do primeiro item do carrossel precisou ser 24px para alinhar com o título
3. Padding do scroll ajustado para 16px para compensar margem interna do ícone
4. FAB em consultas.html com position: fixed causava problema com safe-area → movido para o fluxo normal

---

## Convenções de Commit

Seguir padrão Conventional Commits:

- feat: — nova funcionalidade
- fix: — correção de bug
- refactor: — refatoração sem mudança de comportamento
- Escopo entre parênteses: fix(home):, fix(contracoes):
- Mensagens em português

---

## Instruções para Atualização deste Arquivo

Atualizar CLAUDE.md sempre que:

- Uma nova página for adicionada
- Uma funcionalidade existente for significativamente alterada
- Novos padrões de CSS ou JS forem estabelecidos
- Novos assets forem adicionados
- Bugs com workarounds importantes forem corrigidos
- A paleta de cores ou design system for modificado

# gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills:
`/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`