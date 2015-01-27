$(document).ready(function () {
  'use strict';

  var bod, mode, entries, cursor, theList, fields, filterButton, hint;

  bod = $(document.body);
  mode = 'ready';
    // possible modes: 'ready', 'typing', 'selecting', 'editing', 'filtering'
  entries = {};
  cursor = 0;
  theList = $('#the-list');
  fields = {
    name: $('#input-name'),
    quantity: $('#input-quantity'),
    price: $('#input-price'),
    filter: $('#input-filter')
  };
  filterButton = $('.filter-help');
  hint = $('.hint');

  moveTo(0);
  refreshView();

  bod.removeClass('preload') // Now transitions may happen
    // No submitting anything from this page
    .on('submit', function () {
      return false;
    })
    // Let the user click out of the instructions
    .on('click', '#instructions:not("#instructions *")', function () {
      $('#instruct-toggle').prop('checked', false);
    })
    .on('click', '.list-item', function () {
      moveTo($(this).index());
      refreshView();
      return false;
    })
    .on('click', '#the-list', function () {
      moveTo($(this).children('.list-item').length);
      refreshView();
      return false;
    })
    .on('dblclick', '.list-item', function () {
      mode = 'editing';
      refreshView();
      return false;
    })
    .on('click', '.adder', function () {
      mode = 'selecting';
      move(1);
      refreshView();
      return false;
    })
    .on('click', '.deleter', function () {
      removeItem($('.list-item.selected'));
      refreshView();
      return false;
    })
    .on('click', '.finisher', function () {
      $('.list-item.selected').toggleClass('finished');
      refreshView();
      return false;
    })
    .on('click', '.filter-help', function () {
      mode = 'filtering';
      refreshView();
      return false;
    })
    // Capture keyboard commands
    .on('keydown', function (event) {
      switch (event.keyCode) {

      case 13: // ENTER
        if (mode === 'editing' || mode === 'typing') {
          mode = 'selecting';
          move(1);
        } else {
          mode = 'editing';
        }
        break;

      case 27: // ESC
        revert();
        moveTo(theList.children('.list-item').length);
        break;

      case 38: // UP
        move(-1);
        break;

      case 40: // DOWN
        move(1);
        break;

      case 8: // BACKSPACE
      case 46: // DELETE
        if (mode !== 'selecting') { return; }
        removeItem($('.list-item.selected'));
        break;

      case 189: // - (HYPHEN)
        if (mode !== 'selecting') { return; }
        $('.list-item.selected').toggleClass('finished');
        break;

      case 191: // / (SLASH)
        if (mode !== 'selecting') { return; }
        mode = 'filtering';
        break;

      default:
        return true; // If key pressed was a printable character, keypress
        // handler will take over from this point. 

      }

      refreshView();
      return false;
    })
    .on('keypress', function () {
      if (mode !== 'editing' && mode !=='typing') {
        fields.name.val('');
        mode = 'typing';
        refreshView();
      }
    })
    .on('keyup', function () {
      var item = theList.children('.list-item').eq(cursor);
      item.find('.name').text(fields.name.val());
      filterButton.text(fields.filter.val());
    });

  function move(direction) { // Positive is down, negative is up.
    return moveTo(cursor + (direction / Math.abs(direction)));
  }

  function moveTo(index) {
    var items, item;
    items = theList.children('.list-item');
    item = items.eq(cursor);

    item.length && commit(item.attr('id'));
    cursor = Math.min(items.length, Math.max(index, 0));
    item = items.eq(cursor);
    mode = item.length ? 'selecting' : 'ready';
    item = item.length ? item : listItem().appendTo(theList);
    revert(item.attr('id'));
  }

  function commit(id) {
    var data;
    id = id || $('.list-item.selected').attr('id');
    data = entries[id];
    Object.keys(fields).forEach(function (k) {
      data[k] = fields[k].val();
    });
  }

  function revert(id) {
    var data;
    id = id || $('.list-item.selected').attr('id');
    data = entries[id];
    Object.keys(fields).forEach(function (k) {
      fields[k].val(data[k]);
    });
  }

  function removeItem(jq) {
    delete entries[jq.remove().attr('id')];
    moveTo(Math.min(cursor, $('.list-item').length - 1));
  }

  function refreshView() {
    var items, item;
    items = theList.children('.list-item');
    item = items.removeClass('selected incomplete')
      .eq(cursor)
        .addClass('selected');

    bod.removeClass('editor-open');

    switch (mode) {

    case 'filtering':
      fields.filter.focus();
      hint.text('type a search string to filter your shopping list');
      break;

    case 'editing':
      bod.addClass('editor-open');
      hint.text('');
      break;

    case 'selecting':
      hint.text('press enter on an item to edit additional details');
      break;

    case 'ready':
      item.addClass('incomplete');
      hint.text('type anything to add it to your list');
      break;

    case 'typing':
      item.addClass('incomplete');
      fields.name.focus();
      hint.text('press enter to go to the next item, or esc to cancel');
      break;

    }

    items
      .not('.incomplete')
      .filter(function () {
        var elem = $(this);
        return !(
          elem.attr('id') in entries && elem.find('.name').text().trim());
      })
      .remove();
  }

  function listItem() {
    var newId = ('' + Math.random()).replace('0.', '');
    if ((newId in entries) || $(newId).length) { return listItem(); }
    entries[newId] = {
      name: '',
      quantity: '1',
      price: '0.00',
      filter: ''
    };
    return $(
      '<li class="list-item" id="' + newId + '">' +
        '<span class="name"></span>' +
        '<div class="actions">' +
          '<button class="adder pure-button">ADD</button>' +
          '<button class="finisher pure-button">GOT IT</button>' +
          '<button class="deleter pure-button">DELETE</button>' +
        '</div>' +
      '</li>');
  }
});