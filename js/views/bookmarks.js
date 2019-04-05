import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '../com/bookmarks/header-controls.js'
import '../com/bookmarks/listing.js'

class Bookmarks extends LitElement {
  static get properties() {
    return {
      category: {type: String},
      site: {type: String},
      filter: {type: String},
      searchQuery: {type: String},
      selectedUrls: {type: Array}
    }
  }

  constructor () {
    super()
    this.category = 'your'
    this.filter = null
    this.searchQuery = ''
    this.selectedUrls = []
  }

  // rendering
  // =

  render () {
    let hasSelection = this.selectedUrls.length > 0
    return html`
      <library-bookmarks-header-controls
        category="${this.category}"
        site="${this.site}"
        filter="${this.filter}"
        @query-changed=${this.onQueryChanged}
        @filter-changed=${this.onFilterChanged}
        @bookmark-added=${this.onBookmarkAdded}
      ></library-bookmarks-header-controls>
      <library-bookmarks-listing
        ?show-author=${!!this.site}
        site="${this.site}"
        filter="${this.filter}"
        search-query="${this.searchQuery}"
      ></library-bookmarks-listing>
    `
  }

  // events
  // =

  onQueryChanged (e) {
    this.searchQuery = e.detail.query
  }

  onFilterChanged (e) {
    this.filter = e.detail.filter
  }

  onBookmarkAdded (e) {
    this.shadowRoot.querySelector('library-bookmarks-listing').load()
  }
}

customElements.define('library-view-bookmarks', Bookmarks)
