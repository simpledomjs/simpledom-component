"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAttrs = updateAttrs;
exports.convertToNode = convertToNode;

var _util = require("./util");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function updateAttrs(node, element) {
  for (var key in element.attrs) {
    if (element.attrs.hasOwnProperty(key) && element.attrs[key] !== undefined) {
      (function () {
        var value = element.attrs[key];

        if (key === 'ref') {
          value(node);
        } else if (key.startsWith('on')) {
          var eventKey = key.substring(2).toLowerCase();
          node.addEventListener(eventKey, function (event) {
            return value(event);
          });
        } else {
          if (key === 'className') {
            key = 'class';
          }

          key = (0, _util.dasherize)(key);

          if (key === 'style' && Object.prototype.toString.call(value) == '[object Object]') {
            for (var styleKey in value) {
              if (value.hasOwnProperty(styleKey)) {
                node.style[(0, _util.dasherize)(styleKey)] = value[styleKey];
              }
            }
          } else if (key === 'class' && Object.prototype.toString.call(value) == '[object Object]') {
            for (var classValue in value) {
              if (value.hasOwnProperty(classValue) && value[classValue]) {
                node.classList.add((0, _util.dasherize)(classValue));
              }
            }
          } else {
            node.setAttribute(key, value);
          }
        }
      })();
    }
  }
}

function convertToNode(element, store, componentList) {
  if (element === undefined || element === null) {
    return undefined;
  }

  if (element.isComponent) {
    var componentInstance = new element.componentClass(_objectSpread({}, element.props), store);
    componentList.push(componentInstance);
    return convertToNode(componentInstance.renderComponent(element.otherRef), store, componentList);
  }

  if (!element.isElem) {
    return element.__asHtml ? element : document.createTextNode('' + element);
  }

  var node = document.createElement(element.name);
  updateAttrs(node, element);
  var childLength = element.children.length;

  for (var index = 0; index < childLength; index++) {
    var childElement = element.children[index];

    if (childElement !== undefined && childElement !== null) {
      var childNode = convertToNode(childElement, store, componentList);

      if (childNode !== undefined && childNode !== null) {
        if (childNode.__asHtml) {
          node.insertAdjacentHTML('beforeend', childNode.__asHtml);
        } else {
          node.appendChild(childNode);
        }
      }
    }
  }

  return node;
}