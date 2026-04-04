# CLAUDE.md — Gerar Vida (Aplicativo Gestante Clínica)

Contexto do projeto para uso nas conversas de desenvolvimento. Atualizar sempre que houver mudanças significativas.

---

## Visão Geral

Aplicativo mobile-first de acompanhamento pré-natal chamado **"Gerar Vida"**, voltado para gestantes atendidas pelo sistema público de saúde brasileiro (SUS/UBS). É um protótipo de alta fidelidade construído em **HTML/CSS/JS puro**, sem frameworks ou dependências externas.

---

## Stack Tecnológica

- **HTML5 + CSS3 + JavaScript Vanilla** — sem frameworks, sem build step, sem npm
- **Sem arquivos CSS separados** — todo o CSS é inline dentro de `<style>` nas próprias páginas
- **Google Fonts:** Inter (400, 500, 600, 700, 800)
- **APIs nativas usadas:** Canvas API, Touch Events, localStorage, requestAnimationFrame
- **Idioma:** Português (pt-BR)
- **Plataforma alvo:** Mobile (iOS + Android), com suporte a mouse/wheel para preview no desktop

---

## Estrutura de Arquivos

```
/
├── CLAUDE.md                      # Este arquivo
├── index.html                     # Dashboard da paciente (home)
├── onboarding.html                # Fluxo de onboarding (3 slides)
├── chat.html                      # Chat com equipe de saúde
├── area_medica.html               # Área médica (exames, medicamentos)
├── perfil.html                    # Perfil do usuário
├── nomes.html                     # Seletor de nomes com gráfico de popularidade
├── feto3d.html                    # Visualizador 3D interativo do feto
├── consultas.html                 # Consultas/agendamentos
├── dashboard_medico.html          # Dashboard do médico (lista de pacientes + agenda)
├── dashboard_secretaria.html      # Dashboard da secretaria (agenda + gestão)
└── assets/                        # Imagens PNG
    ├── avatar_agente.png
    ├── avatar_maria.png
    ├── feto_realista.png
    ├── feto3d.png
    ├── fetus_3d.png
    ├── gestante_composicao.png
    ├── gestante_fundo_verde.png
    ├── avocado.png
    └── onboarding_*.png (múltiplos)
```

---

## Design System (CSS Variables)

```css
:root {
  --bg: #F4F6F4;              /* Fundo verde-menta claro */
  --primary: #8DAA91;         /* Verde-sálvia primário */
  --primary-light: #C5D5C8;   /* Verde-sálvia mais claro */
  --accent: #E5987D;          /* Coral/pêssego de destaque */
  --dark-card: #301B28;       /* Ameixa escura (cards dark) */
  --text: #2D312E;            /* Quase-preto */
  --text-secondary: #8DAA91;  /* Verde-sálvia (texto secundário) */
  --text-inactive: #A0AAB2;   /* Cinza (inativo/desabilitado) */
  --white: #ffffff;
  --radius: 20px;             /* Border radius padrão */
}
```

---

## Contexto do Produto

O app foi pivotado de SUS/UBS para **atendimento privado em clínicas**. O modelo de negócio é **SaaS white-label**: vender o app para várias clínicas, cada uma personalizando logo e cores. Há 3 dashboards distintos: paciente, médico(a) e secretaria.

**Estratégia atual:** usar o HTML como demo interativo para fechar as primeiras clínicas. Após validar demanda, migrar para Next.js + Supabase.

---

## Páginas e Funcionalidades

### `index.html` — Dashboard
- Saudação + semana atual (semana 24)
- Barra de progresso da gravidez (24/42 semanas)
- Carrossel de 2 cards: card escuro com feto 3D + card nutricional (abacate)
- Botões de ações rápidas (6): Exames, Chat Agente, Meus Meds, Consultas, Nomes
- Card de próxima consulta
- Seção "Dicas da Semana" (4 dicas)
- Bottom navigation (Home, Perfil)

### `onboarding.html` — Onboarding
- 3 slides: boas-vindas, funcionalidades 3D, benefícios municipais
- Navegação por swipe ou botões
- Dots indicadores
- Salva `localStorage['onboarded'] = 'true'` ao concluir

### `chat.html` — Chat
- Conversa com agente "Roberto" (com indicador de online pulsante)
- Balões de mensagem: usuária (direita, cor accent) + agente (esquerda, com avatar)
- Quick reply chips contextuais
- Indicador de digitação animado (1.8s delay para auto-resposta)
- Textarea que cresce automaticamente
- Envio com Enter, nova linha com Shift+Enter
- Função `escapeHtml()` para prevenção de XSS

### `area_medica.html` — Área Médica
- Tabs: Exames e Medicamentos
- Lista de registros médicos

### `perfil.html` — Perfil
- Card de perfil: avatar + nome (Maria da Silva) + semana 24 + CNS
- Card da UBS com nome do agente
- Menus: Documentos & Dados, Preferências
- Modal bottom sheet de configurações com toggles de notificação

### `nomes.html` — Nomes
- Lista de nomes em 2 colunas (meninas / meninos) com filtro de gênero
- Card de cada nome: nome, badge de gênero, origem, significado
- Modal bottom sheet ao clicar: detalhes + gráfico de popularidade desenhado em Canvas (2015-2024)
- Botão "Guardar no Top 1"

### `feto3d.html` — Feto 3D
- Fundo escuro (ameixa #301B28)
- Imagem do feto com sobreposição de iluminação
- Hotspots clicáveis com info card (bottom sheet)
- Zoom com botões + / -, wheel do mouse, pinch touch
- Pan com drag (mouse ou 1 dedo)
- Double-tap para resetar escala/posição
- Scale clampada entre 0.8x e 3.2x

### `consultas.html` — Consultas
- Lista de consultas pré-natais
- FAB para agendar nova consulta

### `dashboard_medico.html` — Dashboard do Médico (novo)
- Header: nome da médica + data + avatar
- Clinic badge: nome da clínica e especialidade
- Linha de stats: consultas hoje / pacientes ativas / exames pendentes
- Agenda do dia: timeline com status (Realizada / Em curso / Próxima)
- Lista de pacientes: badge de semana gestacional, indicador de risco (baixo/atenção/alto), alertas de exames
- Bottom nav: Início, Pacientes, Agenda, Chat

### `dashboard_secretaria.html` — Dashboard da Secretaria (novo)
- Header escuro (dark-card): nome, data, botão de notificações
- Stats em destaque: consultas do dia, confirmadas, pendentes, total de pacientes
- Barra de busca de pacientes
- Ações rápidas (grid 2x2): Novo Agendamento, Cadastrar Paciente, Enviar Lembrete, Relatório do Dia
- Agenda do dia: timeline com médica responsável e status (Realizada / Em curso / Confirmada / Pendente)
- Lista de todas as pacientes com prontuário e semana gestacional
- FAB coral para novo agendamento
- Bottom nav: Início, Agenda, Pacientes, Relatórios

---

## Padrões de Código

### CSS
- Inline dentro de `<style>` em cada HTML
- BEM-like com kebab-case: `.modal-overlay`, `.quick-btn`, `.nav-item-text`
- Safe areas iOS: `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`
- Viewport height dinâmica: `100dvh`
- Scrollbar hiding: `::-webkit-scrollbar { display: none }`
- `will-change: transform` no track do carrossel

### JavaScript
- Funções globais em camelCase: `openModal`, `sendMessage`, `applyTransform`
- IDs descritivos: `carouselTrack`, `chatScroll`, `modalOverlay`
- Event handlers inline (`onclick`, `oninput`) para ações simples
- `addEventListener` para lógica mais complexa (touch, mouse, wheel)
- `requestAnimationFrame` para animações e desenho de canvas
- `passive: true` em listeners de scroll/touch

### Componentes Reutilizados (padrões visuais)
| Padrão | Classe | Uso |
|--------|--------|-----|
| Card branco | `.card` | Múltiplas páginas |
| Botão de ação rápida | `.quick-btn` | index.html |
| Bottom sheet modal | `.modal-overlay` + `.modal-sheet` | nomes, perfil, feto3d |
| Bottom navigation | `.nav-item` | Maioria das páginas |
| Balão de chat | `.bubble` (variantes) | chat.html |
| Header com voltar | padrão repetido | Subpáginas |

---

## Navegação entre Páginas

Navegação via links HTML simples (`href="pagina.html"`), sem roteador.

| De | Para | Trigger |
|----|------|---------|
| onboarding | index | Botão "Começar" (localStorage check) |
| index | chat | Botão "Chat Agente" |
| index | area_medica | Botões "Exames" / "Meus Meds" |
| index | nomes | Botão "Nomes" |
| index | consultas | Botão "Consultas" |
| index / consultas / perfil | (entre si) | Bottom navigation |
| qualquer subpágina | index | Botão voltar no header |

---

## Mudanças SUS → Clínica Privada (já aplicadas)

| Arquivo | O que mudou |
|---------|-------------|
| `perfil.html` | CNS → Prontuário 2024-00847; "Minha Unidade (UBS)" → "Minha Clínica"; "Agente de Saúde: Roberto" → "Dra. Ana Lima (Obstetra)"; rodapé removeu "SUS" |
| `chat.html` | Título → "Chat com Equipe"; "Agente de Saúde" → "Equipe de Saúde"; "Oi Roberto" → "Oi, Dra. Ana" |
| `index.html` | Meta description; "Atalhos Rápidos UBS" → "Atalhos Rápidos"; "Chat Agente" → "Chat"; "UBS Centro" → "Clínica Gerar Vida" |
| `onboarding.html` | "App UBS" → "Gerar Vida"; slide 1 sub-texto; slide 3 completamente reescrito (Médico Dedicado / Resultados Online / Canal 24h) |
| `consultas.html` | "UBS Centro da Cidade" → "Clínica Gerar Vida" |

---

## Problemas Conhecidos e Workarounds Históricos

Baseado no git log, estes bugs já foram corrigidos — evitar reintroduzir:

1. **iOS scroll snap** causava `margin-left: 0` forçado → removido `scroll-snap` do carrossel
2. **Margem do primeiro item** do carrossel precisou ser `24px` para alinhar com o título
3. **Padding do scroll** ajustado para `16px` para compensar margem interna do ícone
4. **FAB em `consultas.html`** com `position: fixed` causava problema com safe-area → movido para o fluxo normal

---

## Convenções de Commit

Seguir padrão Conventional Commits (já usado no projeto):
- `feat:` — nova funcionalidade
- `fix:` — correção de bug
- `refactor:` — refatoração sem mudança de comportamento
- Escopo entre parênteses quando aplicável: `fix(index):`, `fix(consultas):`
- Mensagens em português

---

## Instruções para Atualização deste Arquivo

Atualizar `CLAUDE.md` sempre que:
- Uma nova página for adicionada
- Uma funcionalidade existente for significativamente alterada
- Novos padrões de CSS ou JS forem estabelecidos
- Novos assets forem adicionados
- Bugs com workarounds importantes forem corrigidos
- A paleta de cores ou design system for modificado
