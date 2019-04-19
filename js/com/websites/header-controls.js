import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import headerControlsCSS from '../../../css/com/header-controls.css.js'

class WebsitesHeaderControls extends LitElement {
  static get properties () {
    return {
      category: {type: String},
      site: {type: String},
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
      ${this.category === 'trash'
        ? ''
        : html`
          <div class="search-container">
            <input placeholder="Find a website" type="text" class="search" @keyup=${this.onKeyupSearch}>
            <i class="fa fa-search"></i>
          </div>
        `}
      ${this.renderActions()}
    `
  }

  renderActions () {
    if (this.site) return ''
    if (this.hasSelection || this.category === 'trash') {
      return this.renderSelectionActions()
    } else if (this.category === 'your') {
      return this.renderStandardActions()
    }
  }

  renderStandardActions () {
    return html`
      <div class="actions">
        <div class="dropdown toggleable-container">
          <a class="btn primary thick toggleable" href="?view=new-website">
            <span class="fas fa-sitemap"></span> New website
          </a>
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
        <span>|</span>
        <button class="btn transparent thick" @click=${this.doEmit('deselect-all')}>
          Deselect all
        </button>
        ${this.category === 'trash'
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

  onKeyupSearch (e) {
    this.dispatchEvent(new CustomEvent('query-changed', {detail: {query: e.currentTarget.value}}))
  }
}
WebsitesHeaderControls.styles = headerControlsCSS

customElements.define('library-websites-header-controls', WebsitesHeaderControls)