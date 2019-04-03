import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '../com/addressbook/header-controls.js'
import '../com/addressbook/listing.js'

class AddressBook extends LitElement {
  static get properties() {
    return {
      category: {type: String},
      searchQuery: {type: String}
    }
  }

  constructor () {
    super()
    this.category = 'your'
    this.searchQuery = ''
  }

  // rendering
  // =

  render () {
    return html`
      <library-addressbook-header-controls
        @query-changed=${this.onQueryChanged}
        @follow-added=${this.onFollowAdded}
      >
      </library-addressbook-header-controls>
      <library-addressbook-listing
        category="${this.category}"
        search-query="${this.searchQuery}"
      ></library-addressbook-listing>
    `
  }

  // events
  // =

  onQueryChanged (e) {
    this.searchQuery = e.detail.query
  }

  onFollowAdded (e) {
    this.shadowRoot.querySelector('library-addressbook-listing').load()
  }
}

customElements.define('library-view-addressbook', AddressBook)
