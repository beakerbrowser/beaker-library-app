import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '../com/bookmarks/header-controls.js'
import '../com/bookmarks/listing.js'

class Bookmarks extends LitElement {
  static get properties() {
    return {
      category: {type: String},
      searchQuery: {type: String},
      selectedUrls: {type: Array}
    }
  }

  constructor () {
    super()
    this.category = 'your'
    this.searchQuery = ''
    this.selectedUrls = []
  }

  // rendering
  // =

  render () {
    let hasSelection = this.selectedUrls.length > 0
    return html`
      <library-bookmarks-header-controls
        @query-changed=${this.onQueryChanged}
      ></library-bookmarks-header-controls>
      <library-bookmarks-listing
        show-extended
        category="${this.category}"
        search-query="${this.searchQuery}"
      ></library-bookmarks-listing>
    `
  }

  // events
  // =

  onQueryChanged (e) {
    this.searchQuery = e.detail.query
  }
}

customElements.define('library-view-bookmarks', Bookmarks)
