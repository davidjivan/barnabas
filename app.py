from flask import Flask, render_template, jsonify, request
import sqlite3
import os

app = Flask(__name__)

# Make sure your server is serving the latest version of your static files.
# In Flask, you can do this by setting the SEND_FILE_MAX_AGE_DEFAULT configuration option to 0 during development:
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


# Database setup
def init_db():
    os.makedirs('database', exist_ok=True)
    conn = sqlite3.connect('database/barnabas.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY, content TEXT, context TEXT)')
    conn.commit()
    conn.close()

init_db()

# Prevent Page Caching
@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response


# App routes
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
        documents = [{"id": id, "content": content, "context": context} for id, content, context in c.fetchall()]
        conn.close()
        return jsonify(documents)
    except Exception as e:
        return str(e), 500


@app.route('/documents', methods=['POST'])
def create_document():
    print('Creating document')
    conn = sqlite3.connect('database/barnabas.db')
    c = conn.cursor()

    # Insert document into database
    content = request.json['content']
    context = request.json['context']
    print('Content received:', content)
    print('Context received:', context)
    c.execute('INSERT INTO documents (content, context) VALUES (?, ?)', (content, context))

    # Get id of inserted row
    id = c.lastrowid

    conn.commit()
    conn.close()

    print('Document created with id:', id)
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
        content = document[1]
        context = document[2]
        print('Content:', content)
        print('Context:', context)
        return jsonify({"id": document[0], "content": content, "context": context})
    else:
        return 'Document not found', 404



@app.route('/documents/<int:id>', methods=['PUT'])
def update_document(id):
    print('Updating document:', id)
    conn = sqlite3.connect('database/barnabas.db')
    c = conn.cursor()

    # Update the content and context of the document in the database
    c.execute('UPDATE documents SET content=?, context=? WHERE id=?', (request.json['content'], request.json['context'], id))

    conn.commit()
    conn.close()

    return '', 204



@app.route('/documents/<int:id>', methods=['DELETE'])
def delete_document(id):
    try:
        conn = sqlite3.connect('database/barnabas.db')
        c = conn.cursor()

        # Delete the document from the database
        c.execute('DELETE FROM documents WHERE id=?', (id,))

        conn.commit()
        conn.close()

        return '', 204
    except Exception as e:
        return str(e), 500




if __name__ == '__main__':
    app.run(debug=True)
