from flask import Flask, request, redirect, session, render_template, make_response, jsonify
import secrets
import datetime
import html
import os

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)  # Chave segura para produção (mas lab ok)

# Banco de dados simulado de usuários
USERS = {
    'ana.silva@acme.com': {
        'name': 'Ana Silva',
        'role': 'Product Manager',
        'avatar': '/static/images/avatar-placeholder.svg',
        'department': 'Product',
        'join_date': '2023-06-15'
    },
    'carlos.santos@acme.com': {
        'name': 'Carlos Santos',
        'role': 'Lead Developer',
        'avatar': '/static/images/avatar-placeholder.svg',
        'department': 'Engineering',
        'join_date': '2022-03-10'
    },
    'julia.mendes@acme.com': {
        'name': 'Julia Mendes',
        'role': 'HR Director',
        'avatar': '/static/images/avatar-placeholder.svg',
        'department': 'Human Resources',
        'join_date': '2021-11-22'
    }
}

@app.route('/')
def index():
    if 'user_email' in session:
        return redirect('/dashboard')
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return redirect('/')
    
    # Simulação de login - qualquer email/senha funciona para lab
    email = request.form.get('email', '')
    password = request.form.get('password', '')
    remember = request.form.get('remember', False)
    
    # Extrai o nome do email para mostrar no dashboard
    username = email.split('@')[0] if '@' in email else email
    
    # Busca dados do usuário ou cria dados padrão
    user_data = USERS.get(email, {
        'name': username.replace('.', ' ').title(),
        'role': 'Team Member',
        'avatar': '/static/images/avatar-placeholder.svg',
        'department': 'General',
        'join_date': datetime.datetime.now().strftime('%Y-%m-%d')
    })
    
    session['user_email'] = email
    session['user_name'] = user_data['name']
    session['user_role'] = user_data['role']
    session['user_avatar'] = user_data['avatar']
    session['user_department'] = user_data['department']
    session['join_date'] = user_data['join_date']
    
    # Cria resposta com cookies
    resp = make_response(redirect('/dashboard'))
    
    # Cookie de sessão principal (o que o Evilginx vai capturar)
    session_token = secrets.token_urlsafe(32)
    resp.set_cookie(
        'acme_session',
        value=session_token,
        httponly=True,
        secure=False,  # False para lab HTTP
        samesite='Lax',
        max_age=30*24*60*60 if remember else 24*60*60  # 30 dias ou 24 horas
    )
    
    # Cookie de preferências (para mostrar que capturamos múltiplos cookies)
    resp.set_cookie(
        'acme_preferences',
        value='theme=light&language=pt-BR',
        max_age=30*24*60*60
    )
    
    return resp

@app.route('/dashboard')
def dashboard():
    if 'user_email' not in session:
        return redirect('/')
    
    # Dados para o dashboard
    context = {
        'user_email': session['user_email'],
        'user_name': session['user_name'],
        'user_role': session['user_role'],
        'user_avatar': session['user_avatar'],
        'user_department': session['user_department'],
        'join_date': session.get('join_date', '2024-01-01'),
        'current_time': datetime.datetime.now().strftime('%d/%m/%Y %H:%M'),
        'notifications': [
            {'id': 1, 'title': 'Reunião de planejamento', 'time': '10:30', 'type': 'meeting'},
            {'id': 2, 'title': 'Novo documento compartilhado', 'time': '09:15', 'type': 'document'},
            {'id': 3, 'title': 'Comentário em sua tarefa', 'time': '08:45', 'type': 'comment'}
        ],
        'recent_docs': [
            {'name': 'Roadmap 2025-Q1', 'owner': 'Ana Silva', 'modified': '2h atrás'},
            {'name': 'Budget Planning', 'owner': 'Carlos Santos', 'modified': '5h atrás'},
            {'name': 'Security Policy', 'owner': 'Julia Mendes', 'modified': '1d atrás'}
        ],
        'stats': {
            'projects': 12,
            'tasks': 48,
            'messages': 23,
            'storage': '68%'
        }
    }
    return render_template('dashboard.html', **context)

@app.route('/api/user/data')
def api_user_data():
    """Endpoint JSON para simular chamadas AJAX"""
    if 'user_email' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    return jsonify({
        'email': session['user_email'],
        'name': session['user_name'],
        'role': session['user_role'],
        'department': session['user_department']
    })

@app.route('/logout')
def logout():
    session.clear()
    resp = make_response(redirect('/'))
    resp.set_cookie('acme_session', '', expires=0)
    resp.set_cookie('acme_preferences', '', expires=0)
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
