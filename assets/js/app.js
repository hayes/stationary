(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"prosemirror/dist/edit":11,"prosemirror/dist/menu/tooltipmenu":21}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elt = elt;
exports.requestAnimationFrame = requestAnimationFrame;
exports.rmClass = rmClass;
exports.addClass = addClass;
exports.contains = contains;
exports.insertCSS = insertCSS;

function elt(tag, attrs) {
  var result = document.createElement(tag);
  if (attrs) for (var _name in attrs) {
    if (_name == "style") result.style.cssText = attrs[_name];else if (attrs[_name] != null) result.setAttribute(_name, attrs[_name]);
  }

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  for (var i = 0; i < args.length; i++) {
    add(args[i], result);
  }return result;
}

function add(value, target) {
  if (typeof value == "string") value = document.createTextNode(value);
  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      add(value[i], target);
    }
  } else {
    target.appendChild(value);
  }
}

var reqFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function requestAnimationFrame(f) {
  if (reqFrame) reqFrame(f);else setTimeout(f, 10);
}

var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);

var browser = {
  mac: /Mac/.test(navigator.platform),
  ie_upto10: ie_upto10,
  ie_11up: ie_11up,
  ie: ie_upto10 || ie_11up,
  gecko: /gecko\/\d/i.test(navigator.userAgent)
};

exports.browser = browser;
function classTest(cls) {
  return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
}

function rmClass(node, cls) {
  var current = node.className;
  var match = classTest(cls).exec(current);
  if (match) {
    var after = current.slice(match.index + match[0].length);
    node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
  }
}

function addClass(node, cls) {
  var current = node.className;
  if (!classTest(cls).test(current)) node.className += (current ? " " : "") + cls;
}

function contains(parent, child) {
  // Android browser and IE will return false if child is a text node.
  if (child.nodeType != 1) child = child.parentNode;
  return child && parent.contains(child);
}

function insertCSS(css) {
  var style = document.createElement("style");
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);
}
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _selection = require("./selection");

var _dom = require("../dom");

var _keys = require("./keys");

function nothing() {}

function ensureSelection(pm) {
  if (pm.selection.node) {
    var found = (0, _selection.findSelectionNear)(pm.doc, pm.selection.from, 1, true);
    if (found) (0, _selection.setDOMSelectionToPos)(pm, found.head);
  }
  return false;
}

// A backdrop keymap used to make sure we always suppress keys that
// have a dangerous default effect, even if the commands they are
// bound to return false, and to make sure that cursor-motion keys
// find a cursor (as opposed to a node selection) when pressed.

var keys = {
  "Esc": nothing,
  "Enter": nothing,
  "Mod-Enter": nothing,
  "Shift-Enter": nothing,
  "Backspace": nothing,
  "Delete": nothing,
  "Mod-B": nothing,
  "Mod-I": nothing,
  "Mod-Backspace": nothing,
  "Mod-Delete": nothing,
  "Shift-Backspace": nothing,
  "Shift-Delete": nothing,
  "Shift-Mod-Backspace": nothing,
  "Shift-Mod-Delete": nothing,
  "Mod-Z": nothing,
  "Mod-Y": nothing,
  "Shift-Mod-Z": nothing,
  "Ctrl-D": nothing,
  "Ctrl-H": nothing,
  "Ctrl-Alt-Backspace": nothing,
  "Alt-D": nothing,
  "Alt-Delete": nothing,
  "Alt-Backspace": nothing,

  "Mod-A": ensureSelection
};["Left", "Right", "Up", "Down", "Home", "End", "PageUp", "PageDown"].forEach(function (key) {
  keys[key] = keys["Shift-" + key] = keys["Mod-" + key] = keys["Shift-Mod-" + key] = keys["Alt-" + key] = keys["Shift-Alt-" + key] = ensureSelection;
});["Left", "Mod-Left", "Right", "Mod-Right", "Up", "Down"].forEach(function (key) {
  return delete keys[key];
});

if (_dom.browser.mac) keys["Ctrl-F"] = keys["Ctrl-B"] = keys["Ctrl-P"] = keys["Ctrl-N"] = keys["Alt-F"] = keys["Alt-B"] = keys["Ctrl-A"] = keys["Ctrl-E"] = keys["Ctrl-V"] = keys["goPageUp"] = ensureSelection;

var captureKeys = new _keys.Keymap(keys);
exports.captureKeys = captureKeys;
},{"../dom":2,"./keys":13,"./selection":17}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWordChar = isWordChar;
exports.charCategory = charCategory;
exports.isExtendingChar = isExtendingChar;
var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;

// Extending unicode characters. A series of a non-extending char +
// any number of extending chars is treated as a single unit as far
// as editing and measuring is concerned. This is not fully correct,
// since some scripts/fonts/browsers also treat other configurations
// of code points as a group.
var extendingChar = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;

function isWordChar(ch) {
  return (/\w/.test(ch) || isExtendingChar(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch))
  );
}

/**
 * Get the category of a given character. Either a "space",
 * a character that can be part of a word ("word"), or anything else ("other").
 *
 * @param  {string} ch The character.
 * @return {string}
 */

function charCategory(ch) {
  return (/\s/.test(ch) ? "space" : isWordChar(ch) ? "word" : "other"
  );
}

function isExtendingChar(ch) {
  return ch.charCodeAt(0) >= 768 && extendingChar.test(ch);
}
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.defineCommand = defineCommand;
exports.defineParamHandler = defineParamHandler;
exports.initCommands = initCommands;
exports.defaultKeymap = defaultKeymap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _transform = require("../transform");

var _dom = require("../dom");

var _utilSortedinsert = require("../util/sortedinsert");

var _utilSortedinsert2 = _interopRequireDefault(_utilSortedinsert);

var _char = require("./char");

var _keys = require("./keys");

var _selection = require("./selection");

var globalCommands = Object.create(null);
var paramHandlers = Object.create(null);

function defineCommand(name, cmd) {
  globalCommands[name] = cmd instanceof Command ? cmd : new Command(name, cmd);
}

_model.NodeType.attachCommand = _model.MarkType.attachCommand = function (name, create) {
  this.register("commands", { name: name, create: create });
};

function defineParamHandler(name, handler) {
  paramHandlers[name] = handler;
}

function getParamHandler(pm) {
  var option = pm.options.commandParamHandler;
  if (option && paramHandlers[option]) return paramHandlers[option];
}

var Command = (function () {
  function Command(name, options) {
    _classCallCheck(this, Command);

    this.name = name;
    this.label = options.label || name;
    this.run = options.run;
    this.params = options.params || [];
    this.select = options.select || function () {
      return true;
    };
    this.active = options.active || function () {
      return false;
    };
    this.info = options;
    this.display = options.display || "icon";
  }

  _createClass(Command, [{
    key: "exec",
    value: function exec(pm, params) {
      var _this = this;

      if (!this.params.length) return this.run(pm);
      if (params) return this.run.apply(this, [pm].concat(_toConsumableArray(params)));
      var handler = getParamHandler(pm);
      if (handler) handler(pm, this, function (params) {
        if (params) _this.run.apply(_this, [pm].concat(_toConsumableArray(params)));
      });else return false;
    }
  }]);

  return Command;
})();

exports.Command = Command;

function initCommands(schema) {
  var result = Object.create(null);
  for (var cmd in globalCommands) {
    result[cmd] = globalCommands[cmd];
  }function fromTypes(types) {
    var _loop = function (_name) {
      var type = types[_name],
          cmds = type.commands;
      if (cmds) cmds.forEach(function (_ref) {
        var name = _ref.name;
        var create = _ref.create;

        result[name] = new Command(name, create(type));
      });
    };

    for (var _name in types) {
      _loop(_name);
    }
  }
  fromTypes(schema.nodes);
  fromTypes(schema.marks);
  return result;
}

function defaultKeymap(pm) {
  var bindings = {};
  function add(command, key) {
    if (Array.isArray(key)) {
      for (var i = 0; i < key.length; i++) {
        add(command, key[i]);
      }
    } else if (key) {
      var _d$$exec = /^(.+?)(?:\((\d+)\))?$/.exec(key);

      var _d$$exec2 = _slicedToArray(_d$$exec, 3);

      var _ = _d$$exec2[0];
      var _name2 = _d$$exec2[1];
      var _d$$exec2$2 = _d$$exec2[2];
      var rank = _d$$exec2$2 === undefined ? 50 : _d$$exec2$2;

      (0, _utilSortedinsert2["default"])(bindings[_name2] || (bindings[_name2] = []), { command: command, rank: rank }, function (a, b) {
        return a.rank - b.rank;
      });
    }
  }
  for (var _name3 in pm.commands) {
    var cmd = pm.commands[_name3];
    add(_name3, cmd.info.key);
    add(_name3, _dom.browser.mac ? cmd.info.macKey : cmd.info.pcKey);
  }

  for (var key in bindings) {
    bindings[key] = bindings[key].map(function (b) {
      return b.command;
    });
  }return new _keys.Keymap(bindings);
}

var andScroll = { scrollIntoView: true };

_model.HardBreak.attachCommand("insertHardBreak", function (type) {
  return {
    label: "Insert hard break",
    run: function run(pm) {
      var _pm$selection = pm.selection;
      var node = _pm$selection.node;
      var from = _pm$selection.from;

      if (node && node.isBlock) return false;else if (pm.doc.path(from.path).type.isCode) return pm.tr.typeText("\n").apply(andScroll);else return pm.tr.replaceSelection(type.create()).apply(andScroll);
    },
    key: ["Mod-Enter", "Shift-Enter"]
  };
});

function markActive(pm, type) {
  var sel = pm.selection;
  if (sel.empty) return type.isInSet(pm.activeMarks());else return pm.doc.rangeHasMark(sel.from, sel.to, type);
}

function canAddInline(pm, type) {
  var _pm$selection2 = pm.selection;
  var from = _pm$selection2.from;
  var to = _pm$selection2.to;
  var empty = _pm$selection2.empty;

  if (empty) return !type.isInSet(pm.activeMarks()) && pm.doc.path(from.path).type.canContainMark(type);
  var can = false;
  pm.doc.nodesBetween(from, to, function (node) {
    if (can || node.isTextblock && !node.type.canContainMark(type)) return false;
    if (node.isInline && !type.isInSet(node.marks)) can = true;
  });
  return can;
}

function markApplies(pm, type) {
  var _pm$selection3 = pm.selection;
  var from = _pm$selection3.from;
  var to = _pm$selection3.to;

  var relevant = false;
  pm.doc.nodesBetween(from, to, function (node) {
    if (node.isTextblock) {
      if (node.type.canContainMark(type)) relevant = true;
      return false;
    }
  });
  return relevant;
}

function generateMarkCommands(type, name, labelName, info) {
  if (!labelName) labelName = name;
  var cap = name.charAt(0).toUpperCase() + name.slice(1);
  type.attachCommand("set" + cap, function (type) {
    return {
      label: "Set " + labelName,
      run: function run(pm) {
        pm.setMark(type, true);
      },
      select: function select(pm) {
        return canAddInline(pm, type);
      },
      icon: { from: name }
    };
  });
  type.attachCommand("unset" + cap, function (type) {
    return {
      label: "Remove " + labelName,
      run: function run(pm) {
        pm.setMark(type, false);
      },
      select: function select(pm) {
        return markActive(pm, type);
      },
      icon: { from: name }
    };
  });
  type.attachCommand(name, function (type) {
    var command = {
      label: "Toggle " + labelName,
      run: function run(pm) {
        pm.setMark(type, null);
      },
      active: function active(pm) {
        return markActive(pm, type);
      },
      select: function select(pm) {
        return markApplies(pm, type);
      }
    };
    for (var prop in info) {
      command[prop] = info[prop];
    }return command;
  });
}

generateMarkCommands(_model.StrongMark, "strong", null, {
  menuGroup: "inline", menuRank: 20,
  icon: {
    width: 805, height: 1024,
    path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
  },
  key: "Mod-B"
});

generateMarkCommands(_model.EmMark, "em", "emphasis", {
  menuGroup: "inline", menuRank: 21,
  icon: {
    width: 585, height: 1024,
    path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
  },
  key: "Mod-I"
});

generateMarkCommands(_model.CodeMark, "code", null, {
  menuGroup: "inline", menuRank: 22,
  icon: {
    width: 896, height: 1024,
    path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
  },
  key: "Mod-`"
});

_model.LinkMark.attachCommand("unlink", function (type) {
  return {
    label: "Unlink",
    run: function run(pm) {
      pm.setMark(type, false);
    },
    select: function select(pm) {
      return markActive(pm, type);
    },
    active: function active() {
      return true;
    },
    menuGroup: "inline", menuRank: 30,
    icon: { from: "link" }
  };
});

_model.LinkMark.attachCommand("link", function (type) {
  return {
    label: "Add link",
    run: function run(pm, href, title) {
      pm.setMark(type, true, { href: href, title: title });
    },
    params: [{ name: "Target", type: "text" }, { name: "Title", type: "text", "default": "" }],
    select: function select(pm) {
      return markApplies(pm, type) && !markActive(pm, type);
    },
    menuGroup: "inline", menuRank: 30,
    icon: {
      width: 951, height: 1024,
      path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
    }
  };
});

_model.Image.attachCommand("insertImage", function (type) {
  return {
    label: "Insert image",
    run: function run(pm, src, alt, title) {
      return pm.tr.replaceSelection(type.create({ src: src, title: title, alt: alt })).apply(andScroll);
    },
    params: [{ name: "Image URL", type: "text" }, { name: "Description / alternative text", type: "text", "default": "" }, { name: "Title", type: "text", "default": "" }],
    select: function select(pm) {
      return pm.doc.path(pm.selection.from.path).type.canContainType(type);
    },
    menuGroup: "inline", menuRank: 40,
    icon: {
      width: 1097, height: 1024,
      path: "M365 329q0 45-32 77t-77 32-77-32-32-77 32-77 77-32 77 32 32 77zM950 548v256h-804v-109l182-182 91 91 292-292zM1005 146h-914q-7 0-12 5t-5 12v694q0 7 5 12t12 5h914q7 0 12-5t5-12v-694q0-7-5-12t-12-5zM1097 164v694q0 37-26 64t-64 26h-914q-37 0-64-26t-26-64v-694q0-37 26-64t64-26h914q37 0 64 26t26 64z"
    },
    prefillParams: function prefillParams(pm) {
      var node = pm.selection.node;

      if (node && node.type == type) return [node.attrs.src, node.attrs.alt, node.attrs.title];
    }
  };
});

/**
 * Get an offset moving backward from a current offset inside a node.
 *
 * @param  {Object} parent The parent node.
 * @param  {int}    offset Offset to move from inside the node.
 * @param  {string} by     Size to delete by. Either "char" or "word".
 */
function moveBackward(parent, offset, by) {
  if (by != "char" && by != "word") throw new Error("Unknown motion unit: " + by);

  var cat = null,
      counted = 0;
  for (;;) {
    if (offset == 0) return offset;

    var _parent$chunkBefore = parent.chunkBefore(offset);

    var start = _parent$chunkBefore.start;
    var node = _parent$chunkBefore.node;

    if (!node.isText) return cat ? offset : offset - 1;

    if (by == "char") {
      for (var i = offset - start; i > 0; i--) {
        if (!(0, _char.isExtendingChar)(node.text.charAt(i - 1))) return offset - 1;
        offset--;
      }
    } else if (by == "word") {
      // Work from the current position backwards through text of a singular
      // character category (e.g. "cat" of "#!*") until reaching a character in a
      // different category (i.e. the end of the word).
      for (var i = offset - start; i > 0; i--) {
        var nextCharCat = (0, _char.charCategory)(node.text.charAt(i - 1));
        if (cat == null || counted == 1 && cat == "space") cat = nextCharCat;else if (cat != nextCharCat) return offset;
        offset--;
        counted++;
      }
    }
  }
}

defineCommand("deleteSelection", {
  label: "Delete the selection",
  run: function run(pm) {
    return pm.tr.replaceSelection().apply(andScroll);
  },
  key: ["Backspace(10)", "Delete(10)", "Mod-Backspace(10)", "Mod-Delete(10)"],
  macKey: ["Ctrl-H(10)", "Alt-Backspace(10)", "Ctrl-D(10)", "Ctrl-Alt-Backspace(10)", "Alt-Delete(10)", "Alt-D(10)"]
});

function deleteBarrier(pm, cut) {
  var around = pm.doc.path(cut.path);
  var before = around.child(cut.offset - 1),
      after = around.child(cut.offset);
  if (before.type.canContainContent(after.type) && pm.tr.join(cut).apply(andScroll) !== false) return;

  var conn = undefined;
  if (after.isTextblock && (conn = before.type.findConnection(after.type))) {
    var tr = pm.tr,
        end = cut.move(1);
    tr.step("ancestor", cut, end, null, { types: [before.type].concat(_toConsumableArray(conn)),
      attrs: [before.attrs].concat(_toConsumableArray(conn.map(function () {
        return null;
      }))) });
    tr.join(end);
    tr.join(cut);
    if (tr.apply(andScroll) !== false) return;
  }

  var selAfter = (0, _selection.findSelectionFrom)(pm.doc, cut, 1);
  return pm.tr.lift(selAfter.from, selAfter.to).apply(andScroll);
}

defineCommand("joinBackward", {
  label: "Join with the block above",
  run: function run(pm) {
    var _pm$selection4 = pm.selection;
    var head = _pm$selection4.head;
    var empty = _pm$selection4.empty;

    if (!empty || head.offset > 0) return false;

    // Find the node before this one
    var before = undefined,
        cut = undefined;
    for (var i = head.path.length - 1; !before && i >= 0; i--) {
      if (head.path[i] > 0) {
        cut = head.shorten(i);
        before = pm.doc.path(cut.path).child(cut.offset - 1);
      }
    } // If there is no node before this, try to lift
    if (!before) return pm.tr.lift(head).apply(andScroll);

    // If the node doesn't allow children, delete it
    if (before.type.contains == null) return pm.tr["delete"](cut.move(-1), cut).apply(andScroll);

    // Apply the joining algorithm
    return deleteBarrier(pm, cut);
  },
  key: ["Backspace(30)", "Mod-Backspace(30)"]
});

defineCommand("deleteCharBefore", {
  label: "Delete a character before the cursor",
  run: function run(pm) {
    var _pm$selection5 = pm.selection;
    var head = _pm$selection5.head;
    var empty = _pm$selection5.empty;

    if (!empty || head.offset == 0) return false;
    var from = moveBackward(pm.doc.path(head.path), head.offset, "char");
    return pm.tr["delete"](new _model.Pos(head.path, from), head).apply(andScroll);
  },
  key: "Backspace(60)",
  macKey: "Ctrl-H(40)"
});

defineCommand("deleteWordBefore", {
  label: "Delete the word before the cursor",
  run: function run(pm) {
    var _pm$selection6 = pm.selection;
    var head = _pm$selection6.head;
    var empty = _pm$selection6.empty;

    if (!empty || head.offset == 0) return false;
    var from = moveBackward(pm.doc.path(head.path), head.offset, "word");
    return pm.tr["delete"](new _model.Pos(head.path, from), head).apply(andScroll);
  },
  key: "Mod-Backspace(40)",
  macKey: "Alt-Backspace(40)"
});

function moveForward(parent, offset, by) {
  if (by != "char" && by != "word") throw new Error("Unknown motion unit: " + by);

  var cat = null,
      counted = 0;
  for (;;) {
    if (offset == parent.size) return offset;

    var _parent$chunkAfter = parent.chunkAfter(offset);

    var start = _parent$chunkAfter.start;
    var node = _parent$chunkAfter.node;

    if (!node.isText) return cat ? offset : offset + 1;

    if (by == "char") {
      for (var i = offset - start; i < node.text.length; i++) {
        if (!(0, _char.isExtendingChar)(node.text.charAt(i + 1))) return offset + 1;
        offset++;
      }
    } else if (by == "word") {
      for (var i = offset - start; i < node.text.length; i++) {
        var nextCharCat = (0, _char.charCategory)(node.text.charAt(i));
        if (cat == null || counted == 1 && cat == "space") cat = nextCharCat;else if (cat != nextCharCat) return offset;
        offset++;
        counted++;
      }
    }
  }
}

defineCommand("joinForward", {
  label: "Join with the block below",
  run: function run(pm) {
    var _pm$selection7 = pm.selection;
    var head = _pm$selection7.head;
    var empty = _pm$selection7.empty;

    if (!empty || head.offset < pm.doc.path(head.path).size) return false;

    // Find the node after this one
    var after = undefined,
        cut = undefined;
    for (var i = head.path.length - 1; !after && i >= 0; i--) {
      cut = head.shorten(i, 1);
      var _parent = pm.doc.path(cut.path);
      if (cut.offset < _parent.size) after = _parent.child(cut.offset);
    }

    // If there is no node after this, there's nothing to do
    if (!after) return false;

    // If the node doesn't allow children, delete it
    if (after.type.contains == null) return pm.tr["delete"](cut, cut.move(1)).apply(andScroll);

    // Apply the joining algorithm
    return deleteBarrier(pm, cut);
  },
  key: ["Delete(30)", "Mod-Delete(30)"]
});

defineCommand("deleteCharAfter", {
  label: "Delete a character after the cursor",
  run: function run(pm) {
    var _pm$selection8 = pm.selection;
    var head = _pm$selection8.head;
    var empty = _pm$selection8.empty;

    if (!empty || head.offset == pm.doc.path(head.path).size) return false;
    var to = moveForward(pm.doc.path(head.path), head.offset, "char");
    return pm.tr["delete"](head, new _model.Pos(head.path, to)).apply(andScroll);
  },
  key: "Delete(60)",
  macKey: "Ctrl-D(60)"
});

defineCommand("deleteWordAfter", {
  label: "Delete a character after the cursor",
  run: function run(pm) {
    var _pm$selection9 = pm.selection;
    var head = _pm$selection9.head;
    var empty = _pm$selection9.empty;

    if (!empty || head.offset == pm.doc.path(head.path).size) return false;
    var to = moveForward(pm.doc.path(head.path), head.offset, "word");
    return pm.tr["delete"](head, new _model.Pos(head.path, to)).apply(andScroll);
  },
  key: "Mod-Delete(40)",
  macKey: ["Ctrl-Alt-Backspace(40)", "Alt-Delete(40)", "Alt-D(40)"]
});

function joinPointAbove(pm) {
  var _pm$selection10 = pm.selection;
  var node = _pm$selection10.node;
  var from = _pm$selection10.from;

  if (node) return (0, _transform.joinableBlocks)(pm.doc, from) ? from : null;else return (0, _transform.joinPoint)(pm.doc, from, -1);
}

defineCommand("joinUp", {
  label: "Join with above block",
  run: function run(pm) {
    var node = pm.selection.node;
    var point = joinPointAbove(pm);
    if (!point) return false;
    pm.tr.join(point).apply();
    if (node) pm.setNodeSelection(point.move(-1));
  },
  select: function select(pm) {
    return joinPointAbove(pm);
  },
  menuGroup: "block", menuRank: 80,
  icon: {
    width: 800, height: 900,
    path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
  },
  key: "Alt-Up"
});

function joinPointBelow(pm) {
  var _pm$selection11 = pm.selection;
  var node = _pm$selection11.node;
  var to = _pm$selection11.to;

  if (node) return (0, _transform.joinableBlocks)(pm.doc, to) ? to : null;else return (0, _transform.joinPoint)(pm.doc, to, 1);
}

defineCommand("joinDown", {
  label: "Join with below block",
  run: function run(pm) {
    var node = pm.selection.node;
    var point = joinPointBelow(pm);
    if (!point) return false;
    pm.tr.join(point).apply();
    if (node) pm.setNodeSelection(point.move(-1));
  },
  select: function select(pm) {
    return joinPointBelow(pm);
  },
  key: "Alt-Down"
});

defineCommand("lift", {
  label: "Lift out of enclosing block",
  run: function run(pm) {
    var _pm$selection12 = pm.selection;
    var from = _pm$selection12.from;
    var to = _pm$selection12.to;

    return pm.tr.lift(from, to).apply(andScroll);
  },
  select: function select(pm) {
    var _pm$selection13 = pm.selection;
    var from = _pm$selection13.from;
    var to = _pm$selection13.to;

    return (0, _transform.canLift)(pm.doc, from, to);
  },
  menuGroup: "block", menuRank: 75,
  icon: {
    width: 1024, height: 1024,
    path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
  },
  key: "Alt-Left"
});

function isAtTopOfListItem(doc, from, to, listType) {
  return _model.Pos.samePath(from.path, to.path) && from.path.length >= 2 && from.path[from.path.length - 1] == 0 && listType.canContain(doc.path(from.path.slice(0, from.path.length - 1)));
}

function wrapCommand(type, name, labelName, isList, info) {
  type.attachCommand("wrap" + name, function (type) {
    var command = {
      label: "Wrap in " + labelName,
      run: function run(pm) {
        var _pm$selection14 = pm.selection;
        var from = _pm$selection14.from;
        var to = _pm$selection14.to;
        var head = _pm$selection14.head;var doJoin = false;
        if (isList && head && isAtTopOfListItem(pm.doc, from, to, type)) {
          // Don't do anything if this is the top of the list
          if (from.path[from.path.length - 2] == 0) return false;
          doJoin = true;
        }
        var tr = pm.tr.wrap(from, to, type);
        if (doJoin) tr.join(from.shorten(from.depth - 2));
        return tr.apply(andScroll);
      },
      select: function select(pm) {
        var _pm$selection15 = pm.selection;
        var from = _pm$selection15.from;
        var to = _pm$selection15.to;
        var head = _pm$selection15.head;

        if (isList && head && isAtTopOfListItem(pm.doc, from, to, type) && from.path[from.path.length - 2] == 0) return false;
        return (0, _transform.canWrap)(pm.doc, from, to, type);
      }
    };
    for (var key in info) {
      command[key] = info[key];
    }return command;
  });
}

wrapCommand(_model.BulletList, "BulletList", "bullet list", true, {
  menuGroup: "block", menuRank: 40,
  icon: {
    width: 768, height: 896,
    path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
  },
  key: ["Alt-Right '*'", "Alt-Right '-'"]
});

wrapCommand(_model.OrderedList, "OrderedList", "ordered list", true, {
  menuGroup: "block", menuRank: 41,
  icon: {
    width: 768, height: 896,
    path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
  },
  key: "Alt-Right '1'"
});

wrapCommand(_model.BlockQuote, "BlockQuote", "block quote", false, {
  menuGroup: "block", menuRank: 45,
  icon: {
    width: 640, height: 896,
    path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
  },
  key: ["Alt-Right '>'", "Alt-Right '\"'"]
});

defineCommand("newlineInCode", {
  label: "Insert newline",
  run: function run(pm) {
    var _pm$selection16 = pm.selection;
    var from = _pm$selection16.from;
    var to = _pm$selection16.to;
    var node = _pm$selection16.node;var block = undefined;
    if (!node && _model.Pos.samePath(from.path, to.path) && (block = pm.doc.path(from.path)).type.isCode && to.offset < block.size) return pm.tr.typeText("\n").apply(andScroll);else return false;
  },
  key: "Enter(10)"
});

defineCommand("createParagraphNear", {
  label: "Create a paragraph near the selected leaf block",
  run: function run(pm) {
    var _pm$selection17 = pm.selection;
    var from = _pm$selection17.from;
    var to = _pm$selection17.to;
    var node = _pm$selection17.node;

    if (!node || !node.isBlock || node.type.contains) return false;
    var side = from.offset ? to : from;
    pm.tr.insert(side, pm.schema.defaultTextblockType().create()).apply(andScroll);
    pm.setSelection(new _model.Pos(side.toPath(), 0));
  },
  key: "Enter(20)"
});

defineCommand("liftEmptyBlock", {
  label: "Move current block up",
  run: function run(pm) {
    var _pm$selection18 = pm.selection;
    var head = _pm$selection18.head;
    var empty = _pm$selection18.empty;

    if (!empty || head.offset > 0) return false;
    if (head.path[head.path.length - 1] > 0 && pm.tr.split(head.shorten()).apply() !== false) return;
    return pm.tr.lift(head).apply(andScroll);
  },
  key: "Enter(30)"
});

defineCommand("splitBlock", {
  label: "Split the current block",
  run: function run(pm) {
    var _pm$selection19 = pm.selection;
    var from = _pm$selection19.from;
    var to = _pm$selection19.to;
    var node = _pm$selection19.node;var block = pm.doc.path(to.path);
    if (node && node.isBlock) {
      if (!from.offset) return false;
      return pm.tr.split(from).apply(andScroll);
    } else {
      var type = to.offset == block.size ? pm.schema.defaultTextblockType() : null;
      return pm.tr["delete"](from, to).split(from, 1, type).apply(andScroll);
    }
  },
  key: "Enter(60)"
});

_model.ListItem.attachCommand("splitListItem", function (type) {
  return {
    label: "Split the current list item",
    run: function run(pm) {
      var _pm$selection20 = pm.selection;
      var from = _pm$selection20.from;
      var to = _pm$selection20.to;
      var node = _pm$selection20.node;
      var empty = _pm$selection20.empty;

      if (node && node.isBlock || from.path.length < 2 || !_model.Pos.samePath(from.path, to.path) || empty && from.offset == 0) return false;
      var toParent = from.shorten(),
          grandParent = pm.doc.path(toParent.path);
      if (grandParent.type != type) return false;
      var nextType = to.offset == grandParent.child(toParent.offset).size ? pm.schema.defaultTextblockType() : null;
      return pm.tr["delete"](from, to).split(from, 2, nextType).apply(andScroll);
    },
    key: "Enter(50)"
  };
});

function blockTypeCommand(type, name, labelName, attrs, key) {
  if (!attrs) attrs = {};
  type.attachCommand(name, function (type) {
    return {
      label: "Change to " + labelName,
      run: function run(pm) {
        var _pm$selection21 = pm.selection;
        var from = _pm$selection21.from;
        var to = _pm$selection21.to;

        return pm.tr.setBlockType(from, to, type, attrs).apply(andScroll);
      },
      select: function select(pm) {
        var _pm$selection22 = pm.selection;
        var from = _pm$selection22.from;
        var to = _pm$selection22.to;
        var node = _pm$selection22.node;

        if (node) return node.isTextblock && !node.hasMarkup(type, attrs);else return !(0, _transform.alreadyHasBlockType)(pm.doc, from, to, type, attrs);
      },
      key: key
    };
  });
}

blockTypeCommand(_model.Heading, "makeH1", "heading 1", { level: 1 }, "Mod-H '1'");
blockTypeCommand(_model.Heading, "makeH2", "heading 2", { level: 2 }, "Mod-H '2'");
blockTypeCommand(_model.Heading, "makeH3", "heading 3", { level: 3 }, "Mod-H '3'");
blockTypeCommand(_model.Heading, "makeH4", "heading 4", { level: 4 }, "Mod-H '4'");
blockTypeCommand(_model.Heading, "makeH5", "heading 5", { level: 5 }, "Mod-H '5'");
blockTypeCommand(_model.Heading, "makeH6", "heading 6", { level: 6 }, "Mod-H '6'");

blockTypeCommand(_model.Paragraph, "makeParagraph", "paragraph", null, "Mod-P");
blockTypeCommand(_model.CodeBlock, "makeCodeBlock", "code block", null, "Mod-\\");

_model.HorizontalRule.attachCommand("insertHorizontalRule", function (type) {
  return {
    label: "Insert horizontal rule",
    run: function run(pm) {
      return pm.tr.replaceSelection(type.create()).apply(andScroll);
    },
    key: "Mod-Space"
  };
});

defineCommand("undo", {
  label: "Undo last change",
  run: function run(pm) {
    pm.scrollIntoView();return pm.history.undo();
  },
  select: function select(pm) {
    return pm.history.canUndo();
  },
  menuGroup: "history", menuRank: 10,
  icon: {
    width: 1024, height: 1024,
    path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
  },
  key: "Mod-Z"
});

defineCommand("redo", {
  label: "Redo last undone change",
  run: function run(pm) {
    pm.scrollIntoView();return pm.history.redo();
  },
  select: function select(pm) {
    return pm.history.canRedo();
  },
  menuGroup: "history", menuRank: 20,
  icon: {
    width: 1024, height: 1024,
    path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
  },
  key: ["Mod-Y", "Shift-Mod-Z"]
});

defineCommand("textblockType", {
  label: "Change block type",
  run: function run(pm, type) {
    var _pm$selection23 = pm.selection;
    var from = _pm$selection23.from;
    var to = _pm$selection23.to;

    return pm.tr.setBlockType(from, to, type.type, type.attrs).apply();
  },
  select: function select(pm) {
    var node = pm.selection.node;

    return !node || node.isTextblock;
  },
  params: [{ name: "Type", type: "select", options: listTextblockTypes, "default": currentTextblockType, defaultLabel: "Type..." }],
  display: "select",
  menuGroup: "block", menuRank: 10
});

_model.Paragraph.prototype.textblockTypes = [{ label: "Normal", rank: 10 }];
_model.CodeBlock.prototype.textblockTypes = [{ label: "Code", rank: 20 }];
_model.Heading.prototype.textblockTypes = [1, 2, 3, 4, 5, 6].map(function (n) {
  return { label: "Head " + n, attrs: { level: n }, rank: 30 + n };
});

function listTextblockTypes(pm) {
  var cached = pm.schema.cached.textblockTypes;
  if (cached) return cached;

  var found = [];
  for (var _name4 in pm.schema.nodes) {
    var type = pm.schema.nodes[_name4];
    if (!type.textblockTypes) continue;
    for (var i = 0; i < type.textblockTypes.length; i++) {
      var info = type.textblockTypes[i];
      (0, _utilSortedinsert2["default"])(found, { label: info.label, value: { type: type, attrs: info.attrs }, rank: info.rank }, function (a, b) {
        return a.rank - b.rank;
      });
    }
  }
  return pm.schema.cached.textblockTypes = found;
}

function currentTextblockType(pm) {
  var _pm$selection24 = pm.selection;
  var from = _pm$selection24.from;
  var to = _pm$selection24.to;
  var node = _pm$selection24.node;

  if (!node || node.isInline) {
    if (!_model.Pos.samePath(from.path, to.path)) return null;
    node = pm.doc.path(from.path);
  } else if (!node.isTextblock) {
    return null;
  }
  var types = listTextblockTypes(pm);
  for (var i = 0; i < types.length; i++) {
    var tp = types[i],
        val = tp.value;
    if (node.hasMarkup(val.type, val.attrs)) return tp;
  }
}

function nodeAboveSelection(pm) {
  var sel = pm.selection,
      i = 0;
  if (sel.node) return !!sel.from.depth && sel.from.shorten();
  for (; i < sel.head.depth && i < sel.anchor.depth; i++) if (sel.head.path[i] != sel.anchor.path[i]) break;
  return i == 0 ? false : sel.head.shorten(i - 1);
}

defineCommand("selectParentBlock", {
  label: "Select parent node",
  run: function run(pm) {
    var node = nodeAboveSelection(pm);
    if (!node) return false;
    pm.setNodeSelection(node);
  },
  select: function select(pm) {
    return nodeAboveSelection(pm);
  },
  menuGroup: "block", menuRank: 90,
  icon: { text: "⬚", style: "font-weight: bold; vertical-align: 20%" },
  key: "Esc"
});

function moveSelectionBlock(pm, dir) {
  var _pm$selection25 = pm.selection;
  var from = _pm$selection25.from;
  var to = _pm$selection25.to;
  var node = _pm$selection25.node;

  var side = dir > 0 ? to : from;
  return (0, _selection.findSelectionFrom)(pm.doc, node && node.isBlock ? side : side.shorten(null, dir > 0 ? 1 : 0), dir);
}

function selectBlockHorizontally(pm, dir) {
  var _pm$selection26 = pm.selection;
  var empty = _pm$selection26.empty;
  var node = _pm$selection26.node;
  var from = _pm$selection26.from;
  var to = _pm$selection26.to;

  if (!empty && !node) return false;

  if (node && node.isInline) {
    pm.setSelection(dir > 0 ? to : from);
    return true;
  }

  var parent = undefined;
  if (!node && (parent = pm.doc.path(from.path)) && (dir > 0 ? from.offset < parent.size : from.offset)) {
    var _ref2 = dir > 0 ? parent.chunkAfter(from.offset) : parent.chunkBefore(from.offset);

    var nextNode = _ref2.node;
    var start = _ref2.start;

    if (nextNode.type.selectable && start == from.offset - (dir > 0 ? 0 : 1)) {
      pm.setNodeSelection(dir < 0 ? from.move(-1) : from);
      return true;
    }
    return false;
  }

  var next = moveSelectionBlock(pm, dir);
  if (next && (next instanceof _selection.NodeSelection || node)) {
    pm.setSelection(next);
    return true;
  }
  return false;
}

defineCommand("selectBlockLeft", {
  label: "Move the selection onto or out of the block to the left",
  run: function run(pm) {
    var done = selectBlockHorizontally(pm, -1);
    if (done) pm.scrollIntoView();
    return done;
  },
  key: ["Left", "Mod-Left"]
});

defineCommand("selectBlockRight", {
  label: "Move the selection onto or out of the block to the right",
  run: function run(pm) {
    var done = selectBlockHorizontally(pm, 1);
    if (done) pm.scrollIntoView();
    return done;
  },
  key: ["Right", "Mod-Right"]
});

function selectBlockVertically(pm, dir) {
  var _pm$selection27 = pm.selection;
  var empty = _pm$selection27.empty;
  var node = _pm$selection27.node;
  var from = _pm$selection27.from;
  var to = _pm$selection27.to;

  if (!empty && !node) return false;

  var leavingTextblock = true;
  if (!node || node.isInline) leavingTextblock = (0, _selection.verticalMotionLeavesTextblock)(pm, dir > 0 ? to : from, dir);

  if (leavingTextblock) {
    var next = moveSelectionBlock(pm, dir);
    if (next && next instanceof _selection.NodeSelection) {
      pm.setSelection(next);
      if (!node) pm.sel.lastNonNodePos = from;
      return true;
    }
  }

  if (!node) return false;

  if (node.isInline) {
    (0, _selection.setDOMSelectionToPos)(pm, from);
    return false;
  }

  var last = pm.sel.lastNonNodePos;
  var beyond = (0, _selection.findSelectionFrom)(pm.doc, dir < 0 ? from : to, dir);
  if (last && beyond && _model.Pos.samePath(last.path, beyond.from.path)) {
    (0, _selection.setDOMSelectionToPos)(pm, last);
    return false;
  }
  pm.setSelection(beyond);
  return true;
}

defineCommand("selectBlockUp", {
  label: "Move the selection onto or out of the block above",
  run: function run(pm) {
    var done = selectBlockVertically(pm, -1);
    if (done !== false) pm.scrollIntoView();
    return done;
  },
  key: "Up"
});

defineCommand("selectBlockDown", {
  label: "Move the selection onto or out of the block below",
  run: function run(pm) {
    var done = selectBlockVertically(pm, 1);
    if (done !== false) pm.scrollIntoView();
    return done;
  },
  key: "Down"
});
},{"../dom":2,"../model":26,"../transform":38,"../util/sortedinsert":49,"./char":4,"./keys":13,"./selection":17}],6:[function(require,module,exports){
"use strict";

var _dom = require("../dom");

(0, _dom.insertCSS)("\n\n.ProseMirror {\n  border: 1px solid silver;\n  position: relative;\n}\n\n.ProseMirror-content {\n  padding: 4px 8px 4px 14px;\n  white-space: pre-wrap;\n  line-height: 1.2;\n}\n\n.ProseMirror-drop-target {\n  position: absolute;\n  width: 1px;\n  background: #666;\n  display: none;\n}\n\n.ProseMirror-content ul.tight p, .ProseMirror-content ol.tight p {\n  margin: 0;\n}\n\n.ProseMirror-content ul, .ProseMirror-content ol {\n  padding-left: 30px;\n  cursor: default;\n}\n\n.ProseMirror-content blockquote {\n  padding-left: 1em;\n  border-left: 3px solid #eee;\n  margin-left: 0; margin-right: 0;\n}\n\n.ProseMirror-content pre {\n  white-space: pre-wrap;\n}\n\n.ProseMirror-selectednode {\n  outline: 2px solid #8cf;\n}\n\n.ProseMirror-content p:first-child,\n.ProseMirror-content h1:first-child,\n.ProseMirror-content h2:first-child,\n.ProseMirror-content h3:first-child,\n.ProseMirror-content h4:first-child,\n.ProseMirror-content h5:first-child,\n.ProseMirror-content h6:first-child {\n  margin-top: .3em;\n}\n\n/* Add space around the hr to make clicking it easier */\n\n.ProseMirror-content hr {\n  position: relative;\n  height: 6px;\n  border: none;\n}\n\n.ProseMirror-content hr:after {\n  content: \"\";\n  position: absolute;\n  left: 10px;\n  right: 10px;\n  top: 2px;\n  border-top: 2px solid silver;\n}\n\n.ProseMirror-content img {\n  cursor: default;\n}\n\n/* Make sure li selections wrap around markers */\n\n.ProseMirror-content li {\n  position: relative;\n  pointer-events: none; /* Don't do weird stuff with marker clicks */\n}\n.ProseMirror-content li > * {\n  pointer-events: auto;\n}\n\nli.ProseMirror-selectednode {\n  outline: none;\n}\n\nli.ProseMirror-selectednode:after {\n  content: \"\";\n  position: absolute;\n  left: -32px;\n  right: -2px; top: -2px; bottom: -2px;\n  border: 2px solid #8cf;\n  pointer-events: none;\n}\n\n");
},{"../dom":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDOMChange = applyDOMChange;
exports.textContext = textContext;
exports.textInContext = textInContext;

var _model = require("../model");

var _parseDom = require("../parse/dom");

var _transformTree = require("../transform/tree");

var _selection = require("./selection");

function isAtEnd(node, pos, depth) {
  for (var i = depth || 0; i < pos.path.length; i++) {
    var n = pos.path[depth];
    if (n < node.size - 1) return false;
    node = node.child(n);
  }
  return pos.offset == node.size;
}
function isAtStart(pos, depth) {
  if (pos.offset > 0) return false;
  for (var i = depth || 0; i < pos.path.length; i++) {
    if (pos.path[depth] > 0) return false;
  }return true;
}

function parseNearSelection(pm) {
  var dom = pm.content,
      node = pm.doc;
  var _pm$selection = pm.selection;
  var from = _pm$selection.from;
  var to = _pm$selection.to;

  for (var depth = 0;; depth++) {
    var toNode = node.child(to.path[depth]);
    var fromStart = isAtStart(from, depth + 1);
    var toEnd = isAtEnd(toNode, to, depth + 1);
    if (fromStart || toEnd || from.path[depth] != to.path[depth] || toNode.isTextblock) {
      var startOffset = depth == from.depth ? from.offset : from.path[depth];
      if (fromStart && startOffset > 0) startOffset--;
      var endOffset = depth == to.depth ? to.offset : to.path[depth] + 1;
      if (toEnd && endOffset < node.size - 1) endOffset++;
      var parsed = (0, _parseDom.fromDOM)(pm.schema, dom, { topNode: node.copy(),
        from: startOffset,
        to: dom.childNodes.length - (node.size - endOffset) });
      parsed = parsed.copy(node.content.slice(0, startOffset).append(parsed.content).append(node.content.slice(endOffset)));
      for (var i = depth - 1; i >= 0; i--) {
        var wrap = pm.doc.path(from.path.slice(0, i));
        parsed = wrap.replace(from.path[i], parsed);
      }
      return parsed;
    }
    node = toNode;
    dom = (0, _selection.findByPath)(dom, from.path[depth], false);
  }
}

function applyDOMChange(pm) {
  var updated = parseNearSelection(pm);
  var changeStart = (0, _model.findDiffStart)(pm.doc.content, updated.content);
  if (changeStart) {
    var changeEnd = findDiffEndConstrained(pm.doc.content, updated.content, changeStart);
    // Mark nodes touched by this change as 'to be redrawn'
    pm.markRangeDirty((0, _model.siblingRange)(pm.doc, changeStart, changeEnd.a));

    pm.tr.replace(changeStart, changeEnd.a, updated, changeStart, changeEnd.b).apply();
    return true;
  } else {
    return false;
  }
}

function offsetBy(first, second, pos) {
  var same = (0, _transformTree.samePathDepth)(first, second);
  var firstEnd = same == first.depth,
      secondEnd = same == second.depth;
  var off = (secondEnd ? second.offset : second.path[same]) - (firstEnd ? first.offset : first.path[same]);
  var shorter = firstEnd ? pos.move(off) : pos.shorten(same, off);
  if (secondEnd) return shorter;else return shorter.extend(new _model.Pos(second.path.slice(same), second.offset));
}

function findDiffEndConstrained(a, b, start) {
  var end = (0, _model.findDiffEnd)(a, b);
  if (!end) return end;
  if (end.a.cmp(start) < 0) return { a: start, b: offsetBy(end.a, start, end.b) };
  if (end.b.cmp(start) < 0) return { a: offsetBy(end.b, start, end.a), b: start };
  return end;
}

// Text-only queries for composition events

function textContext(data) {
  var range = getSelection().getRangeAt(0);
  var start = range.startContainer,
      end = range.endContainer;
  if (start == end && start.nodeType == 3) {
    var value = start.nodeValue,
        lead = range.startOffset,
        _end = range.endOffset;
    if (data && _end >= data.length && value.slice(_end - data.length, _end) == data) lead = _end - data.length;
    return { inside: start, lead: lead, trail: value.length - _end };
  }

  var sizeBefore = null,
      sizeAfter = null;
  var before = start.childNodes[range.startOffset - 1] || nodeBefore(start);
  while (before.lastChild) before = before.lastChild;
  if (before && before.nodeType == 3) {
    var value = before.nodeValue;
    sizeBefore = value.length;
    if (data && value.slice(value.length - data.length) == data) sizeBefore -= data.length;
  }
  var after = end.childNodes[range.endOffset] || nodeAfter(end);
  while (after.firstChild) after = after.firstChild;
  if (after && after.nodeType == 3) sizeAfter = after.nodeValue.length;

  return { before: before, sizeBefore: sizeBefore,
    after: after, sizeAfter: sizeAfter };
}

function textInContext(context, deflt) {
  if (context.inside) {
    var _val = context.inside.nodeValue;
    return _val.slice(context.lead, _val.length - context.trail);
  } else {
    var before = context.before,
        after = context.after,
        val = "";
    if (!before) return deflt;
    if (before.nodeType == 3) val = before.nodeValue.slice(context.sizeBefore);
    var scan = scanText(before, after);
    if (scan == null) return deflt;
    val += scan;
    if (after && after.nodeType == 3) {
      var valAfter = after.nodeValue;
      val += valAfter.slice(0, valAfter.length - context.sizeAfter);
    }
    return val;
  }
}

function nodeAfter(node) {
  for (;;) {
    var next = node.nextSibling;
    if (next) {
      while (next.firstChild) next = next.firstChild;
      return next;
    }
    if (!(node = node.parentElement)) return null;
  }
}

function nodeBefore(node) {
  for (;;) {
    var prev = node.previousSibling;
    if (prev) {
      while (prev.lastChild) prev = prev.lastChild;
      return prev;
    }
    if (!(node = node.parentElement)) return null;
  }
}

function scanText(start, end) {
  var text = "",
      cur = nodeAfter(start);
  for (;;) {
    if (cur == end) return text;
    if (!cur) return null;
    if (cur.nodeType == 3) text += cur.nodeValue;
    cur = cur.firstChild || nodeAfter(cur);
  }
}
},{"../model":26,"../parse/dom":31,"../transform/tree":46,"./selection":17}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw = draw;
exports.redraw = redraw;

var _model = require("../model");

var _serializeDom = require("../serialize/dom");

var _dom = require("../dom");

var _main = require("./main");

// FIXME clean up threading of path and offset, maybe remove from DOM renderer entirely

function options(path, ranges) {
  return {
    onRender: function onRender(node, dom, offset) {
      if (node.type.contains == null) {
        dom.contentEditable = false;
        if (node.isBlock) dom.setAttribute("pm-leaf", "true");
      }
      if (node.isBlock && offset != null) dom.setAttribute("pm-offset", offset);
      if (node.isTextblock) adjustTrailingHacks(dom, node);

      return dom;
    },
    renderInlineFlat: function renderInlineFlat(node, dom, offset) {
      ranges.advanceTo(new _model.Pos(path, offset));
      var end = new _model.Pos(path, offset + node.width);
      var nextCut = ranges.nextChangeBefore(end);

      var inner = dom,
          wrapped = undefined;
      for (var i = 0; i < node.marks.length; i++) {
        inner = inner.firstChild;
      }if (dom.nodeType != 1) {
        dom = (0, _dom.elt)("span", null, dom);
        if (!nextCut) wrapped = dom;
      }
      if (!wrapped && (nextCut || ranges.current.length)) {
        wrapped = inner == dom ? dom = (0, _dom.elt)("span", null, inner) : inner.parentNode.appendChild((0, _dom.elt)("span", null, inner));
      }

      dom.setAttribute("pm-offset", offset);
      if (node.type.contains == null) dom.setAttribute("pm-leaf", node.isText ? node.width : "true");

      var inlineOffset = 0;
      while (nextCut) {
        var size = nextCut - offset;
        var split = splitSpan(wrapped, size);
        if (ranges.current.length) split.className = ranges.current.join(" ");
        split.setAttribute("pm-inner-offset", inlineOffset);
        inlineOffset += size;
        offset += size;
        ranges.advanceTo(new _model.Pos(path, offset));
        if (!(nextCut = ranges.nextChangeBefore(end))) wrapped.setAttribute("pm-inner-offset", inlineOffset);
      }

      if (ranges.current.length) wrapped.className = ranges.current.join(" ");
      return dom;
    },
    document: document, path: path
  };
}

function splitSpan(span, at) {
  var textNode = span.firstChild,
      text = textNode.nodeValue;
  var newNode = span.parentNode.insertBefore((0, _dom.elt)("span", null, text.slice(0, at)), span);
  textNode.nodeValue = text.slice(at);
  return newNode;
}

function draw(pm, doc) {
  pm.content.textContent = "";
  pm.content.appendChild((0, _serializeDom.toDOM)(doc, options([], pm.ranges.activeRangeTracker())));
}

function adjustTrailingHacks(dom, node) {
  var needs = node.size == 0 || node.lastChild.type.isBR ? "br" : node.lastChild.type.contains == null ? "text" : null;
  var last = dom.lastChild;
  var has = !last || last.nodeType != 1 || !last.hasAttribute("pm-ignore") ? null : last.nodeName == "BR" ? "br" : "text";
  if (needs != has) {
    if (has) dom.removeChild(last);
    if (needs) dom.appendChild(needs == "br" ? (0, _dom.elt)("br", { "pm-ignore": "trailing-break" }) : (0, _dom.elt)("span", { "pm-ignore": "cursor-text" }, ""));
  }
}

function findNodeIn(iter, node) {
  var copy = iter.copy();
  for (var child = undefined; child = copy.next().value;) {
    if (child == node) return child;
  }
}

function movePast(dom) {
  var next = dom.nextSibling;
  dom.parentNode.removeChild(dom);
  return next;
}

function redraw(pm, dirty, doc, prev) {
  var opts = options([], pm.ranges.activeRangeTracker());

  function scan(dom, node, prev) {
    var iNode = node.iter(),
        iPrev = prev.iter(),
        pChild = iPrev.next().value;
    var domPos = dom.firstChild;

    for (var child = undefined; child = iNode.next().value;) {
      var offset = iNode.offset - child.width,
          matching = undefined,
          reuseDOM = undefined;
      if (!node.isTextblock) opts.path.push(offset);

      if (pChild == child) {
        matching = pChild;
      } else if (matching = findNodeIn(iPrev, child)) {
        while (pChild != matching) {
          pChild = iPrev.next().value;
          domPos = movePast(domPos);
        }
      }

      if (matching && !dirty.get(matching)) {
        reuseDOM = true;
      } else if (pChild && !child.isText && child.sameMarkup(pChild) && dirty.get(pChild) != _main.DIRTY_REDRAW) {
        reuseDOM = true;
        scan(domPos, child, pChild);
      } else {
        var rendered = (0, _serializeDom.renderNodeToDOM)(child, opts, offset);
        dom.insertBefore(rendered, domPos);
        reuseDOM = false;
      }

      if (reuseDOM) {
        domPos.setAttribute("pm-offset", offset);
        domPos = domPos.nextSibling;
        pChild = iPrev.next().value;
      }
      if (!node.isTextblock) opts.path.pop();
    }

    while (pChild) {
      domPos = movePast(domPos);
      pChild = iPrev.next().value;
    }
    if (node.isTextblock) adjustTrailingHacks(dom, node);
  }
  scan(pm.content, doc, prev);
}
},{"../dom":2,"../model":26,"../serialize/dom":34,"./main":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventMixin = eventMixin;
var methods = {
  on: function on(type, f) {
    var map = this._handlers || (this._handlers = {});
    var arr = map[type] || (map[type] = []);
    arr.push(f);
  },

  off: function off(type, f) {
    var arr = this._handlers && this._handlers[type];
    if (arr) for (var i = 0; i < arr.length; ++i) {
      if (arr[i] == f) {
        arr.splice(i, 1);break;
      }
    }
  },

  signal: function signal(type) {
    var arr = this._handlers && this._handlers[type];

    for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    if (arr) for (var i = 0; i < arr.length; ++i) {
      arr[i].apply(arr, values);
    }
  },

  signalHandleable: function signalHandleable(type) {
    var arr = this._handlers && this._handlers[type];
    if (arr) {
      for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        values[_key2 - 1] = arguments[_key2];
      }

      for (var i = 0; i < arr.length; ++i) {
        var result = arr[i].apply(arr, values);
        if (result !== false) return result;
      }
    }return false;
  },

  hasHandler: function hasHandler(type) {
    var arr = this._handlers && this._handlers[type];
    return arr && arr.length > 0;
  }
};

// Add event-related methods to a constructor's prototype, to make
// registering events on such objects more convenient.

function eventMixin(ctor) {
  var proto = ctor.prototype;
  for (var prop in methods) if (methods.hasOwnProperty(prop)) proto[prop] = methods[prop];
}
},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _transform = require("../transform");

var InvertedStep = function InvertedStep(step, version, id) {
  _classCallCheck(this, InvertedStep);

  this.step = step;
  this.version = version;
  this.id = id;
};

var BranchRemapping = (function () {
  function BranchRemapping(branch) {
    _classCallCheck(this, BranchRemapping);

    this.branch = branch;
    this.remap = new _transform.Remapping();
    this.version = branch.version;
    this.mirrorBuffer = Object.create(null);
  }

  _createClass(BranchRemapping, [{
    key: "moveToVersion",
    value: function moveToVersion(version) {
      while (this.version > version) this.addNextMap();
    }
  }, {
    key: "addNextMap",
    value: function addNextMap() {
      var found = this.branch.mirror[this.version];
      var mapOffset = this.branch.maps.length - (this.branch.version - this.version) - 1;
      var id = this.remap.addToFront(this.branch.maps[mapOffset], this.mirrorBuffer[this.version]);
      --this.version;
      if (found != null) this.mirrorBuffer[found] = id;
      return id;
    }
  }, {
    key: "movePastStep",
    value: function movePastStep(result) {
      var id = this.addNextMap();
      if (result) this.remap.addToBack(result.map, id);
    }
  }]);

  return BranchRemapping;
})();

var workTime = 100,
    pauseTime = 150;

var CompressionWorker = (function () {
  function CompressionWorker(doc, branch, callback) {
    _classCallCheck(this, CompressionWorker);

    this.branch = branch;
    this.callback = callback;
    this.remap = new BranchRemapping(branch);

    this.doc = doc;
    this.events = [];
    this.maps = [];
    this.version = this.startVersion = branch.version;

    this.i = branch.events.length;
    this.timeout = null;
    this.aborted = false;
  }

  _createClass(CompressionWorker, [{
    key: "work",
    value: function work() {
      var _this = this;

      if (this.aborted) return;

      var endTime = Date.now() + workTime;

      for (;;) {
        if (this.i == 0) return this.finish();
        var _event = this.branch.events[--this.i],
            outEvent = [];
        for (var j = _event.length - 1; j >= 0; j--) {
          var _event$j = _event[j];
          var step = _event$j.step;
          var stepVersion = _event$j.version;
          var stepID = _event$j.id;

          this.remap.moveToVersion(stepVersion);

          var mappedStep = (0, _transform.mapStep)(step, this.remap.remap);
          if (mappedStep && isDelStep(step)) {
            var extra = 0,
                start = step.from;
            while (j > 0) {
              var next = _event[j - 1];
              if (next.version != stepVersion - 1 || !isDelStep(next.step) || start.cmp(next.step.to)) break;
              extra += next.step.to.offset - next.step.from.offset;
              start = next.step.from;
              stepVersion--;
              j--;
              this.remap.addNextMap();
            }
            if (extra > 0) {
              var _start = mappedStep.from.move(-extra);
              mappedStep = new _transform.Step("replace", _start, mappedStep.to, _start);
            }
          }
          var result = mappedStep && mappedStep.apply(this.doc);
          if (result) {
            this.doc = result.doc;
            this.maps.push(result.map.invert());
            outEvent.push(new InvertedStep(mappedStep, this.version, stepID));
            this.version--;
          }
          this.remap.movePastStep(result);
        }
        if (outEvent.length) {
          outEvent.reverse();
          this.events.push(outEvent);
        }
        if (Date.now() > endTime) {
          this.timeout = window.setTimeout(function () {
            return _this.work();
          }, pauseTime);
          return;
        }
      }
    }
  }, {
    key: "finish",
    value: function finish() {
      if (this.aborted) return;

      this.events.reverse();
      this.maps.reverse();
      this.callback(this.maps.concat(this.branch.maps.slice(this.branch.maps.length - (this.branch.version - this.startVersion))), this.events);
    }
  }, {
    key: "abort",
    value: function abort() {
      this.aborted = true;
      window.clearTimeout(this.timeout);
    }
  }]);

  return CompressionWorker;
})();

function isDelStep(step) {
  return step.name == "replace" && step.from.offset < step.to.offset && _model.Pos.samePath(step.from.path, step.to.path) && (!step.param || step.param.content.size == 0);
}

var compressStepCount = 150;

var Branch = (function () {
  function Branch(maxDepth) {
    _classCallCheck(this, Branch);

    this.maxDepth = maxDepth;
    this.version = 0;
    this.nextStepID = 1;

    this.maps = [];
    this.mirror = Object.create(null);
    this.events = [];

    this.stepsSinceCompress = 0;
    this.compressing = null;
    this.compressTimeout = null;
  }

  _createClass(Branch, [{
    key: "clear",
    value: function clear(force) {
      if (force || !this.empty()) {
        this.maps.length = this.events.length = this.stepsSinceCompress = 0;
        this.mirror = Object.create(null);
        this.abortCompression();
      }
    }
  }, {
    key: "newEvent",
    value: function newEvent() {
      this.abortCompression();
      this.events.push([]);
      while (this.events.length > this.maxDepth) this.events.shift();
    }
  }, {
    key: "addMap",
    value: function addMap(map) {
      if (!this.empty()) {
        this.maps.push(map);
        this.version++;
        this.stepsSinceCompress++;
        return true;
      }
    }
  }, {
    key: "empty",
    value: function empty() {
      return this.events.length == 0;
    }
  }, {
    key: "addStep",
    value: function addStep(step, map, id) {
      this.addMap(map);
      if (id == null) id = this.nextStepID++;
      this.events[this.events.length - 1].push(new InvertedStep(step, this.version, id));
    }
  }, {
    key: "addTransform",
    value: function addTransform(transform, ids) {
      this.abortCompression();
      for (var i = 0; i < transform.steps.length; i++) {
        var inverted = transform.steps[i].invert(transform.docs[i], transform.maps[i]);
        this.addStep(inverted, transform.maps[i], ids && ids[i]);
      }
    }
  }, {
    key: "popEvent",
    value: function popEvent(doc, allowCollapsing) {
      this.abortCompression();
      var event = this.events.pop();
      if (!event) return null;

      var remap = new BranchRemapping(this),
          collapsing = allowCollapsing;
      var tr = new _transform.Transform(doc);
      var ids = [];

      for (var i = event.length - 1; i >= 0; i--) {
        var invertedStep = event[i],
            step = invertedStep.step;
        if (!collapsing || invertedStep.version != remap.version) {
          collapsing = false;
          remap.moveToVersion(invertedStep.version);

          step = (0, _transform.mapStep)(step, remap.remap);
          var result = step && tr.step(step);
          if (result) {
            ids.push(invertedStep.id);
            if (this.addMap(result.map)) this.mirror[this.version] = invertedStep.version;
          }

          if (i > 0) remap.movePastStep(result);
        } else {
          this.version--;
          delete this.mirror[this.version];
          this.maps.pop();
          tr.step(step);
          ids.push(invertedStep.id);
          --remap.version;
        }
      }
      if (this.empty()) this.clear(true);
      return { transform: tr, ids: ids };
    }
  }, {
    key: "getVersion",
    value: function getVersion() {
      return { id: this.nextStepID, version: this.version };
    }
  }, {
    key: "findVersion",
    value: function findVersion(version) {
      for (var i = this.events.length - 1; i >= 0; i--) {
        var _event2 = this.events[i];
        for (var j = _event2.length - 1; j >= 0; j--) {
          var step = _event2[j];
          if (step.id == version.id) return { event: i, step: j };else if (step.id < version.id) return { event: i, step: j + 1 };
        }
      }
    }
  }, {
    key: "rebased",
    value: function rebased(newMaps, rebasedTransform, positions) {
      if (this.empty()) return;
      this.abortCompression();

      var startVersion = this.version - positions.length;

      // Update and clean up the events
      out: for (var i = this.events.length - 1; i >= 0; i--) {
        var _event3 = this.events[i];
        for (var j = _event3.length - 1; j >= 0; j--) {
          var step = _event3[j];
          if (step.version <= startVersion) break out;
          var off = positions[step.version - startVersion - 1];
          if (off == -1) {
            _event3.splice(j--, 1);
          } else {
            var inv = rebasedTransform.steps[off].invert(rebasedTransform.docs[off], rebasedTransform.maps[off]);
            _event3[j] = new InvertedStep(inv, startVersion + newMaps.length + off + 1, step.id);
          }
        }
      }

      // Sync the array of maps
      if (this.maps.length > positions.length) this.maps = this.maps.slice(0, this.maps.length - positions.length).concat(newMaps).concat(rebasedTransform.maps);else this.maps = rebasedTransform.maps.slice();

      this.version = startVersion + newMaps.length + rebasedTransform.maps.length;

      this.stepsSinceCompress += newMaps.length + rebasedTransform.steps.length - positions.length;
    }
  }, {
    key: "abortCompression",
    value: function abortCompression() {
      if (this.compressing) {
        this.compressing.abort();
        this.compressing = null;
      }
    }
  }, {
    key: "needsCompression",
    value: function needsCompression() {
      return this.stepsSinceCompress > compressStepCount && !this.compressing;
    }
  }, {
    key: "startCompression",
    value: function startCompression(doc) {
      var _this2 = this;

      this.compressing = new CompressionWorker(doc, this, function (maps, events) {
        _this2.maps = maps;
        _this2.events = events;
        _this2.mirror = Object.create(null);
        _this2.compressing = null;
        _this2.stepsSinceCompress = 0;
      });
      this.compressing.work();
    }
  }]);

  return Branch;
})();

var compressDelay = 750;

var History = (function () {
  function History(pm) {
    var _this3 = this;

    _classCallCheck(this, History);

    this.pm = pm;

    this.done = new Branch(pm.options.historyDepth);
    this.undone = new Branch(pm.options.historyDepth);

    this.lastAddedAt = 0;
    this.ignoreTransform = false;

    this.allowCollapsing = true;

    pm.on("transform", function (transform, options) {
      return _this3.recordTransform(transform, options);
    });
  }

  _createClass(History, [{
    key: "recordTransform",
    value: function recordTransform(transform, options) {
      if (this.ignoreTransform) return;

      if (options.addToHistory == false) {
        for (var i = 0; i < transform.maps.length; i++) {
          var map = transform.maps[i];
          this.done.addMap(map);
          this.undone.addMap(map);
        }
      } else {
        this.undone.clear();
        var now = Date.now();
        if (now > this.lastAddedAt + this.pm.options.historyEventDelay) this.done.newEvent();

        this.done.addTransform(transform);
        this.lastAddedAt = now;
      }
      this.maybeScheduleCompression();
    }
  }, {
    key: "undo",
    value: function undo() {
      return this.shift(this.done, this.undone);
    }
  }, {
    key: "redo",
    value: function redo() {
      return this.shift(this.undone, this.done);
    }
  }, {
    key: "canUndo",
    value: function canUndo() {
      return this.done.events.length > 0;
    }
  }, {
    key: "canRedo",
    value: function canRedo() {
      return this.undone.events.length > 0;
    }
  }, {
    key: "shift",
    value: function shift(from, to) {
      var event = from.popEvent(this.pm.doc, this.allowCollapsing);
      if (!event) return false;
      var transform = event.transform;
      var ids = event.ids;

      this.ignoreTransform = true;
      this.pm.apply(transform);
      this.ignoreTransform = false;

      if (!transform.steps.length) return this.shift(from, to);

      if (to) {
        to.newEvent();
        to.addTransform(transform, ids);
      }
      this.lastAddedAt = 0;

      return true;
    }
  }, {
    key: "getVersion",
    value: function getVersion() {
      return this.done.getVersion();
    }
  }, {
    key: "backToVersion",
    value: function backToVersion(version) {
      var found = this.done.findVersion(version);
      if (!found) return false;
      var event = this.done.events[found.event];
      var combined = this.done.events.slice(found.event + 1).reduce(function (comb, arr) {
        return comb.concat(arr);
      }, event.slice(found.step));
      this.done.events.length = found.event + ((event.length = found.step) ? 1 : 0);
      this.done.events.push(combined);

      this.shift(this.done);
    }
  }, {
    key: "rebased",
    value: function rebased(newMaps, rebasedTransform, positions) {
      this.done.rebased(newMaps, rebasedTransform, positions);
      this.undone.rebased(newMaps, rebasedTransform, positions);
      this.maybeScheduleCompression();
    }
  }, {
    key: "maybeScheduleCompression",
    value: function maybeScheduleCompression() {
      this.maybeScheduleCompressionForBranch(this.done);
      this.maybeScheduleCompressionForBranch(this.undone);
    }
  }, {
    key: "maybeScheduleCompressionForBranch",
    value: function maybeScheduleCompressionForBranch(branch) {
      var _this4 = this;

      window.clearTimeout(branch.compressTimeout);
      if (branch.needsCompression()) branch.compressTimeout = window.setTimeout(function () {
        if (branch.needsCompression()) branch.startCompression(_this4.pm.doc);
      }, compressDelay);
    }
  }]);

  return History;
})();

exports.History = History;
},{"../model":26,"../transform":38}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = require("./main");

Object.defineProperty(exports, "ProseMirror", {
  enumerable: true,
  get: function get() {
    return _main.ProseMirror;
  }
});

var _options = require("./options");

Object.defineProperty(exports, "defineOption", {
  enumerable: true,
  get: function get() {
    return _options.defineOption;
  }
});

var _selection = require("./selection");

Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function get() {
    return _selection.Range;
  }
});

var _event = require("./event");

Object.defineProperty(exports, "eventMixin", {
  enumerable: true,
  get: function get() {
    return _event.eventMixin;
  }
});

var _keys = require("./keys");

Object.defineProperty(exports, "Keymap", {
  enumerable: true,
  get: function get() {
    return _keys.Keymap;
  }
});

var _range = require("./range");

Object.defineProperty(exports, "MarkedRange", {
  enumerable: true,
  get: function get() {
    return _range.MarkedRange;
  }
});

var _commands = require("./commands");

Object.defineProperty(exports, "defineCommand", {
  enumerable: true,
  get: function get() {
    return _commands.defineCommand;
  }
});
Object.defineProperty(exports, "defineParamHandler", {
  enumerable: true,
  get: function get() {
    return _commands.defineParamHandler;
  }
});
Object.defineProperty(exports, "Command", {
  enumerable: true,
  get: function get() {
    return _commands.Command;
  }
});
},{"./commands":5,"./event":9,"./keys":13,"./main":14,"./options":15,"./range":16,"./selection":17}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.dispatchKey = dispatchKey;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _parseDom = require("../parse/dom");

var _parseText = require("../parse/text");

var _dom = require("../dom");

var _serializeDom = require("../serialize/dom");

var _serializeText = require("../serialize/text");

var _parse = require("../parse");

var _keys = require("./keys");

var _capturekeys = require("./capturekeys");

var _domchange = require("./domchange");

var _selection = require("./selection");

var stopSeq = null;

/**
 * A collection of DOM events that occur within the editor, and callback functions
 * to invoke when the event fires.
 */
var handlers = {};

var Input = (function () {
  function Input(pm) {
    var _this = this;

    _classCallCheck(this, Input);

    this.pm = pm;

    this.keySeq = null;

    // When the user is creating a composed character,
    // this is set to a Composing instance.
    this.composing = null;
    this.shiftKey = this.updatingComposition = false;
    this.skipInput = 0;

    this.draggingFrom = false;

    this.keymaps = [];

    this.storedMarks = null;

    this.dropTarget = pm.wrapper.appendChild((0, _dom.elt)("div", { "class": "ProseMirror-drop-target" }));

    var _loop = function (_event) {
      var handler = handlers[_event];
      pm.content.addEventListener(_event, function (e) {
        return handler(pm, e);
      });
    };

    for (var _event in handlers) {
      _loop(_event);
    }

    pm.on("selectionChange", function () {
      return _this.storedMarks = null;
    });
  }

  /**
   * Dispatch a key press to the internal keymaps, which will override the default
   * DOM behavior.
   *
   * @param  {ProseMirror}   pm The editor instance.
   * @param  {string}        name The name of the key pressed.
   * @param  {KeyboardEvent} e
   * @return {string} If the key name has a mapping and the callback is invoked ("handled"),
   *                  if the key name needs to be combined in sequence with the next key ("multi"),
   *                  if there is no mapping ("nothing").
   */

  _createClass(Input, [{
    key: "maybeAbortComposition",
    value: function maybeAbortComposition() {
      if (this.composing && !this.updatingComposition) {
        if (this.composing.finished) {
          finishComposing(this.pm);
        } else {
          // Toggle selection to force end of composition
          this.composing = null;
          this.skipInput++;
          var sel = getSelection();
          if (sel.rangeCount) {
            var range = sel.getRangeAt(0);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
        return true;
      }
    }
  }]);

  return Input;
})();

exports.Input = Input;

function dispatchKey(pm, name, e) {
  var seq = pm.input.keySeq;
  // If the previous key should be used in sequence with this one, modify the name accordingly.
  if (seq) {
    if ((0, _keys.isModifierKey)(name)) return true;
    clearTimeout(stopSeq);
    stopSeq = setTimeout(function () {
      if (pm.input.keySeq == seq) pm.input.keySeq = null;
    }, 50);
    name = seq + " " + name;
  }

  var handle = function handle(bound) {
    var result = false;
    if (Array.isArray(bound)) {
      for (var i = 0; result === false && i < bound.length; i++) {
        result = handle(bound[i]);
      }
    } else if (typeof bound == "string") {
      result = pm.execCommand(bound);
    } else {
      result = bound(pm);
    }
    return result !== false;
  };

  var result = undefined;
  for (var i = 0; !result && i < pm.input.keymaps.length; i++) {
    result = (0, _keys.lookupKey)(name, pm.input.keymaps[i].map, handle, pm);
  }if (!result) result = (0, _keys.lookupKey)(name, pm.options.keymap, handle, pm) || (0, _keys.lookupKey)(name, _capturekeys.captureKeys, handle, pm);

  // If the key should be used in sequence with the next key, store the keyname internally.
  if (result == "multi") pm.input.keySeq = name;

  if (result == "handled" || result == "multi") e.preventDefault();

  if (seq && !result && /\'$/.test(name)) {
    e.preventDefault();
    return true;
  }
  return !!result;
}

handlers.keydown = function (pm, e) {
  if (e.keyCode == 16) pm.input.shiftKey = true;
  if (pm.input.composing) return;
  var name = (0, _keys.keyName)(e);
  if (name && dispatchKey(pm, name, e)) return;
  pm.sel.pollForUpdate();
};

handlers.keyup = function (pm, e) {
  if (e.keyCode == 16) pm.input.shiftKey = false;
};

function inputText(pm, range, text) {
  if (range.empty && !text) return false;
  var marks = pm.input.storedMarks || pm.doc.marksAt(range.from);
  var tr = pm.tr;
  tr.replaceWith(range.from, range.to, pm.schema.text(text, marks)).apply();
  pm.scrollIntoView();
  pm.signal("textInput", text);
}

handlers.keypress = function (pm, e) {
  if (pm.input.composing || !e.charCode || e.ctrlKey && !e.altKey || _dom.browser.mac && e.metaKey) return;
  var ch = String.fromCharCode(e.charCode);
  if (dispatchKey(pm, "'" + ch + "'", e)) return;
  var sel = pm.selection;
  if (sel.node && sel.node.contains == null) {
    pm.tr["delete"](sel.from, sel.to).apply();
    sel = pm.selection;
  }
  inputText(pm, sel, ch);
  e.preventDefault();
};

function selectClickedNode(pm, e) {
  var pos = (0, _selection.selectableNodeAbove)(pm, e.target, { left: e.clientX, top: e.clientY }, true);
  if (!pos) return pm.sel.pollForUpdate();

  var _pm$selection = pm.selection;
  var node = _pm$selection.node;
  var from = _pm$selection.from;

  if (node && pos.depth >= from.depth && pos.shorten(from.depth).cmp(from) == 0) {
    if (from.depth == 0) return pm.sel.pollForUpdate();
    pos = from.shorten();
  }

  pm.setNodeSelection(pos);
  pm.focus();
  e.preventDefault();
}

var lastClick = 0;

handlers.mousedown = function (pm, e) {
  if (e.ctrlKey) return selectClickedNode(pm, e);

  pm.sel.pollForUpdate();

  var now = Date.now(),
      multi = now - lastClick < 500;
  lastClick = now;
  if (pm.input.shiftKey || multi) return;

  var x = e.clientX,
      y = e.clientY;
  var done = function done() {
    removeEventListener("mouseup", up);
    removeEventListener("mousemove", move);
  };
  var up = function up() {
    done();
    var pos = (0, _selection.selectableNodeAbove)(pm, e.target, { left: e.clientX, top: e.clientY });
    if (pos) {
      pm.setNodeSelection(pos);
      pm.focus();
    }
  };
  var move = function move(e) {
    if (Math.abs(x - e.clientX) > 4 || Math.abs(y - e.clientY) > 4) done();
  };
  addEventListener("mouseup", up);
  addEventListener("mousemove", move);
};

handlers.touchdown = function (pm) {
  pm.sel.pollForUpdate();
};

handlers.mousemove = function (pm, e) {
  if (e.which || e.button) pm.sel.pollForUpdate();
};

/**
 * A class to track state while creating a composed character.
 */

var Composing = function Composing(pm, data) {
  _classCallCheck(this, Composing);

  this.finished = false;
  this.context = (0, _domchange.textContext)(data);
  this.data = data;
  this.endData = null;
  var range = pm.selection;
  if (data) {
    var path = range.head.path,
        line = pm.doc.path(path).textContent;
    var found = line.indexOf(data, range.head.offset - data.length);
    if (found > -1 && found <= range.head.offset + data.length) range = new _selection.TextSelection(new _model.Pos(path, found), new _model.Pos(path, found + data.length));
  }
  this.range = range;
};

handlers.compositionstart = function (pm, e) {
  if (pm.input.maybeAbortComposition()) return;

  pm.flush();
  pm.input.composing = new Composing(pm, e.data);
  var above = pm.selection.head.shorten();
  pm.markRangeDirty({ from: above, to: above.move(1) });
};

handlers.compositionupdate = function (pm, e) {
  var info = pm.input.composing;
  if (info && info.data != e.data) {
    info.data = e.data;
    pm.input.updatingComposition = true;
    inputText(pm, info.range, info.data);
    pm.input.updatingComposition = false;
    info.range = new _selection.TextSelection(info.range.from, info.range.from.move(info.data.length));
  }
};

handlers.compositionend = function (pm, e) {
  var info = pm.input.composing;
  if (info) {
    pm.input.composing.finished = true;
    pm.input.composing.endData = e.data;
    setTimeout(function () {
      if (pm.input.composing == info) finishComposing(pm);
    }, 20);
  }
};

function finishComposing(pm) {
  var info = pm.input.composing;
  var text = (0, _domchange.textInContext)(info.context, info.endData);
  var range = (0, _selection.rangeFromDOMLoose)(pm);
  pm.ensureOperation();
  pm.input.composing = null;
  if (text != info.data) inputText(pm, info.range, text);
  if (range && !range.eq(pm.sel.range)) pm.setSelection(range);
}

handlers.input = function (pm) {
  if (pm.input.skipInput) return --pm.input.skipInput;

  if (pm.input.composing) {
    if (pm.input.composing.finished) finishComposing(pm);
    return;
  }

  (0, _domchange.applyDOMChange)(pm);
  pm.scrollIntoView();
};

var lastCopied = null;

handlers.copy = handlers.cut = function (pm, e) {
  var _pm$selection2 = pm.selection;
  var from = _pm$selection2.from;
  var to = _pm$selection2.to;
  var empty = _pm$selection2.empty;

  if (empty) return;
  var fragment = pm.selectedDoc;
  lastCopied = { doc: pm.doc, from: from, to: to,
    html: (0, _serializeDom.toHTML)(fragment),
    text: (0, _serializeText.toText)(fragment) };

  if (e.clipboardData) {
    e.preventDefault();
    e.clipboardData.clearData();
    e.clipboardData.setData("text/html", lastCopied.html);
    e.clipboardData.setData("text/plain", lastCopied.text);
    if (e.type == "cut" && !empty) pm.tr["delete"](from, to).apply();
  }
};

handlers.paste = function (pm, e) {
  if (!e.clipboardData) return;
  var sel = pm.selection;
  var txt = e.clipboardData.getData("text/plain");
  var html = e.clipboardData.getData("text/html");
  if (html || txt) {
    e.preventDefault();
    var doc = undefined,
        from = undefined,
        to = undefined;
    if (pm.input.shiftKey && txt) {
      doc = (0, _parseText.fromText)(pm.schema, txt);
    } else if (lastCopied && (lastCopied.html == html || lastCopied.text == txt)) {
      ;var _lastCopied = lastCopied;
      doc = _lastCopied.doc;
      from = _lastCopied.from;
      to = _lastCopied.to;
    } else if (html) {
      doc = (0, _parseDom.fromHTML)(pm.schema, html);
    } else {
      doc = (0, _parse.convertFrom)(pm.schema, txt, (0, _parse.knownSource)("markdown") ? "markdown" : "text");
    }
    pm.tr.replace(sel.from, sel.to, doc, from || (0, _selection.findSelectionAtStart)(doc).from, to || (0, _selection.findSelectionAtEnd)(doc).to).apply();
    pm.scrollIntoView();
  }
};

handlers.dragstart = function (pm, e) {
  if (!e.dataTransfer) return;

  var fragment = pm.selectedDoc;

  e.dataTransfer.setData("text/html", (0, _serializeDom.toHTML)(fragment));
  e.dataTransfer.setData("text/plain", (0, _serializeText.toText)(fragment));
  pm.input.draggingFrom = true;
};

handlers.dragend = function (pm) {
  return window.setTimeout(function () {
    return pm.input.dragginFrom = false;
  }, 50);
};

handlers.dragover = handlers.dragenter = function (pm, e) {
  e.preventDefault();
  var cursorPos = pm.posAtCoords({ left: e.clientX, top: e.clientY });
  if (!cursorPos) return;
  var coords = (0, _selection.coordsAtPos)(pm, cursorPos);
  var rect = pm.wrapper.getBoundingClientRect();
  coords.top -= rect.top;
  coords.right -= rect.left;
  coords.bottom -= rect.top;
  coords.left -= rect.left;
  var target = pm.input.dropTarget;
  target.style.display = "block";
  target.style.left = coords.left - 1 + "px";
  target.style.top = coords.top + "px";
  target.style.height = coords.bottom - coords.top + "px";
};

handlers.dragleave = function (pm) {
  return pm.input.dropTarget.style.display = "";
};

handlers.drop = function (pm, e) {
  pm.input.dropTarget.style.display = "";

  if (!e.dataTransfer) return;

  var html = undefined,
      txt = undefined,
      doc = undefined;
  if (html = e.dataTransfer.getData("text/html")) doc = (0, _parseDom.fromHTML)(pm.schema, html, { document: document });else if (txt = e.dataTransfer.getData("text/plain")) doc = (0, _parse.convertFrom)(pm.schema, txt, (0, _parse.knownSource)("markdown") ? "markdown" : "text");

  if (doc) {
    e.preventDefault();
    var insertPos = pm.posAtCoords({ left: e.clientX, top: e.clientY });
    if (!insertPos) return;
    var tr = pm.tr;
    if (pm.input.draggingFrom && !e.ctrlKey) {
      tr.deleteSelection();
      insertPos = tr.map(insertPos).pos;
    }
    tr.replace(insertPos, insertPos, doc, (0, _selection.findSelectionAtStart)(doc).from, (0, _selection.findSelectionAtEnd)(doc).to).apply();
    pm.setSelection(insertPos, tr.map(insertPos).pos);
    pm.focus();
  }
};

handlers.focus = function (pm) {
  (0, _dom.addClass)(pm.wrapper, "ProseMirror-focused");
  pm.signal("focus");
};

handlers.blur = function (pm) {
  (0, _dom.rmClass)(pm.wrapper, "ProseMirror-focused");
  pm.signal("blur");
};
},{"../dom":2,"../model":26,"../parse":32,"../parse/dom":31,"../parse/text":33,"../serialize/dom":34,"../serialize/text":36,"./capturekeys":3,"./domchange":7,"./keys":13,"./selection":17}],13:[function(require,module,exports){
// From CodeMirror, should be factored into its own NPM module

// declare_global: navigator
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.keyName = keyName;
exports.isModifierKey = isModifierKey;
exports.normalizeKeyName = normalizeKeyName;
exports.lookupKey = lookupKey;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;

/**
 * A map of KeyboardEvent keycodes to key names.
 *
 * @type {Array}
 */
var names = {
  3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
  19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
  36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
  46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod",
  106: "*", 107: "=", 109: "-", 110: ".", 111: "/", 127: "Delete",
  173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
  221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
  63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"
};

// Number keys
exports.names = names;
for (var i = 0; i < 10; i++) {
  names[i + 48] = names[i + 96] = String(i);
} // Alphabetic keys
for (var i = 65; i <= 90; i++) {
  names[i] = String.fromCharCode(i);
} // Function keys
for (var i = 1; i <= 12; i++) {
  names[i + 111] = names[i + 63235] = "F" + i;
} /**
   * Given a keypress event, get the key name.
   *
   * @param  {KeyboardEvent} event   The keypress event.
   * @param  {Boolean}       noShift
   * @return {string}                The key name.
   */

function keyName(event, noShift) {
  var base = names[event.keyCode],
      name = base;
  if (name == null || event.altGraphKey) return false;

  if (event.altKey && base != "Alt") name = "Alt-" + name;
  if (event.ctrlKey && base != "Ctrl") name = "Ctrl-" + name;
  if (event.metaKey && base != "Cmd") name = "Cmd-" + name;
  if (!noShift && event.shiftKey && base != "Shift") name = "Shift-" + name;
  return name;
}

function isModifierKey(value) {
  var name = typeof value == "string" ? value : names[value.keyCode];
  return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
}

function normalizeKeyName(fullName) {
  var parts = fullName.split(/-(?!'?$)/),
      name = parts[parts.length - 1];
  var alt = undefined,
      ctrl = undefined,
      shift = undefined,
      cmd = undefined;
  for (var i = 0; i < parts.length - 1; i++) {
    var mod = parts[i];
    if (/^(cmd|meta|m)$/i.test(mod)) cmd = true;else if (/^a(lt)?$/i.test(mod)) alt = true;else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;else if (/^s(hift)$/i.test(mod)) shift = true;else if (/^mod$/i.test(mod)) {
      if (mac) cmd = true;else ctrl = true;
    } else throw new Error("Unrecognized modifier name: " + mod);
  }
  if (alt) name = "Alt-" + name;
  if (ctrl) name = "Ctrl-" + name;
  if (cmd) name = "Cmd-" + name;
  if (shift) name = "Shift-" + name;
  return name;
}

/**
 * A group of bindings of key names and editor commands,
 * which override the default key press event behavior in the editor's DOM.
 */

var Keymap = (function () {
  function Keymap(keys, options) {
    _classCallCheck(this, Keymap);

    this.options = options || {};
    this.bindings = Object.create(null);
    if (keys) for (var keyname in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, keyname)) this.addBinding(keyname, keys[keyname]);
    }
  }

  /**
   * Lookup a key name in a KeyMap, and pass the mapped value to a handler.
   *
   * @param {string}   key     The key name.
   * @param {Keymap}   map     The key map. If the keymap has an options.call method,
   *                           that will be invoked to get the mapped value.
   * @param {Function} handle  Callback
   * @param {Object}   context
   * @return {string} If the key name has a mapping and the callback is invoked ("handled"),
   *                  if the key name needs to be combined in sequence with the next key ("multi"),
   *                  if there is no mapping ("nothing").
   */

  _createClass(Keymap, [{
    key: "addBinding",
    value: function addBinding(keyname, value) {
      var keys = keyname.split(" ").map(normalizeKeyName);
      for (var i = 0; i < keys.length; i++) {
        var _name = keys.slice(0, i + 1).join(" ");
        var val = i == keys.length - 1 ? value : "...";
        var prev = this.bindings[_name];
        if (!prev) this.bindings[_name] = val;else if (prev != val) throw new Error("Inconsistent bindings for " + _name);
      }
    }
  }, {
    key: "removeBinding",
    value: function removeBinding(keyname) {
      var keys = keyname.split(" ").map(normalizeKeyName);
      for (var i = keys.length - 1; i >= 0; i--) {
        var _name2 = keys.slice(0, i).join(" ");
        var val = this.bindings[_name2];
        if (val == "..." && !this.unusedMulti(_name2)) break;else if (val) delete this.bindings[_name2];
      }
    }
  }, {
    key: "unusedMulti",
    value: function unusedMulti(name) {
      for (var binding in this.bindings) {
        if (binding.length > name && binding.indexOf(name) == 0 && binding.charAt(name.length) == " ") return false;
      }return true;
    }
  }]);

  return Keymap;
})();

exports.Keymap = Keymap;

function lookupKey(_x, _x2, _x3, _x4) {
  var _again = true;

  _function: while (_again) {
    var key = _x,
        map = _x2,
        handle = _x3,
        context = _x4;
    found = fall = i = result = undefined;
    _again = false;

    var found = map.options.call ? map.options.call(key, context) : map.bindings[key];
    if (found === false) return "nothing";
    if (found === "...") return "multi";
    if (found != null && handle(found)) return "handled";

    var fall = map.options.fallthrough;
    if (fall) {
      if (!Array.isArray(fall)) {
        _x = key;
        _x2 = fall;
        _x3 = handle;
        _x4 = context;
        _again = true;
        continue _function;
      }
      for (var i = 0; i < fall.length; i++) {
        var result = lookupKey(key, fall[i], handle, context);
        if (result) return result;
      }
    }
  }
}
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require("./css");

var _model = require("../model");

var _transform = require("../transform");

var _utilSortedinsert = require("../util/sortedinsert");

var _utilSortedinsert2 = _interopRequireDefault(_utilSortedinsert);

var _utilMap = require("../util/map");

var _options = require("./options");

var _selection2 = require("./selection");

var _dom = require("../dom");

var _draw = require("./draw");

var _input = require("./input");

var _history = require("./history");

var _event = require("./event");

var _serializeText = require("../serialize/text");

require("../parse/text");

var _parse = require("../parse");

var _serialize = require("../serialize");

var _commands = require("./commands");

var _range = require("./range");

var _keys = require("./keys");

/**
 * ProseMirror editor class.
 * @class
 */

var ProseMirror = (function () {
  /**
   * @param {Object} opts        Instance options hash.
   * @param {Object} opts.schema The document model schema for the editor instance.
   * @param {Object} opts.doc    The document model for the instance. Optional.
   */

  function ProseMirror(opts) {
    _classCallCheck(this, ProseMirror);

    opts = this.options = (0, _options.parseOptions)(opts);
    this.schema = opts.schema;
    if (opts.doc == null) opts.doc = this.schema.node("doc", null, [this.schema.node("paragraph")]);
    this.content = (0, _dom.elt)("div", { "class": "ProseMirror-content" });
    this.wrapper = (0, _dom.elt)("div", { "class": "ProseMirror" }, this.content);
    this.wrapper.ProseMirror = this;

    if (opts.place && opts.place.appendChild) opts.place.appendChild(this.wrapper);else if (opts.place) opts.place(this.wrapper);

    this.setDocInner(opts.docFormat ? (0, _parse.convertFrom)(this.schema, opts.doc, opts.docFormat, { document: document }) : opts.doc);
    (0, _draw.draw)(this, this.doc);
    this.content.contentEditable = true;
    if (opts.label) this.content.setAttribute("aria-label", opts.label);

    this.mod = Object.create(null);
    this.operation = null;
    this.dirtyNodes = new _utilMap.Map(); // Maps node object to 1 (re-scan content) or 2 (redraw entirely)
    this.flushScheduled = false;

    this.sel = new _selection2.SelectionState(this);
    this.accurateSelection = false;
    this.input = new _input.Input(this);

    this.commands = (0, _commands.initCommands)(this.schema);
    this.commandKeys = Object.create(null);

    (0, _options.initOptions)(this);
  }

  /**
   * @return {Range} The instance of the editor's selection range.
   */

  _createClass(ProseMirror, [{
    key: "apply",

    /**
     * Apply a transform on the editor.
     */
    value: function apply(transform) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? nullOptions : arguments[1];

      if (transform.doc == this.doc) return false;
      if (transform.docs[0] != this.doc && (0, _model.findDiffStart)(transform.docs[0], this.doc)) throw new Error("Applying a transform that does not start with the current document");

      this.updateDoc(transform.doc, transform, options.selection);
      this.signal("transform", transform, options);
      if (options.scrollIntoView) this.scrollIntoView();
      return transform;
    }

    /**
     * @return {Transform} A new transform object.
     */
  }, {
    key: "setContent",
    value: function setContent(value, format) {
      if (format) value = (0, _parse.convertFrom)(this.schema, value, format);
      this.setDoc(value);
    }
  }, {
    key: "getContent",
    value: function getContent(format) {
      return format ? (0, _serialize.convertTo)(this.doc, format) : this.doc;
    }
  }, {
    key: "setDocInner",
    value: function setDocInner(doc) {
      if (doc.type != this.schema.nodes.doc) throw new Error("Trying to set a document with a different schema");
      this.doc = doc;
      this.ranges = new _range.RangeStore(this);
      this.history = new _history.History(this);
    }
  }, {
    key: "setDoc",
    value: function setDoc(doc, sel) {
      if (!sel) sel = (0, _selection2.findSelectionAtStart)(doc);
      this.signal("beforeSetDoc", doc, sel);
      this.ensureOperation();
      this.setDocInner(doc);
      this.sel.set(sel, true);
      this.signal("setDoc", doc, sel);
    }
  }, {
    key: "updateDoc",
    value: function updateDoc(doc, mapping, selection) {
      this.ensureOperation();
      this.input.maybeAbortComposition();
      this.ranges.transform(mapping);
      this.doc = doc;
      this.sel.setAndSignal(selection || this.sel.range.map(doc, mapping));
      this.signal("change");
    }
  }, {
    key: "checkPos",
    value: function checkPos(pos, block) {
      if (!this.doc.isValidPos(pos, block)) throw new Error("Position " + pos + " is not valid in current document");
    }
  }, {
    key: "setSelection",
    value: function setSelection(rangeOrAnchor, head) {
      var range = rangeOrAnchor;
      if (!(range instanceof _selection2.Selection)) range = new _selection2.TextSelection(rangeOrAnchor, head);
      if (range instanceof _selection2.TextSelection) {
        this.checkPos(range.head, true);
        this.checkPos(range.anchor, true);
      } else {
        this.checkPos(range.from, false);
        this.checkPos(range.to, false);
      }
      this.ensureOperation();
      this.input.maybeAbortComposition();
      if (!range.eq(this.sel.range)) this.sel.setAndSignal(range);
    }
  }, {
    key: "setNodeSelection",
    value: function setNodeSelection(pos) {
      this.checkPos(pos, false);
      var parent = this.doc.path(pos.path);
      if (pos.offset >= parent.size) throw new Error("Trying to set a node selection at the end of a node");
      var node = parent.child(pos.offset);
      if (!node.type.selectable) throw new Error("Trying to select a non-selectable node");
      this.input.maybeAbortComposition();
      this.sel.setAndSignal(new _selection2.NodeSelection(pos, pos.move(1), node));
    }
  }, {
    key: "ensureOperation",
    value: function ensureOperation() {
      return this.operation || this.startOperation();
    }
  }, {
    key: "startOperation",
    value: function startOperation() {
      var _this = this;

      this.sel.beforeStartOp();
      this.operation = new Operation(this);
      if (!this.flushScheduled) {
        (0, _dom.requestAnimationFrame)(function () {
          _this.flushScheduled = false;
          _this.flush();
        });
        this.flushScheduled = true;
      }
      return this.operation;
    }
  }, {
    key: "flush",
    value: function flush() {
      if (!document.body.contains(this.wrapper) || !this.operation) return;
      this.signal("flushing");
      var op = this.operation;
      if (!op) return;
      this.operation = null;
      this.accurateSelection = true;

      var docChanged = op.doc != this.doc || this.dirtyNodes.size,
          redrawn = false;
      if (!this.input.composing && (docChanged || op.composingAtStart)) {
        (0, _draw.redraw)(this, this.dirtyNodes, this.doc, op.doc);
        this.dirtyNodes.clear();
        redrawn = true;
      }

      if ((redrawn || !op.sel.eq(this.sel.range)) && !this.input.composing) this.sel.toDOM(op.focus);

      if (op.scrollIntoView !== false) (0, _selection2.scrollIntoView)(this, op.scrollIntoView);
      if (docChanged) this.signal("draw");
      this.signal("flush");
      this.signal("flushed");
      this.accurateSelection = false;
    }
  }, {
    key: "setOption",
    value: function setOption(name, value) {
      (0, _options.setOption)(this, name, value);
    }
  }, {
    key: "getOption",
    value: function getOption(name) {
      return this.options[name];
    }
  }, {
    key: "addKeymap",
    value: function addKeymap(map) {
      var rank = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];

      (0, _utilSortedinsert2["default"])(this.input.keymaps, { map: map, rank: rank }, function (a, b) {
        return a.rank - b.rank;
      });
    }
  }, {
    key: "removeKeymap",
    value: function removeKeymap(map) {
      var maps = this.input.keymaps;
      for (var i = 0; i < maps.length; ++i) {
        if (maps[i].map == map || maps[i].map.options.name == map) {
          maps.splice(i, 1);
          return true;
        }
      }
    }
  }, {
    key: "markRange",
    value: function markRange(from, to, options) {
      this.checkPos(from);
      this.checkPos(to);
      var range = new _range.MarkedRange(from, to, options);
      this.ranges.addRange(range);
      return range;
    }
  }, {
    key: "removeRange",
    value: function removeRange(range) {
      this.ranges.removeRange(range);
    }
  }, {
    key: "setMark",
    value: function setMark(type, to, attrs) {
      var sel = this.selection;
      if (sel.empty) {
        var marks = this.activeMarks();
        if (to == null) to = !type.isInSet(marks);
        if (to && !this.doc.path(sel.head.path).type.canContainMark(type)) return;
        this.input.storedMarks = to ? type.create(attrs).addToSet(marks) : type.removeFromSet(marks);
        this.signal("activeMarkChange");
      } else {
        if (to != null ? to : !this.doc.rangeHasMark(sel.from, sel.to, type)) this.apply(this.tr.addMark(sel.from, sel.to, type.create(attrs)));else this.apply(this.tr.removeMark(sel.from, sel.to, type));
      }
    }
  }, {
    key: "activeMarks",
    value: function activeMarks() {
      return this.input.storedMarks || this.doc.marksAt(this.selection.head);
    }
  }, {
    key: "focus",
    value: function focus() {
      if (this.operation) this.operation.focus = true;else this.sel.toDOM(true);
    }
  }, {
    key: "hasFocus",
    value: function hasFocus() {
      if (this.sel.range instanceof _selection2.NodeSelection) return document.activeElement == this.content;else return (0, _selection2.hasFocus)(this);
    }
  }, {
    key: "posAtCoords",
    value: function posAtCoords(coords) {
      return (0, _selection2.posAtCoords)(this, coords);
    }
  }, {
    key: "coordsAtPos",
    value: function coordsAtPos(pos) {
      this.checkPos(pos);
      return (0, _selection2.coordsAtPos)(this, pos);
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView() {
      var pos = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (pos) this.checkPos(pos);
      this.ensureOperation();
      this.operation.scrollIntoView = pos;
    }
  }, {
    key: "execCommand",
    value: function execCommand(name, params) {
      var cmd = this.commands[name];
      return !!(cmd && cmd.exec(this, params) !== false);
    }
  }, {
    key: "keyForCommand",
    value: function keyForCommand(name) {
      var cached = this.commandKeys[name];
      if (cached !== undefined) return cached;

      var cmd = this.commands[name];
      if (!cmd) return this.commandKeys[name] = null;
      var key = cmd.info.key || (_dom.browser.mac ? cmd.info.macKey : cmd.info.pcKey);
      if (key) {
        key = (0, _keys.normalizeKeyName)(Array.isArray(key) ? key[0] : key);
        var deflt = this.options.keymap.bindings[key];
        if (Array.isArray(deflt) ? deflt.indexOf(name) > -1 : deflt == name) return this.commandKeys[name] = key;
      }
      for (var _key in this.options.keymap.bindings) {
        var bound = this.options.keymap.bindings[_key];
        if (Array.isArray(bound) ? bound.indexOf(name) > -1 : bound == name) return this.commandKeys[name] = _key;
      }
      return this.commandKeys[name] = null;
    }
  }, {
    key: "markRangeDirty",
    value: function markRangeDirty(range) {
      this.ensureOperation();
      var dirty = this.dirtyNodes;
      var from = range.from,
          to = range.to;
      for (var depth = 0, node = this.doc;; depth++) {
        var fromEnd = depth == from.depth,
            toEnd = depth == to.depth;
        if (!fromEnd && !toEnd && from.path[depth] == to.path[depth]) {
          var child = node.child(from.path[depth]);
          if (!dirty.has(child)) dirty.set(child, DIRTY_RESCAN);
          node = child;
        } else {
          var _ret = (function () {
            var start = fromEnd ? from.offset : from.path[depth];
            var end = toEnd ? to.offset : to.path[depth] + 1;
            if (node.isTextblock) {
              node.forEach(function (child, cStart, cEnd) {
                if (cStart < end && cEnd > start) dirty.set(child, DIRTY_REDRAW);
              });
            } else {
              for (var i = node.iter(start, end), child = undefined; child = i.next().value;) {
                dirty.set(child, DIRTY_REDRAW);
              }
            }
            return "break";
          })();

          if (_ret === "break") break;
        }
      }
    }
  }, {
    key: "selection",
    get: function get() {
      if (!this.accurateSelection) this.ensureOperation();
      return this.sel.range;
    }
  }, {
    key: "selectedDoc",
    get: function get() {
      var sel = this.selection;
      return this.doc.sliceBetween(sel.from, sel.to);
    }
  }, {
    key: "selectedText",
    get: function get() {
      return (0, _serializeText.toText)(this.selectedDoc);
    }
  }, {
    key: "tr",
    get: function get() {
      return new EditorTransform(this);
    }
  }]);

  return ProseMirror;
})();

exports.ProseMirror = ProseMirror;
var DIRTY_RESCAN = 1,
    DIRTY_REDRAW = 2;

exports.DIRTY_RESCAN = DIRTY_RESCAN;
exports.DIRTY_REDRAW = DIRTY_REDRAW;
var nullOptions = {};

(0, _event.eventMixin)(ProseMirror);

var Operation = function Operation(pm) {
  _classCallCheck(this, Operation);

  this.doc = pm.doc;
  this.sel = pm.sel.range;
  this.scrollIntoView = false;
  this.focus = false;
  this.composingAtStart = !!pm.input.composing;
};

var EditorTransform = (function (_Transform) {
  _inherits(EditorTransform, _Transform);

  function EditorTransform(pm) {
    _classCallCheck(this, EditorTransform);

    _get(Object.getPrototypeOf(EditorTransform.prototype), "constructor", this).call(this, pm.doc);
    this.pm = pm;
  }

  _createClass(EditorTransform, [{
    key: "apply",
    value: function apply(options) {
      return this.pm.apply(this, options);
    }
  }, {
    key: "replaceSelection",
    value: function replaceSelection(node, inheritMarks) {
      var _selection = this.selection;
      var empty = _selection.empty;
      var from = _selection.from;
      var to = _selection.to;
      var selNode = _selection.node;var parent = undefined;
      if (node && node.isInline && inheritMarks !== false) {
        var marks = empty ? this.pm.input.storedMarks : this.doc.marksAt(from);
        node = node.type.create(node.attrs, node.text, marks);
      }

      if (selNode && selNode.isTextblock && node && node.isInline) {
        // Putting inline stuff onto a selected textblock puts it inside
        from = new _model.Pos(from.toPath(), 0);
        to = new _model.Pos(from.path, selNode.size);
      } else if (selNode) {
        // This node can not simply be removed/replaced. Remove its parent as well
        while (from.depth && from.offset == 0 && (parent = this.doc.path(from.path)) && from.offset == parent.size - 1 && !parent.type.canBeEmpty && !(node && parent.type.canContain(node))) {
          from = from.shorten();
          to = to.shorten(null, 1);
        }
      } else if (node && node.isBlock && this.doc.path(from.path.slice(0, from.depth - 1)).type.canContain(node)) {
        // Inserting a block node into a textblock. Try to insert it above by splitting the textblock
        this["delete"](from, to);
        var _parent = this.doc.path(from.path);
        if (from.offset && from.offset != _parent.size) this.split(from);
        return this.insert(from.shorten(null, from.offset ? 1 : 0), node);
      }

      if (node) return this.replaceWith(from, to, node);else return this["delete"](from, to);
    }
  }, {
    key: "deleteSelection",
    value: function deleteSelection() {
      return this.replaceSelection();
    }
  }, {
    key: "typeText",
    value: function typeText(text) {
      return this.replaceSelection(this.pm.schema.text(text), true);
    }
  }, {
    key: "selection",
    get: function get() {
      return this.steps.length ? this.pm.selection.map(this) : this.pm.selection;
    }
  }]);

  return EditorTransform;
})(_transform.Transform);
},{"../dom":2,"../model":26,"../parse":32,"../parse/text":33,"../serialize":35,"../serialize/text":36,"../transform":38,"../util/map":48,"../util/sortedinsert":49,"./commands":5,"./css":6,"./draw":8,"./event":9,"./history":10,"./input":12,"./keys":13,"./options":15,"./range":16,"./selection":17}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineOption = defineOption;
exports.parseOptions = parseOptions;
exports.initOptions = initOptions;
exports.setOption = setOption;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _commands = require("./commands");

var Option = function Option(defaultValue, update, updateOnInit) {
  _classCallCheck(this, Option);

  this.defaultValue = defaultValue;
  this.update = update;
  this.updateOnInit = updateOnInit !== false;
};

var options = {
  __proto__: null,

  schema: new Option(_model.defaultSchema, false, false),

  doc: new Option(null, function (pm, value) {
    pm.setDoc(value);
  }, false),

  docFormat: new Option(null),

  place: new Option(null),

  keymap: new Option(null, function (pm, value) {
    if (!value) pm.options.keymap = (0, _commands.defaultKeymap)(pm);
  }),

  historyDepth: new Option(50),

  historyEventDelay: new Option(500),

  commandParamHandler: new Option("default"),

  label: new Option(null)
};

function defineOption(name, defaultValue, update, updateOnInit) {
  options[name] = new Option(defaultValue, update, updateOnInit);
}

function parseOptions(obj) {
  var result = Object.create(null);
  var given = obj ? [obj].concat(obj.use || []) : [];
  outer: for (var opt in options) {
    for (var i = 0; i < given.length; i++) {
      if (opt in given[i]) {
        result[opt] = given[i][opt];
        continue outer;
      }
    }
    result[opt] = options[opt].defaultValue;
  }
  return result;
}

function initOptions(pm) {
  for (var opt in options) {
    var desc = options[opt];
    if (desc.update && desc.updateOnInit) desc.update(pm, pm.options[opt], null, true);
  }
}

function setOption(pm, name, value) {
  var desc = options[name];
  if (desc.update === false) throw new Error("Option '" + name + "' can not be changed");
  var old = pm.options[name];
  pm.options[name] = value;
  if (desc.update) desc.update(pm, value, old, false);
}
},{"../model":26,"./commands":5}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _event = require("./event");

var MarkedRange = (function () {
  function MarkedRange(from, to, options) {
    _classCallCheck(this, MarkedRange);

    this.options = options || {};
    this.from = from;
    this.to = to;
  }

  _createClass(MarkedRange, [{
    key: "clear",
    value: function clear() {
      this.signal("removed", this.from);
      this.from = this.to = null;
    }
  }]);

  return MarkedRange;
})();

exports.MarkedRange = MarkedRange;

(0, _event.eventMixin)(MarkedRange);

var RangeSorter = (function () {
  function RangeSorter() {
    _classCallCheck(this, RangeSorter);

    this.sorted = [];
  }

  _createClass(RangeSorter, [{
    key: "find",
    value: function find(at) {
      var min = 0,
          max = this.sorted.length;
      for (;;) {
        if (max < min + 10) {
          for (var i = min; i < max; i++) {
            if (this.sorted[i].at.cmp(at) >= 0) return i;
          }return max;
        }
        var mid = min + max >> 1;
        if (this.sorted[mid].at.cmp(at) > 0) max = mid;else min = mid;
      }
    }
  }, {
    key: "insert",
    value: function insert(obj) {
      this.sorted.splice(this.find(obj.at), 0, obj);
    }
  }, {
    key: "remove",
    value: function remove(at, range) {
      var pos = this.find(at);
      for (var dist = 0;; dist++) {
        var leftPos = pos - dist - 1,
            rightPos = pos + dist;
        if (leftPos >= 0 && this.sorted[leftPos].range == range) {
          this.sorted.splice(leftPos, 1);
          return;
        } else if (rightPos < this.sorted.length && this.sorted[rightPos].range == range) {
          this.sorted.splice(rightPos, 1);
          return;
        }
      }
    }
  }, {
    key: "resort",
    value: function resort() {
      for (var i = 0; i < this.sorted.length; i++) {
        var cur = this.sorted[i];
        var at = cur.at = cur.type == "open" ? cur.range.from : cur.range.to;
        var pos = i;
        while (pos > 0 && this.sorted[pos - 1].at.cmp(at) > 0) {
          this.sorted[pos] = this.sorted[pos - 1];
          this.sorted[--pos] = cur;
        }
      }
    }
  }]);

  return RangeSorter;
})();

var RangeStore = (function () {
  function RangeStore(pm) {
    _classCallCheck(this, RangeStore);

    this.pm = pm;
    this.ranges = [];
    this.sorted = new RangeSorter();
  }

  _createClass(RangeStore, [{
    key: "addRange",
    value: function addRange(range) {
      this.ranges.push(range);
      this.sorted.insert({ type: "open", at: range.from, range: range });
      this.sorted.insert({ type: "close", at: range.to, range: range });
      this.pm.markRangeDirty(range);
    }
  }, {
    key: "removeRange",
    value: function removeRange(range) {
      var found = this.ranges.indexOf(range);
      if (found > -1) {
        this.ranges.splice(found, 1);
        this.sorted.remove(range.from, range);
        this.sorted.remove(range.to, range);
        this.pm.markRangeDirty(range);
        range.clear();
      }
    }
  }, {
    key: "transform",
    value: function transform(mapping) {
      for (var i = 0; i < this.ranges.length; i++) {
        var range = this.ranges[i];
        range.from = mapping.map(range.from, range.options.inclusiveLeft ? -1 : 1).pos;
        range.to = mapping.map(range.to, range.options.inclusiveRight ? 1 : -1).pos;
        var diff = range.from.cmp(range.to);
        if (range.options.clearWhenEmpty !== false && diff >= 0) {
          this.removeRange(range);
          i--;
        } else if (diff > 0) {
          range.to = range.from;
        }
      }
      this.sorted.resort();
    }
  }, {
    key: "activeRangeTracker",
    value: function activeRangeTracker() {
      return new RangeTracker(this.sorted.sorted);
    }
  }]);

  return RangeStore;
})();

exports.RangeStore = RangeStore;

var RangeTracker = (function () {
  function RangeTracker(sorted) {
    _classCallCheck(this, RangeTracker);

    this.sorted = sorted;
    this.pos = 0;
    this.current = [];
  }

  _createClass(RangeTracker, [{
    key: "advanceTo",
    value: function advanceTo(pos) {
      var next = undefined;
      while (this.pos < this.sorted.length && (next = this.sorted[this.pos]).at.cmp(pos) <= 0) {
        var className = next.range.options.className;
        if (!className) continue;
        if (next.type == "open") this.current.push(className);else this.current.splice(this.current.indexOf(className), 1);
        this.pos++;
      }
    }
  }, {
    key: "nextChangeBefore",
    value: function nextChangeBefore(pos) {
      for (;;) {
        if (this.pos == this.sorted.length) return null;
        var next = this.sorted[this.pos];
        if (!next.range.options.className) this.pos++;else if (next.at.cmp(pos) >= 0) return null;else return next.at.offset;
      }
    }
  }]);

  return RangeTracker;
})();
},{"./event":9}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.posFromDOM = posFromDOM;
exports.rangeFromDOMLoose = rangeFromDOMLoose;
exports.findByPath = findByPath;
exports.resolvePath = resolvePath;
exports.hasFocus = hasFocus;
exports.posAtCoords = posAtCoords;
exports.coordsAtPos = coordsAtPos;
exports.scrollIntoView = scrollIntoView;
exports.findSelectionFrom = findSelectionFrom;
exports.findSelectionNear = findSelectionNear;
exports.findSelectionAtStart = findSelectionAtStart;
exports.findSelectionAtEnd = findSelectionAtEnd;
exports.selectableNodeAbove = selectableNodeAbove;
exports.verticalMotionLeavesTextblock = verticalMotionLeavesTextblock;
exports.setDOMSelectionToPos = setDOMSelectionToPos;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _dom = require("../dom");

var SelectionState = (function () {
  function SelectionState(pm) {
    var _this = this;

    _classCallCheck(this, SelectionState);

    this.pm = pm;

    this.range = findSelectionAtStart(pm.doc);
    this.lastNonNodePos = null;

    this.pollState = null;
    this.pollTimeout = null;
    this.lastAnchorNode = this.lastHeadNode = this.lastAnchorOffset = this.lastHeadOffset = null;
    this.lastNode = null;

    pm.content.addEventListener("focus", function () {
      return _this.receivedFocus();
    });
  }

  _createClass(SelectionState, [{
    key: "setAndSignal",
    value: function setAndSignal(range, clearLast) {
      this.set(range, clearLast);
      this.pm.signal("selectionChange");
    }
  }, {
    key: "set",
    value: function set(range, clearLast) {
      this.range = range;
      if (!range.node) this.lastNonNodePos = null;
      if (clearLast !== false) this.lastAnchorNode = null;
    }
  }, {
    key: "setNodeAndSignal",
    value: function setNodeAndSignal(pos) {
      this.setNode(pos);
      this.pm.signal("selectionChange");
    }
  }, {
    key: "pollForUpdate",
    value: function pollForUpdate() {
      var _this2 = this;

      if (this.pm.input.composing) return;
      clearTimeout(this.pollTimeout);
      this.pollState = "update";
      var n = 0,
          check = function check() {
        if (_this2.pm.input.composing) {
          // Abort
        } else if (_this2.pm.operation) {
            _this2.pollTimeout = setTimeout(check, 20);
          } else if (!_this2.readUpdate() && ++n == 1) {
            _this2.pollTimeout = setTimeout(check, 50);
          } else {
            _this2.pollState = null;
            _this2.pollToSync();
          }
      };
      this.pollTimeout = setTimeout(check, 20);
    }
  }, {
    key: "domChanged",
    value: function domChanged() {
      var sel = getSelection();
      return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastHeadNode || sel.focusOffset != this.lastHeadOffset;
    }
  }, {
    key: "storeDOMState",
    value: function storeDOMState() {
      var sel = getSelection();
      this.lastAnchorNode = sel.anchorNode;this.lastAnchorOffset = sel.anchorOffset;
      this.lastHeadNode = sel.focusNode;this.lastHeadOffset = sel.focusOffset;
    }
  }, {
    key: "readUpdate",
    value: function readUpdate() {
      if (this.pm.input.composing || !hasFocus(this.pm) || !this.domChanged()) return false;

      var sel = getSelection(),
          doc = this.pm.doc;
      var anchor = posFromDOMInner(this.pm, sel.anchorNode, sel.anchorOffset);
      var head = posFromDOMInner(this.pm, sel.focusNode, sel.focusOffset);
      var newSel = findSelectionNear(doc, head, this.range.head && this.range.head.cmp(head) < 0 ? -1 : 1);
      if (newSel instanceof TextSelection && doc.path(anchor.path).isTextblock) newSel = new TextSelection(anchor, newSel.head);
      this.setAndSignal(newSel);
      if (newSel instanceof NodeSelection || newSel.head.cmp(head) || newSel.anchor.cmp(anchor)) {
        this.toDOM();
      } else {
        this.clearNode();
        this.storeDOMState();
      }
      return true;
    }
  }, {
    key: "pollToSync",
    value: function pollToSync() {
      var _this3 = this;

      if (this.pollState) return;
      this.pollState = "sync";
      var sync = function sync() {
        if (document.activeElement != _this3.pm.content) {
          _this3.pollState = null;
        } else {
          if (!_this3.pm.operation && !_this3.pm.input.composing) _this3.syncDOM();
          _this3.pollTimeout = setTimeout(sync, 200);
        }
      };
      this.pollTimeout = setTimeout(sync, 200);
    }
  }, {
    key: "syncDOM",
    value: function syncDOM() {
      if (!this.pm.input.composing && hasFocus(this.pm) && this.domChanged()) this.toDOM();
    }
  }, {
    key: "toDOM",
    value: function toDOM(takeFocus) {
      if (this.range instanceof NodeSelection) this.nodeToDOM(takeFocus);else this.rangeToDOM(takeFocus);
    }
  }, {
    key: "nodeToDOM",
    value: function nodeToDOM(takeFocus) {
      window.getSelection().removeAllRanges();
      if (takeFocus) this.pm.content.focus();
      var pos = this.range.from,
          node = this.range.node,
          dom = undefined;
      if (node.isInline) dom = findByOffset(resolvePath(this.pm.content, pos.path), pos.offset, true).node;else dom = resolvePath(this.pm.content, pos.toPath());
      if (dom == this.lastNode) return;
      this.clearNode();
      addNodeSelection(node, dom);
      this.lastNode = dom;
    }
  }, {
    key: "clearNode",
    value: function clearNode() {
      if (this.lastNode) {
        clearNodeSelection(this.lastNode);
        this.lastNode = null;
        return true;
      }
    }
  }, {
    key: "rangeToDOM",
    value: function rangeToDOM(takeFocus) {
      var sel = window.getSelection();
      if (!this.clearNode() && !hasFocus(this.pm)) {
        if (!takeFocus) return;
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=921444
        else if (_dom.browser.gecko) this.pm.content.focus();
      }
      if (!this.domChanged()) return;

      var range = document.createRange();
      var content = this.pm.content;
      var anchor = DOMFromPos(content, this.range.anchor);
      var head = DOMFromPos(content, this.range.head);

      if (sel.extend) {
        range.setEnd(anchor.node, anchor.offset);
        range.collapse(false);
      } else {
        if (this.range.anchor.cmp(this.range.head) > 0) {
          var tmp = anchor;anchor = head;head = tmp;
        }
        range.setEnd(head.node, head.offset);
        range.setStart(anchor.node, anchor.offset);
      }
      sel.removeAllRanges();
      sel.addRange(range);
      if (sel.extend) sel.extend(head.node, head.offset);
      this.storeDOMState();
    }
  }, {
    key: "receivedFocus",
    value: function receivedFocus() {
      if (!this.pollState) this.pollToSync();
    }
  }, {
    key: "beforeStartOp",
    value: function beforeStartOp() {
      if (this.pollState == "update" && this.readUpdate()) {
        clearTimeout(this.pollTimeout);
        this.pollState = null;
        this.pollToSync();
      } else {
        this.syncDOM();
      }
    }
  }]);

  return SelectionState;
})();

exports.SelectionState = SelectionState;

function clearNodeSelection(dom) {
  dom.classList.remove("ProseMirror-selectednode");
}

function addNodeSelection(_node, dom) {
  dom.classList.add("ProseMirror-selectednode");
}

function windowRect() {
  return { left: 0, right: window.innerWidth,
    top: 0, bottom: window.innerHeight };
}

var Selection = function Selection() {
  _classCallCheck(this, Selection);
};

exports.Selection = Selection;

var NodeSelection = (function (_Selection) {
  _inherits(NodeSelection, _Selection);

  function NodeSelection(from, to, node) {
    _classCallCheck(this, NodeSelection);

    _get(Object.getPrototypeOf(NodeSelection.prototype), "constructor", this).call(this);
    this.from = from;
    this.to = to;
    this.node = node;
  }

  /**
   * Text selection range class.
   *
   * A range consists of a head (the active location of the cursor)
   * and an anchor (the start location of the selection).
   */

  _createClass(NodeSelection, [{
    key: "eq",
    value: function eq(other) {
      return other instanceof NodeSelection && !this.from.cmp(other.from);
    }
  }, {
    key: "map",
    value: function map(doc, mapping) {
      var from = mapping.map(this.from, 1).pos;
      var to = mapping.map(this.to, -1).pos;
      if (_model.Pos.samePath(from.path, to.path) && from.offset == to.offset - 1) {
        var node = doc.nodeAfter(from);
        if (node.type.selectable) return new NodeSelection(from, to, node);
      }
      return findSelectionNear(doc, from);
    }
  }, {
    key: "empty",
    get: function get() {
      return false;
    }
  }]);

  return NodeSelection;
})(Selection);

exports.NodeSelection = NodeSelection;

var TextSelection = (function (_Selection2) {
  _inherits(TextSelection, _Selection2);

  function TextSelection(anchor, head) {
    _classCallCheck(this, TextSelection);

    _get(Object.getPrototypeOf(TextSelection.prototype), "constructor", this).call(this);
    this.anchor = anchor;
    this.head = head || anchor;
  }

  _createClass(TextSelection, [{
    key: "eq",
    value: function eq(other) {
      return other instanceof TextSelection && !other.head.cmp(this.head) && !other.anchor.cmp(this.anchor);
    }
  }, {
    key: "map",
    value: function map(doc, mapping) {
      var head = mapping.map(this.head).pos;
      if (!doc.path(head.path).isTextblock) return findSelectionNear(doc, head);
      var anchor = mapping.map(this.anchor).pos;
      return new TextSelection(doc.path(anchor.path).isTextblock ? anchor : head, head);
    }
  }, {
    key: "inverted",
    get: function get() {
      return this.anchor.cmp(this.head) > 0;
    }
  }, {
    key: "from",
    get: function get() {
      return this.inverted ? this.head : this.anchor;
    }
  }, {
    key: "to",
    get: function get() {
      return this.inverted ? this.anchor : this.head;
    }
  }, {
    key: "empty",
    get: function get() {
      return this.anchor.cmp(this.head) == 0;
    }
  }]);

  return TextSelection;
})(Selection);

exports.TextSelection = TextSelection;

function pathFromDOM(node) {
  var path = [];
  for (;;) {
    var attr = node.getAttribute("pm-offset");
    if (!attr) return path;
    path.unshift(+attr);
    node = node.parentNode;
  }
}

function widthFromDOM(dom) {
  var attr = dom.getAttribute("pm-leaf");
  return attr && attr != "true" ? +attr : 1;
}

function posFromDOMInner(pm, dom, domOffset, loose) {
  if (!loose && pm.operation && pm.doc != pm.operation.doc) throw new Error("Fetching a position from an outdated DOM structure");

  var extraOffset = 0,
      tag = undefined;
  for (;;) {
    var adjust = 0;
    if (dom.nodeType == 3) {
      extraOffset += domOffset;
    } else if (dom.hasAttribute("pm-offset") || dom == pm.content) {
      break;
    } else if (tag = dom.getAttribute("pm-inner-offset")) {
      extraOffset += +tag;
      adjust = -1;
    } else if (domOffset && domOffset == dom.childNodes.length) {
      adjust = 1;
    }

    var _parent = dom.parentNode;
    domOffset = adjust < 0 ? 0 : Array.prototype.indexOf.call(_parent.childNodes, dom) + adjust;
    dom = _parent;
  }

  var path = pathFromDOM(dom);
  if (dom.hasAttribute("pm-leaf")) return _model.Pos.from(path, extraOffset + (domOffset ? 1 : 0));

  var offset = 0;
  for (var i = domOffset - 1; i >= 0; i--) {
    var child = dom.childNodes[i];
    if (child.nodeType == 3) {
      if (loose) extraOffset += child.nodeValue.length;
    } else if (tag = child.getAttribute("pm-offset")) {
      offset = +tag + widthFromDOM(child);
      break;
    } else if (loose && !child.hasAttribute("pm-ignore")) {
      extraOffset += child.textContent.length;
    }
  }
  return new _model.Pos(path, offset + extraOffset);
}

function posFromDOM(pm, node, offset) {
  if (offset == null) {
    offset = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
    node = node.parentNode;
  }
  return posFromDOMInner(pm, node, offset);
}

function rangeFromDOMLoose(pm) {
  if (!hasFocus(pm)) return null;
  var sel = getSelection();
  return new TextSelection(posFromDOMInner(pm, sel.anchorNode, sel.anchorOffset, true), posFromDOMInner(pm, sel.focusNode, sel.focusOffset, true));
}

function findByPath(node, n, fromEnd) {
  for (var ch = fromEnd ? node.lastChild : node.firstChild; ch; ch = fromEnd ? ch.previousSibling : ch.nextSibling) {
    if (ch.nodeType != 1) continue;
    var offset = ch.getAttribute("pm-offset");
    if (!offset) {
      var found = findByPath(ch, n);
      if (found) return found;
    } else if (+offset == n) {
      return ch;
    }
  }
}

function resolvePath(parent, path) {
  var node = parent;
  for (var i = 0; i < path.length; i++) {
    node = findByPath(node, path[i]);
    if (!node) throw new Error("Failed to resolve path " + path.join("/"));
  }
  return node;
}

function findByOffset(node, offset, after) {
  function search(node) {
    for (var ch = node.firstChild, i = 0, attr = undefined; ch; ch = ch.nextSibling, i++) {
      if (ch.nodeType != 1) continue;
      if (attr = ch.getAttribute("pm-offset")) {
        var diff = offset - +attr,
            width = widthFromDOM(ch);
        if (diff >= 0 && (after ? diff <= width : diff < width)) return { node: ch, offset: i, innerOffset: diff };
      } else {
        var result = search(ch);
        if (result) return result;
      }
    }
  }
  return search(node);
}

function leafAt(node, offset) {
  for (;;) {
    var child = node.firstChild;
    if (!child) return { node: node, offset: offset };
    if (child.nodeType != 1) return { node: child, offset: offset };
    if (child.hasAttribute("pm-inner-offset")) {
      var nodeOffset = 0;
      for (;;) {
        var nextSib = child.nextSibling,
            nextOffset = undefined;
        if (!nextSib || (nextOffset = +nextSib.getAttribute("pm-inner-offset")) >= offset) break;
        child = nextSib;
        nodeOffset = nextOffset;
      }
      offset -= nodeOffset;
    }
    node = child;
  }
}

/**
 * Get a DOM element at a given position in the document.
 *
 * @param {Node} parent The parent DOM node.
 * @param {Pos} pos     The position in the document.
 * @return {Object}     The DOM node and character offset inside the node.
 */
function DOMFromPos(parent, pos) {
  var dom = resolvePath(parent, pos.path);
  var found = findByOffset(dom, pos.offset, true),
      inner = undefined;
  if (!found) return { node: dom, offset: 0 };
  if (found.node.getAttribute("pm-leaf") == "true" || !(inner = leafAt(found.node, found.innerOffset))) return { node: found.node.parentNode, offset: found.offset + (found.innerOffset ? 1 : 0) };else return inner;
}

function hasFocus(pm) {
  var sel = window.getSelection();
  return sel.rangeCount && (0, _dom.contains)(pm.content, sel.anchorNode);
}

/**
 * Given an x,y position on the editor, get the position in the document.
 *
 * @param  {ProseMirror} pm     Editor instance.
 * @param  {Object}      coords The x, y coordinates.
 * @return {Pos}
 */
// FIXME fails on the space between lines
// FIXME reformulate as selectionAtCoords? So that it can't return null

function posAtCoords(pm, coords) {
  var element = document.elementFromPoint(coords.left, coords.top + 1);
  if (!(0, _dom.contains)(pm.content, element)) return null;

  var offset = undefined;
  if (element.childNodes.length == 1 && element.firstChild.nodeType == 3) {
    element = element.firstChild;
    offset = offsetInTextNode(element, coords);
  } else {
    offset = offsetInElement(element, coords);
  }

  return posFromDOM(pm, element, offset);
}

function textRect(node, from, to) {
  var range = document.createRange();
  range.setEnd(node, to);
  range.setStart(node, from);
  return range.getBoundingClientRect();
}

/**
 * Given a position in the document model, get a bounding box of the character at
 * that position, relative to the window.
 *
 * @param  {ProseMirror} pm The editor instance.
 * @param  {Pos}         pos
 * @return {Object} The bounding box.
 */

function coordsAtPos(pm, pos) {
  var _DOMFromPos = DOMFromPos(pm.content, pos);

  var node = _DOMFromPos.node;
  var offset = _DOMFromPos.offset;

  var side = undefined,
      rect = undefined;
  if (node.nodeType == 3) {
    if (offset < node.nodeValue.length) {
      rect = textRect(node, offset, offset + 1);
      side = "left";
    }
    if ((!rect || rect.left == rect.right) && offset) {
      rect = textRect(node, offset - 1, offset);
      side = "right";
    }
  } else if (node.firstChild) {
    if (offset < node.childNodes.length) {
      var child = node.childNodes[offset];
      rect = child.nodeType == 3 ? textRect(child, 0, child.nodeValue.length) : child.getBoundingClientRect();
      side = "left";
    }
    if ((!rect || rect.left == rect.right) && offset) {
      var child = node.childNodes[offset - 1];
      rect = child.nodeType == 3 ? textRect(child, 0, child.nodeValue.length) : child.getBoundingClientRect();
      side = "right";
    }
  } else {
    rect = node.getBoundingClientRect();
    side = "left";
  }
  var x = rect[side];
  return { top: rect.top, bottom: rect.bottom, left: x, right: x };
}

var scrollMargin = 5;

function scrollIntoView(pm, pos) {
  if (!pos) pos = pm.sel.range.head || pm.sel.range.from;
  var coords = coordsAtPos(pm, pos);
  for (var _parent2 = pm.content;; _parent2 = _parent2.parentNode) {
    var atBody = _parent2 == document.body;
    var rect = atBody ? windowRect() : _parent2.getBoundingClientRect();
    var moveX = 0,
        moveY = 0;
    if (coords.top < rect.top) moveY = -(rect.top - coords.top + scrollMargin);else if (coords.bottom > rect.bottom) moveY = coords.bottom - rect.bottom + scrollMargin;
    if (coords.left < rect.left) moveX = -(rect.left - coords.left + scrollMargin);else if (coords.right > rect.right) moveX = coords.right - rect.right + scrollMargin;
    if (moveX || moveY) {
      if (atBody) window.scrollBy(moveX, moveY);
    } else {
      if (moveY) _parent2.scrollTop += moveY;
      if (moveX) _parent2.scrollLeft += moveX;
    }
    if (atBody) break;
  }
}

function offsetInRects(coords, rects, strict) {
  var y = coords.top;
  var x = coords.left;

  var minY = 1e8,
      minX = 1e8,
      offset = 0;
  for (var i = 0; i < rects.length; i++) {
    var rect = rects[i];
    if (!rect || rect.top == rect.bottom) continue;
    var dX = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
    if (dX > minX) continue;
    if (dX < minX) {
      minX = dX;minY = 1e8;
    }
    var dY = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
    if (dY < minY) {
      minY = dY;
      offset = x < (rect.left + rect.right) / 2 ? i : i + 1;
    }
  }
  if (strict && (minX || minY)) return null;
  return offset;
}

function offsetInTextNode(text, coords, strict) {
  var len = text.nodeValue.length;
  var range = document.createRange();
  var rects = [];
  for (var i = 0; i < len; i++) {
    range.setEnd(text, i + 1);
    range.setStart(text, i);
    rects.push(range.getBoundingClientRect());
  }
  return offsetInRects(coords, rects, strict);
}

function offsetInElement(element, coords) {
  var rects = [];
  for (var child = element.firstChild; child; child = child.nextSibling) {
    if (child.getBoundingClientRect) rects.push(child.getBoundingClientRect());else rects.push(null);
  }
  return offsetInRects(coords, rects);
}

function findSelectionIn(doc, path, offset, dir, text) {
  var node = doc.path(path);
  if (node.isTextblock) return new TextSelection(new _model.Pos(path, offset));

  for (var i = offset + (dir > 0 ? 0 : -1); dir > 0 ? i < node.size : i >= 0; i += dir) {
    var child = node.child(i);
    if (!text && child.type.contains == null && child.type.selectable) return new NodeSelection(new _model.Pos(path, i), new _model.Pos(path, i + 1), child);
    path.push(i);
    var inside = findSelectionIn(doc, path, dir < 0 ? child.size : 0, dir, text);
    if (inside) return inside;
    path.pop();
  }
}

// FIXME we'll need some awareness of bidi motion when determining block start and end

function findSelectionFrom(doc, pos, dir, text) {
  for (var path = pos.path.slice(), offset = pos.offset;;) {
    var found = findSelectionIn(doc, path, offset, dir, text);
    if (found) return found;
    if (!path.length) break;
    offset = path.pop() + (dir > 0 ? 1 : 0);
  }
}

function findSelectionNear(doc, pos, bias, text) {
  if (bias === undefined) bias = 1;

  var result = findSelectionFrom(doc, pos, bias, text) || findSelectionFrom(doc, pos, -bias, text);
  if (!result) throw new Error("Searching for selection in invalid document " + doc);
  return result;
}

function findSelectionAtStart(node, path, text) {
  if (path === undefined) path = [];

  return findSelectionIn(node, path.slice(), 0, 1, text);
}

function findSelectionAtEnd(node, path, text) {
  if (path === undefined) path = [];

  return findSelectionIn(node, path.slice(), node.size, -1, text);
}

function selectableNodeAbove(pm, dom, coords, liberal) {
  for (; dom && dom != pm.content; dom = dom.parentNode) {
    if (dom.hasAttribute("pm-offset")) {
      var path = pathFromDOM(dom);
      var node = pm.doc.path(path);
      if (node.type.clicked) {
        var result = node.type.clicked(node, path, dom, coords);
        if (result) return result;
      }
      // Leaf nodes are implicitly clickable
      if ((liberal || node.type.contains == null) && node.type.selectable) return _model.Pos.from(path);
      return null;
    }
  }
}

function verticalMotionLeavesTextblock(pm, pos, dir) {
  var dom = resolvePath(pm.content, pos.path);
  var coords = coordsAtPos(pm, pos);
  for (var child = dom.firstChild; child; child = child.nextSibling) {
    if (child.nodeType != 1) continue;
    var boxes = child.getClientRects();
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      if (dir < 0 ? box.bottom < coords.top : box.top > coords.bottom) return false;
    }
  }
  return true;
}

function setDOMSelectionToPos(pm, pos) {
  var _DOMFromPos2 = DOMFromPos(pm.content, pos);

  var node = _DOMFromPos2.node;
  var offset = _DOMFromPos2.offset;

  var range = document.createRange();
  range.setEnd(node, offset);
  range.setStart(node, offset);
  var sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
},{"../dom":2,"../model":26}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIcon = getIcon;

var _dom = require("../dom");

var svgCollection = null;
var svgBuilt = Object.create(null);

var SVG = "http://www.w3.org/2000/svg";
var XLINK = "http://www.w3.org/1999/xlink";

function getIcon(name, data) {
  var node = document.createElement("div");
  node.className = "ProseMirror-icon";
  if (data.path) {
    if (!svgBuilt[name]) buildSVG(name, data);
    var svg = node.appendChild(document.createElementNS(SVG, "svg"));
    svg.style.width = data.width / data.height + "em";
    var use = svg.appendChild(document.createElementNS(SVG, "use"));
    use.setAttributeNS(XLINK, "href", "#pm-icon-" + name);
  } else {
    node.textContent = data.text;
    if (data.css) node.style.cssText = data.css;
  }
  return node;
}

function buildSVG(name, data) {
  if (!svgCollection) {
    svgCollection = document.createElementNS(SVG, "svg");
    svgCollection.style.display = "none";
    document.body.insertBefore(svgCollection, document.body.firstChild);
  }
  var sym = document.createElementNS(SVG, "symbol");
  sym.id = "pm-icon-" + name;
  sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height);
  var path = sym.appendChild(document.createElementNS(SVG, "path"));
  path.setAttribute("d", data.path);
  svgCollection.appendChild(sym);
  svgBuilt[name] = true;
}

(0, _dom.insertCSS)("\n.ProseMirror-icon {\n  display: inline-block;\n  line-height: .8;\n  vertical-align: middle;\n  padding: 2px 8px;\n  cursor: pointer;\n}\n\n.ProseMirror-icon-active {\n  background: #666;\n  border-radius: 4px;\n}\n\n.ProseMirror-icon svg {\n  fill: currentColor;\n  height: 1em;\n}\n");
},{"../dom":2}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.showSelectMenu = showSelectMenu;
exports.readParams = readParams;
exports.commandGroups = commandGroups;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tooltip = require("./tooltip");

var _dom = require("../dom");

var _edit = require("../edit");

var _utilSortedinsert = require("../util/sortedinsert");

var _utilSortedinsert2 = _interopRequireDefault(_utilSortedinsert);

var _icons = require("./icons");

var Menu = (function () {
  function Menu(pm, display) {
    _classCallCheck(this, Menu);

    this.display = display;
    this.stack = [];
    this.pm = pm;
  }

  _createClass(Menu, [{
    key: "show",
    value: function show(content, displayInfo) {
      this.stack.length = 0;
      this.enter(content, displayInfo);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.stack.length = 0;
      this.display.reset();
    }
  }, {
    key: "enter",
    value: function enter(content, displayInfo) {
      var _this = this;

      var pieces = [],
          explore = function explore(value) {
        if (Array.isArray(value)) {
          for (var i = 0; i < value.length; i++) {
            explore(value[i]);
          }pieces.push(separator);
        } else if (!value.select || value.select(_this.pm)) {
          pieces.push(value);
        }
      };
      explore(content);
      // Remove superfluous separators
      for (var i = 0; i < pieces.length; i++) {
        if (pieces[i] == separator && (i == 0 || i == pieces.length - 1 || pieces[i + 1] == separator)) pieces.splice(i--, 1);
      }if (!pieces.length) return this.display.clear();

      this.stack.push(pieces);
      this.draw(displayInfo);
    }
  }, {
    key: "draw",
    value: function draw(displayInfo) {
      var _this2 = this;

      var cur = this.stack[this.stack.length - 1];
      var rendered = (0, _dom.elt)("div", { "class": "ProseMirror-menu" }, cur.map(function (item) {
        return renderItem(item, _this2);
      }));
      if (this.stack.length > 1) this.display.enter(rendered, function () {
        return _this2.leave();
      }, displayInfo);else this.display.show(rendered, displayInfo);
    }
  }, {
    key: "leave",
    value: function leave() {
      this.stack.pop();
      if (this.stack.length) this.draw();else this.display.reset();
    }
  }, {
    key: "active",
    get: function get() {
      return this.stack.length > 1;
    }
  }]);

  return Menu;
})();

exports.Menu = Menu;

var TooltipDisplay = (function () {
  function TooltipDisplay(tooltip, resetFunc) {
    _classCallCheck(this, TooltipDisplay);

    this.tooltip = tooltip;
    this.resetFunc = resetFunc;
  }

  _createClass(TooltipDisplay, [{
    key: "clear",
    value: function clear() {
      this.tooltip.close();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.resetFunc) this.resetFunc();else this.clear();
    }
  }, {
    key: "show",
    value: function show(dom, info) {
      this.tooltip.open(dom, info);
    }
  }, {
    key: "enter",
    value: function enter(dom, back, info) {
      var button = (0, _dom.elt)("div", { "class": "ProseMirror-tooltip-back", title: "Back" });
      button.addEventListener("mousedown", function (e) {
        e.preventDefault();e.stopPropagation();
        back();
      });
      this.show((0, _dom.elt)("div", { "class": "ProseMirror-tooltip-back-wrapper" }, dom, button), info);
    }
  }]);

  return TooltipDisplay;
})();

exports.TooltipDisplay = TooltipDisplay;

function title(pm, command) {
  var key = pm.keyForCommand(command.name);
  return key ? command.label + " (" + key + ")" : command.label;
}

function renderIcon(command, menu) {
  var icon = resolveIcon(menu.pm, command);
  if (command.active(menu.pm)) icon.className += " ProseMirror-icon-active";
  var dom = (0, _dom.elt)("span", { "class": "ProseMirror-menuicon", title: title(menu.pm, command) }, icon);
  dom.addEventListener("mousedown", function (e) {
    e.preventDefault();e.stopPropagation();
    if (!command.params.length) {
      command.exec(menu.pm);
      menu.reset();
    } else if (command.params.length == 1 && command.params[0].type == "select") {
      showSelectMenu(menu.pm, command, dom);
    } else {
      menu.enter(readParams(command));
    }
  });
  return dom;
}

function resolveIcon(pm, command) {
  for (;;) {
    var icon = command.info.icon;
    if (!icon) break;
    if (icon.from) {
      command = pm.commands[icon.from];
      if (!command) break;
    } else {
      return (0, _icons.getIcon)(command.name, icon);
    }
  }
  return (0, _icons.getIcon)("default", { text: "✘" });
}

function renderSelect(item, menu) {
  var param = item.params[0];
  var value = !param["default"] ? null : param["default"].call ? param["default"](menu.pm) : param["default"];

  var dom = (0, _dom.elt)("div", { "class": "ProseMirror-select ProseMirror-select-command-" + item.name, title: item.label }, !value ? param.defaultLabel || "Select..." : value.display ? value.display(value) : value.label);
  dom.addEventListener("mousedown", function (e) {
    e.preventDefault();e.stopPropagation();
    showSelectMenu(menu.pm, item, dom);
  });
  return dom;
}

function showSelectMenu(pm, item, dom) {
  var param = item.params[0];
  var options = param.options.call ? param.options(pm) : param.options;
  var menu = (0, _dom.elt)("div", { "class": "ProseMirror-select-menu" }, options.map(function (o) {
    var dom = (0, _dom.elt)("div", null, o.display ? o.display(o) : o.label);
    dom.addEventListener("mousedown", function (e) {
      e.preventDefault();
      item.exec(pm, [o.value]);
      finish();
    });
    return dom;
  }));
  var pos = dom.getBoundingClientRect(),
      box = pm.wrapper.getBoundingClientRect();
  menu.style.left = pos.left - box.left - 2 + "px";
  menu.style.top = pos.top - box.top - 2 + "px";

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    document.body.removeEventListener("mousedown", finish);
    document.body.removeEventListener("keydown", finish);
    pm.wrapper.removeChild(menu);
  }
  document.body.addEventListener("mousedown", finish);
  document.body.addEventListener("keydown", finish);
  pm.wrapper.appendChild(menu);
}

function renderItem(item, menu) {
  if (item.display == "icon") return renderIcon(item, menu);else if (item.display == "select") return renderSelect(item, menu);else if (!item.display) throw new Error("Command " + item.name + " can not be shown in a menu");else return item.display(menu);
}

function buildParamForm(pm, command) {
  var prefill = command.info.prefillParams && command.info.prefillParams(pm);
  var fields = command.params.map(function (param, i) {
    var field = undefined,
        name = "field_" + i;
    var val = prefill ? prefill[i] : param["default"] || "";
    if (param.type == "text") field = (0, _dom.elt)("input", { name: name, type: "text",
      placeholder: param.name,
      value: val,
      autocomplete: "off" });else if (param.type == "select") field = (0, _dom.elt)("select", { name: name }, (param.options.call ? param.options(pm) : param.options).map(function (o) {
      return (0, _dom.elt)("option", { value: o.value, selected: o == val }, o.label);
    }));else // FIXME more types
      throw new Error("Unsupported parameter type: " + param.type);
    return (0, _dom.elt)("div", null, field);
  });
  return (0, _dom.elt)("form", null, fields);
}

function gatherParams(pm, command, form) {
  var bad = false;
  var params = command.params.map(function (param, i) {
    var val = form.elements["field_" + i].value;
    if (val) return val;
    if (param["default"] == null) bad = true;else return param["default"].call ? param["default"](pm) : param["default"];
  });
  return bad ? null : params;
}

function paramForm(pm, command, callback) {
  var form = buildParamForm(pm, command),
      done = false;

  var finish = function finish(result) {
    if (!done) {
      done = true;
      callback(result);
    }
  };

  var submit = function submit() {
    // FIXME error messages
    finish(gatherParams(pm, command, form));
  };
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submit();
  });
  form.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
      finish(null);
    } else if (e.keyCode == 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault();
      submit();
    }
  });
  // FIXME too hacky?
  setTimeout(function () {
    var input = form.querySelector("input, textarea");
    if (input) input.focus();
  }, 20);

  return form;
}

function readParams(command) {
  return { display: function display(menu) {
      return paramForm(menu.pm, command, function (params) {
        menu.pm.focus();
        if (params) {
          command.exec(menu.pm, params);
          menu.reset();
        } else {
          menu.leave();
        }
      });
    } };
}

var separator = {
  display: function display() {
    return (0, _dom.elt)("div", { "class": "ProseMirror-menuseparator" });
  }
};

function commandGroups(pm) {
  for (var _len = arguments.length, names = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    names[_key - 1] = arguments[_key];
  }

  return names.map(function (group) {
    var found = [];
    for (var _name in pm.commands) {
      var cmd = pm.commands[_name];
      if (cmd.info.menuGroup && cmd.info.menuGroup == group) (0, _utilSortedinsert2["default"])(found, cmd, function (a, b) {
        return (a.info.menuRank || 50) - (b.info.menuRank || 50);
      });
    }
    return found;
  });
}

function tooltipParamHandler(pm, command, callback) {
  var tooltip = new _tooltip.Tooltip(pm, "center");
  tooltip.open(paramForm(pm, command, function (params) {
    pm.focus();
    tooltip.close();
    callback(params);
  }));
}

(0, _edit.defineParamHandler)("default", tooltipParamHandler);
(0, _edit.defineParamHandler)("tooltip", tooltipParamHandler);

// FIXME check for obsolete styles
(0, _dom.insertCSS)("\n\n.ProseMirror-menu {\n  margin: 0 -4px;\n  line-height: 1;\n  white-space: pre;\n}\n.ProseMirror-tooltip .ProseMirror-menu {\n  width: -webkit-fit-content;\n  width: fit-content;\n}\n\n.ProseMirror-tooltip-back-wrapper {\n  padding-left: 12px;\n}\n.ProseMirror-tooltip-back {\n  position: absolute;\n  top: 5px; left: 5px;\n  cursor: pointer;\n}\n.ProseMirror-tooltip-back:after {\n  content: \"«\";\n}\n\n.ProseMirror-menuicon {\n  margin: 0 7px;\n}\n\n.ProseMirror-menuseparator {\n  display: inline-block;\n}\n.ProseMirror-menuseparator:after {\n  content: \"︙\";\n  opacity: 0.5;\n  padding: 0 4px;\n  vertical-align: baseline;\n}\n\n.ProseMirror-select, .ProseMirror-select-menu {\n  border: 1px solid #777;\n  border-radius: 3px;\n  font-size: 90%;\n}\n\n.ProseMirror-select {\n  padding: 1px 12px 1px 4px;\n  display: inline-block;\n  vertical-align: middle;\n  position: relative;\n  cursor: pointer;\n  margin: 0 8px;\n}\n\n.ProseMirror-select-command-textblockType {\n  min-width: 3.2em;\n}\n\n.ProseMirror-select:after {\n  content: \"▿\";\n  color: #777;\n  position: absolute;\n  right: 4px;\n}\n\n.ProseMirror-select-menu {\n  position: absolute;\n  background: #444;\n  color: white;\n  padding: 2px 2px;\n  z-index: 15;\n}\n.ProseMirror-select-menu div {\n  cursor: pointer;\n  padding: 0 1em 0 2px;\n}\n.ProseMirror-select-menu div:hover {\n  background: #777;\n}\n\n");
},{"../dom":2,"../edit":11,"../util/sortedinsert":49,"./icons":18,"./tooltip":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _dom = require("../dom");

var prefix = "ProseMirror-tooltip";

var Tooltip = (function () {
  function Tooltip(pm, dir) {
    var _this = this;

    _classCallCheck(this, Tooltip);

    this.pm = pm;
    this.dir = dir || "above";
    this.pointer = pm.wrapper.appendChild((0, _dom.elt)("div", { "class": prefix + "-pointer-" + this.dir + " " + prefix + "-pointer" }));
    this.pointerWidth = this.pointerHeight = null;
    this.dom = pm.wrapper.appendChild((0, _dom.elt)("div", { "class": prefix }));
    this.dom.addEventListener("transitionend", function () {
      if (_this.dom.style.opacity == "0") _this.dom.style.display = _this.pointer.style.display = "";
    });

    this.isOpen = false;
    this.lastLeft = this.lastRight = null;
  }

  _createClass(Tooltip, [{
    key: "detach",
    value: function detach() {
      this.dom.parentNode.removeChild(this.dom);
      this.pointer.parentNode.removeChild(this.pointer);
    }
  }, {
    key: "getSize",
    value: function getSize(node) {
      var wrap = this.pm.wrapper.appendChild((0, _dom.elt)("div", {
        "class": prefix,
        style: "display: block; position: absolute"
      }, node));
      var size = { width: wrap.offsetWidth, height: wrap.offsetHeight };
      wrap.parentNode.removeChild(wrap);
      return size;
    }
  }, {
    key: "open",
    value: function open(node, pos) {
      var left = this.lastLeft = pos ? pos.left : this.lastLeft;
      var top = this.lastTop = pos ? pos.top : this.lastTop;

      var size = this.getSize(node);

      var around = this.pm.wrapper.getBoundingClientRect();

      for (var child = this.dom.firstChild, next = undefined; child; child = next) {
        next = child.nextSibling;
        if (child != this.pointer) this.dom.removeChild(child);
      }
      this.dom.appendChild(node);

      this.dom.style.display = this.pointer.style.display = "block";

      if (this.pointerWidth == null) {
        this.pointerWidth = this.pointer.offsetWidth - 1;
        this.pointerHeight = this.pointer.offsetHeight - 1;
      }

      this.dom.style.width = size.width + "px";
      this.dom.style.height = size.height + "px";

      var margin = 5;
      if (this.dir == "above" || this.dir == "below") {
        var tipLeft = Math.max(0, Math.min(left - size.width / 2, window.innerWidth - size.width));
        this.dom.style.left = tipLeft - around.left + "px";
        this.pointer.style.left = left - around.left - this.pointerWidth / 2 + "px";
        if (this.dir == "above") {
          var tipTop = top - around.top - margin - this.pointerHeight - size.height;
          this.dom.style.top = tipTop + "px";
          this.pointer.style.top = tipTop + size.height + "px";
        } else {
          // below
          var tipTop = top - around.top + margin;
          this.pointer.style.top = tipTop + "px";
          this.dom.style.top = tipTop + this.pointerHeight + "px";
        }
      } else if (this.dir == "left" || this.dir == "right") {
        this.dom.style.top = top - around.top - size.height / 2 + "px";
        this.pointer.style.top = top - this.pointerHeight / 2 - around.top + "px";
        if (this.dir == "left") {
          var pointerLeft = left - around.left - margin - this.pointerWidth;
          this.dom.style.left = pointerLeft - size.width + "px";
          this.pointer.style.left = pointerLeft + "px";
        } else {
          // right
          var pointerLeft = left - around.left + margin;
          this.dom.style.left = pointerLeft + this.pointerWidth + "px";
          this.pointer.style.left = pointerLeft + "px";
        }
      } else if (this.dir == "center") {
        var _top = Math.max(around.top, 0),
            bottom = Math.min(around.bottom, window.innerHeight);
        var fromTop = (bottom - _top - size.height) / 2;
        this.dom.style.left = (around.width - size.width) / 2 + "px";
        this.dom.style.top = _top - around.top + fromTop + "px";
      }

      getComputedStyle(this.dom).opacity;
      getComputedStyle(this.pointer).opacity;
      this.dom.style.opacity = this.pointer.style.opacity = 1;
      this.isOpen = true;
    }
  }, {
    key: "close",
    value: function close() {
      if (this.isOpen) {
        this.isOpen = false;
        this.dom.style.opacity = this.pointer.style.opacity = 0;
      }
    }
  }]);

  return Tooltip;
})();

exports.Tooltip = Tooltip;

(0, _dom.insertCSS)("\n\n.ProseMirror-tooltip {\n  position: absolute;\n  display: none;\n  box-sizing: border-box;\n  -moz-box-sizing: border- box;\n  overflow: hidden;\n\n  -webkit-transition: width 0.4s ease-out, height 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  -moz-transition: width 0.4s ease-out, height 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  transition: width 0.4s ease-out, height 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  opacity: 0;\n\n  border-radius: 5px;\n  padding: 3px 7px;\n  margin: 0;\n  background: #444;\n  border-color: #777;\n  color: white;\n\n  z-index: 5;\n}\n\n.ProseMirror-tooltip-pointer {\n  content: \"\";\n  position: absolute;\n  display: none;\n  width: 0; height: 0;\n\n  -webkit-transition: left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  -moz-transition: left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  transition: left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  opacity: 0;\n\n  z-index: 5;\n}\n\n.ProseMirror-tooltip-pointer-above {\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-top: 6px solid #444;\n}\n\n.ProseMirror-tooltip-pointer-below {\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #444;\n}\n\n.ProseMirror-tooltip-pointer-right {\n  border-top: 6px solid transparent;\n  border-bottom: 6px solid transparent;\n  border-right: 6px solid #444;\n}\n\n.ProseMirror-tooltip-pointer-left {\n  border-top: 6px solid transparent;\n  border-bottom: 6px solid transparent;\n  border-left: 6px solid #444;\n}\n\n.ProseMirror-tooltip input[type=\"text\"],\n.ProseMirror-tooltip textarea {\n  background: #666;\n  color: white;\n  border: none;\n  outline: none;\n}\n\n.ProseMirror-tooltip input[type=\"text\"] {\n  padding: 0 4px;\n}\n\n");
},{"../dom":2}],21:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _edit = require("../edit");

var _dom = require("../dom");

var _update = require("./update");

var _tooltip = require("./tooltip");

var _menu = require("./menu");

var classPrefix = "ProseMirror-tooltipmenu";

(0, _edit.defineOption)("tooltipMenu", false, function (pm, value) {
  if (pm.mod.tooltipMenu) pm.mod.tooltipMenu.detach();
  pm.mod.tooltipMenu = value ? new TooltipMenu(pm, value) : null;
});

var TooltipMenu = (function () {
  function TooltipMenu(pm, config) {
    var _this = this;

    _classCallCheck(this, TooltipMenu);

    this.pm = pm;
    this.inlineItems = config && config.inlineItems || (0, _menu.commandGroups)(pm, "inline");
    this.blockItems = config && config.blockItems || (0, _menu.commandGroups)(pm, "block");
    this.showLinks = config ? config.showLinks !== false : true;
    this.emptyBlockMenu = config && config.emptyBlockMenu;
    this.update = new _update.MenuUpdate(pm, "change selectionChange blur", function () {
      return _this.prepareUpdate();
    });

    this.tooltip = new _tooltip.Tooltip(pm, "above");
    this.menu = new _menu.Menu(pm, new _menu.TooltipDisplay(this.tooltip, function () {
      return _this.update.force();
    }));
  }

  /**
   * Get the x and y coordinates at the top center of the current DOM selection.
   *
   * @return {Object}
   */

  _createClass(TooltipMenu, [{
    key: "detach",
    value: function detach() {
      this.update.detach();
      this.tooltip.detach();
    }
  }, {
    key: "prepareUpdate",
    value: function prepareUpdate() {
      var _this2 = this;

      if (this.menu.active) return null;

      var _pm$selection = this.pm.selection;
      var empty = _pm$selection.empty;
      var node = _pm$selection.node;
      var head = _pm$selection.head;var link = undefined;
      if (!this.pm.hasFocus()) {
        return function () {
          return _this2.tooltip.close();
        };
      } else if (node && node.isBlock) {
        var _ret = (function () {
          var coords = topOfNodeSelection(_this2.pm);
          return {
            v: function () {
              return _this2.menu.show(_this2.blockItems, coords);
            }
          };
        })();

        if (typeof _ret === "object") return _ret.v;
      } else if (!empty) {
        var _ret2 = (function () {
          var coords = node ? topOfNodeSelection(_this2.pm) : topCenterOfSelection();
          return {
            v: function () {
              return _this2.menu.show(_this2.inlineItems, coords);
            }
          };
        })();

        if (typeof _ret2 === "object") return _ret2.v;
      } else if (this.emptyBlockMenu && this.pm.doc.path(head.path).size == 0) {
        var _ret3 = (function () {
          var coords = _this2.pm.coordsAtPos(head);
          return {
            v: function () {
              return _this2.menu.show(_this2.blockItems, coords);
            }
          };
        })();

        if (typeof _ret3 === "object") return _ret3.v;
      } else if (this.showLinks && (link = this.linkUnderCursor())) {
        var _ret4 = (function () {
          var coords = _this2.pm.coordsAtPos(head);
          return {
            v: function () {
              return _this2.showLink(link, coords);
            }
          };
        })();

        if (typeof _ret4 === "object") return _ret4.v;
      } else {
        return function () {
          return _this2.tooltip.close();
        };
      }
    }
  }, {
    key: "linkUnderCursor",
    value: function linkUnderCursor() {
      var head = this.pm.selection.head;
      if (!head) return null;
      var marks = this.pm.doc.marksAt(head);
      return marks.reduce(function (found, m) {
        return found || m.type.name == "link" && m;
      }, null);
    }
  }, {
    key: "showLink",
    value: function showLink(link, pos) {
      var node = (0, _dom.elt)("div", { "class": classPrefix + "-linktext" }, (0, _dom.elt)("a", { href: link.attrs.href, title: link.attrs.title }, link.attrs.href));
      this.tooltip.open(node, pos);
    }
  }]);

  return TooltipMenu;
})();

function topCenterOfSelection() {
  var rects = window.getSelection().getRangeAt(0).getClientRects();
  var _rects$0 = rects[0];
  var left = _rects$0.left;
  var right = _rects$0.right;
  var top = _rects$0.top;var i = 1;
  while (left == right && rects.length > i) {
    ;var _rects = rects[i++];
    left = _rects.left;
    right = _rects.right;
    top = _rects.top;
  }
  for (; i < rects.length; i++) {
    if (rects[i].top < rects[0].bottom - 1 && (
    // Chrome bug where bogus rectangles are inserted at span boundaries
    i == rects.length - 1 || Math.abs(rects[i + 1].left - rects[i].left) > 1)) {
      left = Math.min(left, rects[i].left);
      right = Math.max(right, rects[i].right);
      top = Math.min(top, rects[i].top);
    }
  }
  return { top: top, left: (left + right) / 2 };
}

function topOfNodeSelection(pm) {
  var selected = pm.content.querySelector(".ProseMirror-selectednode");
  if (!selected) return { left: 0, top: 0 };
  var box = selected.getBoundingClientRect();
  return { left: Math.min((box.left + box.right) / 2, box.left + 20), top: box.top };
}

(0, _dom.insertCSS)("\n\n.ProseMirror-tooltipmenu-linktext a {\n  color: white;\n  text-decoration: none;\n  padding: 0 5px;\n}\n\n.ProseMirror-tooltipmenu-linktext a:hover {\n  text-decoration: underline;\n}\n\n");
},{"../dom":2,"../edit":11,"./menu":19,"./tooltip":20,"./update":22}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_FLUSH_DELAY = 200;
var UPDATE_TIMEOUT = 200;

var MenuUpdate = (function () {
  function MenuUpdate(pm, events, prepare) {
    var _this = this;

    _classCallCheck(this, MenuUpdate);

    this.pm = pm;
    this.prepare = prepare;

    this.mustUpdate = false;
    this.updateInfo = null;
    this.timeout = null;
    this.lastFlush = 0;

    this.events = events.split(" ");
    this.onEvent = this.onEvent.bind(this);
    this.force = this.force.bind(this);
    this.events.forEach(function (event) {
      return pm.on(event, _this.onEvent);
    });
    pm.on("flush", this.onFlush = this.onFlush.bind(this));
    pm.on("flushed", this.onFlushed = this.onFlushed.bind(this));
  }

  _createClass(MenuUpdate, [{
    key: "detach",
    value: function detach() {
      var _this2 = this;

      clearTimeout(this.timeout);
      this.events.forEach(function (event) {
        return _this2.pm.off(event, _this2.onEvent);
      });
      this.pm.off("flush", this.onFlush);
      this.pm.off("flushed", this.onFlushed);
    }
  }, {
    key: "onFlush",
    value: function onFlush() {
      var now = Date.now();
      if (this.mustUpdate && now - this.lastFlush >= MIN_FLUSH_DELAY) {
        this.lastFlush = now;
        clearTimeout(this.timeout);
        this.mustUpdate = false;
        this.update = this.prepare();
      }
    }
  }, {
    key: "onFlushed",
    value: function onFlushed() {
      if (this.update) {
        this.update();
        this.update = null;
      }
    }
  }, {
    key: "onEvent",
    value: function onEvent() {
      this.mustUpdate = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.force, UPDATE_TIMEOUT);
    }
  }, {
    key: "force",
    value: function force() {
      this.mustUpdate = false;
      this.updateInfo = null;
      this.lastFlush = Date.now();
      clearTimeout(this.timeout);
      var update = this.prepare();
      if (update) update();
    }
  }]);

  return MenuUpdate;
})();

exports.MenuUpdate = MenuUpdate;
},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _schema = require("./schema");

// ;; The default top-level document node type.

var Doc = (function (_Block) {
  _inherits(Doc, _Block);

  function Doc() {
    _classCallCheck(this, Doc);

    _get(Object.getPrototypeOf(Doc.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default blockquote node type.

  _createClass(Doc, null, [{
    key: "kind",
    get: function get() {
      return ".";
    }
  }]);

  return Doc;
})(_schema.Block);

exports.Doc = Doc;

var BlockQuote = (function (_Block2) {
  _inherits(BlockQuote, _Block2);

  function BlockQuote() {
    _classCallCheck(this, BlockQuote);

    _get(Object.getPrototypeOf(BlockQuote.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default ordered list node type. Has a single attribute,
  // `order`, which determines the number at which the list starts
  // counting, and defaults to 1.
  return BlockQuote;
})(_schema.Block);

exports.BlockQuote = BlockQuote;

var OrderedList = (function (_Block3) {
  _inherits(OrderedList, _Block3);

  function OrderedList() {
    _classCallCheck(this, OrderedList);

    _get(Object.getPrototypeOf(OrderedList.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(OrderedList, null, [{
    key: "contains",
    get: function get() {
      return "list_item";
    }
  }]);

  return OrderedList;
})(_schema.Block);

exports.OrderedList = OrderedList;

OrderedList.attributes = { order: new _schema.Attribute({ "default": "1" }) };

// ;; The default bullet list node type.

var BulletList = (function (_Block4) {
  _inherits(BulletList, _Block4);

  function BulletList() {
    _classCallCheck(this, BulletList);

    _get(Object.getPrototypeOf(BulletList.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default list item node type.

  _createClass(BulletList, null, [{
    key: "contains",
    get: function get() {
      return "list_item";
    }
  }]);

  return BulletList;
})(_schema.Block);

exports.BulletList = BulletList;

var ListItem = (function (_Block5) {
  _inherits(ListItem, _Block5);

  function ListItem() {
    _classCallCheck(this, ListItem);

    _get(Object.getPrototypeOf(ListItem.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default horizontal rule node type.

  _createClass(ListItem, null, [{
    key: "kind",
    get: function get() {
      return ".";
    }
  }]);

  return ListItem;
})(_schema.Block);

exports.ListItem = ListItem;

var HorizontalRule = (function (_Block6) {
  _inherits(HorizontalRule, _Block6);

  function HorizontalRule() {
    _classCallCheck(this, HorizontalRule);

    _get(Object.getPrototypeOf(HorizontalRule.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default heading node type. Has a single attribute `level`,
  // which indicates the heading level, and defaults to 1.

  _createClass(HorizontalRule, null, [{
    key: "contains",
    get: function get() {
      return null;
    }
  }]);

  return HorizontalRule;
})(_schema.Block);

exports.HorizontalRule = HorizontalRule;

var Heading = (function (_Textblock) {
  _inherits(Heading, _Textblock);

  function Heading() {
    _classCallCheck(this, Heading);

    _get(Object.getPrototypeOf(Heading.prototype), "constructor", this).apply(this, arguments);
  }

  return Heading;
})(_schema.Textblock);

exports.Heading = Heading;

Heading.attributes = { level: new _schema.Attribute({ "default": "1" }) };

// ;; The default code block / listing node type. Only allows unmarked
// text nodes inside of it.

var CodeBlock = (function (_Textblock2) {
  _inherits(CodeBlock, _Textblock2);

  function CodeBlock() {
    _classCallCheck(this, CodeBlock);

    _get(Object.getPrototypeOf(CodeBlock.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default paragraph node type.

  _createClass(CodeBlock, [{
    key: "containsMarks",
    get: function get() {
      return false;
    }
  }, {
    key: "isCode",
    get: function get() {
      return true;
    }
  }], [{
    key: "contains",
    get: function get() {
      return "text";
    }
  }]);

  return CodeBlock;
})(_schema.Textblock);

exports.CodeBlock = CodeBlock;

var Paragraph = (function (_Textblock3) {
  _inherits(Paragraph, _Textblock3);

  function Paragraph() {
    _classCallCheck(this, Paragraph);

    _get(Object.getPrototypeOf(Paragraph.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default inline image node type. Has these attributes:
  //
  // - **`src`** (required): The URL of the image.
  // - **`alt`**: The alt text.
  // - **`title`**: The title of the image.

  _createClass(Paragraph, [{
    key: "defaultTextblock",
    get: function get() {
      return true;
    }
  }]);

  return Paragraph;
})(_schema.Textblock);

exports.Paragraph = Paragraph;

var Image = (function (_Inline) {
  _inherits(Image, _Inline);

  function Image() {
    _classCallCheck(this, Image);

    _get(Object.getPrototypeOf(Image.prototype), "constructor", this).apply(this, arguments);
  }

  return Image;
})(_schema.Inline);

exports.Image = Image;

Image.attributes = {
  src: new _schema.Attribute(),
  alt: new _schema.Attribute({ "default": "" }),
  title: new _schema.Attribute({ "default": "" })
};

// ;; The default hardbreak node type.

var HardBreak = (function (_Inline2) {
  _inherits(HardBreak, _Inline2);

  function HardBreak() {
    _classCallCheck(this, HardBreak);

    _get(Object.getPrototypeOf(HardBreak.prototype), "constructor", this).apply(this, arguments);
  }

  // Mark types

  // ;; The default emphasis mark type.

  _createClass(HardBreak, [{
    key: "selectable",
    get: function get() {
      return false;
    }
  }, {
    key: "isBR",
    get: function get() {
      return true;
    }
  }]);

  return HardBreak;
})(_schema.Inline);

exports.HardBreak = HardBreak;

var EmMark = (function (_MarkType) {
  _inherits(EmMark, _MarkType);

  function EmMark() {
    _classCallCheck(this, EmMark);

    _get(Object.getPrototypeOf(EmMark.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default strong mark type.

  _createClass(EmMark, null, [{
    key: "rank",
    get: function get() {
      return 51;
    }
  }]);

  return EmMark;
})(_schema.MarkType);

exports.EmMark = EmMark;

var StrongMark = (function (_MarkType2) {
  _inherits(StrongMark, _MarkType2);

  function StrongMark() {
    _classCallCheck(this, StrongMark);

    _get(Object.getPrototypeOf(StrongMark.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The default link mark type. Has these attributes:
  //
  // - **`href`** (required): The link target.
  // - **`title`**: The link's title.

  _createClass(StrongMark, null, [{
    key: "rank",
    get: function get() {
      return 52;
    }
  }]);

  return StrongMark;
})(_schema.MarkType);

exports.StrongMark = StrongMark;

var LinkMark = (function (_MarkType3) {
  _inherits(LinkMark, _MarkType3);

  function LinkMark() {
    _classCallCheck(this, LinkMark);

    _get(Object.getPrototypeOf(LinkMark.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(LinkMark, null, [{
    key: "rank",
    get: function get() {
      return 53;
    }
  }]);

  return LinkMark;
})(_schema.MarkType);

exports.LinkMark = LinkMark;

LinkMark.attributes = {
  href: new _schema.Attribute(),
  title: new _schema.Attribute({ "default": "" })
};

// ;; The default code font mark type.

var CodeMark = (function (_MarkType4) {
  _inherits(CodeMark, _MarkType4);

  function CodeMark() {
    _classCallCheck(this, CodeMark);

    _get(Object.getPrototypeOf(CodeMark.prototype), "constructor", this).apply(this, arguments);
  }

  // :: SchemaSpec
  // The specification for the default schema.

  _createClass(CodeMark, [{
    key: "isCode",
    get: function get() {
      return true;
    }
  }], [{
    key: "rank",
    get: function get() {
      return 101;
    }
  }]);

  return CodeMark;
})(_schema.MarkType);

exports.CodeMark = CodeMark;
var defaultSpec = new _schema.SchemaSpec({
  doc: Doc,
  blockquote: BlockQuote,
  ordered_list: OrderedList,
  bullet_list: BulletList,
  list_item: ListItem,
  horizontal_rule: HorizontalRule,

  paragraph: Paragraph,
  heading: Heading,
  code_block: CodeBlock,

  text: _schema.Text,
  image: Image,
  hard_break: HardBreak
}, {
  em: EmMark,
  strong: StrongMark,
  link: LinkMark,
  code: CodeMark
});

// :: Schema
// ProseMirror's default document schema.
var defaultSchema = new _schema.Schema(defaultSpec);
exports.defaultSchema = defaultSchema;
},{"./schema":30}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDiffStart = findDiffStart;
exports.findDiffEnd = findDiffEnd;

var _pos = require("./pos");

// :: (Node, Node) → ?Pos
// Find the first position at which nodes `a` and `b` differ, or
// `null` if they are the same.

function findDiffStart(a, b) {
  var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  var iA = a.iter(),
      iB = b.iter(),
      offset = 0;
  for (;;) {
    if (iA.atEnd() || iB.atEnd()) {
      if (a.size == b.size) return null;
      break;
    }

    var childA = iA.next(),
        childB = iB.next();
    if (childA == childB) {
      offset += childA.width;continue;
    }

    if (!childA.sameMarkup(childB)) break;

    if (childA.isText && childA.text != childB.text) {
      for (var j = 0; childA.text[j] == childB.text[j]; j++) {
        offset++;
      }break;
    }

    if (childA.size || childB.size) {
      path.push(offset);
      var inner = findDiffStart(childA.content, childB.content, path);
      if (inner) return inner;
      path.pop();
    }
    offset += childA.width;
  }
  return new _pos.Pos(path, offset);
}

// :: (Node, Node) → ?{a: Pos, b: Pos}
// Find the first position, searching from the end, at which nodes `a`
// and `b` differ, or `null` if they are the same. Since this position
// will not be the same in both nodes, an object with two separate
// positions is returned.

function findDiffEnd(a, b) {
  var pathA = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
  var pathB = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  var iA = a.reverseIter(),
      iB = b.reverseIter();
  var offA = a.size,
      offB = b.size;

  for (;;) {
    if (iA.atEnd() || iB.atEnd()) {
      if (a.size == b.size) return null;
      break;
    }
    var childA = iA.next(),
        childB = iB.next();
    if (childA == childB) {
      offA -= childA.width;offB -= childB.width;
      continue;
    }

    if (!childA.sameMarkup(childB)) break;

    if (childA.isText && childA.text != childB.text) {
      var same = 0,
          minSize = Math.min(childA.text.length, childB.text.length);
      while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
        same++;offA--;offB--;
      }
      break;
    }
    offA -= childA.width;offB -= childB.width;
    if (childA.size || childB.size) {
      pathA.push(offA);pathB.push(offB);
      var inner = findDiffEnd(childA.content, childB.content, pathA, pathB);
      if (inner) return inner;
      pathA.pop();pathB.pop();
    }
  }
  return { a: new _pos.Pos(pathA, offA), b: new _pos.Pos(pathB, offB) };
}
},{"./pos":29}],25:[function(require,module,exports){
// ;; A fragment is an abstract type used to represent a node's
// collection of child nodes. It tries to hide considerations about
// the actual way in which the child nodes are stored, so that
// different representations (nodes that only contain simple nodes
// versus nodes that also contain text) can be approached using the
// same API.
//
// Fragments are persistent data structures. That means you should
// _not_ mutate them or their content, but create new instances
// whenever needed. The API tries to make this easy.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x16, _x17, _x18) { var _again = true; _function: while (_again) { var object = _x16, property = _x17, receiver = _x18; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x16 = parent; _x17 = property; _x18 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fragment = (function () {
  function Fragment() {
    _classCallCheck(this, Fragment);
  }

  _createClass(Fragment, [{
    key: "append",

    // :: (Fragment, number, number) → Fragment
    // Create a fragment that combines this one with another fragment.
    // Takes care of merging adjacent text nodes and can also merge
    // “open” nodes at the boundary. `joinLeft` and `joinRight` give the
    // depth to which the left and right fragments are open. If open
    // nodes with the same markup are found on both sides, they are
    // joined. If not, the open nodes are [closed](#Node.close).
    value: function append(other) {
      var joinLeft = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var joinRight = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      if (!this.size) return joinRight ? other.replace(0, other.firstChild.close(joinRight - 1, "start")) : other;
      if (!other.size) return joinLeft ? this.replace(this.size - 1, this.lastChild.close(joinLeft - 1, "end")) : this;
      return this.appendInner(other, joinLeft, joinRight);
    }

    // :: string
    // Concatenate all the text nodes found in this fragment and its
    // childen.
  }, {
    key: "toString",

    // :: () → string
    // Return a debugging string that describes this fragment.
    value: function toString() {
      var str = "";
      this.forEach(function (n) {
        return str += (str ? ", " : "") + n.toString();
      });
      return str;
    }

    // :: (number, number, ?(Node) → Node) → [Node]
    // Produce an array with the child nodes between the given
    // boundaries, optionally mapping a function over them.
  }, {
    key: "toArray",
    value: function toArray(from, to, f) {
      if (from === undefined) from = 0;
      if (to === undefined) to = this.size;

      var result = [];
      for (var iter = this.iter(from, to), n = undefined; n = iter.next().value;) {
        result.push(f ? f(n) : n);
      }return result;
    }

    // :: ((Node) → Node) → Fragment
    // Produce a new Fragment by mapping all this fragment's children
    // through a function.
  }, {
    key: "map",
    value: function map(f) {
      // FIXME join text nodes?
      return Fragment.fromArray(this.toArray(undefined, undefined, f));
    }

    // :: ((Node) → bool) → bool
    // Returns `true` if the given function returned `true` for any of
    // the fragment's children.
  }, {
    key: "some",
    value: function some(f) {
      for (var iter = this.iter(), n = undefined; n = iter.next().value;) {
        if (f(n)) return n;
      }
    }
  }, {
    key: "close",
    value: function close(depth, side) {
      var child = side == "start" ? this.firstChild : this.lastChild;
      var closed = child.close(depth - 1, side);
      if (closed == child) return this;
      return this.replace(side == "start" ? 0 : this.size - 1, closed);
    }
  }, {
    key: "nodesBetween",
    value: function nodesBetween(from, to, f, path, parent) {
      var moreFrom = from && from.depth > path.length,
          moreTo = to && to.depth > path.length;
      var start = moreFrom ? from.path[path.length] : from ? from.offset : 0;
      var end = moreTo ? to.path[path.length] + 1 : to ? to.offset : this.size;
      for (var iter = this.iter(start, end), node = undefined; node = iter.next().value;) {
        var startOffset = iter.offset - node.width;
        path.push(startOffset);
        node.nodesBetween(moreFrom && startOffset == start ? from : null, moreTo && iter.offset == end ? to : null, f, path, parent);
        path.pop();
      }
    }

    // :: (?Pos, ?Pos) → Fragment
    // Slice out the sub-fragment between the two given positions.
    // `null` can be passed for either to indicate the slice should go
    // all the way to the start or end of the fragment.
  }, {
    key: "sliceBetween",
    value: function sliceBetween(from, to) {
      var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      var moreFrom = from && from.depth > depth,
          moreTo = to && to.depth > depth;
      var start = moreFrom ? from.path[depth] : from ? from.offset : 0;
      var end = moreTo ? to.path[depth] + 1 : to ? to.offset : this.size;
      var nodes = [];
      for (var iter = this.iter(start, end), node = undefined; node = iter.next().value;) {
        var passFrom = moreFrom && iter.offset - node.width == start ? from : null;
        var passTo = moreTo && iter.offset == end ? to : null;
        if (passFrom || passTo) node = node.sliceBetween(passFrom, passTo, depth + 1);
        nodes.push(node);
      }
      return new this.constructor(nodes);
    }

    // :: (Schema, Object) → Fragment
    // Deserialize a fragment from its JSON representation.
  }, {
    key: "textContent",
    get: function get() {
      var text = "";
      this.forEach(function (n) {
        return text += n.textContent;
      });
      return text;
    }
  }], [{
    key: "fromJSON",
    value: function fromJSON(schema, value) {
      return value ? this.fromArray(value.map(schema.nodeFromJSON)) : emptyFragment;
    }

    // :: ([Node]) → Fragment
    // Build a fragment from an array of nodes.
  }, {
    key: "fromArray",
    value: function fromArray(array) {
      if (!array.length) return emptyFragment;
      var hasText = false;
      for (var i = 0; i < array.length; i++) {
        if (array[i].isText) hasText = true;
      }return new (hasText ? TextFragment : FlatFragment)(array);
    }

    // :: (?union<Fragment, Node, [Node]>) → Fragment
    // Create a fragment from something that can be interpreted as a set
    // of nodes. For `null`, it returns the empty fragment. For a
    // fragment, the fragment itself. For a node or array of nodes, a
    // fragment containing those nodes.
  }, {
    key: "from",
    value: function from(nodes) {
      if (!nodes) return emptyFragment;
      if (nodes instanceof Fragment) return nodes;
      return this.fromArray(Array.isArray(nodes) ? nodes : [nodes]);
    }
  }]);

  return Fragment;
})();

exports.Fragment = Fragment;

var iterEnd = { done: true };

var FlatIterator = (function () {
  function FlatIterator(array, pos, end) {
    _classCallCheck(this, FlatIterator);

    this.array = array;
    this.pos = pos;
    this.end = end;
  }

  _createClass(FlatIterator, [{
    key: "copy",
    value: function copy() {
      return new this.constructor(this.array, this.pos, this.end);
    }
  }, {
    key: "atEnd",
    value: function atEnd() {
      return this.pos == this.end;
    }
  }, {
    key: "next",
    value: function next() {
      return this.pos == this.end ? iterEnd : this.array[this.pos++];
    }
  }, {
    key: "offset",
    get: function get() {
      return this.pos;
    }
  }]);

  return FlatIterator;
})();

var ReverseFlatIterator = (function (_FlatIterator) {
  _inherits(ReverseFlatIterator, _FlatIterator);

  function ReverseFlatIterator() {
    _classCallCheck(this, ReverseFlatIterator);

    _get(Object.getPrototypeOf(ReverseFlatIterator.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; #forward=Fragment

  _createClass(ReverseFlatIterator, [{
    key: "next",
    value: function next() {
      return this.pos == this.end ? iterEnd : this.array[--this.pos];
    }
  }]);

  return ReverseFlatIterator;
})(FlatIterator);

var FlatFragment = (function (_Fragment) {
  _inherits(FlatFragment, _Fragment);

  function FlatFragment(content) {
    _classCallCheck(this, FlatFragment);

    _get(Object.getPrototypeOf(FlatFragment.prototype), "constructor", this).call(this);
    this.content = content;
  }

  // :: Fragment
  // An empty fragment. Intended to be reused whenever a node doesn't
  // contain anything (rather than allocating a new empty fragment for
  // each leaf node).

  // :: (?number, ?number) → Iterator<Node>
  // Create a forward iterator over the content of the fragment. An
  // explicit start and end offset can be given to have the iterator
  // go over only part of the content. If an iteration bound falls
  // within a text node, only the part that is within the bounds is
  // yielded.

  _createClass(FlatFragment, [{
    key: "iter",
    value: function iter() {
      var start = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var end = arguments.length <= 1 || arguments[1] === undefined ? this.size : arguments[1];

      return new FlatIterator(this.content, start, end);
    }

    // :: (?number, ?number) → Iterator<Node>
    // Create a reverse iterator over the content of the fragment. An
    // explicit start and end offset can be given to have the iterator
    // go over only part of the content. **Note**: `start` should be
    // greater than `end`, when passed.
  }, {
    key: "reverseIter",
    value: function reverseIter() {
      var start = arguments.length <= 0 || arguments[0] === undefined ? this.size : arguments[0];
      var end = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      return new ReverseFlatIterator(this.content, start, end);
    }

    // :: number
    // The maximum offset in this fragment.
  }, {
    key: "child",

    // :: (number) → Node
    // Get the child at the given offset. Might return a text node that
    // stretches before and/or after the offset.
    value: function child(off) {
      if (off < 0 || off >= this.content.length) throw new Error("Offset " + off + " out of range");
      return this.content[off];
    }

    // :: ((node: Node, start: number, end: number))
    // Call the given function for each node in the fragment, passing it
    // the node, its start offset, and its end offset.
  }, {
    key: "forEach",
    value: function forEach(f) {
      for (var i = 0; i < this.content.length; i++) {
        f(this.content[i], i, i + 1);
      }
    }

    // :: (number) → {start: number, node: Node}
    // Find the node before the given offset. Returns an object
    // containing the node as well as its start index. Offset should be
    // greater than zero.
  }, {
    key: "chunkBefore",
    value: function chunkBefore(off) {
      return { node: this.child(off - 1), start: off - 1 };
    }

    // :: (number) → {start: number, node: Node}
    // Find the node after the given offset. Returns an object
    // containing the node as well as its start index. Offset should be
    // less than the fragment's size.
  }, {
    key: "chunkAfter",
    value: function chunkAfter(off) {
      return { node: this.child(off), start: off };
    }

    // :: (number, ?number) → Fragment
    // Return a fragment with only the nodes between the given offsets.
    // When `to` is not given, the slice will go to the end of the
    // fragment.
  }, {
    key: "slice",
    value: function slice(from) {
      var to = arguments.length <= 1 || arguments[1] === undefined ? this.size : arguments[1];

      if (from == to) return emptyFragment;
      return new FlatFragment(this.content.slice(from, to));
    }

    // :: (number, Node) → Fragment
    // Return a fragment in which the node at the given offset is
    // replaced by the given node. The node, as well as the one it
    // replaces, should not be text nodes.
  }, {
    key: "replace",
    value: function replace(offset, node) {
      if (node.isText) throw new Error("Argument to replace should be a non-text node");
      var copy = this.content.slice();
      copy[offset] = node;
      return new FlatFragment(copy);
    }
  }, {
    key: "appendInner",
    value: function appendInner(other, joinLeft, joinRight) {
      var last = this.content.length - 1,
          content = this.content.slice(0, last);
      var before = this.content[last],
          after = other.firstChild;
      if (joinLeft > 0 && joinRight > 0 && before.sameMarkup(after)) content.push(before.append(after.content, joinLeft - 1, joinRight - 1));else content.push(before.close(joinLeft - 1, "end"), after.close(joinRight - 1, "start"));
      return Fragment.fromArray(content.concat(other.toArray(after.width)));
    }

    // :: () → Object
    // Create a JSON-serializeable representation of this fragment.
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.content.map(function (n) {
        return n.toJSON();
      });
    }
  }, {
    key: "size",
    get: function get() {
      return this.content.length;
    }

    // :: ?Node
    // The first child of the fragment, or `null` if it is empty.
  }, {
    key: "firstChild",
    get: function get() {
      return this.content.length ? this.content[0] : null;
    }

    // :: ?Node
    // The last child of the fragment, or `null` if it is empty.
  }, {
    key: "lastChild",
    get: function get() {
      return this.content.length ? this.content[this.content.length - 1] : null;
    }
  }]);

  return FlatFragment;
})(Fragment);

var emptyFragment = new FlatFragment([]);

exports.emptyFragment = emptyFragment;

var TextIterator = (function () {
  function TextIterator(fragment, startOffset, endOffset) {
    var pos = arguments.length <= 3 || arguments[3] === undefined ? -1 : arguments[3];

    _classCallCheck(this, TextIterator);

    this.frag = fragment;
    this.offset = startOffset;
    this.pos = pos;
    this.endOffset = endOffset;
  }

  _createClass(TextIterator, [{
    key: "copy",
    value: function copy() {
      return new this.constructor(this.frag, this.offset, this.endOffset, this.pos);
    }
  }, {
    key: "atEnd",
    value: function atEnd() {
      return this.offset == this.endOffset;
    }
  }, {
    key: "next",
    value: function next() {
      if (this.pos == -1) {
        var start = this.init();
        if (start) return start;
      }
      return this.offset == this.endOffset ? iterEnd : this.advance();
    }
  }, {
    key: "advance",
    value: function advance() {
      var node = this.frag.content[this.pos++],
          end = this.offset + node.width;
      if (end > this.endOffset) {
        node = node.copy(node.text.slice(0, this.endOffset - this.offset));
        this.offset = this.endOffset;
        return node;
      }
      this.offset = end;
      return node;
    }
  }, {
    key: "init",
    value: function init() {
      this.pos = 0;
      var offset = 0;
      while (offset < this.offset) {
        var node = this.frag.content[this.pos++],
            end = offset + node.width;
        if (end == this.offset) break;
        if (end > this.offset) {
          var sliceEnd = node.width;
          if (end > this.endOffset) {
            sliceEnd = this.endOffset - offset;
            end = this.endOffset;
          }
          node = node.copy(node.text.slice(this.offset - offset, sliceEnd));
          this.offset = end;
          return node;
        }
        offset = end;
      }
    }
  }]);

  return TextIterator;
})();

var ReverseTextIterator = (function (_TextIterator) {
  _inherits(ReverseTextIterator, _TextIterator);

  function ReverseTextIterator() {
    _classCallCheck(this, ReverseTextIterator);

    _get(Object.getPrototypeOf(ReverseTextIterator.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ReverseTextIterator, [{
    key: "advance",
    value: function advance() {
      var node = this.frag.content[--this.pos],
          end = this.offset - node.width;
      if (end < this.endOffset) {
        node = node.copy(node.text.slice(this.endOffset - end));
        this.offset = this.endOffset;
        return node;
      }
      this.offset = end;
      return node;
    }
  }, {
    key: "init",
    value: function init() {
      this.pos = this.frag.content.length;
      var offset = this.frag.size;
      while (offset > this.offset) {
        var node = this.frag.content[--this.pos],
            end = offset - node.width;
        if (end == this.offset) break;
        if (end < this.offset) {
          if (end < this.endOffset) {
            node = node.copy(node.text.slice(this.endOffset - end, this.offset - end));
            end = this.endOffset;
          } else {
            node = node.copy(node.text.slice(0, this.offset - end));
          }
          this.offset = end;
          return node;
        }
        offset = end;
      }
    }
  }]);

  return ReverseTextIterator;
})(TextIterator);

var TextFragment = (function (_Fragment2) {
  _inherits(TextFragment, _Fragment2);

  function TextFragment(content, size) {
    _classCallCheck(this, TextFragment);

    _get(Object.getPrototypeOf(TextFragment.prototype), "constructor", this).call(this);
    this.content = content;
    this.size = size || 0;
    if (size == null) for (var i = 0; i < content.length; i++) {
      this.size += content[i].width;
    }
  }

  _createClass(TextFragment, [{
    key: "iter",
    value: function iter() {
      var from = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var to = arguments.length <= 1 || arguments[1] === undefined ? this.size : arguments[1];

      return new TextIterator(this, from, to);
    }
  }, {
    key: "reverseIter",
    value: function reverseIter() {
      var from = arguments.length <= 0 || arguments[0] === undefined ? this.size : arguments[0];
      var to = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      return new ReverseTextIterator(this, from, to);
    }
  }, {
    key: "child",
    value: function child(off) {
      if (off < 0 || off >= this.size) throw new Error("Offset " + off + " out of range");
      for (var i = 0, curOff = 0; i < this.content.length; i++) {
        var child = this.content[i];
        curOff += child.width;
        if (curOff > off) return child;
      }
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      for (var i = 0, off = 0; i < this.content.length; i++) {
        var child = this.content[i];
        f(child, off, off += child.width);
      }
    }
  }, {
    key: "chunkBefore",
    value: function chunkBefore(off) {
      if (!off) throw new Error("No chunk before start of node");
      for (var i = 0, curOff = 0; i < this.content.length; i++) {
        var child = this.content[i],
            end = curOff + child.width;
        if (end >= off) return { node: child, start: curOff };
        curOff = end;
      }
    }
  }, {
    key: "chunkAfter",
    value: function chunkAfter(off) {
      if (off == this.size) throw new Error("No chunk after end of node");
      for (var i = 0, curOff = 0; i < this.content.length; i++) {
        var child = this.content[i],
            end = curOff + child.width;
        if (end > off) return { node: child, start: curOff };
        curOff = end;
      }
    }
  }, {
    key: "slice",
    value: function slice() {
      var from = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var to = arguments.length <= 1 || arguments[1] === undefined ? this.size : arguments[1];

      if (from == to) return emptyFragment;
      return new TextFragment(this.toArray(from, to));
    }
  }, {
    key: "replace",
    value: function replace(off, node) {
      if (node.isText) throw new Error("Argument to replace should be a non-text node");
      var curNode = undefined,
          index = undefined;
      for (var curOff = 0; curOff < off; index++) {
        curNode = this.content[index];
        curOff += curNode.width;
      }
      if (curNode.isText) throw new Error("Can not replace text content with replace method");
      var copy = this.content.slice();
      copy[index] = node;
      return new TextFragment(copy);
    }
  }, {
    key: "appendInner",
    value: function appendInner(other, joinLeft, joinRight) {
      var last = this.content.length - 1,
          content = this.content.slice(0, last);
      var before = this.content[last],
          after = other.firstChild;
      var same = before.sameMarkup(after);
      if (same && before.isText) content.push(before.copy(before.text + after.text));else if (same && joinLeft > 0 && joinRight > 0) content.push(before.append(after.content, joinLeft - 1, joinRight - 1));else content.push(before.close(joinLeft - 1, "end"), after.close(joinRight - 1, "start"));
      return Fragment.fromArray(content.concat(other.toArray(after.width)));
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.content.map(function (n) {
        return n.toJSON();
      });
    }
  }, {
    key: "firstChild",
    get: function get() {
      return this.size ? this.content[0] : null;
    }
  }, {
    key: "lastChild",
    get: function get() {
      return this.size ? this.content[this.content.length - 1] : null;
    }
  }]);

  return TextFragment;
})(Fragment);

if (typeof Symbol != "undefined") {
  // :: () → Iterator<Node>
  // A fragment is iterable, in the ES6 sense.
  Fragment.prototype[Symbol.iterator] = function () {
    return this.iter();
  };
  FlatIterator.prototype[Symbol.iterator] = TextIterator.prototype[Symbol.iterator] = function () {
    return this;
  };
}
},{}],26:[function(require,module,exports){
// !!
// This module defines ProseMirror's document model, the data
// structure used to define and inspect content documents. It
// includes:
//
// * The [node](#Node) type that represents document elements
//
// * The [schema](#Schema) types used to tag and constrain the
//   document structure
//
// * The data type for document [positions](#Pos)

"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _node = require("./node");

Object.defineProperty(exports, "Node", {
        enumerable: true,
        get: function get() {
                return _node.Node;
        }
});

var _fragment = require("./fragment");

Object.defineProperty(exports, "Fragment", {
        enumerable: true,
        get: function get() {
                return _fragment.Fragment;
        }
});
Object.defineProperty(exports, "emptyFragment", {
        enumerable: true,
        get: function get() {
                return _fragment.emptyFragment;
        }
});

var _mark = require("./mark");

Object.defineProperty(exports, "Mark", {
        enumerable: true,
        get: function get() {
                return _mark.Mark;
        }
});

var _schema = require("./schema");

Object.defineProperty(exports, "SchemaSpec", {
        enumerable: true,
        get: function get() {
                return _schema.SchemaSpec;
        }
});
Object.defineProperty(exports, "Schema", {
        enumerable: true,
        get: function get() {
                return _schema.Schema;
        }
});
Object.defineProperty(exports, "SchemaError", {
        enumerable: true,
        get: function get() {
                return _schema.SchemaError;
        }
});
Object.defineProperty(exports, "NodeType", {
        enumerable: true,
        get: function get() {
                return _schema.NodeType;
        }
});
Object.defineProperty(exports, "Block", {
        enumerable: true,
        get: function get() {
                return _schema.Block;
        }
});
Object.defineProperty(exports, "Textblock", {
        enumerable: true,
        get: function get() {
                return _schema.Textblock;
        }
});
Object.defineProperty(exports, "Inline", {
        enumerable: true,
        get: function get() {
                return _schema.Inline;
        }
});
Object.defineProperty(exports, "Text", {
        enumerable: true,
        get: function get() {
                return _schema.Text;
        }
});
Object.defineProperty(exports, "MarkType", {
        enumerable: true,
        get: function get() {
                return _schema.MarkType;
        }
});
Object.defineProperty(exports, "Attribute", {
        enumerable: true,
        get: function get() {
                return _schema.Attribute;
        }
});

var _defaultschema = require("./defaultschema");

Object.defineProperty(exports, "defaultSchema", {
        enumerable: true,
        get: function get() {
                return _defaultschema.defaultSchema;
        }
});
Object.defineProperty(exports, "Doc", {
        enumerable: true,
        get: function get() {
                return _defaultschema.Doc;
        }
});
Object.defineProperty(exports, "BlockQuote", {
        enumerable: true,
        get: function get() {
                return _defaultschema.BlockQuote;
        }
});
Object.defineProperty(exports, "OrderedList", {
        enumerable: true,
        get: function get() {
                return _defaultschema.OrderedList;
        }
});
Object.defineProperty(exports, "BulletList", {
        enumerable: true,
        get: function get() {
                return _defaultschema.BulletList;
        }
});
Object.defineProperty(exports, "ListItem", {
        enumerable: true,
        get: function get() {
                return _defaultschema.ListItem;
        }
});
Object.defineProperty(exports, "HorizontalRule", {
        enumerable: true,
        get: function get() {
                return _defaultschema.HorizontalRule;
        }
});
Object.defineProperty(exports, "Paragraph", {
        enumerable: true,
        get: function get() {
                return _defaultschema.Paragraph;
        }
});
Object.defineProperty(exports, "Heading", {
        enumerable: true,
        get: function get() {
                return _defaultschema.Heading;
        }
});
Object.defineProperty(exports, "CodeBlock", {
        enumerable: true,
        get: function get() {
                return _defaultschema.CodeBlock;
        }
});
Object.defineProperty(exports, "Image", {
        enumerable: true,
        get: function get() {
                return _defaultschema.Image;
        }
});
Object.defineProperty(exports, "HardBreak", {
        enumerable: true,
        get: function get() {
                return _defaultschema.HardBreak;
        }
});
Object.defineProperty(exports, "CodeMark", {
        enumerable: true,
        get: function get() {
                return _defaultschema.CodeMark;
        }
});
Object.defineProperty(exports, "EmMark", {
        enumerable: true,
        get: function get() {
                return _defaultschema.EmMark;
        }
});
Object.defineProperty(exports, "StrongMark", {
        enumerable: true,
        get: function get() {
                return _defaultschema.StrongMark;
        }
});
Object.defineProperty(exports, "LinkMark", {
        enumerable: true,
        get: function get() {
                return _defaultschema.LinkMark;
        }
});

var _pos = require("./pos");

Object.defineProperty(exports, "Pos", {
        enumerable: true,
        get: function get() {
                return _pos.Pos;
        }
});
Object.defineProperty(exports, "siblingRange", {
        enumerable: true,
        get: function get() {
                return _pos.siblingRange;
        }
});

var _diff = require("./diff");

Object.defineProperty(exports, "findDiffStart", {
        enumerable: true,
        get: function get() {
                return _diff.findDiffStart;
        }
});
Object.defineProperty(exports, "findDiffEnd", {
        enumerable: true,
        get: function get() {
                return _diff.findDiffEnd;
        }
});
},{"./defaultschema":23,"./diff":24,"./fragment":25,"./mark":27,"./node":28,"./pos":29,"./schema":30}],27:[function(require,module,exports){
// ;; A mark is a piece of information that can be attached to a node,
// such as it being empasized, in code font, or a link. It has a type
// and optionally a set of attributes that provide further information
// (such as the target of the link). Marks are created through a
// [schema](#Schema), which controls which types exist and which
// attributes they have.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mark = (function () {
  function Mark(type, attrs) {
    _classCallCheck(this, Mark);

    // :: MarkType
    // The type of this mark.
    this.type = type;
    // :: Object
    // The attributes associated with this mark.
    this.attrs = attrs;
  }

  // :: () → Object
  // Convert this mark to a JSON-serializeable representation.

  _createClass(Mark, [{
    key: "toJSON",
    value: function toJSON() {
      if (this.type.instance) return this.type.name;
      var obj = { _: this.type.name };
      for (var attr in this.attrs) {
        obj[attr] = this.attrs[attr];
      }return obj;
    }

    // :: ([Mark]) → [Mark]
    // Given a set of marks, create a new set which contains this one as
    // well, in the right position. If this mark or another of its type
    // is already in the set, the set itself is returned.
  }, {
    key: "addToSet",
    value: function addToSet(set) {
      for (var i = 0; i < set.length; i++) {
        var other = set[i];
        if (other.type == this.type) {
          if (this.eq(other)) return set;else return [].concat(_toConsumableArray(set.slice(0, i)), [this], _toConsumableArray(set.slice(i + 1)));
        }
        if (other.type.rank > this.type.rank) return [].concat(_toConsumableArray(set.slice(0, i)), [this], _toConsumableArray(set.slice(i)));
      }
      return set.concat(this);
    }

    // :: ([Mark]) → [Mark]
    // Remove this mark from the given set, returning a new set. If this
    // mark is not in the set, the set itself is returned.
  }, {
    key: "removeFromSet",
    value: function removeFromSet(set) {
      for (var i = 0; i < set.length; i++) if (this.eq(set[i])) return [].concat(_toConsumableArray(set.slice(0, i)), _toConsumableArray(set.slice(i + 1)));
      return set;
    }

    // :: ([Mark]) → bool
    // Test whether this mark is in the given set of marks.
  }, {
    key: "isInSet",
    value: function isInSet(set) {
      for (var i = 0; i < set.length; i++) {
        if (this.eq(set[i])) return true;
      }return false;
    }

    // :: (Mark) → bool
    // Test whether this mark has the same type and attributes as
    // another mark.
  }, {
    key: "eq",
    value: function eq(other) {
      if (this == other) return true;
      if (this.type != other.type) return false;
      for (var attr in this.attrs) {
        if (other.attrs[attr] != this.attrs[attr]) return false;
      }return true;
    }

    // :: ([Mark], [Mark]) → bool
    // Test whether two sets of marks are identical.
  }], [{
    key: "sameSet",
    value: function sameSet(a, b) {
      if (a == b) return true;
      if (a.length != b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (!a[i].eq(b[i])) return false;
      }return true;
    }
  }]);

  return Mark;
})();

exports.Mark = Mark;
},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x8, _x9, _x10) { var _again = true; _function: while (_again) { var object = _x8, property = _x9, receiver = _x10; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x8 = parent; _x9 = property; _x10 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fragment = require("./fragment");

var _mark = require("./mark");

var emptyArray = [];

// ;; This class represents a node in the tree that makes up a
// ProseMirror document. So a document is an instance of `Node`, with
// children that are also instances of `Node`.
//
// Nodes are persistent data structures. Instead of changing them, you
// create new ones with the content you want. Old ones keep pointing
// at the old document shape. This is made cheaper by sharing
// structure between the old and new data as much as possible, which a
// tree shape like this (without back pointers) makes easy.
//
// **Never** directly mutate the properties of a `Node` object.

var Node = (function () {
  function Node(type, attrs, content, marks) {
    _classCallCheck(this, Node);

    // :: NodeType
    // The type of node that this is.
    this.type = type;

    // :: Object
    // An object mapping attribute names to string values. The kind of
    // attributes allowed and required are determined by the node
    // type.
    this.attrs = attrs;

    // :: Fragment
    // The node's content.
    this.content = content || _fragment.emptyFragment;

    // :: [Mark]
    // The marks (things like whether it is emphasized or part of a
    // link) associated with this node.
    this.marks = marks || emptyArray;
  }

  // :: number
  // The size of the node's content, which is the maximum offset in
  // the node. For nodes that don't contain text, this is also the
  // number of child nodes that the node has.

  _createClass(Node, [{
    key: "child",

    // :: (number) → Node
    // Retrieve the child at the given offset. Note that this is **not**
    // the appropriate way to loop over a node. `child`'s complexity may
    // be non-constant for some nodes, and it will return the same node
    // multiple times when calling it for different offsets within a
    // text node.
    value: function child(off) {
      return this.content.child(off);
    }

    // :: (?number, ?number) → Iterator<Node>
    // Create an iterator over this node's children, optionally starting
    // and ending at a given offset.
  }, {
    key: "iter",
    value: function iter(start, end) {
      return this.content.iter(start, end);
    }

    // :: (?number, ?number) → Iterator<Node>
    // Create a reverse iterator (iterating from the node's end towards
    // its start) over this node's children, optionally starting and
    // ending at a given offset. **Note**: if given, `start` should be
    // greater than (or equal) to `end`.
  }, {
    key: "reverseIter",
    value: function reverseIter(start, end) {
      return this.content.reverseIter(start, end);
    }

    // :: (number) → {start: number, node: Node}
    // Find the node that sits before a given offset. Can be used to
    // find out which text node covers a given offset. The `start`
    // property of the return value is the starting offset of the
    // returned node. It is an error to call this with offset 0.
  }, {
    key: "chunkBefore",
    value: function chunkBefore(off) {
      return this.content.chunkBefore(off);
    }

    // :: (number) → {start: number, node: Node}
    // Find the node that sits after a given offset. The `start`
    // property of the return value is the starting offset of the
    // returned node. It is an error to call this with offset
    // corresponding to the end of the node.
  }, {
    key: "chunkAfter",
    value: function chunkAfter(off) {
      return this.content.chunkAfter(off);
    }

    // :: ((node: Node, start: number, end: number))
    // Call the given function for each child node. The function will be
    // given the node, as well as its start and end offsets, as
    // arguments.
  }, {
    key: "forEach",
    value: function forEach(f) {
      this.content.forEach(f);
    }

    // :: string
    // Concatenate all the text nodes found in this fragment and its
    // childen.
  }, {
    key: "sameMarkup",

    // :: (Node) → bool
    // Compare the markup (type, attributes, and marks) of this node to
    // those of another. Returns `true` if both have the same markup.
    value: function sameMarkup(other) {
      return this.hasMarkup(other.type, other.attrs, other.marks);
    }

    // :: (NodeType, ?Object, ?[Mark]) → bool
    // Check whether this node's markup correspond to the given type,
    // attributes, and marks.
  }, {
    key: "hasMarkup",
    value: function hasMarkup(type, attrs, marks) {
      return this.type == type && Node.sameAttrs(this.attrs, attrs) && _mark.Mark.sameSet(this.marks, marks || emptyArray);
    }
  }, {
    key: "copy",

    // :: (?Fragment) → Node
    // Create a new node with the same markup as this node, containing
    // the given content (or empty, if no content is given).
    value: function copy() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      return new this.constructor(this.type, this.attrs, content, this.marks);
    }

    // :: ([Mark]) → Node
    // Create a copy of this node, with the given set of marks instead
    // of the node's own marks.
  }, {
    key: "mark",
    value: function mark(marks) {
      return new this.constructor(this.type, this.attrs, this.content, marks);
    }

    // :: (number, ?number) → Node
    // Create a copy of this node with only the content between the
    // given offsets. If `to` is not given, it defaults to the end of
    // the node.
  }, {
    key: "slice",
    value: function slice(from, to) {
      return this.copy(this.content.slice(from, to));
    }

    // :: (number, number, Fragment) → Node
    // Create a copy of this node with the content between the given
    // offsets replaced by the given fragment.
  }, {
    key: "splice",
    value: function splice(from, to, replace) {
      return this.copy(this.content.slice(0, from).append(replace).append(this.content.slice(to)));
    }

    // :: (Fragment, ?number, ?number) → Node
    // [Append](#Fragment.append) the given fragment to this node's
    // content, and create a new node with the result.
  }, {
    key: "append",
    value: function append(fragment) {
      var joinLeft = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var joinRight = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      return this.copy(this.content.append(fragment, joinLeft, joinRight));
    }

    // :: (number, Node) → Node
    // Return a copy of this node with the child at the given offset
    // replaced by the given node. **Note**: The offset should not fall
    // within a text node.
  }, {
    key: "replace",
    value: function replace(pos, node) {
      return this.copy(this.content.replace(pos, node));
    }

    // :: ([number], Node) → Node
    // Return a copy of this node with the descendant at `path` replaced
    // by the given replacement node. This will copy as many subnodes as
    // there are elements in `path`.
  }, {
    key: "replaceDeep",
    value: function replaceDeep(path, node) {
      var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      if (depth == path.length) return node;
      var pos = path[depth];
      return this.replace(pos, this.child(pos).replaceDeep(path, node, depth + 1));
    }

    // :: (number, string) → Node
    // “Close” this node by making sure that, if it is empty, and is not
    // allowed to be so, it has its default content inserted. When depth
    // is greater than zero, subnodes at the given side (which can be
    // `"start"` or `"end"`) are closed too. Returns itself if no work
    // is necessary, or a closed copy if something did need to happen.
  }, {
    key: "close",
    value: function close(depth, side) {
      if (depth == 0 && this.size == 0 && !this.type.canBeEmpty) return this.copy(this.type.defaultContent());
      var closedContent = undefined;
      if (depth > 0 && (closedContent = this.content.close(depth - 1, side)) != this.content) return this.copy(closedContent);
      return this;
    }

    // :: ([number]) → Node
    // Get the descendant node at the given path, which is interpreted
    // as a series of offsets into successively deeper nodes.
  }, {
    key: "path",
    value: function path(_path) {
      for (var i = 0, node = this; i < _path.length; node = node.child(_path[i]), i++) {}
      return node;
    }

    // :: (Pos) → Node
    // Get the node after the given position.
  }, {
    key: "nodeAfter",
    value: function nodeAfter(pos) {
      return this.path(pos.path).child(pos.offset);
    }
  }, {
    key: "pathNodes",
    value: function pathNodes(path) {
      var nodes = [];
      for (var i = 0, node = this;; i++) {
        nodes.push(node);
        if (i == path.length) break;
        node = node.child(path[i]);
      }
      return nodes;
    }

    // :: (Pos, ?bool) → bool
    // Checks whether the given position is valid in this node. When
    // `requireTextblock` is true, only positions inside textblocks are
    // considered valid.
  }, {
    key: "isValidPos",
    value: function isValidPos(pos, requireTextblock) {
      for (var i = 0, node = this;; i++) {
        if (i == pos.path.length) {
          if (requireTextblock && !node.isTextblock) return false;
          return pos.offset <= node.size;
        } else {
          var n = pos.path[i];
          if (n >= node.size) return false;
          node = node.child(n);
        }
      }
    }

    // :: (?Pos, ?Pos, (node: Node, path: [number], parent: Node))
    // Iterate over all nodes between the given two positions, calling
    // the callback with the node, the path towards it, and its parent
    // node, as arguments. `from` and `to` may be `null` to denote
    // starting at the start of the node or ending at its end. Note that
    // the path passed to the callback is mutated as iteration
    // continues, so if you want to preserve it, make a copy.
  }, {
    key: "nodesBetween",
    value: function nodesBetween(from, to, f) {
      var path = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
      var parent = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      if (f(this, path, parent) === false) return;
      this.content.nodesBetween(from, to, f, path, this);
    }

    // :: (?Pos, ?Pos, (node: Node, path: [number], start: number, end: number, parent: Node))
    // Calls the given function for each inline node between the two
    // given positions. Pass null for `from` or `to` to start or end at
    // the start or end of the node.
  }, {
    key: "inlineNodesBetween",
    value: function inlineNodesBetween(from, to, f) {
      this.nodesBetween(from, to, function (node, path, parent) {
        if (node.isInline) {
          var last = path.length - 1;
          f(node, path.slice(0, last), path[last], path[last] + node.width, parent);
        }
      });
    }

    // :: (?Pos, ?Pos) → Node
    // Returns a copy of this node containing only the content between
    // `from` and `to`. You can pass `null` for either of them to start
    // or end at the start or end of the node.
  }, {
    key: "sliceBetween",
    value: function sliceBetween(from, to) {
      var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      return this.copy(this.content.sliceBetween(from, to, depth));
    }

    // :: (Pos) → [Mark]
    // Get the marks of the node before the given position or, if that
    // position is at the start of a non-empty node, those of the node
    // after it.
  }, {
    key: "marksAt",
    value: function marksAt(pos) {
      var parent = this.path(pos.path);
      if (!parent.isTextblock || !parent.size) return emptyArray;
      return parent.chunkBefore(pos.offset || 1).node.marks;
    }

    // :: (?Pos, ?Pos, MarkType) → bool
    // Test whether a mark of the given type occurs in this document
    // between the two given positions.
  }, {
    key: "rangeHasMark",
    value: function rangeHasMark(from, to, type) {
      var found = false;
      this.nodesBetween(from, to, function (node) {
        if (type.isInSet(node.marks)) found = true;
      });
      return found;
    }

    // :: bool
    // True when this is a block (non-inline node)
  }, {
    key: "toString",

    // :: () → string
    // Return a string representation of this node for debugging
    // purposes.
    value: function toString() {
      var name = this.type.name;
      if (this.content.size) name += "(" + this.content.toString() + ")";
      return wrapMarks(this.marks, name);
    }

    // :: () → Object
    // Return a JSON-serializable representation of this node.
  }, {
    key: "toJSON",
    value: function toJSON() {
      var obj = { type: this.type.name };
      for (var _ in this.attrs) {
        obj.attrs = this.attrs;
        break;
      }
      if (this.size) obj.content = this.content.toJSON();
      if (this.marks.length) obj.marks = this.marks.map(function (n) {
        return n.toJSON();
      });
      return obj;
    }

    // This is a hack to be able to treat a node object as an iterator result
  }, {
    key: "size",
    get: function get() {
      return this.content.size;
    }

    // :: number
    // The width of this node. Always 1 for non-text nodes, and the
    // length of the text for text nodes.
  }, {
    key: "width",
    get: function get() {
      return 1;
    }
  }, {
    key: "textContent",
    get: function get() {
      return this.content.textContent;
    }

    // :: ?Node
    // Returns this node's first child, or `null` if there are no
    // children.
  }, {
    key: "firstChild",
    get: function get() {
      return this.content.firstChild;
    }

    // :: ?Node
    // Returns this node's last child, or `null` if there are no
    // children.
  }, {
    key: "lastChild",
    get: function get() {
      return this.content.lastChild;
    }
  }, {
    key: "isBlock",
    get: function get() {
      return this.type.isBlock;
    }

    // :: bool
    // True when this is a textblock node, a block node with inline
    // content.
  }, {
    key: "isTextblock",
    get: function get() {
      return this.type.isTextblock;
    }

    // :: bool
    // True when this is an inline node (a text node or a node that can
    // appear among text).
  }, {
    key: "isInline",
    get: function get() {
      return this.type.isInline;
    }

    // :: bool
    // True when this is a text node.
  }, {
    key: "isText",
    get: function get() {
      return this.type.isText;
    }
  }, {
    key: "value",
    get: function get() {
      return this;
    }

    // :: (Schema, Object) → Node
    // Deserialize a node from its JSON representation.
  }], [{
    key: "sameAttrs",
    value: function sameAttrs(a, b) {
      if (a == b) return true;
      var empty = isEmpty(a);
      if (empty != isEmpty(b)) return false;
      if (!empty) for (var prop in a) {
        if (a[prop] !== b[prop]) return false;
      }return true;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(schema, json) {
      var type = schema.nodeType(json.type);
      var content = json.text != null ? json.text : _fragment.Fragment.fromJSON(schema, json.content);
      return type.create(json.attrs, content, json.marks && json.marks.map(schema.markFromJSON));
    }
  }]);

  return Node;
})();

exports.Node = Node;

if (typeof Symbol != "undefined") {
  // :: () → Iterator<Node>
  // A fragment is iterable, in the ES6 sense.
  Node.prototype[Symbol.iterator] = function () {
    return this.iter();
  };
}

// ;; #forward=Node

var TextNode = (function (_Node) {
  _inherits(TextNode, _Node);

  function TextNode(type, attrs, content, marks) {
    _classCallCheck(this, TextNode);

    _get(Object.getPrototypeOf(TextNode.prototype), "constructor", this).call(this, type, attrs, null, marks);
    // :: ?string
    // For text nodes, this contains the node's text content.
    this.text = content;
  }

  _createClass(TextNode, [{
    key: "toString",
    value: function toString() {
      return wrapMarks(this.marks, JSON.stringify(this.text));
    }
  }, {
    key: "mark",
    value: function mark(marks) {
      return new TextNode(this.type, this.attrs, this.text, marks);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var base = _get(Object.getPrototypeOf(TextNode.prototype), "toJSON", this).call(this);
      base.text = this.text;
      return base;
    }
  }, {
    key: "textContent",
    get: function get() {
      return this.text;
    }
  }, {
    key: "width",
    get: function get() {
      return this.text.length;
    }
  }]);

  return TextNode;
})(Node);

exports.TextNode = TextNode;

function wrapMarks(marks, str) {
  for (var i = marks.length - 1; i >= 0; i--) {
    str = marks[i].type.name + "(" + str + ")";
  }return str;
}

function isEmpty(obj) {
  if (obj) for (var _ in obj) {
    return false;
  }return true;
}
},{"./fragment":25,"./mark":27}],29:[function(require,module,exports){
// ;; Instances of the `Pos` class represent positions in a document.
// A position an array of integers that describe a path to the target
// node (see [`Node.path`](#Node..path)) and an integer offset into
// that target node.

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.siblingRange = siblingRange;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pos = (function () {
  // :: (path: [number], number)

  function Pos(path, offset) {
    _classCallCheck(this, Pos);

    // :: [number] The path to the target node.
    this.path = path;
    // :: number The offset into the target node.
    this.offset = offset;
  }

  // ;; Return a string representation of the path of the form
  // `"0/2:10"`, where the numbers before the colon are the path, and
  // the number after it is the offset.

  _createClass(Pos, [{
    key: "toString",
    value: function toString() {
      return this.path.join("/") + ":" + this.offset;
    }

    // :: number
    // The length of the position's path.
  }, {
    key: "cmp",

    // :: (Pos) → number
    // Compares this position to another position, and returns a number.
    // Of this result number, only the sign is significant. It is
    // negative if this position is less than the other one, zero if
    // they are the same, and positive if this position is greater.
    value: function cmp(other) {
      if (other == this) return 0;
      return Pos.cmp(this.path, this.offset, other.path, other.offset);
    }
  }, {
    key: "shorten",

    // :: (?number, ?number) → Pos
    // Create a position pointing into a parent of this position's
    // target. When `to` is given, it determines the new length of the
    // path. By default, the path becomes one storter. The `offset`
    // parameter can be used to determine where in this parent the
    // position points. By default, it points before the old target. You
    // can pass a negative or positive integer to move it backward or
    // forward (**note**: this method performs no bounds checking).
    value: function shorten() {
      var to = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (to >= this.depth) return this;
      return Pos.shorten(this.path, to, offset);
    }

    // :: (number) → Pos
    // Create a position with an offset moved relative to this
    // position's offset. For example moving `0/1:10` by `-2` yields
    // `0/1:8`.
  }, {
    key: "move",
    value: function move(by) {
      return new Pos(this.path, this.offset + by);
    }

    // :: (?move) → [number]
    // Convert this position to an array of numbers (including its
    // offset). Optionally pass an argument to adjust the value of the
    // offset.
  }, {
    key: "toPath",
    value: function toPath() {
      var move = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return this.path.concat(this.offset + move);
    }
  }, {
    key: "extend",
    value: function extend(pos) {
      var path = this.path.slice(),
          add = this.offset;
      for (var i = 0; i < pos.path.length; i++) {
        path.push(pos.path[i] + add);
        add = 0;
      }
      return new Pos(path, pos.offset + add);
    }

    // :: () → Object
    // Convert the position to a JSON-safe representation.
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this;
    }

    // :: ([number], ?number) → Pos
    // Build a position from an array of numbers (as in
    // [toPath](#Pos.toPath)), taking the last element of the array as
    // offset and optionally moving it by `move`.
  }, {
    key: "depth",
    get: function get() {
      return this.path.length;
    }
  }], [{
    key: "cmp",
    value: function cmp(pathA, offsetA, pathB, offsetB) {
      var lenA = pathA.length,
          lenB = pathB.length;
      for (var i = 0, end = Math.min(lenA, lenB); i < end; i++) {
        var diff = pathA[i] - pathB[i];
        if (diff != 0) return diff;
      }
      if (lenA > lenB) return offsetB <= pathA[i] ? 1 : -1;else if (lenB > lenA) return offsetA <= pathB[i] ? -1 : 1;else return offsetA - offsetB;
    }

    // :: ([number], [number]) → bool
    // Compares two paths and returns true when they are the same.
  }, {
    key: "samePath",
    value: function samePath(pathA, pathB) {
      if (pathA.length != pathB.length) return false;
      for (var i = 0; i < pathA.length; i++) {
        if (pathA[i] !== pathB[i]) return false;
      }return true;
    }
  }, {
    key: "shorten",
    value: function shorten(path) {
      var to = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      if (to == null) to = path.length - 1;
      return new Pos(path.slice(0, to), path[to] + offset);
    }
  }, {
    key: "from",
    value: function from(array) {
      var move = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (!array.length) throw new Error("Can't create a pos from an empty array");
      return new Pos(array.slice(0, array.length - 1), array[array.length - 1] + move);
    }

    // :: (Object) → Pos
    // Create a position from a JSON representation.
  }, {
    key: "fromJSON",
    value: function fromJSON(json) {
      return new Pos(json.path, json.offset);
    }
  }]);

  return Pos;
})();

exports.Pos = Pos;

function siblingRange(doc, from, to) {
  for (var i = 0, node = doc;; i++) {
    if (node.isTextblock) {
      var path = from.path.slice(0, i - 1),
          offset = from.path[i - 1];
      return { from: new Pos(path, offset), to: new Pos(path, offset + 1) };
    }
    var fromEnd = i == from.path.length,
        toEnd = i == to.path.length;
    var left = fromEnd ? from.offset : from.path[i];
    var right = toEnd ? to.offset : to.path[i];
    if (fromEnd || toEnd || left != right) {
      var path = from.path.slice(0, i);
      return { from: new Pos(path, left), to: new Pos(path, right + (toEnd ? 0 : 1)) };
    }
    node = node.child(left);
  }
}
},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _node = require("./node");

var _fragment = require("./fragment");

var _mark = require("./mark");

var _utilError = require("../util/error");

// ;; The exception type used to signal schema-related errors.

var SchemaError = (function (_ProseMirrorError) {
  _inherits(SchemaError, _ProseMirrorError);

  function SchemaError() {
    _classCallCheck(this, SchemaError);

    _get(Object.getPrototypeOf(SchemaError.prototype), "constructor", this).apply(this, arguments);
  }

  return SchemaError;
})(_utilError.ProseMirrorError);

exports.SchemaError = SchemaError;

function findKinds(type, name, schema, override) {
  function set(sub, sup) {
    if (sub in schema.kinds) {
      if (schema.kinds[sub] == sup) return;
      SchemaError.raise("Inconsistent superkinds for kind " + sub + ": " + sup + " and " + schema.kinds[sub]);
    }
    if (schema.subKind(sub, sup)) SchemaError.raise("Conflicting kind hierarchy through " + sub + " and " + sup);
    schema.kinds[sub] = sup;
  }

  for (var cur = type;; cur = Object.getPrototypeOf(cur)) {
    var curKind = override != null && cur == type ? override : cur.kind;
    if (curKind != null) {
      var _$$exec = /^(.*?)(\.)?$/.exec(curKind);

      var _$$exec2 = _slicedToArray(_$$exec, 3);

      var _ = _$$exec2[0];
      var kind = _$$exec2[1];
      var end = _$$exec2[2];

      if (kind) {
        set(name, kind);
        name = kind;
      }
      if (end) {
        set(name, null);
        return;
      }
    }
  }
}

// ;; Node types are objects allocated once per [`Schema`](#Schema)
// and used to tag [`Node`](#Node) instances with a type. They are
// instances of subtypes of this class, and contain information about
// the node type (its name, its allowed attributes, methods for
// serializing it to various formats, information to guide
// deserialization, and so on).

var NodeType = (function () {
  function NodeType(name, contains, attrs, schema) {
    _classCallCheck(this, NodeType);

    // :: string
    // The name the node type has in this schema.
    this.name = name;
    // :: ?string
    // The kind of nodes this node may contain. `null` means it's a
    // leaf node.
    this.contains = contains;
    // :: Object<Attribute>
    // The attributes allowed on this node type.
    this.attrs = attrs;
    // :: Schema
    // A link back to the [`Schema`](#Schema) the node type belongs to.
    this.schema = schema;
    this.defaultAttrs = null;
  }

  // :: Object<Attribute>
  // The default set of attributes to associate with a given type. Note
  // that schemas may add additional attributes to instances of the
  // type.

  // :: bool
  // True if this is a block type.

  _createClass(NodeType, [{
    key: "canContainFragment",

    // :: (Fragment) → bool
    // Test whether the content of the given fragment could be contained
    // in this node type.
    value: function canContainFragment(fragment) {
      var _this = this;

      var ok = true;
      fragment.forEach(function (n) {
        if (!_this.canContain(n)) ok = false;
      });
      return ok;
    }

    // :: (Node) → bool
    // Test whether the given node could be contained in this node type.
  }, {
    key: "canContain",
    value: function canContain(node) {
      if (!this.canContainType(node.type)) return false;
      for (var i = 0; i < node.marks.length; i++) {
        if (!this.canContainMark(node.marks[i])) return false;
      }return true;
    }

    // :: (Mark) → bool
    // Test whether this node type can contain children with the given
    // mark.
  }, {
    key: "canContainMark",
    value: function canContainMark(mark) {
      var contains = this.containsMarks;
      if (contains === true) return true;
      if (contains) for (var i = 0; i < contains.length; i++) {
        if (contains[i] == mark.name) return true;
      }return false;
    }

    // :: (NodeType) → bool
    // Test whether this node type can contain nodes of the given node
    // type.
  }, {
    key: "canContainType",
    value: function canContainType(type) {
      return this.schema.subKind(type.name, this.contains);
    }

    // :: (NodeType) → bool
    // Test whether the nodes that can be contained in the given node
    // type are a subtype of the nodes that can be contained in this
    // type.
  }, {
    key: "canContainContent",
    value: function canContainContent(type) {
      return this.schema.subKind(type.contains, this.contains);
    }

    // :: (NodeType) → [NodeType]
    // Find a set of intermediate node types, possibly empty, that have
    // to be inserted between this type and `other` to put a node of
    // type `other` into this type.
  }, {
    key: "findConnection",
    value: function findConnection(other) {
      // FIXME be more careful about order, and about chosen nodes
      // having default attrs
      if (this.canContainType(other)) return [];

      var seen = Object.create(null);
      var active = [{ from: this, via: [] }];
      while (active.length) {
        var current = active.shift();
        for (var _name in this.schema.nodes) {
          var type = this.schema.nodeType(_name);
          if (!(type.contains in seen) && current.from.canContainType(type)) {
            var via = current.via.concat(type);
            if (type.canContainType(other)) return via;
            active.push({ from: type, via: via });
            seen[type.contains] = true;
          }
        }
      }
    }
  }, {
    key: "buildAttrs",
    value: (function (_buildAttrs) {
      function buildAttrs(_x, _x2) {
        return _buildAttrs.apply(this, arguments);
      }

      buildAttrs.toString = function () {
        return _buildAttrs.toString();
      };

      return buildAttrs;
    })(function (attrs, content) {
      if (!attrs && this.defaultAttrs) return this.defaultAttrs;else return buildAttrs(this.attrs, attrs, this, content);
    })

    // :: (?Object, ?Fragment, ?[Mark]) → Node
    // Create a [`Node`](#Node) of this type. The given attributes are
    // checked and defaulted (you can pass `null` to use the type's
    // defaults entirely, if no required attributes exist). `content`
    // may be a [`Fragment`](#Fragment), a node, an array of nodes, or
    // `null`. Similarly `marks` may be `null` to default to the empty
    // set of marks.
  }, {
    key: "create",
    value: function create(attrs, content, marks) {
      return new _node.Node(this, this.buildAttrs(attrs, content), _fragment.Fragment.from(content), marks);
    }
  }, {
    key: "createAutoFill",
    value: function createAutoFill(attrs, content, marks) {
      if ((!content || content.length == 0) && !this.canBeEmpty) content = this.defaultContent();
      return this.create(attrs, content, marks);
    }

    // :: bool
    // Controls whether this node is allowed to be empty.
  }, {
    key: "isBlock",
    get: function get() {
      return false;
    }

    // :: bool
    // True if this is a textblock type, a block that contains inline
    // content.
  }, {
    key: "isTextblock",
    get: function get() {
      return false;
    }

    // :: bool
    // True if this is an inline type.
  }, {
    key: "isInline",
    get: function get() {
      return false;
    }

    // :: bool
    // True if this is the text node type.
  }, {
    key: "isText",
    get: function get() {
      return false;
    }

    // :: bool
    // Controls whether nodes of this type can be selected (as a user
    // node selection).
  }, {
    key: "selectable",
    get: function get() {
      return true;
    }

    // :: bool
    // Controls whether this node type is locked.
  }, {
    key: "locked",
    get: function get() {
      return false;
    }

    // :: string
    // Controls the _kind_ of the node, which is used to determine valid
    // parent/child relations. Can be a word, which adds that kind to
    // the set of kinds of the superclass, a word followed by a dot, to
    // ignore the kinds of the superclass and use only that word (along
    // with the node's name) as kind, or only a dot, in which case the
    // only kind the node has is its own name.
  }, {
    key: "canBeEmpty",
    get: function get() {
      return true;
    }
  }, {
    key: "containsMarks",

    // :: union<bool, [string]>
    // The mark types that child nodes of this node may have. `false`
    // means no marks, `true` means any mark, and an array of strings
    // can be used to explicitly list the allowed mark types.
    get: function get() {
      return false;
    }
  }], [{
    key: "compile",
    value: function compile(types, schema) {
      var result = Object.create(null);
      for (var _name2 in types) {
        var info = types[_name2];
        var type = info.type || SchemaError.raise("Missing node type for " + _name2);
        findKinds(type, _name2, schema, info.kind);
        var contains = "contains" in info ? info.contains : type.contains;
        result[_name2] = new type(_name2, contains, info.attributes || type.attributes, schema);
      }
      for (var _name3 in result) {
        var contains = result[_name3].contains;
        if (contains && !(contains in schema.kinds)) SchemaError.raise("Node type " + _name3 + " is specified to contain non-existing kind " + contains);
      }
      if (!result.doc) SchemaError.raise("Every schema needs a 'doc' type");
      if (!result.text) SchemaError.raise("Every schema needs a 'text' type");

      for (var _name4 in types) {
        types[_name4].defaultAttrs = getDefaultAttrs(types[_name4].attrs);
      }return result;
    }

    // :: (string, *)
    // Register a metadata element for this type. That is, add `value`
    // to the array under the property name `name` on the type's
    // prototype, creating the array if it wasn't already there. This is
    // mostly used to attach things like commands and parsing strategies
    // to node type.
  }, {
    key: "register",
    value: function register(name, value) {
      ;(this.prototype[name] || (this.prototype[name] = [])).push(value);
    }
  }, {
    key: "kind",
    get: function get() {
      return ".";
    }
  }]);

  return NodeType;
})();

exports.NodeType = NodeType;
NodeType.attributes = {};

// ;; Base type for block nodetypes.

var Block = (function (_NodeType) {
  _inherits(Block, _NodeType);

  function Block() {
    _classCallCheck(this, Block);

    _get(Object.getPrototypeOf(Block.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; Base type for textblock node types.

  _createClass(Block, [{
    key: "defaultContent",
    value: function defaultContent() {
      var inner = this.schema.defaultTextblockType().create();
      var conn = this.findConnection(inner.type);
      if (!conn) SchemaError.raise("Can't create default content for " + this.name);
      for (var i = conn.length - 1; i >= 0; i--) {
        inner = conn[i].create(null, inner);
      }return _fragment.Fragment.from(inner);
    }
  }, {
    key: "isBlock",
    get: function get() {
      return true;
    }
  }, {
    key: "canBeEmpty",
    get: function get() {
      return this.contains == null;
    }
  }], [{
    key: "contains",
    get: function get() {
      return "block";
    }
  }, {
    key: "kind",
    get: function get() {
      return "block.";
    }
  }]);

  return Block;
})(NodeType);

exports.Block = Block;

var Textblock = (function (_Block) {
  _inherits(Textblock, _Block);

  function Textblock() {
    _classCallCheck(this, Textblock);

    _get(Object.getPrototypeOf(Textblock.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; Base type for inline node types.

  _createClass(Textblock, [{
    key: "containsMarks",
    get: function get() {
      return true;
    }
  }, {
    key: "isTextblock",
    get: function get() {
      return true;
    }
  }, {
    key: "canBeEmpty",
    get: function get() {
      return true;
    }
  }], [{
    key: "contains",
    get: function get() {
      return "inline";
    }
  }]);

  return Textblock;
})(Block);

exports.Textblock = Textblock;

var Inline = (function (_NodeType2) {
  _inherits(Inline, _NodeType2);

  function Inline() {
    _classCallCheck(this, Inline);

    _get(Object.getPrototypeOf(Inline.prototype), "constructor", this).apply(this, arguments);
  }

  // ;; The text node type.

  _createClass(Inline, [{
    key: "isInline",
    get: function get() {
      return true;
    }
  }], [{
    key: "contains",
    get: function get() {
      return null;
    }
  }, {
    key: "kind",
    get: function get() {
      return "inline.";
    }
  }]);

  return Inline;
})(NodeType);

exports.Inline = Inline;

var Text = (function (_Inline) {
  _inherits(Text, _Inline);

  function Text() {
    _classCallCheck(this, Text);

    _get(Object.getPrototypeOf(Text.prototype), "constructor", this).apply(this, arguments);
  }

  // Attribute descriptors

  // ;; Attributes are named strings associated with nodes and marks.
  // Each node type or mark type has a fixed set of attributes, which
  // instances of this class are used to control.

  _createClass(Text, [{
    key: "create",
    value: function create(attrs, content, marks) {
      return new _node.TextNode(this, this.buildAttrs(attrs, content), content, marks);
    }
  }, {
    key: "selectable",
    get: function get() {
      return false;
    }
  }, {
    key: "isText",
    get: function get() {
      return true;
    }
  }]);

  return Text;
})(Inline);

exports.Text = Text;

var Attribute =
// :: (Object)
// Create an attribute. `options` is an object containing the
// settings for the attributes. The following settings are
// supported:
//
// **`default`**: `?string`
// : The default value for this attribute, to choose when no
//   explicit value is provided.
//
// **`compute`**: `?(Fragment) → string`
// : A function that computes a default value for the attribute from
//   the node's content.
//
// Attributes that have no default or compute property must be
// provided whenever a node or mark of a type that has them is
// created.
function Attribute() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, Attribute);

  this["default"] = options["default"];
  this.compute = options.compute;
}

// Marks

// ;; Like nodes, marks (which are associated with nodes to signify
// things like emphasis or being part of a link) are tagged with type
// objects, which are instantiated once per [Schema](#Schema).
;

exports.Attribute = Attribute;

var MarkType = (function () {
  function MarkType(name, attrs, rank, schema) {
    _classCallCheck(this, MarkType);

    // :: string
    // The name of the mark type.
    this.name = name;
    // :: Object<Attribute>
    // The attributes supported by this type of mark.
    this.attrs = attrs;
    this.rank = rank;
    // :: Schema
    // The schema that this mark type instance is part of.
    this.schema = schema;
    var defaults = getDefaultAttrs(this.attrs);
    this.instance = defaults && new _mark.Mark(this, defaults);
  }

  // :: Object<Attribute>
  // The default set of attributes to associate with a mark type. By
  // default, this returns an empty object.

  // :: number
  // Mark type ranks are used to determine the order in which mark
  // arrays are sorted. (If multiple mark types end up with the same
  // rank, they still get a fixed order in the schema, but there's no
  // guarantee what it will be.)

  _createClass(MarkType, [{
    key: "create",

    // :: (Object) → Mark
    // Create a mark of this type. `attrs` may be `null` or an object
    // containing only some of the mark's attributes. The others, if
    // they have defaults, will be added.
    value: function create(attrs) {
      if (!attrs && this.instance) return this.instance;
      return new _mark.Mark(this, buildAttrs(this.attrs, attrs, this));
    }
  }, {
    key: "removeFromSet",

    // :: ([Mark]) → [Mark]
    // When there is a mark of this type in the given set, a new set
    // without it is returned. Otherwise, the input set is returned.
    value: function removeFromSet(set) {
      for (var i = 0; i < set.length; i++) if (set[i].type == this) return set.slice(0, i).concat(set.slice(i + 1));
      return set;
    }

    // :: ([Mark]) → bool
    // Tests whether there is a mark of this type in the given set.
  }, {
    key: "isInSet",
    value: function isInSet(set) {
      for (var i = 0; i < set.length; i++) {
        if (set[i].type == this) return set[i];
      }
    }

    // :: (string, *)
    // Register a metadata element for this mark type. Adds `value` to
    // the array under the property name `name` on the type's prototype.
  }], [{
    key: "getOrder",
    value: function getOrder(marks) {
      var sorted = [];
      for (var _name5 in marks) {
        sorted.push({ name: _name5, rank: marks[_name5].type.rank });
      }sorted.sort(function (a, b) {
        return a.rank - b.rank;
      });
      var ranks = Object.create(null);
      for (var i = 0; i < sorted.length; i++) {
        ranks[sorted[i].name] = i;
      }return ranks;
    }
  }, {
    key: "compile",
    value: function compile(marks, schema) {
      var order = this.getOrder(marks);
      var result = Object.create(null);
      for (var _name6 in marks) {
        var info = marks[_name6];
        var attrs = info.attributes || info.type.attributes;
        result[_name6] = new info.type(_name6, attrs, order[_name6], schema);
      }
      return result;
    }
  }, {
    key: "register",
    value: function register(name, value) {
      ;(this.prototype[name] || (this.prototype[name] = [])).push(value);
    }
  }, {
    key: "rank",
    get: function get() {
      return 50;
    }
  }]);

  return MarkType;
})();

exports.MarkType = MarkType;
MarkType.attributes = {};

// Schema specifications are data structures that specify a schema --
// a set of node types, their names, attributes, and nesting behavior.

function copyObj(obj, f) {
  var result = Object.create(null);
  for (var prop in obj) {
    result[prop] = f ? f(obj[prop]) : obj[prop];
  }return result;
}

function ensureWrapped(obj) {
  return obj instanceof Function ? { type: obj } : obj;
}

function overlayObj(obj, overlay) {
  var copy = copyObj(obj);
  for (var _name7 in overlay) {
    var info = ensureWrapped(overlay[_name7]);
    if (info == null) {
      delete copy[_name7];
    } else if (info.type) {
      copy[_name7] = info;
    } else {
      var existing = copy[_name7] = copyObj(copy[_name7]);
      for (var prop in info) {
        existing[prop] = info[prop];
      }
    }
  }
  return copy;
}

// FIXME clean up handling of attributes, finish documentation.

// ;; A schema specification is a blueprint for an actual
// [`Schema`](#Schema). It maps names to node and mark types, along
// with extra information, such as additional attributes and changes
// to node kinds and relations.
//
// A specification consists of an object that maps node names to node
// type constructors and another similar object mapping mark names to
// mark type constructors.

var SchemaSpec = (function () {
  // :: (?Object<{type: NodeType}>, ?Object<{type: MarkType}>)

  // Create a schema specification from scratch. The arguments map
  // node names to node type constructors and mark names to mark type
  // constructors. Their property value should be either the type
  // constructors themselves, or objects with a type constructor under
  // their `type` property, and optionally other properties.

  function SchemaSpec(nodes, marks) {
    _classCallCheck(this, SchemaSpec);

    this.nodes = nodes ? copyObj(nodes, ensureWrapped) : Object.create(null);
    this.marks = marks ? copyObj(marks, ensureWrapped) : Object.create(null);
  }

  // For node types where all attrs have a default value (or which don't
  // have any attributes), build up a single reusable default attribute
  // object, and use it for all nodes that don't specify specific
  // attributes.

  _createClass(SchemaSpec, [{
    key: "updateNodes",
    value: function updateNodes(nodes) {
      return new SchemaSpec(overlayObj(this.nodes, nodes), this.marks);
    }
  }, {
    key: "addAttribute",
    value: function addAttribute(filter, attrName, attrInfo) {
      var copy = copyObj(this.nodes);
      for (var _name8 in copy) {
        if (typeof filter == "string" ? filter == _name8 : typeof filter == "function" ? filter(_name8, copy[_name8]) : filter ? filter == copy[_name8] : true) {
          var info = copy[_name8] = copyObj(copy[_name8]);
          if (!info.attributes) info.attributes = copyObj(info.type.attributes);
          info.attributes[attrName] = attrInfo;
        }
      }
      return new SchemaSpec(copy, this.marks);
    }
  }, {
    key: "updateMarks",
    value: function updateMarks(marks) {
      return new SchemaSpec(this.nodes, overlayObj(this.marks, marks));
    }
  }]);

  return SchemaSpec;
})();

exports.SchemaSpec = SchemaSpec;
function getDefaultAttrs(attrs) {
  var defaults = Object.create(null);
  for (var attrName in attrs) {
    var attr = attrs[attrName];
    if (attr["default"] == null) return null;
    defaults[attrName] = attr["default"];
  }
  return defaults;
}

function buildAttrs(attrSpec, attrs, arg1, arg2) {
  var built = Object.create(null);
  for (var _name9 in attrSpec) {
    var value = attrs && attrs[_name9];
    if (value == null) {
      var attr = attrSpec[_name9];
      if (attr["default"] != null) value = attr["default"];else if (attr.compute) value = attr.compute(arg1, arg2);else SchemaError.raise("No value supplied for attribute " + _name9);
    }
    built[_name9] = value;
  }
  return built;
}

// ;; Each document is based on a single schema, which provides the
// node and mark types that it is made up of (which, in turn,
// determine the structure it is allowed to have).

var Schema = (function () {
  // :: (SchemaSpec)
  // Construct a schema from a specification.

  function Schema(spec) {
    _classCallCheck(this, Schema);

    // :: SchemaSpec
    // The specification on which the schema is based.
    this.spec = spec;
    this.kinds = Object.create(null);
    // :: Object<NodeType>
    // An object mapping the schema's node names to node type objects.
    this.nodes = NodeType.compile(spec.nodes, this);
    // :: Object<MarkType>
    // A map from mark names to mark type objects.
    this.marks = MarkType.compile(spec.marks, this);
    // :: Object
    // An object for storing whatever values modules may want to
    // compute and cache per schema. (If you want to store something
    // in it, try to use property names unlikely to clash.)
    this.cached = Object.create(null);

    this.node = this.node.bind(this);
    this.text = this.text.bind(this);
    this.nodeFromJSON = this.nodeFromJSON.bind(this);
    this.markFromJSON = this.markFromJSON.bind(this);
  }

  // FIXME normalize mark arrays passed to these methods

  // :: (union<string, NodeType>, ?Object, ?union<Fragment, Node, [Node]>, ?[Mark]) → Node
  // Create a node in this schema. The `type` may be a string or a
  // [`NodeType`](#NodeType) instance. Attributes will be extended
  // with defaults, `content` may be a [`Fragment`](#Fragment),
  // `null`, a [`Node`](#Node), or an array of nodes.
  //
  // When creating a text node, `content` should be a string and is
  // interpreted as the node's text.
  //
  // This method is bound to the Schema, meaning you don't have to
  // call it as a method, but can pass it to higher-order functions
  // and such.

  _createClass(Schema, [{
    key: "node",
    value: function node(type, attrs, content, marks) {
      if (typeof type == "string") type = this.nodeType(type);else if (!(type instanceof NodeType)) SchemaError.raise("Invalid node type: " + type);else if (type.schema != this) SchemaError.raise("Node type from different schema used (" + type.name + ")");

      return type.create(attrs, content, marks);
    }

    // :: (string, ?[Mark]) → Node
    // Create a text node in the schema. This method is bound to the Schema.
  }, {
    key: "text",
    value: function text(_text, marks) {
      return this.nodes.text.create(null, _text, marks);
    }

    // :: () → ?NodeType
    // Return the default textblock type for this schema, or `null` if
    // it does not contain a node type with a `defaultTextblock`
    // property.
  }, {
    key: "defaultTextblockType",
    value: function defaultTextblockType() {
      var cached = this.cached.defaultTextblockType;
      if (cached !== undefined) return cached;
      for (var _name10 in this.nodes) {
        if (this.nodes[_name10].defaultTextblock) return this.cached.defaultTextblockType = this.nodes[_name10];
      }
      return this.cached.defaultTextblockType = null;
    }

    // :: (string, ?Object) → Mark
    // Create a mark with the named type
  }, {
    key: "mark",
    value: function mark(name, attrs) {
      var spec = this.marks[name] || SchemaError.raise("No mark named " + name);
      return spec.create(attrs);
    }

    // :: (Object) → Node
    // Deserialize a node from its JSON representation. This method is
    // bound.
  }, {
    key: "nodeFromJSON",
    value: function nodeFromJSON(json) {
      return _node.Node.fromJSON(this, json);
    }

    // :: (Object) → Mark
    // Deserialize a mark from its JSON representation. This method is
    // bound.
  }, {
    key: "markFromJSON",
    value: function markFromJSON(json) {
      if (typeof json == "string") return this.mark(json);
      return this.mark(json._, json);
    }

    // :: (string) → NodeType
    // Get the [`NodeType`](#NodeType) associated with the given name in
    // this schema, or raise an error if it does not exist.
  }, {
    key: "nodeType",
    value: function nodeType(name) {
      return this.nodes[name] || SchemaError.raise("Unknown node type: " + name);
    }

    // :: (string, string) → bool
    // Test whether a node kind is a subkind of another kind.
  }, {
    key: "subKind",
    value: function subKind(sub, sup) {
      for (;;) {
        if (sub == sup) return true;
        sub = this.kinds[sub];
        if (!sub) return false;
      }
    }
  }]);

  return Schema;
})();

exports.Schema = Schema;
},{"../util/error":47,"./fragment":25,"./mark":27,"./node":28}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.fromDOM = fromDOM;
exports.fromHTML = fromHTML;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _index = require("./index");

function fromDOM(schema, dom, options) {
  if (!options) options = {};
  var context = new Context(schema, options.topNode || schema.node("doc"));
  var start = options.from ? dom.childNodes[options.from] : dom.firstChild;
  var end = options.to != null && dom.childNodes[options.to] || null;
  context.addAll(start, end, true);
  var doc = undefined;
  while (context.stack.length) doc = context.leave();
  return doc;
}

(0, _index.defineSource)("dom", fromDOM);

function fromHTML(schema, html, options) {
  var wrap = (options && options.document || window.document).createElement("div");
  wrap.innerHTML = html;
  return fromDOM(schema, wrap, options);
}

(0, _index.defineSource)("html", fromHTML);

var blockElements = {
  address: true, article: true, aside: true, blockquote: true, canvas: true,
  dd: true, div: true, dl: true, fieldset: true, figcaption: true, figure: true,
  footer: true, form: true, h1: true, h2: true, h3: true, h4: true, h5: true,
  h6: true, header: true, hgroup: true, hr: true, li: true, noscript: true, ol: true,
  output: true, p: true, pre: true, section: true, table: true, tfoot: true, ul: true
};

var noMarks = [];

var Context = (function () {
  function Context(schema, topNode) {
    _classCallCheck(this, Context);

    this.schema = schema;
    this.stack = [];
    this.marks = noMarks;
    this.closing = false;
    this.enter(topNode.type, topNode.attrs);
    this.nodeInfo = nodeInfo(schema);
  }

  _createClass(Context, [{
    key: "parseAttrs",
    value: function parseAttrs(dom, type, attrs) {
      for (var attr in type.attrs) {
        var desc = type.attrs[attr];
        if (desc.parseDOM && (!attrs || !Object.prototype.hasOwnProperty.call(attrs, attr))) {
          var value = desc.parseDOM(dom, this.options, desc, type);
          if (value != null) {
            if (!attrs) attrs = {};
            attrs[attr] = value;
          }
        }
      }
      return attrs;
    }
  }, {
    key: "addDOM",
    value: function addDOM(dom) {
      if (dom.nodeType == 3) {
        // FIXME define a coherent strategy for dealing with trailing, leading, and multiple spaces (this isn't one)
        var value = dom.nodeValue;
        var _top = this.top,
            last = undefined;
        if (/\S/.test(value) || _top.type.isTextblock) {
          value = value.replace(/\s+/g, " ");
          if (/^\s/.test(value) && (last = _top.content[_top.content.length - 1]) && last.type.name == "text" && /\s$/.test(last.text)) value = value.slice(1);
          if (value) this.insert(this.schema.text(value, this.marks));
        }
      } else if (dom.nodeType != 1 || dom.hasAttribute("pm-ignore")) {
        // Ignore non-text non-element nodes
      } else if (!this.parseNodeType(dom)) {
          this.addAll(dom.firstChild, null);
          var _name = dom.nodeName.toLowerCase();
          if (blockElements.hasOwnProperty(_name) && this.top.type == this.schema.defaultTextblockType()) this.closing = true;
        }
    }
  }, {
    key: "tryParsers",
    value: function tryParsers(parsers, dom) {
      if (parsers) for (var i = 0; i < parsers.length; i++) {
        var parser = parsers[i];
        if (parser.parse(dom, this, parser.type, null, this.options) !== false) return true;
      }
    }
  }, {
    key: "parseNodeType",
    value: function parseNodeType(dom) {
      return this.tryParsers(this.nodeInfo[dom.nodeName.toLowerCase()], dom) || this.tryParsers(this.nodeInfo._, dom);
    }
  }, {
    key: "addAll",
    value: function addAll(from, to, sync) {
      var stack = sync && this.stack.slice();
      for (var dom = from; dom != to; dom = dom.nextSibling) {
        this.addDOM(dom);
        if (sync && blockElements.hasOwnProperty(dom.nodeName.toLowerCase())) this.sync(stack);
      }
    }
  }, {
    key: "doClose",
    value: function doClose() {
      if (!this.closing || this.stack.length < 2) return;
      var left = this.leave();
      this.enter(left.type, left.attrs);
      this.closing = false;
    }
  }, {
    key: "insert",
    value: function insert(node) {
      if (this.top.type.canContain(node)) {
        this.doClose();
      } else {
        for (var i = this.stack.length - 1; i >= 0; i--) {
          var route = this.stack[i].type.findConnection(node.type);
          if (!route) continue;
          if (i == this.stack.length - 1) {
            this.doClose();
          } else {
            while (this.stack.length > i + 1) this.leave();
          }
          for (var j = 0; j < route.length; j++) {
            this.enter(route[j]);
          }if (this.marks.length) this.marks = noMarks;
          break;
        }
      }
      this.top.content.push(node);
      return node;
    }
  }, {
    key: "insertFrom",
    value: function insertFrom(dom, type, attrs, content, styles) {
      return this.insert(type.createAutoFill(this.parseAttrs(dom, type, attrs), content, styles));
    }
  }, {
    key: "enter",
    value: function enter(type, attrs) {
      if (this.marks.length) this.marks = noMarks;
      this.stack.push({ type: type, attrs: attrs, content: [] });
    }
  }, {
    key: "enterFrom",
    value: function enterFrom(dom, type, attrs) {
      this.enter(type, this.parseAttrs(dom, type, attrs));
    }
  }, {
    key: "leave",
    value: function leave() {
      var top = this.stack.pop();
      var node = top.type.createAutoFill(top.attrs, top.content);
      if (this.stack.length) this.insert(node);
      return node;
    }
  }, {
    key: "sync",
    value: function sync(stack) {
      while (this.stack.length > stack.length) this.leave();
      for (;;) {
        var n = this.stack.length - 1,
            one = this.stack[n],
            two = stack[n];
        if (one.type == two.type && _model.Node.sameAttrs(one.attrs, two.attrs)) break;
        this.leave();
      }
      while (stack.length > this.stack.length) {
        var add = stack[this.stack.length];
        this.enter(add.type, add.attrs);
      }
      if (this.marks.length) this.marks = noMarks;
      this.closing = false;
    }
  }, {
    key: "top",
    get: function get() {
      return this.stack[this.stack.length - 1];
    }
  }]);

  return Context;
})();

function nodeInfo(schema) {
  return schema.cached.parseDOMNodes || (schema.cached.parseDOMNodes = summarizeNodeInfo(schema));
}

function summarizeNodeInfo(schema) {
  var tags = Object.create(null);
  tags._ = [];
  function read(value) {
    var info = value.parseDOM;
    if (!info) return;
    info.forEach(function (info) {
      var tag = info.tag || "_";(tags[tag] || (tags[tag] = [])).push({
        type: value,
        rank: info.rank == null ? 50 : info.rank,
        parse: info.parse
      });
    });
  }

  for (var _name2 in schema.nodes) {
    read(schema.nodes[_name2]);
  }for (var _name3 in schema.marks) {
    read(schema.marks[_name3]);
  }for (var tag in tags) {
    tags[tag].sort(function (a, b) {
      return a.rank - b.rank;
    });
  }return tags;
}

function wrap(dom, context, type, attrs) {
  context.enterFrom(dom, type, attrs);
  context.addAll(dom.firstChild, null, true);
  context.leave();
}

_model.Paragraph.register("parseDOM", { tag: "p", parse: wrap });

_model.BlockQuote.register("parseDOM", { tag: "blockquote", parse: wrap });

var _loop = function (i) {
  _model.Heading.register("parseDOM", {
    tag: "h" + i,
    parse: function parse(dom, context, type) {
      return wrap(dom, context, type, { level: i });
    }
  });
};

for (var i = 1; i <= 6; i++) {
  _loop(i);
}_model.HorizontalRule.register("parseDOM", { tag: "hr", parse: wrap });

_model.CodeBlock.register("parseDOM", { tag: "pre", parse: function parse(dom, context, type) {
    var params = dom.firstChild && /^code$/i.test(dom.firstChild.nodeName) && dom.firstChild.getAttribute("class");
    if (params && /fence/.test(params)) {
      var found = [],
          re = /(?:^|\s)lang-(\S+)/g,
          m = undefined;
      while (m = re.test(params)) found.push(m[1]);
      params = found.join(" ");
    } else {
      params = null;
    }
    var text = dom.textContent;
    context.insertFrom(dom, type, { params: params }, text ? [context.schema.text(text)] : []);
  } });

_model.BulletList.register("parseDOM", { tag: "ul", parse: wrap });

_model.OrderedList.register("parseDOM", { tag: "ol", parse: function parse(dom, context, type) {
    var attrs = { order: dom.getAttribute("start") || 1 };
    wrap(dom, context, type, attrs);
  } });

_model.ListItem.register("parseDOM", { tag: "li", parse: wrap });

_model.HardBreak.register("parseDOM", { tag: "br", parse: function parse(dom, context, type) {
    context.insertFrom(dom, type, null, null, context.marks);
  } });

_model.Image.register("parseDOM", { tag: "img", parse: function parse(dom, context, type) {
    context.insertFrom(dom, type, {
      src: dom.getAttribute("src"),
      title: dom.getAttribute("title") || null,
      alt: dom.getAttribute("alt") || null
    });
  } });

// Inline style tokens

function inline(dom, context, style) {
  var old = context.marks;
  context.marks = (style.instance || style).addToSet(old);
  context.addAll(dom.firstChild, null);
  context.marks = old;
}

_model.LinkMark.register("parseDOM", { tag: "a", parse: function parse(dom, context, style) {
    var href = dom.getAttribute("href");
    if (!href) return false;
    inline(dom, context, style.create({ href: href, title: dom.getAttribute("title") }));
  } });

_model.EmMark.register("parseDOM", { tag: "i", parse: inline });
_model.EmMark.register("parseDOM", { tag: "em", parse: inline });

_model.StrongMark.register("parseDOM", { tag: "b", parse: inline });
_model.StrongMark.register("parseDOM", { tag: "strong", parse: inline });

_model.CodeMark.register("parseDOM", { tag: "code", parse: inline });
},{"../model":26,"./index":32}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertFrom = convertFrom;
exports.knownSource = knownSource;
exports.defineSource = defineSource;
var parsers = Object.create(null);

function convertFrom(schema, value, format, arg) {
  var converter = parsers[format];
  if (!converter) throw new Error("Source format " + format + " not defined");
  return converter(schema, value, arg);
}

function knownSource(format) {
  return !!parsers[format];
}

function defineSource(format, func) {
  parsers[format] = func;
}

defineSource("json", function (schema, json) {
  return schema.nodeFromJSON(json);
});
},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromText = fromText;

var _index = require("./index");

// FIXME is it meaningful to try and attach text-parsing information
// to node types?

function fromText(schema, text) {
  var blocks = text.trim().split(/\n{2,}/);
  var nodes = [];
  for (var i = 0; i < blocks.length; i++) {
    var spans = [];
    var parts = blocks[i].split("\n");
    for (var j = 0; j < parts.length; j++) {
      if (j) spans.push(schema.node("hard_break"));
      if (parts[j]) spans.push(schema.text(parts[j]));
    }
    nodes.push(schema.node("paragraph", null, spans));
  }
  if (!nodes.length) nodes.push(schema.node("paragraph"));
  return schema.node("doc", null, nodes);
}

(0, _index.defineSource)("text", fromText);
},{"./index":32}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.toDOM = toDOM;
exports.toHTML = toHTML;
exports.renderNodeToDOM = renderNodeToDOM;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _index = require("./index");

// declare_global: window

var DOMSerializer = (function () {
  function DOMSerializer(options) {
    _classCallCheck(this, DOMSerializer);

    this.options = options || {};
    this.doc = this.options.document || window.document;
  }

  _createClass(DOMSerializer, [{
    key: "elt",
    value: function elt(tag, attrs) {
      var result = this.doc.createElement(tag);
      if (attrs) for (var _name in attrs) {
        if (_name == "style") result.style.cssText = attrs[_name];else if (attrs[_name]) result.setAttribute(_name, attrs[_name]);
      }

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      for (var i = 0; i < args.length; i++) {
        result.appendChild(typeof args[i] == "string" ? this.doc.createTextNode(args[i]) : args[i]);
      }return result;
    }
  }, {
    key: "renderNode",
    value: function renderNode(node, offset) {
      var dom = node.type.serializeDOM(node, this);
      for (var attr in node.type.attrs) {
        var desc = node.type.attrs[attr];
        if (desc.serializeDOM) desc.serializeDOM(dom, node.attrs[attr], this, node);
      }
      if (this.options.onRender) dom = this.options.onRender(node, dom, offset) || dom;
      return dom;
    }
  }, {
    key: "renderContent",
    value: function renderContent(node, where) {
      if (!where) where = this.doc.createDocumentFragment();
      if (!node.isTextblock) this.renderBlocksInto(node, where);else if (this.options.renderInlineFlat) this.renderInlineFlatInto(node, where);else this.renderInlineInto(node, where);
      return where;
    }
  }, {
    key: "renderBlocksInto",
    value: function renderBlocksInto(parent, where) {
      for (var i = parent.iter(), child = undefined; child = i.next().value;) {
        if (this.options.path) this.options.path.push(i.offset - child.width);
        where.appendChild(this.renderNode(child, i.offset - child.width));
        if (this.options.path) this.options.path.pop();
      }
    }
  }, {
    key: "renderInlineInto",
    value: function renderInlineInto(parent, where) {
      var _this = this;

      var top = where;
      var active = [];
      parent.forEach(function (node, offset) {
        var keep = 0;
        for (; keep < Math.min(active.length, node.marks.length); ++keep) if (!node.marks[keep].eq(active[keep])) break;
        while (keep < active.length) {
          active.pop();
          top = top.parentNode;
        }
        while (active.length < node.marks.length) {
          var add = node.marks[active.length];
          active.push(add);
          top = top.appendChild(_this.renderMark(add));
        }
        top.appendChild(_this.renderNode(node, offset));
      });
    }
  }, {
    key: "renderInlineFlatInto",
    value: function renderInlineFlatInto(parent, where) {
      var _this2 = this;

      parent.forEach(function (node, start) {
        var dom = _this2.renderNode(node, start);
        dom = _this2.wrapInlineFlat(dom, node.marks);
        dom = _this2.options.renderInlineFlat(node, dom, start) || dom;
        where.appendChild(dom);
      });
    }
  }, {
    key: "renderMark",
    value: function renderMark(mark) {
      var dom = mark.type.serializeDOM(mark, this);
      for (var attr in mark.type.attrs) {
        var desc = mark.type.attrs[attr];
        if (desc.serializeDOM) desc.serializeDOM(dom, mark.attrs[attr], this);
      }
      return dom;
    }
  }, {
    key: "wrapInlineFlat",
    value: function wrapInlineFlat(dom, marks) {
      for (var i = marks.length - 1; i >= 0; i--) {
        var wrap = this.renderMark(marks[i]);
        wrap.appendChild(dom);
        dom = wrap;
      }
      return dom;
    }
  }, {
    key: "renderAs",
    value: function renderAs(node, tagName, tagAttrs) {
      return this.renderContent(node, this.elt(tagName, tagAttrs));
    }
  }]);

  return DOMSerializer;
})();

function toDOM(node) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new DOMSerializer(options).renderContent(node);
}

(0, _index.defineTarget)("dom", toDOM);

function toHTML(node, options) {
  var serializer = new DOMSerializer(options);
  var wrap = serializer.elt("div");
  wrap.appendChild(serializer.renderContent(node));
  return wrap.innerHTML;
}

(0, _index.defineTarget)("html", toHTML);

function renderNodeToDOM(node, options, offset) {
  var serializer = new DOMSerializer(options);
  var dom = serializer.renderNode(node, offset);
  if (node.isInline) {
    dom = serializer.wrapInlineFlat(dom, node.marks);
    if (serializer.options.renderInlineFlat) dom = options.renderInlineFlat(node, dom, offset) || dom;
  }
  return dom;
}

// Block nodes

function def(cls, method) {
  cls.prototype.serializeDOM = method;
}

def(_model.BlockQuote, function (node, s) {
  return s.renderAs(node, "blockquote");
});

_model.BlockQuote.prototype.clicked = function (_, path, dom, coords) {
  var childBox = dom.firstChild.getBoundingClientRect();
  if (coords.left < childBox.left - 2) return _model.Pos.from(path);
};

def(_model.BulletList, function (node, s) {
  return s.renderAs(node, "ul");
});

def(_model.OrderedList, function (node, s) {
  return s.renderAs(node, "ol", { start: node.attrs.order != "1" && node.attrs.order });
});

_model.OrderedList.prototype.clicked = _model.BulletList.prototype.clicked = function (_, path, dom, coords) {
  for (var i = 0; i < dom.childNodes.length; i++) {
    var child = dom.childNodes[i];
    if (!child.hasAttribute("pm-offset")) continue;
    var childBox = child.getBoundingClientRect();
    if (coords.left > childBox.left - 2) return null;
    if (childBox.top <= coords.top && childBox.bottom >= coords.top) return new _model.Pos(path, i);
  }
};

def(_model.ListItem, function (node, s) {
  return s.renderAs(node, "li");
});

def(_model.HorizontalRule, function (_, s) {
  return s.elt("hr");
});

def(_model.Paragraph, function (node, s) {
  return s.renderAs(node, "p");
});

def(_model.Heading, function (node, s) {
  return s.renderAs(node, "h" + node.attrs.level);
});

def(_model.CodeBlock, function (node, s) {
  var code = s.renderAs(node, "code");
  if (node.attrs.params != null) code.className = "fence " + node.attrs.params.replace(/(^|\s+)/g, "$&lang-");
  return s.elt("pre", null, code);
});

// Inline content

def(_model.Text, function (node, s) {
  return s.doc.createTextNode(node.text);
});

def(_model.Image, function (node, s) {
  return s.elt("img", {
    src: node.attrs.src,
    alt: node.attrs.alt,
    title: node.attrs.title
  });
});

def(_model.HardBreak, function (_, s) {
  return s.elt("br");
});

// Inline styles

def(_model.EmMark, function (_, s) {
  return s.elt("em");
});

def(_model.StrongMark, function (_, s) {
  return s.elt("strong");
});

def(_model.CodeMark, function (_, s) {
  return s.elt("code");
});

def(_model.LinkMark, function (mark, s) {
  return s.elt("a", { href: mark.attrs.href,
    title: mark.attrs.title });
});
},{"../model":26,"./index":35}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertTo = convertTo;
exports.knownTarget = knownTarget;
exports.defineTarget = defineTarget;
var serializers = Object.create(null);

function convertTo(doc, format, arg) {
  var converter = serializers[format];
  if (!converter) throw new Error("Target format " + format + " not defined");
  return converter(doc, arg);
}

function knownTarget(format) {
  return !!serializers[format];
}

function defineTarget(format, func) {
  serializers[format] = func;
}

defineTarget("json", function (doc) {
  return doc.toJSON();
});
},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toText = toText;

var _model = require("../model");

var _index = require("./index");

_model.Block.prototype.serializeText = function (node) {
  var accum = "";
  node.forEach(function (child) {
    return accum += child.type.serializeText(child);
  });
  return accum;
};

_model.Textblock.prototype.serializeText = function (node) {
  var text = _model.Block.prototype.serializeText(node);
  return text && text + "\n\n";
};

_model.Inline.prototype.serializeText = function () {
  return "";
};

_model.HardBreak.prototype.serializeText = function () {
  return "\n";
};

_model.Text.prototype.serializeText = function (node) {
  return node.text;
};

function toText(doc) {
  return doc.type.serializeText(doc).trim();
}

(0, _index.defineTarget)("text", toText);
},{"../model":26,"./index":35}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canLift = canLift;
exports.canWrap = canWrap;
exports.alreadyHasBlockType = alreadyHasBlockType;

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _tree = require("./tree");

var _map = require("./map");

(0, _step.defineStep)("ancestor", {
  apply: function apply(doc, step) {
    var from = step.from,
        to = step.to;
    if (!(0, _tree.isFlatRange)(from, to)) return null;
    var toParent = from.path,
        start = from.offset,
        end = to.offset;
    var _step$param = step.param;
    var _step$param$depth = _step$param.depth;
    var depth = _step$param$depth === undefined ? 0 : _step$param$depth;
    var _step$param$types = _step$param.types;
    var types = _step$param$types === undefined ? [] : _step$param$types;
    var _step$param$attrs = _step$param.attrs;
    var attrs = _step$param$attrs === undefined ? [] : _step$param$attrs;

    var inner = doc.path(from.path);
    for (var i = 0; i < depth; i++) {
      if (start > 0 || end < doc.path(toParent).size || toParent.length == 0) return null;
      start = toParent[toParent.length - 1];
      end = start + 1;
      toParent = toParent.slice(0, toParent.length - 1);
    }
    if (depth == 0 && types.length == 0) return null;

    var parent = doc.path(toParent),
        parentSize = parent.size,
        newParent = undefined;
    if (parent.type.locked) return null;
    if (types.length) {
      var _ret = (function () {
        var lastWrapper = types[types.length - 1];
        var content = inner.content.slice(from.offset, to.offset);
        if (!parent.type.canContainType(types[0]) || content.some(function (n) {
          return !lastWrapper.canContain(n);
        }) || !inner.size && !lastWrapper.canBeEmpty || lastWrapper.locked) return {
            v: null
          };
        var node = null;
        for (var i = types.length - 1; i >= 0; i--) {
          node = types[i].create(attrs[i], node || content);
        }newParent = parent.splice(start, end, _model.Fragment.from(node));
      })();

      if (typeof _ret === "object") return _ret.v;
    } else {
      if (!parent.type.canContainFragment(inner.content) || !inner.size && start == 0 && end == parent.size && !parent.type.canBeEmpty) return null;
      newParent = parent.splice(start, end, inner.content);
    }
    var copy = doc.replaceDeep(toParent, newParent);

    var toInner = toParent.slice();
    for (var i = 0; i < types.length; i++) {
      toInner.push(i ? 0 : start);
    }var startOfInner = new _model.Pos(toInner, types.length ? 0 : start);
    var replaced = null;
    var insertedSize = types.length ? 1 : to.offset - from.offset;
    if (depth != types.length || depth > 1 || types.length > 1) {
      var posBefore = new _model.Pos(toParent, start);
      var posAfter1 = new _model.Pos(toParent, end),
          posAfter2 = new _model.Pos(toParent, start + insertedSize);
      var endOfInner = new _model.Pos(toInner, startOfInner.offset + (to.offset - from.offset));
      replaced = [new _map.ReplacedRange(posBefore, from, posBefore, startOfInner), new _map.ReplacedRange(to, posAfter1, endOfInner, posAfter2, posAfter1, posAfter2)];
    }
    var moved = [new _map.MovedRange(from, to.offset - from.offset, startOfInner)];
    if (end - start != insertedSize) moved.push(new _map.MovedRange(new _model.Pos(toParent, end), parentSize - end, new _model.Pos(toParent, start + insertedSize)));
    return new _transform.TransformResult(copy, new _map.PosMap(moved, replaced));
  },
  invert: function invert(step, oldDoc, map) {
    var types = [],
        attrs = [];
    if (step.param.depth) for (var i = 0; i < step.param.depth; i++) {
      var _parent = oldDoc.path(step.from.path.slice(0, step.from.path.length - i));
      types.unshift(_parent.type);
      attrs.unshift(_parent.attrs);
    }
    var newFrom = map.map(step.from).pos;
    var newTo = step.from.cmp(step.to) ? map.map(step.to, -1).pos : newFrom;
    return new _step.Step("ancestor", newFrom, newTo, null, { depth: step.param.types ? step.param.types.length : 0,
      types: types, attrs: attrs });
  },
  paramToJSON: function paramToJSON(param) {
    return { depth: param.depth,
      types: param.types && param.types.map(function (t) {
        return t.name;
      }),
      attrs: param.attrs };
  },
  paramFromJSON: function paramFromJSON(schema, json) {
    return { depth: json.depth,
      types: json.types && json.types.map(function (n) {
        return schema.nodeType(n);
      }),
      attrs: json.attrs };
  }
});

function canBeLifted(doc, range) {
  var content = [doc.path(range.from.path)],
      unwrap = false;
  for (;;) {
    var parentDepth = -1;

    var _loop = function (_node, i) {
      if (!content.some(function (inner) {
        return !_node.type.canContainContent(inner.type);
      })) parentDepth = i;
      _node = _node.child(range.from.path[i]);
      node = _node;
    };

    for (var node = doc, i = 0; i < range.from.path.length; i++) {
      _loop(node, i);
    }
    if (parentDepth > -1) return { path: range.from.path.slice(0, parentDepth), unwrap: unwrap };
    if (unwrap || !content[0].isBlock) return null;
    content = content[0].content.slice(range.from.offset, range.to.offset);
    unwrap = true;
  }
}

function canLift(doc, from, to) {
  var range = (0, _model.siblingRange)(doc, from, to || from);
  var found = canBeLifted(doc, range);
  if (found) return { found: found, range: range };
}

_transform.Transform.prototype.lift = function (from) {
  var to = arguments.length <= 1 || arguments[1] === undefined ? from : arguments[1];
  return (function () {
    var can = canLift(this.doc, from, to);
    if (!can) return this;
    var found = can.found;
    var range = can.range;

    var depth = range.from.path.length - found.path.length;
    var rangeNode = found.unwrap && this.doc.path(range.from.path);

    for (var d = 0, pos = range.to;; d++) {
      if (pos.offset < this.doc.path(pos.path).size) {
        this.split(pos, depth);
        break;
      }
      if (d == depth - 1) break;
      pos = pos.shorten(null, 1);
    }
    for (var d = 0, pos = range.from;; d++) {
      if (pos.offset > 0) {
        this.split(pos, depth - d);
        var cut = range.from.path.length - depth,
            path = pos.path.slice(0, cut).concat(pos.path[cut] + 1);
        while (path.length < range.from.path.length) path.push(0);
        range = { from: new _model.Pos(path, 0), to: new _model.Pos(path, range.to.offset - range.from.offset) };
        break;
      }
      if (d == depth - 1) break;
      pos = pos.shorten();
    }
    if (found.unwrap) {
      for (var i = range.to.offset - 1; i > range.from.offset; i--) {
        this.join(new _model.Pos(range.from.path, i));
      }var size = 0;
      for (var i = rangeNode.iter(range.from.offset, range.to.offset), child = undefined; child = i.next().value;) {
        size += child.size;
      }var path = range.from.path.concat(range.from.offset);
      range = { from: new _model.Pos(path, 0), to: new _model.Pos(path, size) };
      ++depth;
    }
    this.step("ancestor", range.from, range.to, null, { depth: depth });
    return this;
  }).apply(this, arguments);
};

function canWrap(doc, from, to, type) {
  var range = (0, _model.siblingRange)(doc, from, to || from);
  if (range.from.offset == range.to.offset) return null;
  var parent = doc.path(range.from.path);
  var around = parent.type.findConnection(type);
  var inside = type.findConnection(parent.child(range.from.offset).type);
  if (around && inside) return { range: range, around: around, inside: inside };
}

_transform.Transform.prototype.wrap = function (from, to, type, wrapAttrs) {
  var can = canWrap(this.doc, from, to, type);
  if (!can) return this;
  var range = can.range;
  var around = can.around;
  var inside = can.inside;

  var types = around.concat(type).concat(inside);
  var attrs = around.map(function () {
    return null;
  }).concat(wrapAttrs).concat(inside.map(function () {
    return null;
  }));
  this.step("ancestor", range.from, range.to, null, { types: types, attrs: attrs });
  if (inside.length) {
    var toInner = range.from.path.slice();
    for (var i = 0; i < around.length + inside.length + 1; i++) {
      toInner.push(i ? 0 : range.from.offset);
    }for (var i = range.to.offset - 1 - range.from.offset; i > 0; i--) {
      this.split(new _model.Pos(toInner, i), inside.length);
    }
  }
  return this;
};

function alreadyHasBlockType(doc, from, to, type, attrs) {
  var found = false;
  if (!attrs) attrs = {};
  doc.nodesBetween(from, to || from, function (node) {
    if (node.isTextblock) {
      if (node.hasMarkup(type, attrs)) found = true;
      return false;
    }
  });
  return found;
}

_transform.Transform.prototype.setBlockType = function (from, to, type, attrs) {
  var _this = this;

  this.doc.nodesBetween(from, to || from, function (node, path) {
    if (node.isTextblock && !node.hasMarkup(type, attrs)) {
      path = path.slice();
      // Ensure all markup that isn't allowed in the new node type is cleared
      _this.clearMarkup(new _model.Pos(path, 0), new _model.Pos(path, node.size), type);
      _this.step("ancestor", new _model.Pos(path, 0), new _model.Pos(path, _this.doc.path(path).size), null, { depth: 1, types: [type], attrs: [attrs] });
      return false;
    }
  });
  return this;
};

_transform.Transform.prototype.setNodeType = function (pos, type, attrs) {
  var node = this.doc.nodeAfter(pos);
  var path = pos.toPath();
  this.step("ancestor", new _model.Pos(path, 0), new _model.Pos(path, node.size), null, { depth: 1, types: [type], attrs: [attrs] });
  return this;
};
},{"../model":26,"./map":40,"./step":44,"./transform":45,"./tree":46}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./mark");

require("./split");

require("./replace");

var _transform = require("./transform");

Object.defineProperty(exports, "TransformResult", {
  enumerable: true,
  get: function get() {
    return _transform.TransformResult;
  }
});
Object.defineProperty(exports, "Transform", {
  enumerable: true,
  get: function get() {
    return _transform.Transform;
  }
});

var _step = require("./step");

Object.defineProperty(exports, "Step", {
  enumerable: true,
  get: function get() {
    return _step.Step;
  }
});

var _ancestor = require("./ancestor");

Object.defineProperty(exports, "canLift", {
  enumerable: true,
  get: function get() {
    return _ancestor.canLift;
  }
});
Object.defineProperty(exports, "canWrap", {
  enumerable: true,
  get: function get() {
    return _ancestor.canWrap;
  }
});
Object.defineProperty(exports, "alreadyHasBlockType", {
  enumerable: true,
  get: function get() {
    return _ancestor.alreadyHasBlockType;
  }
});

var _join = require("./join");

Object.defineProperty(exports, "joinPoint", {
  enumerable: true,
  get: function get() {
    return _join.joinPoint;
  }
});
Object.defineProperty(exports, "joinableBlocks", {
  enumerable: true,
  get: function get() {
    return _join.joinableBlocks;
  }
});

var _map = require("./map");

Object.defineProperty(exports, "PosMap", {
  enumerable: true,
  get: function get() {
    return _map.PosMap;
  }
});
Object.defineProperty(exports, "MapResult", {
  enumerable: true,
  get: function get() {
    return _map.MapResult;
  }
});
Object.defineProperty(exports, "mapStep", {
  enumerable: true,
  get: function get() {
    return _map.mapStep;
  }
});
Object.defineProperty(exports, "Remapping", {
  enumerable: true,
  get: function get() {
    return _map.Remapping;
  }
});
},{"./ancestor":37,"./join":39,"./map":40,"./mark":41,"./replace":42,"./split":43,"./step":44,"./transform":45}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinableBlocks = joinableBlocks;
exports.joinPoint = joinPoint;

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _map = require("./map");

(0, _step.defineStep)("join", {
  apply: function apply(doc, step) {
    var before = doc.path(step.from.path);
    var after = doc.path(step.to.path);
    if (step.from.offset < before.size || step.to.offset > 0 || !before.type.canContainFragment(after.content)) return null;
    var pFrom = step.from.path,
        pTo = step.to.path;
    var last = pFrom.length - 1,
        offset = pFrom[last] + 1;
    if (pFrom.length != pTo.length || pFrom.length == 0 || offset != pTo[last]) return null;
    for (var i = 0; i < last; i++) {
      if (pFrom[i] != pTo[i]) return null;
    }var targetPath = pFrom.slice(0, last);
    var target = doc.path(targetPath),
        oldSize = target.size;
    if (target.type.locked) return null;
    var joined = before.append(after.content);
    var copy = doc.replaceDeep(targetPath, target.splice(offset - 1, offset + 1, _model.Fragment.from(joined)));

    var map = new _map.PosMap([new _map.MovedRange(step.to, after.size, step.from), new _map.MovedRange(new _model.Pos(targetPath, offset + 1), oldSize - offset - 1, new _model.Pos(targetPath, offset))], [new _map.ReplacedRange(step.from, step.to, step.from, step.from, step.to.shorten())]);
    return new _transform.TransformResult(copy, map);
  },
  invert: function invert(step, oldDoc) {
    return new _step.Step("split", null, null, step.from, oldDoc.path(step.to.path).copy());
  }
});

function joinableBlocks(doc, pos) {
  if (pos.offset == 0) return false;
  var parent = doc.path(pos.path);
  if (parent.isTextblock || pos.offset == parent.size) return false;
  var type = parent.child(pos.offset - 1).type;
  return !type.isTextblock && type.contains && type == parent.child(pos.offset).type;
}

function joinPoint(doc, pos) {
  var dir = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];

  for (;;) {
    if (joinableBlocks(doc, pos)) return pos;
    if (pos.depth == 0) return null;
    pos = pos.shorten(null, dir < 0 ? 0 : 1);
  }
}

_transform.Transform.prototype.join = function (at) {
  var parent = this.doc.path(at.path);
  if (at.offset == 0 || at.offset == parent.size || parent.isTextblock) return this;
  this.step("join", new _model.Pos(at.path.concat(at.offset - 1), parent.child(at.offset - 1).size), new _model.Pos(at.path.concat(at.offset), 0));
  return this;
};
},{"../model":26,"./map":40,"./step":44,"./transform":45}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.mapStep = mapStep;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _step = require("./step");

var MovedRange = (function () {
  function MovedRange(start, size) {
    var dest = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, MovedRange);

    this.start = start;
    this.size = size;
    this.dest = dest;
  }

  _createClass(MovedRange, [{
    key: "toString",
    value: function toString() {
      return "[moved " + this.start + "+" + this.size + " to " + this.dest + "]";
    }
  }, {
    key: "end",
    get: function get() {
      return new _model.Pos(this.start.path, this.start.offset + this.size);
    }
  }]);

  return MovedRange;
})();

exports.MovedRange = MovedRange;

var Side = function Side(from, to, ref) {
  _classCallCheck(this, Side);

  this.from = from;
  this.to = to;
  this.ref = ref;
};

var ReplacedRange = (function () {
  function ReplacedRange(from, to, newFrom, newTo) {
    var ref = arguments.length <= 4 || arguments[4] === undefined ? from : arguments[4];
    var newRef = arguments.length <= 5 || arguments[5] === undefined ? newFrom : arguments[5];
    return (function () {
      _classCallCheck(this, ReplacedRange);

      this.before = new Side(from, to, ref);
      this.after = new Side(newFrom, newTo, newRef);
    }).apply(this, arguments);
  }

  _createClass(ReplacedRange, [{
    key: "toString",
    value: function toString() {
      return "[replaced " + this.before.from + "-" + this.before.to + " with " + this.after.from + "-" + this.after.to + "]";
    }
  }]);

  return ReplacedRange;
})();

exports.ReplacedRange = ReplacedRange;

var empty = [];

var MapResult = function MapResult(pos) {
  var deleted = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  var recover = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  _classCallCheck(this, MapResult);

  this.pos = pos;
  this.deleted = deleted;
  this.recover = recover;
};

exports.MapResult = MapResult;

function offsetFrom(base, pos) {
  if (pos.path.length > base.path.length) {
    var path = [pos.path[base.path.length] - base.offset];
    for (var i = base.path.length + 1; i < pos.path.length; i++) {
      path.push(pos.path[i]);
    }return new _model.Pos(path, pos.offset);
  } else {
    return new _model.Pos([], pos.offset - base.offset);
  }
}

function mapThrough(map, pos, bias, back) {
  if (bias === undefined) bias = 1;

  for (var i = 0; i < map.replaced.length; i++) {
    var range = map.replaced[i],
        side = back ? range.after : range.before;
    var left = undefined,
        right = undefined;
    if ((left = pos.cmp(side.from)) >= 0 && (right = pos.cmp(side.to)) <= 0) {
      var other = back ? range.before : range.after;
      return new MapResult(bias < 0 ? other.from : other.to, !!(left && right), { rangeID: i, offset: offsetFrom(side.ref, pos) });
    }
  }

  for (var i = 0; i < map.moved.length; i++) {
    var range = map.moved[i];
    var start = back ? range.dest : range.start;
    if (pos.cmp(start) >= 0 && _model.Pos.cmp(pos.path, pos.offset, start.path, start.offset + range.size) <= 0) {
      var dest = back ? range.start : range.dest;
      var depth = start.depth;
      if (pos.depth > depth) {
        var offset = dest.offset + (pos.path[depth] - start.offset);
        return new MapResult(new _model.Pos(dest.path.concat(offset).concat(pos.path.slice(depth + 1)), pos.offset));
      } else {
        return new MapResult(new _model.Pos(dest.path, dest.offset + (pos.offset - start.offset)));
      }
    }
  }

  return new MapResult(pos);
}

var PosMap = (function () {
  function PosMap(moved, replaced) {
    _classCallCheck(this, PosMap);

    this.moved = moved || empty;
    this.replaced = replaced || empty;
  }

  _createClass(PosMap, [{
    key: "recover",
    value: function recover(offset) {
      return this.replaced[offset.rangeID].after.ref.extend(offset.offset);
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      return mapThrough(this, pos, bias, false);
    }
  }, {
    key: "invert",
    value: function invert() {
      return new InvertedPosMap(this);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.moved.concat(this.replaced).join(" ");
    }
  }]);

  return PosMap;
})();

exports.PosMap = PosMap;

var InvertedPosMap = (function () {
  function InvertedPosMap(map) {
    _classCallCheck(this, InvertedPosMap);

    this.inner = map;
  }

  _createClass(InvertedPosMap, [{
    key: "recover",
    value: function recover(offset) {
      return this.inner.replaced[offset.rangeID].before.ref.extend(offset.offset);
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      return mapThrough(this.inner, pos, bias, true);
    }
  }, {
    key: "invert",
    value: function invert() {
      return this.inner;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "-" + this.inner;
    }
  }]);

  return InvertedPosMap;
})();

var nullMap = new PosMap();

exports.nullMap = nullMap;

var Remapping = (function () {
  function Remapping() {
    var head = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var tail = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var mirror = arguments.length <= 2 || arguments[2] === undefined ? Object.create(null) : arguments[2];

    _classCallCheck(this, Remapping);

    this.head = head;
    this.tail = tail;
    this.mirror = mirror;
  }

  _createClass(Remapping, [{
    key: "addToFront",
    value: function addToFront(map, corr) {
      this.head.push(map);
      var id = -this.head.length;
      if (corr != null) this.mirror[id] = corr;
      return id;
    }
  }, {
    key: "addToBack",
    value: function addToBack(map, corr) {
      this.tail.push(map);
      var id = this.tail.length - 1;
      if (corr != null) this.mirror[corr] = id;
      return id;
    }
  }, {
    key: "get",
    value: function get(id) {
      return id < 0 ? this.head[-id - 1] : this.tail[id];
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      var deleted = false;

      for (var i = -this.head.length; i < this.tail.length; i++) {
        var map = this.get(i);
        var result = map.map(pos, bias);
        if (result.recover) {
          var corr = this.mirror[i];
          if (corr != null) {
            i = corr;
            pos = this.get(corr).recover(result.recover);
            continue;
          }
        }
        if (result.deleted) deleted = true;
        pos = result.pos;
      }

      return new MapResult(pos, deleted);
    }
  }]);

  return Remapping;
})();

exports.Remapping = Remapping;

function maxPos(a, b) {
  return a.cmp(b) > 0 ? a : b;
}

function mapStep(step, remapping) {
  var allDeleted = true;
  var from = null,
      to = null,
      pos = null;

  if (step.from) {
    var result = remapping.map(step.from, 1);
    from = result.pos;
    if (!result.deleted) allDeleted = false;
  }
  if (step.to) {
    if (step.to.cmp(step.from) == 0) {
      to = from;
    } else {
      var result = remapping.map(step.to, -1);
      to = maxPos(result.pos, from);
      if (!result.deleted) allDeleted = false;
    }
  }
  if (step.pos) {
    if (from && step.pos.cmp(step.from) == 0) {
      pos = from;
    } else if (to && step.pos.cmp(step.to) == 0) {
      pos = to;
    } else {
      var result = remapping.map(step.pos, 1);
      pos = result.pos;
      if (!result.deleted) allDeleted = false;
    }
  }
  if (!allDeleted) return new _step.Step(step.name, from, to, pos, step.param);
}
},{"../model":26,"./step":44}],41:[function(require,module,exports){
"use strict";

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _tree = require("./tree");

(0, _step.defineStep)("addMark", {
  apply: function apply(doc, step) {
    return new _transform.TransformResult((0, _tree.copyStructure)(doc, step.from, step.to, function (node, from, to) {
      if (!node.type.canContainMark(step.param)) return node;
      return (0, _tree.copyInline)(node, from, to, function (node) {
        return node.mark(step.param.addToSet(node.marks));
      });
    }));
  },
  invert: function invert(step, _oldDoc, map) {
    return new _step.Step("removeMark", step.from, map.map(step.to).pos, null, step.param);
  },
  paramToJSON: function paramToJSON(param) {
    return param.toJSON();
  },
  paramFromJSON: function paramFromJSON(schema, json) {
    return schema.markFromJSON(json);
  }
});

_transform.Transform.prototype.addMark = function (from, to, st) {
  var _this = this;

  var removed = [],
      added = [],
      removing = null,
      adding = null;
  this.doc.inlineNodesBetween(from, to, function (_ref, path, start, end, parent) {
    var marks = _ref.marks;

    if (st.isInSet(marks) || !parent.type.canContainMark(st.type)) {
      adding = removing = null;
    } else {
      var rm = st.type.isInSet(marks);
      if (rm) {
        if (removing && removing.param.eq(rm)) {
          removing.to = new _model.Pos(path, end);
        } else {
          removing = new _step.Step("removeMark", new _model.Pos(path, start), new _model.Pos(path, end), null, rm);
          removed.push(removing);
        }
      } else if (removing) {
        removing = null;
      }
      if (adding) {
        adding.to = new _model.Pos(path, end);
      } else {
        adding = new _step.Step("addMark", new _model.Pos(path, start), new _model.Pos(path, end), null, st);
        added.push(adding);
      }
    }
  });
  removed.forEach(function (s) {
    return _this.step(s);
  });
  added.forEach(function (s) {
    return _this.step(s);
  });
  return this;
};

(0, _step.defineStep)("removeMark", {
  apply: function apply(doc, step) {
    return new _transform.TransformResult((0, _tree.copyStructure)(doc, step.from, step.to, function (node, from, to) {
      return (0, _tree.copyInline)(node, from, to, function (node) {
        return node.mark(step.param.removeFromSet(node.marks));
      });
    }));
  },
  invert: function invert(step, _oldDoc, map) {
    return new _step.Step("addMark", step.from, map.map(step.to).pos, null, step.param);
  },
  paramToJSON: function paramToJSON(param) {
    return param.toJSON();
  },
  paramFromJSON: function paramFromJSON(schema, json) {
    return schema.markFromJSON(json);
  }
});

_transform.Transform.prototype.removeMark = function (from, to) {
  var _this2 = this;

  var st = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var matched = [],
      step = 0;
  this.doc.inlineNodesBetween(from, to, function (_ref2, path, start, end) {
    var marks = _ref2.marks;

    step++;
    var toRemove = null;
    if (st instanceof _model.MarkType) {
      var found = st.isInSet(marks);
      if (found) toRemove = [found];
    } else if (st) {
      if (st.isInSet(marks)) toRemove = [st];
    } else {
      toRemove = marks;
    }
    if (toRemove && toRemove.length) {
      path = path.slice();
      for (var i = 0; i < toRemove.length; i++) {
        var rm = toRemove[i],
            found = undefined;
        for (var j = 0; j < matched.length; j++) {
          var m = matched[j];
          if (m.step == step - 1 && rm.eq(matched[j].style)) found = m;
        }
        if (found) {
          found.to = new _model.Pos(path, end);
          found.step = step;
        } else {
          matched.push({ style: rm, from: new _model.Pos(path, start), to: new _model.Pos(path, end), step: step });
        }
      }
    }
  });
  matched.forEach(function (m) {
    return _this2.step("removeMark", m.from, m.to, null, m.style);
  });
  return this;
};

_transform.Transform.prototype.clearMarkup = function (from, to, newParent) {
  var _this3 = this;

  var delSteps = []; // Must be accumulated and applied in inverse order
  this.doc.inlineNodesBetween(from, to, function (_ref3, path, start, end) {
    var marks = _ref3.marks;
    var type = _ref3.type;

    if (newParent ? !newParent.canContainType(type) : !type.isText) {
      path = path.slice();
      var _from = new _model.Pos(path, start);
      delSteps.push(new _step.Step("replace", _from, new _model.Pos(path, end), _from));
      return;
    }
    for (var i = 0; i < marks.length; i++) {
      var mark = marks[i];
      if (!newParent || !newParent.canContainMark(mark.type)) {
        path = path.slice();
        _this3.step("removeMark", new _model.Pos(path, start), new _model.Pos(path, end), null, mark);
      }
    }
  });
  for (var i = delSteps.length - 1; i >= 0; i--) {
    this.step(delSteps[i]);
  }return this;
};
},{"../model":26,"./step":44,"./transform":45,"./tree":46}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replace = replace;

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _map = require("./map");

var _tree = require("./tree");

function findMovedChunks(oldNode, oldPath, newNode, startDepth) {
  var moved = [];
  var newPath = oldPath.path.slice(0, startDepth);

  for (var depth = startDepth;; depth++) {
    var joined = depth == oldPath.depth ? 0 : 1;
    var cut = depth == oldPath.depth ? oldPath.offset : oldPath.path[depth];
    var afterCut = oldNode.size - cut;
    var newOffset = newNode.size - afterCut;

    var from = oldPath.shorten(depth, joined);
    var to = new _model.Pos(newPath, newOffset + joined);
    if (from.cmp(to)) moved.push(new _map.MovedRange(from, afterCut - joined, to));

    if (!joined) return moved;

    oldNode = oldNode.child(cut);
    newNode = newNode.child(newOffset);
    newPath = newPath.concat(newOffset);
  }
}

function replace(node, from, to, root, repl) {
  var depth = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

  if (depth == root.length) {
    var before = node.sliceBetween(null, from, depth);
    var after = node.sliceBetween(to, null, depth),
        result = undefined;
    if (!before.type.canContainFragment(repl.content)) return null;
    if (repl.content.size) result = before.append(repl.content, from.depth - depth, repl.openLeft).append(after.content, repl.openRight, to.depth - depth);else result = before.append(after.content, from.depth - depth, to.depth - depth);
    if (!result.size && !result.type.canBeEmpty) result = result.copy(result.type.defaultContent());
    return { doc: result, moved: findMovedChunks(node, to, result, depth) };
  } else {
    var pos = root[depth];
    var result = replace(node.child(pos), from, to, root, repl, depth + 1);
    if (!result) return null;
    return { doc: node.replace(pos, result.doc), moved: result.moved };
  }
}

var nullRepl = { content: _model.emptyFragment, openLeft: 0, openRight: 0 };

(0, _step.defineStep)("replace", {
  apply: function apply(doc, step) {
    var rootPos = step.pos,
        root = rootPos.path;
    if (step.from.depth < root.length || step.to.depth < root.length) return null;
    for (var i = 0; i < root.length; i++) {
      if (step.from.path[i] != root[i] || step.to.path[i] != root[i]) return null;
    }var result = replace(doc, step.from, step.to, rootPos.path, step.param || nullRepl);
    if (!result) return null;
    var out = result.doc;
    var moved = result.moved;

    var end = moved.length ? moved[moved.length - 1].dest : step.to;
    var replaced = new _map.ReplacedRange(step.from, step.to, step.from, end, rootPos, rootPos);
    return new _transform.TransformResult(out, new _map.PosMap(moved, [replaced]));
  },
  invert: function invert(step, oldDoc, map) {
    var depth = step.pos.depth;
    return new _step.Step("replace", step.from, map.map(step.to).pos, step.from.shorten(depth), {
      content: oldDoc.path(step.pos.path).content.sliceBetween(step.from, step.to, depth),
      openLeft: step.from.depth - depth,
      openRight: step.to.depth - depth
    });
  },
  paramToJSON: function paramToJSON(param) {
    return param && { content: param.content.size && param.content.toJSON(),
      openLeft: param.openLeft, openRight: param.openRight };
  },
  paramFromJSON: function paramFromJSON(schema, json) {
    return json && { content: _model.Fragment.fromJSON(schema, json.content),
      openLeft: json.openLeft, openRight: json.openRight };
  }
});

function shiftFromStack(stack, depth) {
  var shifted = stack[depth] = stack[depth].splice(0, 1, _model.emptyFragment);
  for (var i = depth - 1; i >= 0; i--) {
    shifted = stack[i] = stack[i].replace(0, shifted);
  }
}

// FIXME find a not so horribly confusing way to express this
function buildInserted(nodesLeft, source, start, end) {
  var sliced = source.sliceBetween(start, end);
  var nodesRight = [];
  for (var node = sliced, i = 0; i <= start.path.length; i++, node = node.firstChild) {
    nodesRight.push(node);
  }var same = (0, _tree.samePathDepth)(start, end);
  var searchLeft = nodesLeft.length - 1,
      searchRight = nodesRight.length - 1;
  var result = null;

  var inner = nodesRight[searchRight];
  if (inner.isTextblock && inner.size && nodesLeft[searchLeft].isTextblock) {
    result = nodesLeft[searchLeft--].copy(inner.content);
    --searchRight;
    shiftFromStack(nodesRight, searchRight);
  }

  for (;;) {
    var node = nodesRight[searchRight],
        type = node.type,
        matched = null;
    var outside = searchRight <= same;
    for (var i = searchLeft; i >= 0; i--) {
      var left = nodesLeft[i];
      if (outside ? left.type.canContainContent(node.type) : left.type == type) {
        matched = i;
        break;
      }
    }
    if (matched != null) {
      if (!result) {
        result = nodesLeft[matched].copy(node.content);
        searchLeft = matched - 1;
      } else {
        while (searchLeft >= matched) {
          var wrap = nodesLeft[searchLeft];
          var content = _model.Fragment.from(result);
          result = wrap.copy(searchLeft == matched ? content.append(node.content) : content);
          searchLeft--;
        }
      }
    }
    if (matched != null || node.size == 0) {
      if (outside) break;
      if (searchRight) shiftFromStack(nodesRight, searchRight - 1);
    }
    searchRight--;
  }

  var repl = { content: result ? result.content : _model.emptyFragment,
    openLeft: start.depth - searchRight,
    openRight: end.depth - searchRight };
  return { repl: repl, depth: searchLeft + 1 };
}

function moveText(tr, doc, before, after) {
  var root = (0, _tree.samePathDepth)(before, after);
  var cutAt = after.shorten(null, 1);
  while (cutAt.path.length > root && doc.path(cutAt.path).size == 1) cutAt = cutAt.shorten(null, 1);
  tr.split(cutAt, cutAt.path.length - root);
  var start = after,
      end = new _model.Pos(start.path, doc.path(start.path).size);
  var parent = doc.path(start.path.slice(0, root));
  var wanted = parent.pathNodes(before.path.slice(root));
  var existing = parent.pathNodes(start.path.slice(root));
  while (wanted.length && existing.length && wanted[0].sameMarkup(existing[0])) {
    wanted.shift();
    existing.shift();
  }
  if (existing.length || wanted.length) tr.step("ancestor", start, end, null, {
    depth: existing.length,
    types: wanted.map(function (n) {
      return n.type;
    }),
    attrs: wanted.map(function (n) {
      return n.attrs;
    })
  });
  for (var i = root; i < before.path.length; i++) {
    tr.join(before.shorten(i, 1));
  }
}

/**
 * Delete content between two positions.
 *
 * @param  {Pos} from
 * @param  {Pos} to
 * @return this
 */
_transform.Transform.prototype["delete"] = function (from, to) {
  if (from.cmp(to)) this.replace(from, to);
  return this;
};

/**
 * Replace the content between two positions.
 */
_transform.Transform.prototype.replace = function (from, to, source, start, end) {
  var repl = undefined,
      depth = undefined,
      doc = this.doc,
      maxDepth = (0, _tree.samePathDepth)(from, to);
  if (source) {
    ;
    var _buildInserted = buildInserted(doc.pathNodes(from.path), source, start, end);

    repl = _buildInserted.repl;
    depth = _buildInserted.depth;

    while (depth > maxDepth) {
      if (repl.content.size) repl = { content: _model.Fragment.from(doc.path(from.path.slice(0, depth)).copy(repl.content)),
        openLeft: repl.openLeft + 1, openRight: repl.openRight + 1 };
      depth--;
    }
  } else {
    repl = nullRepl;
    depth = maxDepth;
  }
  var root = from.shorten(depth),
      docAfter = doc,
      after = to;
  if (repl.content.size || (0, _tree.replaceHasEffect)(doc, from, to)) {
    var result = this.step("replace", from, to, root, repl);
    docAfter = result.doc;
    after = result.map.map(to).pos;
  }

  // If no text nodes before or after end of replacement, don't glue text
  if (!doc.path(to.path).isTextblock) return this;
  if (!(repl.content.size ? source.path(end.path).isTextblock : doc.path(from.path).isTextblock)) return this;

  var nodesAfter = doc.path(root.path).pathNodes(to.path.slice(depth)).slice(1);
  var nodesBefore = undefined;
  if (repl.content.size) {
    var inserted = repl.content;
    nodesBefore = [];
    for (var i = 0; i < repl.openRight; i++) {
      var last = inserted.child(inserted.size - 1);
      nodesBefore.push(last);
      inserted = last.content;
    }
  } else {
    nodesBefore = doc.path(root.path).pathNodes(from.path.slice(depth)).slice(1);
  }

  if (nodesBefore.length && (nodesAfter.length != nodesBefore.length || !nodesAfter.every(function (n, i) {
    return n.sameMarkup(nodesBefore[i]);
  }))) {
    var _after$shorten = after.shorten(root.depth);

    var path = _after$shorten.path;
    var offset = _after$shorten.offset;var before = undefined;
    for (var node = docAfter.path(path), i = 0;; i++) {
      if (i == nodesBefore.length) {
        before = new _model.Pos(path, offset);
        break;
      }
      path.push(offset - 1);
      node = node.child(offset - 1);
      offset = node.size;
    }
    moveText(this, docAfter, before, after);
  }
  return this;
};

_transform.Transform.prototype.replaceWith = function (from, to, content) {
  if (!(content instanceof _model.Fragment)) content = _model.Fragment.from(content);
  if (!_model.Pos.samePath(from.path, to.path)) return this;
  this.step("replace", from, to, from, { content: content, openLeft: 0, openRight: 0 });
  return this;
};

_transform.Transform.prototype.insert = function (pos, content) {
  return this.replaceWith(pos, pos, content);
};

_transform.Transform.prototype.insertInline = function (pos, node) {
  return this.insert(pos, node.mark(this.doc.marksAt(pos)));
};

_transform.Transform.prototype.insertText = function (pos, text) {
  return this.insert(pos, this.doc.type.schema.text(text, this.doc.marksAt(pos)));
};
},{"../model":26,"./map":40,"./step":44,"./transform":45,"./tree":46}],43:[function(require,module,exports){
"use strict";

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _map = require("./map");

(0, _step.defineStep)("split", {
  apply: function apply(doc, step) {
    var pos = step.pos;
    if (pos.depth == 0) return null;

    var _pos$shorten = pos.shorten();

    var parentPath = _pos$shorten.path;
    var offset = _pos$shorten.offset;

    var parent = doc.path(parentPath);
    var target = parent.child(offset),
        targetSize = target.size;

    var _ref = step.param || target;

    var typeAfter = _ref.type;
    var attrsAfter = _ref.attrs;

    var splitAt = pos.offset;
    if (splitAt == 0 && !target.type.canBeEmpty || target.type.locked || splitAt == target.size && !typeAfter.canBeEmpty) return null;
    var newParent = parent.splice(offset, offset + 1, _model.Fragment.from([target.slice(0, splitAt), typeAfter.create(attrsAfter, target.content.slice(splitAt))]));
    var copy = doc.replaceDeep(parentPath, newParent);

    var dest = new _model.Pos(parentPath.concat(offset + 1), 0);
    var map = new _map.PosMap([new _map.MovedRange(pos, targetSize - pos.offset, dest), new _map.MovedRange(new _model.Pos(parentPath, offset + 1), newParent.size - 2 - offset, new _model.Pos(parentPath, offset + 2))], [new _map.ReplacedRange(pos, pos, pos, dest, pos, pos.shorten(null, 1))]);
    return new _transform.TransformResult(copy, map);
  },
  invert: function invert(step, _oldDoc, map) {
    return new _step.Step("join", step.pos, map.map(step.pos).pos);
  },
  paramToJSON: function paramToJSON(param) {
    return param && { type: param.type.name, attrs: param.attrs };
  },
  paramFromJSON: function paramFromJSON(schema, json) {
    return json && { type: schema.nodeType(json.type), attrs: json.attrs };
  }
});

_transform.Transform.prototype.split = function (pos, depth, typeAfter, attrsAfter) {
  if (depth === undefined) depth = 1;

  if (depth == 0) return this;
  for (var i = 0;; i++) {
    this.step("split", null, null, pos, typeAfter && { type: typeAfter, attrs: attrsAfter });
    if (i == depth - 1) return this;
    typeAfter = null;
    pos = pos.shorten(null, 1);
  }
};

_transform.Transform.prototype.splitIfNeeded = function (pos) {
  var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  for (var off = 0; off < depth; off++) {
    var here = pos.shorten(pos.depth - off);
    if (here.offset && here.offset < this.doc.path(here.path).size) this.step("split", null, null, here);
  }
  return this;
};
},{"../model":26,"./map":40,"./step":44,"./transform":45}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.defineStep = defineStep;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var Step = (function () {
  function Step(name, from, to, pos) {
    var param = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, Step);

    if (!(name in steps)) throw new Error("Unknown step type: " + name);
    this.name = name;
    this.from = from;
    this.to = to;
    this.pos = pos;
    this.param = param;
  }

  _createClass(Step, [{
    key: "apply",
    value: function apply(doc) {
      return steps[this.name].apply(doc, this);
    }
  }, {
    key: "invert",
    value: function invert(oldDoc, map) {
      return steps[this.name].invert(this, oldDoc, map);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var impl = steps[this.name];
      return {
        name: this.name,
        from: this.from,
        to: this.to,
        pos: this.pos,
        param: impl.paramToJSON ? impl.paramToJSON(this.param) : this.param
      };
    }
  }], [{
    key: "fromJSON",
    value: function fromJSON(schema, json) {
      var impl = steps[json.name];
      return new Step(json.name, json.from && _model.Pos.fromJSON(json.from), json.to && _model.Pos.fromJSON(json.to), json.pos && _model.Pos.fromJSON(json.pos), impl.paramFromJSON ? impl.paramFromJSON(schema, json.param) : json.param);
    }
  }]);

  return Step;
})();

exports.Step = Step;

var steps = Object.create(null);

function defineStep(name, impl) {
  steps[name] = impl;
}
},{"../model":26}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _step2 = require("./step");

var _map = require("./map");

var TransformResult = function TransformResult(doc) {
  var map = arguments.length <= 1 || arguments[1] === undefined ? _map.nullMap : arguments[1];

  _classCallCheck(this, TransformResult);

  this.doc = doc;
  this.map = map;
};

exports.TransformResult = TransformResult;

var Transform = (function () {
  function Transform(doc) {
    _classCallCheck(this, Transform);

    this.docs = [doc];
    this.steps = [];
    this.maps = [];
  }

  _createClass(Transform, [{
    key: "step",
    value: function step(_step, from, to, pos, param) {
      if (typeof _step == "string") _step = new _step2.Step(_step, from, to, pos, param);
      var result = _step.apply(this.doc);
      if (result) {
        this.steps.push(_step);
        this.maps.push(result.map);
        this.docs.push(result.doc);
      }
      return result;
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      var deleted = false;
      for (var i = 0; i < this.maps.length; i++) {
        var result = this.maps[i].map(pos, bias);
        pos = result.pos;
        if (result.deleted) deleted = true;
      }
      return new _map.MapResult(pos, deleted);
    }
  }, {
    key: "doc",
    get: function get() {
      return this.docs[this.docs.length - 1];
    }
  }, {
    key: "before",
    get: function get() {
      return this.docs[0];
    }
  }]);

  return Transform;
})();

exports.Transform = Transform;
},{"./map":40,"./step":44}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyStructure = copyStructure;
exports.copyInline = copyInline;
exports.isFlatRange = isFlatRange;
exports.replaceHasEffect = replaceHasEffect;
exports.samePathDepth = samePathDepth;

var _model = require("../model");

function copyStructure(node, from, to, f) {
  var depth = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

  if (node.isTextblock) {
    return f(node, from ? from.offset : 0, to ? to.offset : node.size);
  } else {
    if (!node.size) return node;
    var start = from ? from.path[depth] : 0;
    var end = to ? to.path[depth] + 1 : node.size;
    var content = node.content.toArray(0, start);
    for (var iter = node.iter(start, end), child = undefined; child = iter.next().value;) {
      var passFrom = iter.offset - child.width == start ? from : null;
      var passTo = iter.offset == end ? to : null;
      content.push(copyStructure(child, passFrom, passTo, f, depth + 1));
    }
    return node.copy(_model.Fragment.fromArray(content.concat(node.content.toArray(end))));
  }
}

function copyInline(node, from, to, f) {
  return node.splice(from, to, node.content.slice(from, to).map(f));
}

function isFlatRange(from, to) {
  if (from.path.length != to.path.length) return false;
  for (var i = 0; i < from.path.length; i++) {
    if (from.path[i] != to.path[i]) return false;
  }return from.offset <= to.offset;
}

function canBeJoined(node, offset, depth) {
  if (!depth || offset == 0 || offset == node.size) return false;
  var left = node.child(offset - 1),
      right = node.child(offset);
  return left.sameMarkup(right);
}

function replaceHasEffect(doc, from, to) {
  for (var depth = 0, node = doc;; depth++) {
    var fromEnd = depth == from.depth,
        toEnd = depth == to.depth;
    if (fromEnd || toEnd || from.path[depth] != to.path[depth]) {
      var gapStart = undefined,
          gapEnd = undefined;
      if (fromEnd) {
        gapStart = from.offset;
      } else {
        gapStart = from.path[depth] + 1;
        for (var i = depth + 1, n = node.child(gapStart - 1); i <= from.path.length; i++) {
          if (i == from.path.length) {
            if (from.offset < n.size) return true;
          } else {
            if (from.path[i] + 1 < n.size) return true;
            n = n.child(from.path[i]);
          }
        }
      }
      if (toEnd) {
        gapEnd = to.offset;
      } else {
        gapEnd = to.path[depth];
        for (var i = depth + 1; i <= to.path.length; i++) {
          if ((i == to.path.length ? to.offset : to.path[i]) > 0) return true;
        }
      }
      if (gapStart != gapEnd) return true;
      return canBeJoined(node, gapStart, Math.min(from.depth, to.depth) - depth);
    } else {
      node = node.child(from.path[depth]);
    }
  }
}

function samePathDepth(a, b) {
  for (var i = 0;; i++) {
    if (i == a.path.length || i == b.path.length || a.path[i] != b.path[i]) return i;
  }
}
},{"../model":26}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProseMirrorError = (function (_Error) {
  _inherits(ProseMirrorError, _Error);

  function ProseMirrorError(message) {
    _classCallCheck(this, ProseMirrorError);

    _get(Object.getPrototypeOf(ProseMirrorError.prototype), "constructor", this).call(this, message);
    if (this.message != message) {
      this.message = message;
      if (Error.captureStackTrace) Error.captureStackTrace(this, this.name);else this.stack = new Error(message).stack;
    }
  }

  _createClass(ProseMirrorError, [{
    key: "name",
    get: function get() {
      return this.constructor.name || functionName(this.constructor) || "ProseMirrorError";
    }
  }], [{
    key: "raise",
    value: function raise(message) {
      throw new this(message);
    }
  }]);

  return ProseMirrorError;
})(Error);

exports.ProseMirrorError = ProseMirrorError;

function functionName(f) {
  var match = /^function (\w+)/.exec(f.toString());
  return match && match[1];
}
},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = window.Map || (function () {
  function _class() {
    _classCallCheck(this, _class);

    this.content = [];
  }

  _createClass(_class, [{
    key: "set",
    value: function set(key, value) {
      var found = this.find(key);
      if (found > -1) this.content[found + 1] = value;else this.content.push(key, value);
    }
  }, {
    key: "get",
    value: function get(key) {
      var found = this.find(key);
      return found == -1 ? undefined : this.content[found + 1];
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.find(key) > -1;
    }
  }, {
    key: "find",
    value: function find(key) {
      for (var i = 0; i < this.content.length; i += 2) {
        if (this.content[i] === key) return i;
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.content.length = 0;
    }
  }, {
    key: "size",
    get: function get() {
      return this.content.length / 2;
    }
  }]);

  return _class;
})();
exports.Map = Map;
},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = sortedInsert;

function sortedInsert(array, elt, compare) {
  var i = 0;
  for (; i < array.length; i++) if (compare(array[i], elt) > 0) break;
  array.splice(i, 0, elt);
}

module.exports = exports["default"];
},{}]},{},[1]);
