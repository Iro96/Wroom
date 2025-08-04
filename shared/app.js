const createBtn = document.getElementById("create-room");
const joinBtn = document.getElementById("join-room");
const leaveBtn = document.getElementById("leave-room");
const copyBtn = document.getElementById("copy-room");
const kickBtn = document.getElementById("kick-members");
const input = document.getElementById("room-id-input");
const editor = document.getElementById("editor");
const openBtn = document.getElementById("open-file");
const saveBtn = document.getElementById("save-file");
const alertBox = document.getElementById("custom-alert");

let socket = null;
let isAuthor = false;
let editorSynced = false;

function showAlert(msg, type = "error") {
  alertBox.textContent = msg;
  alertBox.className = `custom-alert ${type}`;
  alertBox.classList.add("visible");
  setTimeout(() => alertBox.classList.remove("visible"), 2500);
}

function generateRoomId() {
  return "wroom-" + Math.random().toString(36).substr(2, 6);
}

function setupUI() {
  input.style.display = "none";
  createBtn.style.display = "none";
  joinBtn.style.display = "none";
  leaveBtn.style.display = "inline";
  copyBtn.style.display = isAuthor ? "inline" : "none";
  kickBtn.style.display = isAuthor ? "inline" : "none";
}

function resetUI() {
  input.style.display = "inline";
  createBtn.style.display = "inline";
  joinBtn.style.display = "inline";
  leaveBtn.style.display = "none";
  copyBtn.style.display = "none";
  kickBtn.style.display = "none";
}

function connectToRoom(roomId) {
  socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
  editorSynced = false;
  isAuthor = false;

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (e) => {
    const data = e.data;

    if (data === "__ROOM_NOT_FOUND__") {
      showAlert("Room does not exist!", "error");
      socket.close();
      return;
    }

    if (data.startsWith("__ROOM_JOINED__")) {
      const [, role, content] = data.split("|");
      isAuthor = role === "author";
      editor.value = content || "";
      editorSynced = true;
      setupUI();
      showAlert(`Joined as ${role}`, "success");
      return;
    }

    if (data === "__YOU_ARE_KICKED__") {
      showAlert("You were kicked from the room", "error");
      disconnectRoom();
      return;
    }

    if (editorSynced && data.startsWith("__CONTENT__|")) {
      const content = data.split("|", 2)[1];
      editor.value = content; // Everyone receives and updates
    }
  };

  editor.addEventListener("input", () => {
    if (socket && socket.readyState === WebSocket.OPEN && editorSynced) {
      socket.send("__CONTENT__|" + editor.value);
    }
  });
}

function disconnectRoom() {
  if (socket) socket.close();
  socket = null;
  isAuthor = false;
  editorSynced = false;
  editor.value = "";
  resetUI();
}

createBtn.onclick = async () => {
  const newRoom = generateRoomId();
  input.value = newRoom;

  try {
    const res = await fetch(`http://localhost:8000/create-room/${newRoom}`);
    const json = await res.json();
    if (json.status === "room_created") {
      connectToRoom(newRoom);
    } else {
      showAlert("Failed to create room", "error");
    }
  } catch (err) {
    showAlert("Network error", "error");
  }
};

joinBtn.onclick = () => {
  const room = input.value.trim();
  if (room) connectToRoom(room);
};

leaveBtn.onclick = () => disconnectRoom();

copyBtn.onclick = () => {
  navigator.clipboard.writeText(input.value).then(
    () => showAlert("Room ID copied!", "success"),
    () => showAlert("Copy failed", "error")
  );
};

kickBtn.onclick = () => {
  if (isAuthor && socket) {
    socket.send("__KICK_ALL__");
    showAlert("All members kicked", "success");
  }
};

openBtn.onclick = async () => {
  const content = await window.electronAPI.openFile();
  if (content !== undefined) {
    editor.value = content;
    if (socket && socket.readyState === WebSocket.OPEN && editorSynced) {
      socket.send("__CONTENT__|" + content);
    }
  }
};

saveBtn.onclick = async () => {
  const status = await window.electronAPI.saveFile(editor.value);
  if (status === "saved") {
    showAlert("File saved!", "success");
  }
};
