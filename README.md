# StoryWeaver - Plataforma de Narrativa Colaborativa com IA

## 📖 Visão Geral

StoryWeaver é uma plataforma inovadora que permite aos usuários criar histórias colaborativas em tempo real com auxílio de inteligência artificial. Combinando desenvolvimento de narrativa humana com capacidades de geração de texto da IA Claude da Anthropic, a plataforma oferece uma experiência única de co-criação de histórias.

### ✨ Principais Funcionalidades

- **Criação de Contas**: Sistema de registro e login seguro
- **Histórias Colaborativas**: Múltiplos usuários podem trabalhar na mesma história simultaneamente
- **Geração de IA**: Continue sua história com sugestões criativas da IA Claude
- **Atualizações em Tempo Real**: Veja as contribuições dos colaboradores imediatamente via WebSockets
- **Navegação de Histórias**: Explore histórias criadas por outros usuários
- **Gerenciamento de Colaboradores**: Convide amigos para participar de suas histórias
- **Controle de Versão**: Cada capítulo é numerado e atribuído ao seu autor (humano ou IA)

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.14+** com FastAPI
- **SQLAlchemy** para ORM e SQLite como banco de dados
- **Pydantic** para validação de dados
- **Python-Jose** para autenticação JWT
- **Anthropic SDK** para integração com a API Claude
- **WebSockets** para comunicação em tempo real

### Frontend
- **React 18** com **Vite** para build rápido
- **React Router DOM** para navegação
- **Axios** para chamadas HTTP
- **Socket.IO Client** para conexão WebSocket
- **JavaScript ES6+**

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Verifique com: `node --version` e `npm --version`

2. **Python** (versão 3.14.0 conforme especificação do projeto)
   - Recomendado usar através do `uv` conforme instruções do CLAUDE.md
   - Verifique com: `python --version`

3. **Conta na Anthropic** com acesso à API Claude
   - Cadastre-se em: https://console.anthropic.com/
   - Obtenha sua chave de API na seção de "API Keys"

## ⚙️ Configuração

### 1. Configurar a Chave da API Anthropic

Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:

```env
ANTHROPIC_API_KEY=sua_chave_de_api_aqui
```

Substitua `sua_chave_de_api_aqui` pela chave real obtida no console da Anthropic.

### 2. Estrutura de Pastas Esperada

Após seguir estas instruções, sua estrutura deve ficar assim:

```
C:\Users\Davi\Desktop\storyweaver\
├── backend\
│   ├── app.py
│   ├── database.py
│   ├── models.py
│   ├── ai_service.py
│   ├── websocket_manager.py
│   ├── routers\
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── stories.py
│   │   └── collaborations.py
│   ├── requirements.txt
│   └── .env
├── frontend\
│   ├── src\
│   │   ├── components\
│   │   │   ├── StoryEditor.jsx
│   │   │   ├── StoryBrowser.jsx
│   │   │   └── CollaborationPanel.jsx
│   │   ├── hooks\
│   │   │   └─ useSocket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## ▶️ Como Executar

### Passo 1: Iniciar o Backend

Abra um **Prompt de Comando** (ou PowerShell) e execute:

```cmd
cd C:\Users\Davi\Desktop\storyweaver\backend

:: Criar e ativar ambiente virtual (se ainda não existir)
python -m venv venv
venv\Scripts\activate

:: Instalar dependências
pip install -r requirements.txt

:: Iniciar o servidor
uvicorn app:create_app --host 0.0.0.0 --port 8000 --reload
```

Você verá algo como:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using statreload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Passo 2: Iniciar o Frontend

Abra **outro Prompt de Comando** (não feche o primeiro!) e execute:

```cmd
cd C:\Users\Davi\Desktop\storyweaver\frontend

:: Instalar dependências do frontend
npm install

:: Iniciar o servidor de desenvolvimento
npm run dev
```

Você verá algo como:
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Passo 3: Acessar a Aplicação

Abra seu navegador e acesse:
**http://localhost:3000**

## 🔧 Funcionamento Detalhado

### Fluxo de Uso Típico

1. **Registro/Login**: Usuário cria conta ou faz login
2. **Criar História**: 
   - Define título e prompt inicial (situação/gancho da história)
   - Tornam-se automaticamente o "dono" da história
3. **Escrever Capitulos**:
   - Usuário escreve conteúdo e clica em "Adicionar Capítulo"
   - Capítulo é salvo com número sequencial e marcado como autor humano
4. **Gerar Conteúdo com IA**:
   - Clicar em "Gerar Capítulo de IA"
   - Sistema envia prompt + contexto atual para a API Claude
   - IA retorna continuação criativa (2-3 parágrafos)
   - Capítulo é salvo marcado como autor IA (ID 0)
   - Atualização enviada em tempo real para todos colaboradores
5. **Colaboração**:
   - Usuário convida amigos compartilhando ID da história
   - Amigos aceitam convite e passam a ver atualizações em tempo real
   - Todos podem adicionar capítulos ou gerar conteúdo com IA

### Arquitetura de Comunicação

```
Frontend (React)  <--HTTP/REST-->  Backend (FastAPI)  <--API-->  Claude (Anthropic)
      ↑                                          ↓
      └───────WebSocket (Socket.IO) ◄──────────┘
```

- **HTTP/REST**: Para operações CRUD (criar, ler, atualizar, deletar histórias/capitulos/usuarios)
- **WebSocket**: Para atualizações em tempo real (quando alguém adiciona um capítulo, todos veem instantaneamente)

## 🐞 Solução de Problemas Comuns

### Backend Não Inicia
- **Erro**: `ModuleNotFoundError: No module named 'fastapi'`
  - **Solução**: Verifique se ativou o ambiente virtual (`venv\Scripts\activate`) e instalou as dependências (`pip install -r requirements.txt`)

- **Erro**: `Address already in use`
  - **Solução**: Porta 8000 está ocupada. Mude para outra porta:
    ```bash
    uvicorn app:create_app --port 8001 --reload
    ```
    E atualize o proxy no `frontend/vite.config.js`:
    ```js
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      }
    }
    ```

### Frontend Não Conecta ao Backend
- **Erro**: `Failed to fetch` ou `Network Error` no console do navegador
  - **Soluções**:
    1. Verifique se o backend está realmente rodando (terminal mostrando "Uvicorn running")
    2. Confirme que ambas as aplicações estão usando portas compatíveis
    3. Tente acessar diretamente: `http://localhost:8000/docs` (deve mostrar a documentação da API)
    4. Desative temporariamente firewall/antivirus para teste

### Falha na Geração de IA
- **Erro**: Mensagens como "[AI temporariamente indisponível]" ou erros de autenticação
  - **Soluções**:
    1. Verifique se o arquivo `backend/.env` existe e contém a chave correta
    2. Confirme que não há espaços extras antes/depois da chave
    3. Teste sua chave diretamente no console da Anthropic
    4. Verifique se você tem créditos suficientes em sua conta Anthropic

### Problemas de Performance
- **Lentidão ao carregar histórias**: Normal na primeira execução enquanto o banco de dados inicializa
- **Delay nas atualizações em tempo real**: Verifique sua conexão internet; WebSockets requerem conexão estável

## 📝 Notas Importantes

### Segurança (Para Desenvolvimento)
⚠️ **ATENÇÃO**: Esta implementação é para fins educacionais e de demonstração. Para uso em produção:
- Use bcrypt ou argon2 para hash de senhas (não SHA-256 simples)
- Armazene SECRET_KEY em variáveis de ambiente, não no código
- Implemente limites de taxa para evitar abusos da API Claude
- Adicione validação e sanitização de entrada mais rigorosas
- Use HTTPS em produção

### Escalabilidade
- O SQLite é excelente para desenvolvimento e pequenos testes
- Para produção com muitos usuários, considere migrar para PostgreSQL ou MySQL
- O WebSocket manager atual funciona bem para centenas de conexões simultâneas
- Para escala maior, considere Redis ou soluções especializadas como Socket.io clusters

### Personalização
- Para mudar o modelo de IA: Edite `backend/ai_service.py` e altere o parâmetro `model`
- Para ajustar o tamanho das respostas da IA: Modifique `max_tokens` na mesma função
- Para mudar o estilo/prompt da IA: Edite o template de prompt em `ai_service.py`

## 🎯 Próximos Passos Sugeridos

Se quiser expandir esta plataforma, considere:

1. **Melhorias de UI/UX**:
   - Drag-and-drop para reorganização de capítulos
   - Comentários em tempo real nos capítulos
   - Sistema de curtidas/reações
   - Modo escuro/claro

2. **Funcionalidades Avançadas**:
   - Upload de imagens/ilustrações para as histórias
   - Exportação para PDF/ePub
   - Histórico de versões com capacidade de desfazer
   - Sugestões de IA para títulos e prompts
   - Sistemas de tags e categorias

3. **Integrações**:
   - Login com Google/GitHub
   - Notificações por email
   - Integração com redes sociais para compartilhamento
   - API pública para desenvolvedores externos

4. **DevOps**:
   - Docker Compose para implantação fácil
   - Testes automatizados (unitários e de integração)
   - Pipeline de CI/CD com GitHub Actions
   - Monitoramento com Prometheus/Grafana

---

## 👨‍💻 Desenvolvido com

- ❤️ Paixão por narrativa e tecnologia
- 🤖 Poder da IA Claude da Anthropic
- 🚀 Velocidade do Vite + React
- 🐍 Robustez do Python/FastAPI

Divirta-se criando histórias incríveis com amigos e IA! 📚✨

---
*Documentação gerada automaticamente - Última atualização: $(date)*