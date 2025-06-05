import mysql.connector

conexao = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    password = '',
    database = 'atelie'
)

cursor = conexao.cursor()

with open('produtos.csv', 'r', encoding='utf-8') as arquivo:
    for i in arquivo:
        i = i.strip().split(',')
        try:
            int(i[0])

            sql = f'INSERT INTO PRODUTO VALUES (NULL, "{i[1]}", "{i[2].replace('"', '')}", "{i[3].replace('"', '')}", {i[4]}, {i[5]})'
            cursor.execute(sql)
            conexao.commit()
            
        except:
            pass
        