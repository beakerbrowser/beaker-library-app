import { LitElement, css, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { library } from './tmp-beaker.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import './com/sidebar.js'
import './com/header-controls.js'
import './com/archives-listing.js'
import './com/new-form.js'

class Archives extends LitElement {
  static get properties() {
    return {
      currentView: {type: String},
      currentCategory: {type: String},
      searchQuery: {type: String},
      selectedUrls: {type: Array}
    }
  }

  constructor () {
    super()
    this.searchQuery = ''
    this.currentView = ''
    this.currentCategory = ''
    this.selectedUrls = []

    let urlp = new URL(window.location)
    if (urlp.searchParams.has('new')) {
      this.currentView = 'new'
    } else {
      this.currentView = 'archives'
      this.currentCategory = urlp.searchParams.get('category') || 'owned'
    }
  }

  get listingEl () {
    return this.shadowRoot.querySelector('library-archives-listing')
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
    return html`
      <nav>
        <library-sidebar
          current-category="${this.currentCategory}"
          @set-category=${this.onSetCategory}
        ></library-sidebar>
      </nav>
      <main>
        ${this.renderView()}
      </main>
    `
  }

  renderView () {
    if (this.currentView === 'archives') {
      let hasSelection = this.selectedUrls.length > 0
      return html`
        <library-header-controls
          ?has-selection=${hasSelection}
          current-category="${this.currentCategory}"
          @query-changed=${this.onQueryChanged}
          @select-all=${this.onSelectAll}
          @deselect-all=${this.onDeselectAll}
          @move-selection-to-trash=${this.onMoveSelectionToTrash}
          @restore-selection-from-trash=${this.onRestoreSelectionFromTrash}
          @delete-selection-permanently=${this.onDeleteSelectionPermanently}
        ></library-header-controls>
        <library-archives-listing
          current-category="${this.currentCategory}"
          search-query="${this.searchQuery}"
          @selection-changed=${this.onSelectionChanged}
          @move-to-trash=${this.onMoveToTrash}
          @restore-from-trash=${this.onRestoreFromTrash}
          @delete-permanently=${this.onDeletePermanently}
        ></library-archives-listing>
      `
    } else if (this.currentView === 'new') {
      return html`
        <library-new-form></library-new-form>
      `
    }
  }

  // events
  // =

  onSetCategory (e) {
    this.currentView = 'archives'
    this.currentCategory = e.detail.category
    history.replaceState({}, '', '/')
  }

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
Archives.styles = css`
:host {
  display: flex;
  max-width: 1040px;
  margin: 0 0 100px;
}

nav {
  width: 170px;
  padding: 0 15px;
}

main {
  flex: 1;
}

library-sidebar {
  padding: 20px 0;
  position: sticky;
  top: 0px;
}

`

customElements.define('library-archives', Archives)
