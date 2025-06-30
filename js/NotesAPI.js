// NotesAPI.js
// Enhanced Notes API using localStorage
// Author: Muhannad

export default class NotesAPI {
  static STORAGE_KEY = "notesapp-notes";


  static getAllNotes() {
    const notes = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    return notes.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  }


  static saveNote(noteToSave) {
    const notes = this.getAllNotes();
    const existing = notes.find(note => note.id === noteToSave.id);

    if (existing) {
      
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();
    } else {
      
      noteToSave.id = Math.floor(Math.random() * 1_000_000);
      noteToSave.updated = new Date().toISOString();
      notes.push(noteToSave);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
  }

  
  static deleteNote(id) {
    const notes = this.getAllNotes().filter(note => note.id !== parseInt(id));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
  }
}

