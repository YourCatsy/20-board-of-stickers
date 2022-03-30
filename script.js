import NotesApi from "./NotesApi.js";

'use strict';

const DELETE_BUTTON_SELECTOR = '.delete-button';
const MESSAGE_TEXT_SELECTOR = '.message-text';
const NOTE_ITEM_SELECTOR = '.note';
const NEW_TASK_TEMPLATE = '#newTaskTemplate';
const ADD_BUTTON_SELECTOR = '.add-button';
const LIST_SELECTOR = '#list';

const EMPTY_NOTE = { description: '' };
let notesList = [];

const $noteListEl = $(LIST_SELECTOR);
const noteTemplate = $(NEW_TASK_TEMPLATE).html();

$(ADD_BUTTON_SELECTOR).on('click', onAddNoteBtnClick);
$noteListEl.on('click', DELETE_BUTTON_SELECTOR, onDeleteBtnClick)
    .on('focusout', MESSAGE_TEXT_SELECTOR, onNotesListFocusout);

showList();

function onDeleteBtnClick(e) {
    const $element = getNoteElByChild($(e.target));
    const $elementIndex = getNoteElId($element);

    $element.fadeOut(400, () => deleteNote($elementIndex));
}

function onNotesListFocusout(e) {
    const $element = $(e.target);
    const id = getNoteElId($element);

    updateNote(id, { description: $element.val() });
}

function onAddNoteBtnClick() {
    createNote(EMPTY_NOTE);
}

function showList() {
    NotesApi.getList()
        .then(setData)
        .then(renderList);
}

function setData(data) {
    return (notesList = data);
}

function getNoteElementById(id) {
    return $noteListEl.find(`[data-note-index="${id}"]`);
}

function createNote(note) {
    NotesApi.create(note)
        .then((note) => {
            notesList.push(note);
            renderNote(note);
        });
}

function updateNote(id, changes) {
    const note = notesList.find((el) => el.id == id);

    Object.keys(changes).forEach((key) => (note[key] = changes[key]));
    NotesApi.update(id, note);
}

function deleteNote(id) {
    setData(notesList.filter((el) => el.id != id))
    deleteNoteElement(id);
    NotesApi.delete(id);
}

function deleteNoteElement(id) {
    const $element = getNoteElementById(id);

    $element && $element.remove();
}

function renderList(notesList) {
    const $notesHTML = notesList.map(getNoteHtml).join('');

    $noteListEl.append($notesHTML).fadeIn(1000);
}

function renderNote(note) {
    const $noteEl = $(getNoteHtml(note));

    $noteListEl.append($noteEl);
}

function getNoteHtml(note) {
    return noteTemplate
        .replace('{{id}}', note.id)
        .replace('{{description}}', note.description);
}

function getNoteElId($el) {
    const $note = getNoteElByChild($el);
    return $note && $note.data('noteIndex');
}

function getNoteElByChild($child) {
    return $child.closest(NOTE_ITEM_SELECTOR);
}

