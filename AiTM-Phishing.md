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

  Dentro da consola interativa 
- config domain lab.example.com
- config ipv4 external <YOUR_VPS_IP>

> Atencao! Aqui voce tem que ir para [DigitalOcean](https://github.com/miguellofredo85/Red-Team-TTP/blob/main/DigitalOcean.md) e configurar o ambiente cloud

### **O que é um Phishlet?**

Um **phishlet** é uma configuração baseada em YAML que indica ao Evilginx2 como:

- Atuar como proxy de um site alvo
- Capturar credenciais de login
- Roubar cookies de sessão e tokens de autenticação
- Redirecionar o tráfego para um serviço legítimo de forma invisível

Os phishlets formam a base de todos os cenários de phishing do Evilginx2. Cada um é adaptado a um aplicativo específico (por exemplo, Google, WordPress, Amazon) e inclui lógica para gerenciamento de domínios, sequestro de sessão e coleta de credenciais.

---

### **Por que isso é importante**

Os phishlets permitem que invasores (ou membros de equipes de teste de segurança, em um contexto legal) **contornem a autenticação de dois fatores (2FA)** roubando o cookie de sessão após a vítima fazer login com sucesso no serviço real — sem perceber que algo malicioso está ocorrendo. Esse é um diferencial fundamental entre o Evilginx e ferramentas de phishing mais simples.

---

### **Passo a passo: baixe e analise o Phishlet do WordPress.org**

### **1. Obtenha o Phishlet do WordPress.org**

Acesse este link:

> https://github.com/An0nUD4Y/Evilginx2-Phishlets/blob/master/wordpress.org.yaml
> 

Clique em **“Raw”** e, em seguida, copie todo o conteúdo YAML.

---


### **2. Salvar o Phishlet localmente**

No terminal do Kali Linux:

mkdir -p ~/hands-on-phishing/phishlets cd ~/hands-on-phishing/phishlets nano wordpress.org.yaml

Cole o conteúdo com `Ctrl + Shift + V` e, em seguida:

- Salve e saia com: `Ctrl + X`, depois `Y` e, por fim, `Enter`

---

### **3. (Opcional) Abra na GUI para facilitar a revisão**

mousepad wordpress.org.yaml

Use qualquer editor GUI de sua preferência (`gedit`, `VS Code`, etc.).

---

### **Análise da estrutura do phishlet**

Veja o que procurar no arquivo `wordpress.org.yaml`:

> Este phishlet tem como alvo o domínio oficial wordpress.org. Ele não funcionará imediatamente em sites WordPress auto-hospedados, como hacksmarter-manufacturing.shop. É necessária personalização.
>



