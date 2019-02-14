import {LitElement, css, html} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import './com/sidebar.js'
import './com/header-controls.js'
import './com/archives-listing.js'
import './com/footer-hint.js'

class Archives extends LitElement {
  static get properties() {
    return {
      currentCategory: {type: String},
      searchQuery: {type: String},
      selectedKeys: {type: Array}
    }
  }

  constructor () {
    super()
    this.searchQuery = ''
    this.currentCategory = 'all'
    this.selectedKeys = []
  }

  render() {
    var hasSelection = this.selectedKeys.length > 0
    return html`
      <nav>
        <library-sidebar
          current-category="${this.currentCategory}"
          @set-category=${this.onSetCategory}
        ></library-sidebar>
      </nav>
      <main>
        <library-header-controls
          ?has-selection=${hasSelection}
          @query-changed=${this.onQueryChanged}
        ></library-header-controls>
        <library-archives-listing
          current-category="${this.currentCategory}"
          search-query="${this.searchQuery}"
          @selection-changed=${this.onSelectionChanged}
        ></library-archives-listing>        
        <library-footer-hint />
      </main>
    `
  }

  onSetCategory (e) {
    this.currentCategory = e.detail.category
  }

  onQueryChanged (e) {
    this.searchQuery = e.detail.query
  }

  onSelectionChanged (e) {
    this.selectedKeys = Object.keys(this.shadowRoot.querySelector('library-archives-listing').selectedKeys)
  }
}
Archives.styles = css`
:host {
  display: flex;
}

nav {
  width: 170px;
  padding: 20px 15px;
}

main {
  flex: 1;
  padding: 16px 80px 0 0;
}

`

customElements.define('library-archives', Archives)
