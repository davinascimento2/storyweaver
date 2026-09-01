# StoryWeaver - Instruções de Execução

## ✅ Pré-requisitos instalados?
- Node.js (verifique: node --version)
- Python 3.14+ (verifique: python --version)
- Chave API da Anthropic obtida em https://console.anthropic.com/

## 🚀 Passo a passo para rodar

### 1. Configure a API key
No backend, crie arquivo .env:
```
ANTHROPIC_API_KEY=cole_sua_chave_aqui
```

### 2. Inicie o backend (Terminal 1)
```cmd
cd C:\Users\Davi\Desktop\storyweaver\backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:create_app --host 0.0.0.0 --port 8000 --reload
```

### 3. Inicie o frontend (Terminal 2)
```cmd
cd C:\Users\Davi\Desktop\storyweaver\frontend
npm install
npm run dev
```

### 4. Acesse
Abra navegador em: http://localhost:3000

## 🔧 Problemas comuns
- Se "port already in use": mude 8000 para 8001 nos comandos
- Se AI não funcionar: verifique .env e chave API
- Se frontend não conecta: confira se backend está rodando (terminal 1)

Pronto! Seu StoryWeaver está funcionando.