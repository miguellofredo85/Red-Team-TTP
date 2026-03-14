1- Instalar o Python e o Flask 
- pip install flask

2- Criar o arquivo do servidor alvo (mock_idp.py):
Salve o seguinte código em um arquivo. Este script cria um pequeno servidor web com uma página de login falsa e um "painel" pós-login.

```
from flask import Flask, request, redirect, session, make_response
import html

app = Flask(__name__)
# Em um lab, uma chave secreta fixa é aceitável. NÃO FAÇA ISSO EM PRODUÇÃO.
app.secret_key = 'chave-super-secreta-do-lab'

@app.route('/')
def index():
    # Redireciona para o dashboard se já estiver logado
    if 'user' in session:
        return redirect('/dashboard')
    # Exibe a página de login
    return '''
    <!DOCTYPE html>
    <html>
    <head><title>Login do Lab</title></head>
    <body>
        <h2>Bem-vindo ao Serviço Alvo do Lab</h2>
        <form method="post" action="/login">
            <label for="username">Usuário:</label><br>
            <input type="text" id="username" name="username"><br>
            <label for="password">Senha:</label><br>
            <input type="password" id="password" name="password"><br><br>
            <input type="submit" value="Entrar">
        </form>
    </body>
    </html>
    '''

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username', '')
    password = request.form.get('password', '') # Não usamos a senha de propósito, para focar no token.
    # Qualquer usuário/senha é aceito no lab.
    session['user'] = username
    # Cria um cookie de sessão simples
    resp = make_response(redirect('/dashboard'))
    resp.set_cookie('session_cookie', f'valor_simulado_{username}')
    return resp

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/')
    user = html.escape(session['user'])
    return f'<h1>Painel do Usuário: {user}</h1><p>Você está logado! O ataque funcionou.</p><p><a href="/logout">Sair</a></p>'

@app.route('/logout')
def logout():
    session.pop('user', None)
    resp = make_response(redirect('/'))
    resp.set_cookie('session_cookie', '', expires=0)
    return resp

if __name__ == '__main__':
    # Roda na porta 5000, acessível localmente e na rede (0.0.0.0)
    app.run(host='0.0.0.0', port=5000, debug=True)

```
