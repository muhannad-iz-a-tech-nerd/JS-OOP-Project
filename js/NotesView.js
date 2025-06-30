// NotesView.js
// Dynamic Notes View UI
// aither: Muhannad shut up

export default class NotesView {
  constructor(
    root,
    { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;

    this.root.innerHTML = `
      <div class="notes__sidebar">
        <button class="notes__add" type="button">Add Note</button>
        <div class="notes__list"></div>
      </div>
      <div class="notes__preview">
        <input class="notes__title" type="text" placeholder="New Note..." />
        <textarea class="notes__body" placeholder="Take note..."></textarea>
      </div>
    `;

    this._bindEvents();
    this.updateNotePreviewVisibility(false);
  }


  _bindEvents() {
    const btnAddNote = this.root.querySelector(".notes__add");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

    btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach(input => {
      input.addEventListener("blur", () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();
        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });
  }


  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;
    const truncatedBody =
      body.length > MAX_BODY_LENGTH
        ? body.substring(0, MAX_BODY_LENGTH) + "..."
        : body;

    return `
      <div class="notes__list-item" data-note-id="${id}">
        <div class="notes__small-title">${title}</div>
        <div class="notes__small-body">${truncatedBody}</div>
        <div class="notes__small-updated">
          ${updated.toLocaleString(undefined, {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </div>
      </div>
    `;
  }

 
  updateNoteList(notes) {
    const notesList = this.root.querySelector(".notes__list");
    notesList.innerHTML = "";

    for (const note of notes) {
      const noteHTML = this._createListItemHTML(
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );
      notesList.insertAdjacentHTML("beforeend", noteHTML);
    }

    this._bindListItemEvents();
  }

  _bindListItemEvents() {
    this.root.querySelectorAll(".notes__list-item").forEach(item => {
      item.addEventListener("click", () => {
        this.onNoteSelect(item.dataset.noteId);
      });

      item.addEventListener("dblclick", () => {
        const confirmDelete = confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
          this.onNoteDelete(item.dataset.noteId);
        }
      });
    });
  }
  updateActiveNote(note) {
    const titleInput = this.root.querySelector(".notes__title");
    const bodyInput = this.root.querySelector(".notes__body");

    titleInput.value = note.title;
    bodyInput.value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach(item => {
      item.classList.remove("notes__list-item--selected");
    });

    const activeItem = this.root.querySelector(
      `.notes__list-item[data-note-id="${note.id}"]`
    );
    if (activeItem) {
      activeItem.classList.add("notes__list-item--selected");
    }
  }


  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}
