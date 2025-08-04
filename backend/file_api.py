import os

BASE_DIR = "../shared"

def save_file(room_id: str, content: str):
    filepath = os.path.join(BASE_DIR, f"{room_id}.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

def load_file(room_id: str) -> str:
    filepath = os.path.join(BASE_DIR, f"{room_id}.md")
    if not os.path.exists(filepath):
        return ""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()
