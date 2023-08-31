from flask import Flask, render_template, jsonify, request
import sqlite3
import os

app = Flask(__name__)

# Database setup
def init_db():
    os.makedirs('database', exist_ok=True)
    conn = sqlite3.connect('database/barnabas.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY, content TEXT)')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/documents', methods=['GET'])
def get_documents():
    try:
        os.makedirs('database', exist_ok=True)
        conn = sqlite3.connect('database/barnabas.db')
        c = conn.cursor()
        c.execute('SELECT * FROM documents')
        documents = [{"id": id, "content": content} for id, content in c.fetchall()]
        conn.close()
        return jsonify(documents)
    except Exception as e:
        return str(e), 500

@app.route('/documents', methods=['POST'])
def create_document():

  conn = sqlite3.connect('database/barnabas.db')
  c = conn.cursor()

  # Insert document into database
  c.execute('INSERT INTO documents (content) VALUES (?)', (request.json['content'],))

  # Get id of inserted row
  id = c.lastrowid

  conn.commit()
  conn.close()

  return jsonify({'id': id})



@app.route('/documents/<int:id>', methods=['GET'])
def get_document(id):
    print('Getting document:', id)
    conn = sqlite3.connect('database/barnabas.db')
    c = conn.cursor()

    c.execute('SELECT * FROM documents WHERE id=?', (id,))
    document = c.fetchone()

    conn.close()

    if document:
        return jsonify({"id": document[0], "content": document[1]})
    else:
        return 'Document not found', 404



@app.route('/documents/<int:id>', methods=['PUT'])
def update_document(id):
    print('Updating document:', id)
    conn = sqlite3.connect('database/barnabas.db')
    c = conn.cursor()

    # Update the content of the document in the database
    c.execute('UPDATE documents SET content=? WHERE id=?', (request.json['content'], id))

    conn.commit()
    conn.close()

    return '', 204



if __name__ == '__main__':
    app.run(debug=True)
