import { useState, useEffect } from "react";

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const rec = new window.webkitSpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      setRecognition(rec);

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setNewNote(transcript);
      };
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const createNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        { id: Date.now(), content: newNote, timestamp: new Date().toISOString() },
      ]);
      setNewNote("");
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updateNote = (id, content) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, content } : note)));
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      <h1>📝 Note Taking App</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px" }}
      />

      {/* Note Input */}
      <textarea
        placeholder="✍️ Type your note here..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        rows="3"
        style={{ width: "100%", padding: "8px", borderRadius: "5px", marginBottom: "10px" }}
      ></textarea>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={isRecording ? stopRecording : startRecording} style={{ flex: 1 }}>
          {isRecording ? "⏹️ Stop Recording" : "🎤 Start Recording"}
        </button>
        <button onClick={createNote} style={{ flex: 1 }}>➕ Add Note</button>
      </div>

      {/* Notes */}
      <div>
        {filteredNotes.map((note) => (
          <div key={note.id} style={{ padding: "10px", border: "1px solid gray", marginBottom: "10px", borderRadius: "5px" }}>
            <strong>{new Date(note.timestamp).toLocaleDateString()}</strong>
            <p>{note.content}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => {
                const newContent = prompt("Edit Note:", note.content);
                if (newContent) updateNote(note.id, newContent);
              }}>✏️ Edit</button>
              <button onClick={() => deleteNote(note.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteApp;
