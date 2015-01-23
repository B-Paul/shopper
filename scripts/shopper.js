var doc = $(document).ready(function () {
  var model, app, items, edit, nameField, controls;

  // Release the animations!
  $(document.body).removeClass('preload');

  model = {
    'list-title': {
      'name': 'Untitled Shopping List ' + mdyDate(new Date())
    },
    'list-filter': {
      'name': ''
    }
  };

  doc
    .on('keydown', captureInput)
    .on('keyup', updateList);

  app = $('#shopper');

  items = $('#the-list')
    .on('click', 'li', selectItem)
    .on('dblclick', 'li', openItem)
    .on('click', '.deleteme', deleteItem)
    .on('click', '.finishme', toggleItemFinished);

  edit = $('#editor')
    .find('property')
      .on('change', updateList)
      .end()
    .on('submit', closeItem);

  nameField = edit.find('input[name="name"]')
    .focus()
    .on('blur', function () {
      if (!app.hasClass('item-opened')) { nameField.focus(); }
    });

  title = $('#list-title')
    .on('click', selectItem);

  filter = $('#list-filter')
    .on('click', selectItem);

  function captureInput(event) {
    var item = items.find('.selected').first();

    // If the current item is "open", keyboard control should navigate through
    // the form as expected---no special commands.
    if (app.hasClass('item-opened')) { return; }

    // recognize navigation commands
    switch (event.keyCode) {

    case 13:
      // ENTER
      if (item.hasClass('incomplete')) { selectNextFrom(item); }
      else { openItem.apply(item); }
      return false;

    case 27:
      // ESCAPE
      clearSelection();
      return false;

    case 189:
      // - (HYPHEN)
      item.length && toggleItemFinished.apply(item);
      return false;

    case 222:
      // ' (SINGLE QUOTE)
      selectItem(title);
      return false;

    case 191:
      // / (SLASH)
      selectItem(filter);
      return false;

    case 8:
    case 46:
      // BACKSPACE, DELETE
      item.length && deleteItem.apply(item);
      return false;

    case 37:
      // LEFT
      selectLeftFrom(item);
      return false;

    case 38:
      // UP
      selectUpFrom(item);
      return false;

    case 39:
      // RIGHT
      selectRightFrom(item);
      return false;

    case 40:
      // DOWN
      selectDownFrom(item);
      return false;

    default:
      break;

    }

    // focus the selected item if possible
    if (item.length) {
      if (!item.hasClass('incomplete')) { beginItem(item); }
      return;
    }

    // if nothing selected, create a new item and focus that
    item = shoppingItem();
    model[item.attr('id')] = {
      'name': '',
      'quantity': '1',
      'price': '0.00'
    };
    beginItem(item);
    items.append(item);
  }

  function updateList() {
    var item, data;
    item = items.find('.selected').first();
    data = {};
    edit.find('.property').each(function () {
      var prop = $(this);
      data[prop.attr('name')] = prop.val();
    });
    model[item.attr('id')] = data;

    // Populate the item with the collected data.
    item.find('.name').text(data.name);
    if (data.finished === 'TRUE') { item.addClass('finished'); }
    else { item.removeClass('finished'); }

    // List filtering to be added here.
  }

  function selectItem() {
    var item, selectedId;
    item = $(this);
    selectedId = item.attr('id');
    if (selectedId in model) {
      clearSelection();
      item.addClass('selected');
      populateForm(model[selectedId]);
      nameField.focus();
    }
  }

  function openItem() {
    var item = $(this);
    if (!this.hasClass('shopping-item')) { return; }
    selectItem.apply($(this));
    app.addClass('item-opened');
  }

  function closeItem() {
    selectItem.apply($(this));
    app.removeClass('item-opened');
  }

  function toggleItemFinished() {
    $(this).toggleClass('finished');
  }

  function deleteItem() {
    $(this).remove();
  }

  function clearSelection() {
    $('.shopping-item, .control-item')
      .removeClass('selected open placeholder incomplete');
  }

  function beginItem(item) {
    selectItem.apply(item);
    nameField.val('');
    item.addClass('incomplete');
    return item;
  }

  function selectUpFrom(item) {
    item = item.prev();
    if (!item.length) { clearSelection(); }
    else { selectItem.apply(item); }
  }

  function selectDownFrom(item) {
    item = item.next();
    if (!item.length) { clearSelection(); }
    else { selectItem.apply(item); }
  }

  function selectLeftFrom(item) {
    // TODO
  }

  function selectRightFrom(item) {
    // TODO
  }

  // TODO: Change this when grid navigation is implemented
  var selectNextFrom = selectDownFrom; // alias.

  function shoppingItem() {
    var newId = '' + Math.random();
    if ($('#' + newId).length) { return shoppingItem(); } // ID should be unique
    return $(
      '<li id="' + newID + '"' +
        'class="shopping-item">' +
        '<label class="name"></label>' +
        '<button class="finishme">GOT IT</button>' +
        '<button class="deleteme">DELETE</button>' +
      '</li>');
  }

  function populateForm(data) {
    edit.find('.property').each(function () {
      var prop = $(this);
      prop.val(data[prop.attr('name')] || '');
    });
  }

  function mdyDate(date) {
    // TODO
  }
});
