import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '../com/addressbook/listing.js'

class AddressBook extends LitElement {
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
}

customElements.define('library-view-addressbook', AddressBook)
