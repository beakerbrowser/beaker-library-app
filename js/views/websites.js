import { LitElement, css, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { library } from '../tmp-beaker.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import '../com/websites/header-controls.js'
import '../com/websites/listing.js'

class Websites extends LitElement {
  static get properties() {
    return {
      category: {type: String},
      searchQuery: {type: String},
      selectedUrls: {type: Array}
    }
  }

  constructor () {
    super()
    this.category = ''
    this.searchQuery = ''
    this.selectedUrls = []
  }

  get listingEl () {
    return this.shadowRoot.querySelector('library-websites-listing')
  }

  // management
  // =
  
  async moveToTrash (urls) {
    // remove items
    for (let url of urls) {
      await library.remove(url).catch(err => false)
    }
    // reload state
    this.listingEl.deselectAll()
    await this.listingEl.load()
    
    const undo = async () => {
      // readd items
      for (let url of urls) {
        await library.add(url).catch(err => false)
      }
      // reload state
      await this.listingEl.load()
    }

    toast.create('Moved to trash', '', 10e3, {label: 'Undo', click: undo})
  }
  
  async restoreFromTrash (urls) {
    // add items
    for (let url of urls) {
      await library.add(url).catch(err => false)
    }
    // reload state
    this.listingEl.deselectAll()
    await this.listingEl.load()
    
    const undo = async () => {
      // reremove items
      for (let url of urls) {
        await library.remove(url).catch(err => false)
      }
      // reload state
      await this.listingEl.load()
    }

    toast.create('Restored from trash', '', 10e3, {label: 'Undo', click: undo})
  }

  async deletePermanently (urls) {
    if (!confirm('Delete permanently? This cannot be undone.')) {
      return
    }
    // permadelete
    for (let url of urls) {
      await beaker.archives.delete(url)
    }
    // reload state
    this.listingEl.deselectAll()
    await this.listingEl.load()
  }

  // rendering
  // =

  render () {
    let hasSelection = this.selectedUrls.length > 0
    return html`
      <library-websites-header-controls
        ?has-selection=${hasSelection}
        current-category="${this.category}"
        @query-changed=${this.onQueryChanged}
        @select-all=${this.onSelectAll}
        @deselect-all=${this.onDeselectAll}
        @move-selection-to-trash=${this.onMoveSelectionToTrash}
        @restore-selection-from-trash=${this.onRestoreSelectionFromTrash}
        @delete-selection-permanently=${this.onDeleteSelectionPermanently}
      ></library-websites-header-controls>
      <library-websites-listing
        current-category="${this.category}"
        search-query="${this.searchQuery}"
        @selection-changed=${this.onSelectionChanged}
        @move-to-trash=${this.onMoveToTrash}
        @restore-from-trash=${this.onRestoreFromTrash}
        @delete-permanently=${this.onDeletePermanently}
      ></library-websites-listing>
    `
  }

  // events
  // =

  onQueryChanged (e) {
    this.searchQuery = e.detail.query
  }

  async onSelectionChanged (e) {
    this.selectedUrls = this.listingEl.selectedUrls
    await new Promise(r => setTimeout(r, 0)) // really not sure why, but rendering is not getting schedule if I dont churn the event loop
    await this.requestUpdate()
  }

  onSelectAll (e) {
    this.listingEl.selectAll()
  }

  onDeselectAll (e) {
    this.listingEl.deselectAll()
  }

  onMoveToTrash (e) {
    this.moveToTrash([e.detail.url])
  }

  onMoveSelectionToTrash (e) {
    this.moveToTrash(this.selectedUrls)
  }

  onRestoreFromTrash (e) {
    this.restoreFromTrash([e.detail.url])
  }

  onRestoreSelectionFromTrash (e) {
    this.restoreFromTrash(this.selectedUrls)
  }

  onDeletePermanently (e) {
    this.deletePermanently([e.detail.url])
  }

  onDeleteSelectionPermanently (e) {
    this.deletePermanently(this.selectedUrls)
  }
}
Websites.styles = css`
`

customElements.define('library-view-websites', Websites)
