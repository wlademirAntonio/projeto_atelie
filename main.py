from flask import Flask, render_template, request, redirect
import mysql.connector

conexao = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    password = '',
    database = 'atelie'
)

cursor = conexao.cursor()

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def main():
    return render_template("index.html")

@app.route("/busca", methods = ["GET", "POST"])
def busca():
    try:
        cod = request.form.get('cod')

        sql = f'SELECT ID, COD, MARCA, NOME, PRECO FROM PRODUTO WHERE COD = "{cod}"'
        cursor.execute(sql)
        sql = cursor.fetchall()

        if len(sql) > 0:
            return {'type': 'success', 'message': 'exist', 'info': sql[0]}
        else:
            return {'type': 'success', 'message': 'not exist'}
    except:
        return {'type': 'error', 'message': 'Falha ao procurar produto'}
    
@app.route("/cadastro", methods = ["GET", "POST"])
def cadastro():
    try:
        cod = request.form.get('cod')
        marca = request.form.get('marca')
        nome = request.form.get('nome')
        preco = request.form.get('preco')
        quantidade = request.form.get('quantidade')

        if cod != '' and marca != '' and nome != '' and preco != '' and quantidade != '':
            preco = float(preco.replace(',', '.'))
            quantidade = int(quantidade)

            sql = f'INSERT INTO PRODUTO VALUES (NULL, "{cod}", "{marca}", "{nome}", {preco}, {quantidade})'
            cursor.execute(sql)
            conexao.commit()

            return {'type': 'success', 'message': 'Produto cadastrado'}
        else:
            return {'type': 'error', 'message': 'Campo(s) obrigatório(s) não preenchido(s)'}
    except:
        return {'type': 'error', 'message': 'Erro ao efetuar cadastro'}

if __name__== "__main__":
    app.run(debug=True)