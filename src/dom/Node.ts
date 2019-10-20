import { EventTarget } from '../events/EventTarget'
import { Document } from "./Document"

export class Node extends EventTarget {
  readonly childNodes: Node[] = []
  parentElement = null

  constructor(public readonly ownerDocument: Document, public readonly nodeType, public readonly _nativeId) {
    super()
  }

  appendChild(child: Node) {
    this.insertBefore(child, null)
  }

  insertBefore(child: Node, before: Node | null) {
    const index = before === null ?this.childNodes.length :this.childNodes.indexOf(child)

    // consider if it's worth to throw like browsers do
    if (~index) {
      this.insertAt(child, index)
    }
  }

  insertAt(child: Node, index) {
    child.remove()
    this.childNodes.splice(index, 0, child)
    child.parentElement = this
  }

  remove() {
    const parent = this.parentNode

    if (parent) {
      parent.removeChild(this)
    }
  }

  removeChild(child: Node) {
    const index = this.childNodes.indexOf(child)

    if (!~index) {
      throw new Error('not a child')
    }

    this.childNodes.splice(index, 1)
  }

  replaceChild(child: Node, prev: Node) {
    const index = this.childNodes.indexOf(prev)

    if (~index) {
      this.insertAt(child, index)
      this.removeChild(prev)
    }
  }

  get firstChild() {
    return this.childNodes[0]
  }

  get lastChild() {
    const chs = this.childNodes

    return chs[chs.length - 1]
  }

  get parentNode() {
    return this.parentElement as Node
  }

  get nextSibling() {
    const parentChildren = this.parentElement.childNodes

    return parentChildren[parentChildren.indexOf(this) + 1]
  }

  get previousSibling() {
    const parentChildren = this.parentElement.childNodes

    return parentChildren[parentChildren.indexOf(this) - 1]
  }

  // TODO: get/set nodeValue
  // (Text.nodeValue exists already)
  get nodeName() {
    const node = this as any

    switch (this.nodeType) {
      case Node.ELEMENT_NODE: return node.tagName
      case Node.DOCUMENT_NODE: return '#document'
      case Node.TEXT_NODE: return '#text'
    }
  }

  static ELEMENT_NODE = 1
  static TEXT_NODE = 3
  static DOCUMENT_NODE = 9
  static DOCUMENT_FRAGMENT_NODE = 11
}
