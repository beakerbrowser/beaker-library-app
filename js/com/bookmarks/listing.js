import { html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { classMap } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/class-map.js'
import { profiles, bookmarks } from '../../tmp-beaker.js'
import { Table } from '/vendor/beaker-app-stdlib/js/com/table.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import { writeToClipboard } from '/vendor/beaker-app-stdlib/js/clipboard.js'
import tableCSS from '/vendor/beaker-app-stdlib/css/com/table.css.js'
import bookmarksListingCSS from '../../../css/com/bookmarks/listing.css.js'
import '/vendor/beaker-app-stdlib/js/com/img-fallbacks.js'

class BookmarksListing extends Table {
  static get properties() {
    return { 
      rows: {type: Array},
      category: {type: String},
      filter: {type: String},
      showExtended: {type: Boolean, attribute: 'show-extended'},
      searchQuery: {attribute: 'search-query', reflect: true}
    }
  }

  constructor () {
    super()

    this.showExtended = false
    this.bookmarks = []
    this.searchQuery = ''
  }

  get columns () {
    return [
      {id: 'visibility', width: 26, renderer: 'renderRowVisibility'},
      {id: 'favicon', width: 30, renderer: 'renderRowFavicon'},
      {id: 'title', flex: 1, renderer: 'renderRowTitle'},
      {id: 'buttons', width: 75, renderer: 'renderRowButtons'},
      {id: 'pinned', width: 30, renderer: 'renderRowPinned'}
    ]
  }

  get rows () {
    if (this.searchQuery) {
      return this.bookmarks.filter(b => {
        if (b.title && b.title.toLowerCase().includes(this.searchQuery)) {
          return b
        } else if (b.description && b.description.toLowerCase().includes(this.searchQuery)) {
          return b
        } else if (b.href && b.href.toLowerCase().includes(this.searchQuery)) {
          return b
        } else if (b.tags && b.tags.length && b.tags.join(' ').toLowerCase().includes(this.searchQuery)) {
          return b
        }
      })
    }
    return this.bookmarks
  }

  set rows (v) {
    // noop
  }

  get fontAwesomeCSSUrl () {
    return '/vendor/beaker-app-stdlib/css/fontawesome.css'
  }

  // data management
  // =

  async load () {
    if (!this.category) {
      return
    }
    var user = await profiles.getCurrentUser()
    switch (this.category) {
      case 'your':
      {
        let filters = {authors: user.url}
        if (this.filter === 'pinned') filters.pinned = true
        if (this.filter === 'public') filters.isPublic = true
        if (this.filter === 'private') filters.isPublic = false
        this.bookmarks = await bookmarks.query({filters})
        break
      }
      case 'network':
        this.bookmarks = await bookmarks.query({filters: {isPublic: true}})
        break
      default:
        this.bookmarks = await bookmarks.query({filters: {authors: this.category, isPublic: true}})
        break
    }
    console.log(this.bookmarks)
    this.requestUpdate()
  }

  // rendering
  // =

  renderRowPinned (row) {
    if (!row.isOwner) {
      return ''
    }
    const cls = classMap({
      'pin-btn': true,
      pressed: row.pinned
    })
    var tooltip
    if (typeof row.newPinState !== 'undefined') {
      tooltip = row.newPinState ? 'Pinned!' : 'Unpinned!'
    } else {
      tooltip = row.pinned ? 'Unpin from the start page' : 'Pin to the start page'
    }
    return html`
      <a
        class="${cls}"
        data-tooltip="${tooltip}"
        @click=${e => this.onTogglePinned(e, row)}
        @mouseleave=${e => this.onMouseleavePinned(e, row)}
      >
        <span class="fas fa-thumbtack"></span>
      </a>
    `
  }

  renderRowVisibility (row) {
    if (row.isPublic) {
      return html`<img src="${row.author.url}/thumb" title="${row.author.title}">`
    }
    return html`<span class="fas fa-fw fa-lock"></span>`
  }

  renderRowFavicon (row) {
    return html`<img class="favicon" src="beaker-favicon:32,${row.href}">`
  }

  renderRowTitle (row) {
    var titleEl = html`<a class="link" href="${row.href}">${row.title || html`<em>Untitled</em>`}</a>`
    if (this.showExtended) {
      return html`
        <div class="extended-info">
          <div class="title-line">${titleEl}</div>
          ${row.description ? html`<div class="description-line">${row.description}</div>` : ''}
          ${Array.isArray(row.tags) && row.tags.length ? html`<div class="tags-line">${row.tags.map(t => html`<span>${t}</span>`)}</div>` : ''}
        </div>
      `
    }
    return titleEl
  }

  renderRowButtons (row) {
    if (!row.isOwner) return html``
    return html`
      <div>
        <button class="btn transparent" @click=${e => this.onEditBookmark(e, row)}><i class="fas fa-pencil-alt"></i></button>
        <button class="btn transparent" @click=${e => this.onDeleteBookmark(e, row)}><i class="fas fa-trash"></i></button>
      </div>
    `
  }

  // events
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if ((name === 'category' || name === 'filter') && newval) {
      // trigger a load when we change categories
      console.log('loading')
      this.load()
    }
  }

  emit (evt, detail) {
    this.dispatchEvent(new CustomEvent(evt, {detail}))
  }


  async onTogglePinned (e, row) {
    e.preventDefault()
    e.stopPropagation()
    var btnEl = e.currentTarget
    var iconEl = e.currentTarget.querySelector('span')

    // update
    row.pinned = !row.pinned
    await bookmarks.edit(row.href, row)
    row.newPinState = row.pinned

    // do an animation to tell the user it succeeded
    btnEl.dataset.tooltip = row.pinned ? 'Pinned!' : 'Unpinned!'
    iconEl.style.visibility = 'visible'
    iconEl.animate([
      {transform: 'scale(1.0)'},
      {transform: 'scale(1.5)'},
      {transform: 'scale(1.0)'},
    ], { duration: 200 })
    await new Promise(r => setTimeout(r, 200))
    iconEl.style.removeProperty('visibility')

    // rerender
    await this.requestUpdate()
  }

  onMouseleavePinned (e, row) {
    // clear the new pin state
    row.newPinState = undefined
    this.requestUpdate()
  }
  
  async onEditBookmark (e, bookmark) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    try {
      // render popup
      var b = await BeakerEditBookmarkPopup.create(bookmark, {
        fontawesomeSrc: '/vendor/beaker-app-stdlib/css/fontawesome.css'
      })

      // update
      await bookmarks.edit(bookmark.href, b)
      await this.load()
    } catch (e) {
      // ignore
      console.log(e)
    }
  }

  async onDeleteBookmark (e, bookmark) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    await bookmarks.remove(bookmark.href)
    var i = this.bookmarks.indexOf(bookmark)
    this.bookmarks.splice(i, 1)
    this.requestUpdate()

    const undo = async () => {
      await bookmarks.add(bookmark)
      this.bookmarks.splice(i, 0, bookmark)
      this.requestUpdate()
    }

    toast.create('Bookmark deleted', '', 10e3, {label: 'Undo', click: undo})
  }

  onContextmenuRow (e, bookmark) {
    e.preventDefault()
    var items = [
      {icon: 'fa fa-external-link-alt', label: 'Open in new tab', click: () => window.open(bookmark.href)},
      {icon: 'fa fa-link', label: 'Copy URL', click: () => writeToClipboard(bookmark.href)},
    ]
    if (bookmark.isOwner) {
      items.push({icon: 'fas fa-pencil-alt', label: 'Edit bookmark', click: () => this.onEditBookmark(null, bookmark)})
      items.push({icon: 'fas fa-trash', label: 'Delete', click: () => this.onDeleteBookmark(null, bookmark)})
    }
    contextMenu.create({
      x: e.clientX,
      y: e.clientY,
      items,
      fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'
    })
  }
}
BookmarksListing.styles = [tableCSS, bookmarksListingCSS]
customElements.define('library-bookmarks-listing', BookmarksListing)
