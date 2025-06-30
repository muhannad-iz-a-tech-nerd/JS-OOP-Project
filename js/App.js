// JS-OOP=PROJECT main controller
// Originally by: Elma3alem Yousef
// Enhanced by: Muhannad El King 

import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App {
  constructor(root) {
    
    this.notes = [];

    
    this.activeNote = null;

    /** @type {NotesView} UI handler , I almost thought about making it a bit robustic, but, meh. you are welcome ;)*/
    this.view = new NotesView(root, this._handlers());

    this._refreshNotes();
  }

  /**
   * Re-fetch all notes from storage and update UI
   */
  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();
    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  /**
   * Set internal note list and update view o 
   * @param {Array<Object>} notes
   */
  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  /**
   * Set the active note and show it in the preview of 
   * @param {Object} note
   */
  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  /**
   * Event handlers passed to NotesView in the form of 
   * @returns {Object} Handlers map
   */
  _handlers() {
    return {
      onNoteSelect: (noteId) => {
        const selectedNote = this.notes.find((note) => note.id == noteId);
        if (selectedNote) {
          this._setActiveNote(selectedNote);
        }
      },

      onNoteAdd: () => {
        const newNote = {
          title: "New Note",
          body: "Take note...",
        };
        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },

      onNoteEdit: (title, body) => {
        if (!this.activeNote) return;

        NotesAPI.saveNote({
          id: this.activeNote.id,
          title,
          body,
        });
        this._refreshNotes();
      },

      onNoteDelete: (noteId) => {
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
      },
    };
  }
}
