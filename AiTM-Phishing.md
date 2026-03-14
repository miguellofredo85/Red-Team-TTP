## 🛠️ Ferramentas Utilizadas

| Ferramenta | Função | Descrição |
| :--- | :--- | :--- |
| **Gophish** | Orquestrador | Gerencia o envio de e-mails, campanhas e rastreamento de alvos. | https://github.com/gophish/gophish |
| **Evilginx3** | Proxy Reverso | Atua como Man-in-the-Middle (MitM) para capturar cookies de sessão e bypassar 2FA. | https://github.com/kgretzky/evilginx2 | 
| **EviGolPhish** | Integrador | Automatiza a ponte entre os links do Evilginx3 e os templates do Gophish. | https://github.com/fin3ss3g0d/evilgophish |

---

# 🛰️ Fluxo de Dados: Ataque de Proxy Reverso (Man-in-the-Middle)

Este diagrama representa a movimentação de dados em tempo real. O Atacante (você) atua como um "espelho" inteligente no meio da comunicação.

---

## 🔄 Diagrama de Sequência de Dados

| Origem     | Direção | Destino      | Dado Transferido / Ação                       |
|:-----------|:-------:|:-------------|:----------------------------------------------|
| Vítima     |   -->   | Evilginx3    | Solicitação da página (via link de phishing)  |
| Evilginx3  |   -->   | Site Real    | Solicitação espelhada da página legítima      |
| Site Real  |   -->   | Evilginx3    | Envio da página de login real + Cabeçalhos    |
| Evilginx3  |   -->   | Vítima       | Renderização da página real (transparente)    |
| Vítima     |   -->   | Evilginx3    | **Usuário e Senha** (POST Data)               |
| Evilginx3  |   -->   | Site Real    | Repasse das credenciais para validação        |
| Vítima     |   -->   | Evilginx3    | **Código MFA** (SMS/App)                      |
| Evilginx3  |   -->   | Site Real    | Repasse do código 2FA                         |
| Site Real  |   -->   | Evilginx3    | **Session Cookie (Auth Token)** |
| **Atacante**|   <--   | Evilginx3    | **Exfiltração do Cookie para o Operador** |


## Instalacoes

### goPhish
- git clone https://github.com/gophish/gophish.git
- cd gophish
- go build
- sudo ./gophish 

### Evilginx3
- git clone https://github.com/kgretzky/evilginx2.git
- cd evilginx2
- make
- sudo ./build/evilginx -p ./phishlets -developer









