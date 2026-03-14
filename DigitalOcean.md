> Sua infraestrutura de phishing baseada na nuvem começa com um servidor virtual. Na DigitalOcean, essas máquinas virtuais são chamadas de Droplets. 
**Projeto**
1. No painel de controle da DigitalOcean, acesse **Projetos** → clique em **“Novo projeto”**.
2. Nome: `Curso Prático de Phishing`
3. Descrição: `Este projeto é para o curso prático de phishing da Simply Cyber Academy.`
4. Objetivo: Selecione **Projeto de aula / Educacional**
5. Clique em **Criar projeto**
6. Na tela “Mover recursos” → clique em **“Ignorar por enquanto”**

**Droplet**
1. escolha uma imagem
2. cpu regular
3. check Add improved metrics monitoring and alerting (free)
4. Access terminal (SSH tem mais seguranca que senha) gerar uma key na sua maquina atacante com ssh-keygen, copie o conteudo da .pub e cole no New SSH
5. escolha none do hostname
## **Conecte-se ao seu Droplet**
**Conecao ao droplets**
1. Copie o **endereço IP público** do painel do Droplet.
2. No terminal do Kali, conecte-se via SSH:
`ssh root@<your_droplet_ip>`

Exemplo:
`ssh [root@134.122.45.89](mailto:root@134.122.45.89)`
Na primeira conexão, digite `yes` para confiar na chave do host.

### **Passo a passo: como configurar alertas de cobrança**

### **1. Acesse as configurações de cobrança**

- Na mesma página de cobrança, clique na guia **“Configurações”**.

### **2. Role a página até a seção Alertas de cobrança**

- Localize a seção **Alertas de cobrança** (role a página para baixo).
- Clique em **“Ativar alerta”** (no lado direito).

### **3. Defina seu limite de alerta**

- Insira um valor de alerta: recomenda-se `5,00` USD

Isso significa que:

- Você receberá um e-mail se as cobranças em sua conta ultrapassarem US$ 5.

Clique em **“Confirmar”** para ativar o alerta.

## **Por que configurar um firewall?**

- Mesmo com o **login baseado em chave SSH**, qualquer pessoa pode tentar um ataque de força bruta à sua porta SSH se ela estiver exposta publicamente.
- As máquinas virtuais na nuvem são frequentemente escaneadas por bots — minimizar sua superfície de ataque é essencial.
- Isso vale tanto para **Blue Teams** (defesa) quanto para **Red Teams** (proteção da infraestrutura contra outros invasores).

> Prática recomendada: Combine a autenticação por chave SSH com regras rígidas de firewall baseadas em IP.
> 

---

## **Passo a passo: Crie um firewall na DigitalOcean**

### **1. Acesse as configurações do seu Droplet**

1. No **painel do Droplet**, clique no seu Droplet.
2. Clique na guia **“Rede”**.
3. Role para baixo até a seção **“Firewalls”**.
4. Clique em **“Editar”** (ou **“Criar Firewall”**, se não houver nenhum).

---

### **2. Modifique a regra SSH**

Por padrão, o SSH (porta 22) está aberto para **todos os IPs** (`0.0.0.0/0`), o que é perigoso.

### **Obtenha seu endereço IP:**

No seu **terminal Kali** ou em qualquer shell:

curl ifconfig.me

Copie o IP retornado — este é o seu endereço IP público.

> 🧠 Importante: Se você estiver usando uma VPN ou se o seu IP mudar (por exemplo, hotspot móvel), será necessário atualizar isso posteriormente.
> 

### **Atualize a regra:**

- Em **Regras de entrada**, localize a regra SSH.
- Substitua `0.0.0.0/0` pelo **seu endereço IP público**.
- Clique em **Adicionar Origem**, cole seu IP e pressione Enter.

---
### **3. Marque seu firewall**

- Dê ao firewall um nome como: `ssh-my-ip-only`
- Em **“Aplicar a Droplets”**, use a tag definida anteriormente: `phishing`
- Isso garante que o firewall seja aplicado automaticamente a qualquer droplet com essa tag.

Clique em **Criar firewall**.

---

## **Verificação: Teste o acesso SSH**

### **Enquanto estiver no seu IP da lista de permissões:**

Execute no Kali ou em qualquer terminal:

ssh root@<your_droplet_ip>

Você deve se conectar com sucesso.

---

### **Troque de IP (por exemplo, desative a VPN):**

1. Desative sua VPN ou troque de rede.
2. Tente o mesmo comando SSH novamente:

ssh root@<your_droplet_ip>

❌ Deve **falhar silenciosamente** — o SSH parecerá fechado.

> Até mesmo varreduras de porta (por exemplo, nmap) mostrarão a porta 22 como filtrada ou fechada.


