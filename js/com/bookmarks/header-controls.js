import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import headerControlsCSS from '../../../css/com/header-controls.css.js'

class BookmarksHeaderControls extends LitElement {
  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="search-container">
        <input placeholder="Find a bookmark" type="text" class="search" @keyup=${this.onKeyupSearch}>
        <i class="fa fa-search"></i>
      </div>
      <div class="actions">
        <div class="dropdown toggleable-container">
          <button class="btn thick toggleable" @click=${this.onClickFilter}>
            <strong>Filter:</strong> None <span class="fas fa-caret-down"></span>
          </button>
        </div>
        <div class="dropdown toggleable-container">
          <button class="btn primary thick toggleable" @click=${this.onClickNew}>
            <span class="fas fa-star"></span> New
          </button>
        </div>
      </div>
    `
  }

  onClickFilter (e) {
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
      items: [
        {icon: false, label: 'None', click: () => goto('/?new')},
        {icon: false, label: 'Pinned', click: () => goto('/?new')},
        {icon: false, label: 'Public', click: () => goto('/?new')},
        {icon: false, label: 'Private', click: () => goto('/?new')}
      ]
    })
  }

  onClickNew (e) {
    e.preventDefault()
    e.stopPropagation()
    // TODO
  }

  onKeyupSearch (e) {
    this.dispatchEvent(new CustomEvent('query-changed', {detail: {query: e.currentTarget.value}}))
  }
}
BookmarksHeaderControls.styles = headerControlsCSS

customElements.define('library-bookmarks-header-controls', BookmarksHeaderControls)