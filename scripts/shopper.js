var doc = $(document).ready(function () {
  'use strict';

  var bod, model, theList, nameField, quantityField, priceField, editor;

  bod = $(document.body).removeClass('preload'); // Now transitions may happen
  model = {};
  theList = $('#the-list');
  nameField = $('#input-name');
  quantityField = $('#input-quantity');
  priceField = $('#input-price');
  editor = $('#editor');

  doc
    .on('keydown', function (event) {
      var item = theList.find('.selected').first();

      switch (event.keyCode) {

      case 13: // ENTER
        if (!item.length) { return false; }
        if (!item.hasClass('incomplete')) {
          bod.addClass('editor-open');
          item.addClass('incomplete');
          return false;
        }
        if (bod.hasClass('editor-open')) {
          bod.removeClass('editor-open');
        }
        item.removeClass('selected incomplete');
        nameField.val('');
        return false;

      case 27: // ESC
        if (item.hasClass('incomplete')) { removeItem(item); }
        deselect();
        return false;

      case 38: // UP
        item = item.prev();
        item = item.length ? item : theList.find('.list-item').last();
        selectItem(item);
        bod.hasClass('editor-open') && item.addClass('incomplete');
        return false;

      case 40: // DOWN
        item = item.next();
        item = item.length ? item : theList.find('.list-item').first();
        selectItem(item);
        bod.hasClass('editor-open') && item.addClass('incomplete');
        return false;

      case 8: // BACKSPACE
      case 46: // DELETE
        return item.hasClass('incomplete')
          || bod.hasClass('editor-open')
          || bod.hasClass('filter-open')
          || (item.length && removeItem(item) && false);

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

      bod.hasClass('editor-open')
        || bod.hasClass('filter-open')
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
      data.quantity = quantityField.val();
      data.price = priceField.val();

      selectedItem.find('.name').text(data.name);
      if (data.quantity > 1) {} // badge the item
    });

  function selectItem(jq) {
    var item = model[jq.attr('id')];

    if (!jq.hasClass('list-item')) { return; }
    deselect(theList.find('.list-item').not(jq), true);

    editor.find('input').each(function () {
      var $this = $(this);
      $this.val(item[$this.attr('name')]);
    });

    return jq.addClass('selected');
  }

  function deselect(jq, keepEditor) {
    jq = jq && jq.length ? jq : theList.find('.list-item');
    jq.removeClass('selected incomplete');
    keepEditor || bod.removeClass('editor-open');
    editor.get(0).reset();
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