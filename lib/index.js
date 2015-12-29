var ProseMirror = require('prosemirror/dist/edit').ProseMirror
require('prosemirror/dist/menu/tooltipmenu')

void new ProseMirror({
  place: document.querySelector('section[name=page-editor] [name=page-content]'),
  doc: 'Hello!',
  docFormat: 'text',
  tooltipMenu: {
    emptyBlockMenu: true
  }
})

window.proise
