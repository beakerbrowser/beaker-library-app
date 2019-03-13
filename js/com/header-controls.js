import { LitElement, html, css } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import headerControlsCSS from '../../css/com/header-controls.css.js'

class HeaderControls extends LitElement {
  static get properties () {
    return {
      currentCategory: {type: String, attribute: 'current-category'},
      hasSelection: {type: Boolean, attribute: 'has-selection', reflect: true}
    }
  }

  constructor () {
    super()
    this.hasSelection = false
  }

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      ${this.currentCategory === 'trash'
        ? ''
        : html`
          <div class="search-container">
            <input autofocus="autofocus" placeholder="Search your Library" type="text" class="search" @keyup=${this.onKeyupSearch}>
            <i class="fa fa-search"></i>
          </div>
        `}
      ${this.renderActions()}
    `
  }

  renderActions () {
    if (this.hasSelection || this.currentCategory === 'trash') {
      return this.renderSelectionActions()
    } else {
      return this.renderStandardActions()
    }
  }

  renderStandardActions () {
    return html`
      <div class="actions">
        <div class="dropdown toggleable-container">
          <button class="btn primary thick toggleable" @click=${this.onClickNew}>
            New <span class="fas fa-caret-down"></span>
          </button>
        </div>
      </div>
    `
  }

  renderSelectionActions () {
    return html`
      <div class="actions">
        <button class="btn transparent thick" @click=${this.doEmit('select-all')}>
          Select all
        </button>
        |
        <button class="btn transparent thick" @click=${this.doEmit('deselect-all')}>
          Deselect all
        </button>
        ${this.currentCategory === 'trash'
          ? html`
            <button class="btn thick" ?disabled=${!this.hasSelection} @click=${this.doEmit('restore-selection-from-trash')}>
              Restore from Trash
            </button>
            <button class="btn thick" ?disabled=${!this.hasSelection} @click=${this.doEmit('delete-selection-permanently')}>
              Delete permanently
            </button>
          `
          : html`
            <button class="btn warning thick" @click=${this.doEmit('move-selection-to-trash')}>
              Move to Trash
            </button>
          `}
      </div>
    `
  }

  doEmit (evt) {
    return () => this.dispatchEvent(new CustomEvent(evt))
  }

  onClickNew (e) {
    e.preventDefault()
    e.stopPropagation()
    const goto = (url) => { window.location = url }
    contextMenu.create({
      x: e.currentTarget.getBoundingClientRect().right,
      y: e.currentTarget.getBoundingClientRect().bottom,
      right: true,
      withTriangle: true,
      noBorders: true,
      roomy: true,
      style: 'padding: 4px 0; min-width: 160px; font-size: 14px; color: #000',
      items: [{icon: false, label: 'Website', click: () => goto('/?new')}]
    })
  }

  onKeyupSearch (e) {
    this.dispatchEvent(new CustomEvent('query-changed', {detail: {query: e.currentTarget.value}}))
  }
}
HeaderControls.styles = headerControlsCSS

customElements.define('library-header-controls', HeaderControls)