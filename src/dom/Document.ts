import { Node } from './Node'
import { Element } from './Element'
import { Text } from './Text'
import { Comment } from './Comment'
import { Window } from './Window'
import { DocumentFragment } from './DocumentFragment'

import { HTMLUnknownElement } from './HTMLUnknownElement'
import { HTMLInputElement } from './HTMLInputElement'

export class Document extends Node {
  _scene = this.defaultView.sceneContext
  _els: Element[] = [new Element(this, 'html', 0)]

  // title is only defined here, not on the window itself
  title = ''

  documentElement = this._els[0]
  head = this.createElement('head')
  body = this.createElement('body')

  activeElement
  // last time over for enter/leave
  _overElement
  // mousedown origin
  _clickedElement

  // react-dom does some feature-sniffing using `xxx in document`
  // (isInputEventSupported)
  oninput = null

  constructor(public defaultView: Window) {
    super(null, Node.DOCUMENT_NODE, 0)

    this.documentElement.parentNode = this
    this.documentElement.appendChild(this.body)

    this.parentNode = this.defaultView as unknown as Node
  }

  createElement(tagName: string) {
    let nativeId = this._scene.createElement()
    let el

    switch (tagName) {
      case 'input':
        el = new HTMLInputElement(this, tagName, nativeId)
        break

      default:
        el = new HTMLUnknownElement(this, tagName, nativeId)
    }

    el._created()

    this._els.push(el)

    // apply default styles
    Object.assign(el.style, defaultStyles[tagName] || {})

    return el
  }

  createTextNode(text: string): Text {
    return new Text(this, text, this._scene.createText())
  }

  createComment(data: string): Comment {
    // empty text node for now (should be fine)
    return new Comment(this, data, this._scene.createText())
  }

  createDocumentFragment() {
    return new DocumentFragment(this, Node.DOCUMENT_FRAGMENT_NODE, undefined)
  }

  getElementById(id) {
    // return this.querySelector(`#${id}`)
    return this._els.find(el => el.id === id)
  }

  querySelector(selectors: string) {
    return this.documentElement.querySelector(selectors)
  }

  querySelectorAll(selectors: string) {
    return this.documentElement.querySelectorAll(selectors)
  }

  _getEl(_nativeId) {
    return this._els[_nativeId]
  }

  _getTheParent() {
    return this.defaultView
  }
}

// TODO: share with CSSStyleDeclaration
const EM = 16

// mostly inspired by css reboot
const defaultStyles = {
  body: {
    display: 'block',
    width: '100%',
    minHeight: '100%',
  },

  div: {
    display: 'block',
  },

  h1: {
    display: 'block',
    fontSize: 2.5 * EM,
    lineHeight: 1.2 * 2.5 * EM,
    marginBottom: 0.5 * EM,
  },

  h2: {
    display: 'block',
    fontSize: 2 * EM,
    lineHeight: 1.2 * 2 * EM,
    marginBottom: 0.5 * EM,
  },

  h3: {
    display: 'block',
    fontSize: 1.75 * EM,
    lineHeight: 1.2 * 1.75 * EM,
    marginBottom: 0.5 * EM,
  },

  h4: {
    display: 'block',
    fontSize: 1.5 * EM,
    lineHeight: 1.2 * 1.5 * EM,
    marginBottom: 0.5 * EM,
  },

  h5: {
    display: 'block',
    fontSize: 1.25 * EM,
    lineHeight: 1.2 * 1.25 * EM,
    marginBottom: 0.5 * EM,
  },

  h6: {
    display: 'block',
    fontSize: 1 * EM,
    lineHeight: 1.2 * EM,
    marginBottom: 0.5 * EM,
  },

  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    borderRadius: 2,
    fontSize: 14,
    lineHeight: 32,
    color: '#ffffff',
    textAlign: 'center',
    justifyContent: 'space-around',
  },

  a: {
    color: '#4338ad',
  },

  p: {
    marginBottom: 1 * EM,
  },

  input: {
    padding: 5
  },
}
