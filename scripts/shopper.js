var doc = $(document).ready(function () {
  'use strict';

  var bod, model, theList, nameField, editor;

  bod = $(document.body).removeClass('preload'); // Now transitions may happen
  model = {};
  theList = $('#the-list');
  nameField = $('#input-name');
  editor = $('#editor');

  doc
    .on('keydown', function (event) {
      var item = theList.find('.selected').first();

      switch (event.keyCode) {

      case 13: // ENTER
        if (!item.hasClass('incomplete')) {
          bod.addClass('item-opened');
          return;
        }
        item.removeClass('selected incomplete');
        nameField.val('');
        return false;

      case 27: // ESCAPE
        if (item.hasClass('incomplete')) { removeItem(item); }
        else { item.removeClass('selected incomplete'); }
        nameField.val('');
        return false;

      case 38: // UP
        item = item.removeClass('selected incomplete').prev();
        selectItem(item.length ? item : theList.find('.list-item').last());
        return false;

      case 40: // DOWN
        item = item.removeClass('selected incomplete').next();
        selectItem(item.length ? item : theList.find('.list-item').first());
        return false;

      case 8: // BACKSPACE
      case 46: // DELETE
        if (item.hasClass('incomplete')) { return; }
        item.length && removeItem(item);
        return false;

      }
    })
    .on('keypress', function () {
      var item = theList.find('.selected').first();

      if (!item.length) {
        item = listItem().appendTo(theList);
        selectItem(item);
      }

      if (!item.hasClass('incomplete')) {
        nameField.val('');
        item.addClass('incomplete');
      }

      bod.hasClass('editor-opened')
        || bod.hasClass('filter-opened')
        || nameField.focus();
    })
    .on('keyup', function () {
      var selectedItem, selectedId, data;

      selectedItem = theList.find('.selected').first();
      if (!selectedItem.length) { return; }
      selectedId = selectedItem.attr('id');

      data = model[selectedId]
      data.name = nameField.val();
      if (!data.name.length) { removeItem(selectedItem); }

      selectedItem.find('.name').text(data.name);
      if (data.quantity > 1) {} // badge the item
    });

  function selectItem(jq) {
    var item = model[jq.attr('id')];

    if (!jq.hasClass('list-item')) { return; }
    editor.find('input').each(function () {
      var $this = $(this);
      $this.val(item[$this.attr('name')]);
    });

    theList.find('.list-item').removeClass('selected');
    return jq.addClass('selected');
  }

  function removeItem(jq) {
    delete model[jq.remove().attr('id')];
  }

  function listItem() {
    var newId = '' + Math.random();
    if ((newId in model) || $(newId).length) { return listItem(); }
    model[newId] = {
      name: '',
      quantity: '1',
      price: '0.00'
    }
    console.log(model);
    return $(
      '<li class="list-item incomplete" id="' + newId + '">' +
        '<span class="name"></span>' +
        '<div class="actions">' +
          '<button class="finisher pure-button">GOT IT</button>' +
          '<button class="deleter pure-button">DELETE</button>' +
        '</div>' +
      '</li>');
  }
});