import { Component, ConnectedComponent } from './Component';
import { Store } from './Store';
import * as SimpleDom from 'simpledom.js';
import { el, renderToDom } from './renderer';

exports.Component = Component;
exports.Store = Store;
exports.el = el;
exports.renderToDom = renderToDom;
exports.renderTo = SimpleDom.renderTo;
exports.predicate = SimpleDom.predicate;
exports.renderToString = SimpleDom.renderToString;
