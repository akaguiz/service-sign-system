# Service Sign System

## Descrição Geral
API para gerenciamento e assinatura de documentos, permitindo criar, listar e assinar documentos eletronicamente.

## Endpoints

### POST /documents  
Cria um novo documento para assinatura.

- Request Body (JSON):
```json
{
  "title": "string",
  "content": "string",
  "signers": [
    {
      "name": "string",
      "email": "string"
    }
  ]
}
```
- Response:
  - 201 Created
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "signers": [ ... ],
  "status": "pending"
}
```
- Erros:
  - 400 Bad Request (dados inválidos)

---

### GET /documents  
Lista todos os documentos.

- Response:
  - 200 OK
```json
[
  {
    "id": "uuid",
    "title": "string",
    "status": "pending|signed"
  }
]
```

---

### GET /documents/{id}  
Obtém os detalhes de um documento específico.

- Path Parameters:
  - `id` (string, obrigatório) — ID do documento

- Response:
  - 200 OK
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "signers": [ ... ],
  "status": "pending|signed"
}
```
- Erros:
  - 404 Not Found (documento não encontrado)

---

### POST /documents/{id}/sign  
Assina o documento.

- Path Parameters:
  - `id` (string, obrigatório) — ID do documento

- Request Body:
```json
{
  "signerEmail": "string",
  "signature": "string"
}
```

- Response:
  - 200 OK
```json
{
  "message": "Document signed successfully"
}
```
- Erros:
  - 400 Bad Request (dados inválidos)
  - 404 Not Found (documento ou signatário não encontrado)

---

## Como rodar o projeto localmente

1. Clone o repositório:  
```
git clone https://github.com/akaguiz/service-sign-system.git
```
2. Instale as dependências:  
```
npm install
```
3. Configure variáveis de ambiente, se necessário.

4. Execute o servidor:  
```
npm start
```
5. A API estará disponível em `http://localhost:3000`

---

## Tecnologias usadas

- Node.js  
- Express  
- TypeScript

