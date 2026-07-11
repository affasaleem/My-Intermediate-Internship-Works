import sqlite3
import os

def main():
    print("Current Working Directory:", os.getcwd())
    print("Files in CWD:", os.listdir('.'))
    
    db_path = 'shiptivity.db'
    if os.path.exists(db_path):
        print(f"Database size: {os.path.getsize(db_path)} bytes")
    else:
        print("Database file does not exist!")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print("Tables in db:", cursor.fetchall())

    conn.close()

if __name__ == "__main__":
    main()
