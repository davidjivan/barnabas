import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('database/barnabas.db')

c = conn.cursor()

# Create the documents table
c.execute('''
    CREATE TABLE documents (
        id INTEGER PRIMARY KEY,
        content TEXT
    )
''')

conn.commit()

conn.close()

print('Database created successfully')
