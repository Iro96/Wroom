from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# rooms = { room_id: { "author": WebSocket or None, "members": [WebSocket], "content": str } }
rooms = {}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()

    if room_id not in rooms:
        await websocket.send_text("__ROOM_NOT_FOUND__")
        await websocket.close()
        return

    room = rooms[room_id]

    # Set as author if author slot is empty
    is_author = False
    if room["author"] is None:
        room["author"] = websocket
        is_author = True
        await websocket.send_text("__ROOM_JOINED__|author")
    else:
        room["members"].append(websocket)
        await websocket.send_text("__ROOM_JOINED__|member")
        if room["content"]:
            await websocket.send_text(f"__CONTENT__|{room['content']}")

    try:
        while True:
            msg = await websocket.receive_text()

            if msg.startswith("__CONTENT__|"):
                content = msg.split("|", 1)[1]
                room["content"] = content

                # Broadcast to all participants except sender
                all_participants = [room["author"]] + room["members"]
                for user in all_participants:
                    if user != websocket:
                        await user.send_text(f"__CONTENT__|{content}")

            elif msg == "__KICK_ALL__" and websocket == room["author"]:
                for member in room["members"]:
                    try:
                        await member.send_text("__YOU_ARE_KICKED__")
                        await member.close()
                    except:
                        pass
                room["members"].clear()

    except WebSocketDisconnect:
        if websocket == room["author"]:
            for member in room["members"]:
                try:
                    await member.send_text("__YOU_ARE_KICKED__")
                    await member.close()
                except:
                    pass
            del rooms[room_id]
        elif websocket in room["members"]:
            room["members"].remove(websocket)

@app.get("/create-room/{room_id}")
async def create_room(room_id: str):
    if room_id not in rooms:
        rooms[room_id] = {
            "author": None,
            "members": [],
            "content": ""
        }
    return {"status": "room_created"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
