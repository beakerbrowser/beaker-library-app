import {html} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import {library, profiles} from '../tmp-beaker.js'
import {followgraph} from '../tmp-unwalled-garden.js'
import bytes from '/vendor/beaker-app-stdlib/vendor/bytes/index.js'
import {pluralize} from '/vendor/beaker-app-stdlib/js/strings.js'
import {Table} from '/vendor/beaker-app-stdlib/js/com/table.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import {writeToClipboard} from '/vendor/beaker-app-stdlib/js/clipboard.js'
import tableCSS from '/vendor/beaker-app-stdlib/css/com/table.css.js'
import archivesListingCSS from '../../css/com/archives-listing.css.js'

class ArchivesListing extends Table {
  static get properties() {
    return { 
      rows: {type: Array},
      currentCategory: {type: String, attribute: 'current-category'},
      selectedRows: {type: Object},
      searchQuery: {attribute: 'search-query', reflect: true}
    }
  }

  constructor () {
    super()

    this.selectedRows = {}
    this.archives = []
    this.sortColumn = 'title'
    this.searchQuery = ''
    this.sort()

    this.load()
  }

  get columns () {
    return [
      {id: 'favicon', width: 30, renderer: 'renderRowFavicon'},
      {id: 'title', label: 'Title', flex: 3, renderer: 'renderRowTitle'},
      {id: 'owner', label: 'Owner', flex: 1, renderer: 'renderRowOwner'},
      {id: 'peers', label: 'Peers', flex: 1, renderer: 'renderPeers'},
      {id: 'last-updated', label: 'Last updated', flex: 1, renderer: 'renderRowLastUpdated'},
      {id: 'size', label: 'Size', flex: 1, renderer: 'renderRowSize'},
      {id: 'buttons', label: '', width: 65, renderer: 'renderRowButtons'}
    ]
  }

  get rows () {
    if (this.searchQuery) {
      return this.archives.filter(a => {
        if (a.title && a.title.toLowerCase().includes(this.searchQuery)) {
          return a
        } else if (a.description && a.description.toLowerCase().includes(this.searchQuery)) {
          return a
        } else if (a.url && a.url.toLowerCase().includes(this.searchQuery)) {
          return a
        }
      })
    }
    return this.archives
  }

  set rows (v) {
    // noop
  }

  get fontAwesomeCSSUrl () {
    return '/vendor/beaker-app-stdlib/css/fontawesome.css'
  }

  get selectedKeys () {
    return Object.entries(this.selectedRows).filter(([key, b]) => b).map(([key]) => key)
  }

  isRowSelected (row) {
    return this.selectedRows[row.key]
  }

  getRowHref (row) {
    return row.url
  }

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'current-category' && newval) {
      // trigger a load when we change categories
      this.load()
    }
  }

  // data management
  // =

  async load () {
    try {
      if (this.currentCategory === 'following') {
        let user = await profiles.getCurrentUser()
        let follows = await followgraph.listFollows(user.url)
        this.archives = await Promise.all(follows.map(follow => library.get(follow.url)))
      } else {
        let filters = {}
        if (this.currentCategory === 'all') {
          filters.saved = true
        } else if (this.currentCategory === 'owned') {
          filters.owner = true
          filters.saved = true
        } else if (this.currentCategory === 'trash') {
          filters.owner = true
          filters.saved = false
        }
        this.archives = await library.list({filters})
      }
    } catch (e) {
      console.error('Error while loading archives')
      console.error(e)
      toast.create('Failed to load archives', 'error')
    }
    this.requestUpdate()
  }

  sort () {
    var direction = this.sortDirection === 'asc' ? -1 : 1
    this.archives.sort((a, b) => {
      var v = 0
      switch (this.sortColumn) {
        case 'size': v = a.size - b.size; break
        case 'peers': v = a.connections - b.connections; break
        case 'last-updated': v = a.mtime - b.mtime; break
        case 'owner': v = getOwner(b).localeCompare(getOwner(a)); break
      }
      if (v === 0) v = (b.title || '').localeCompare(a.title || '') // use title to tie-break
      return v * direction
    })
    this.requestUpdate()
  }

  // rendering
  // =

  renderRowFavicon (row) {
    return html`<img class="favicon" src="beaker-favicon:32,${row.url}">`
  }

  renderRowTitle (row) {
    return row.title || html`<em>Untitled</em>`
  }

  renderRowOwner (row) {
    return getOwner(row)
  }

  renderPeers (row) {
    return row.connections || '--'
  }

  renderRowLastUpdated (row) {
    // TODO switch to Intl.RelativeTimeFormat when Beaker reaches Chrome 71
    return row.mtime ? timeDifference(row.mtime) : '--'
  }

  renderRowSize (row) {
    return bytes(row.size)
  }

  renderRowButtons (row) {
    return html`
      <div>
        <button class="btn transparent trash-btn" @click=${e => this.emit('move-to-trash', {key: row.key})}><i class="fas fa-trash"></i></button>
        <button class="btn transparent context-btn" @click=${e => this.onClickRowMenu(e, row)}><i class="fa fa-ellipsis-v"></i></button>
        <span class="select-check" @click=${e => this.onSelectRow(e, row)}><i class="fa fa-check-circle"></i></span>
      </div>
    `
  }

  // events
  // =

  emit (evt, detail) {
    this.dispatchEvent(new CustomEvent(evt, {detail}))
  }

  onSelectRow (e, row) {
    e.preventDefault()
    e.stopPropagation()

    this.selectedRows[row.key] = !this.selectedRows[row.key]
    this.requestUpdate()
    this.dispatchEvent(new Event('selection-changed'))
  }

  onClickRowMenu (e, row) {
    e.preventDefault()
    e.stopPropagation()
    
    // position off the clicked element
    var rect = e.currentTarget.getClientRects()[0]
    var x = rect.right + 4
    var y = getTop(e.currentTarget) + e.currentTarget.offsetHeight
    this.showContextMenu(x, y, row, {withTriangle: true, right: true})
  }

  onContextmenuRow (e, row) {
    e.preventDefault()
    this.showContextMenu(e.clientX, e.clientY, row)
  }

  async showContextMenu (x, y, row, opts) {
    var items = [
      {icon: 'fa fa-external-link-alt', label: 'Open in new tab', click: () => window.open(row.url)},
      {icon: 'fa fa-link', label: 'Copy URL', click: () => writeToClipboard(row.url)},
      {icon: 'code', label: 'View source', click: () => window.open(`beaker://editor/${row.url}`)}
    ]
    if (row.userSettings.isSaved) {
      items.push({icon: 'fas fa-trash', label: 'Move to trash', click: () => this.emit('move-to-trash', {key: row.key})})
    } else {
      items.push({icon: 'fa fa-undo', label: 'Restore from trash', click: () => this.emit('restore-from-trash', {key: row.key})})
      items.push({icon: 'fa fa-times-circle', label: 'Delete permanently', click: () => this.emit('delete-permanently', {key: row.key})})
    }
    await contextMenu.create(Object.assign({x, y, items, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'}, opts))
  }
}
ArchivesListing.styles = [tableCSS, archivesListingCSS]
customElements.define('library-archives-listing', ArchivesListing)

// helpers
// =

function getOwner (archive) {
  return archive.owner ? 'me' : ''
}

// get the offsetTop relative to the document
function getTop (el) {
  let top = 0
  do {
    top += el.offsetTop
  } while ((el = el.offsetParent))
  return top
}

// simple timediff fn till Intl.RelativeTimeFormat lands
// https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time-eg-2-seconds-ago-one-week-ago-etc-best
const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;
const now = Date.now()
function timeDifference (ts) {
  var elapsed = now - ts
  if (elapsed < msPerMinute) {
    let n = Math.round(elapsed/1000)
    return `${n} ${pluralize(n, 'second')} ago`
  } else if (elapsed < msPerHour) {
    let n = Math.round(elapsed/msPerMinute)
    return `${n} ${pluralize(n, 'minute')} ago`
  } else if (elapsed < msPerDay ) {
    let n = Math.round(elapsed/msPerHour )
    return `${n} ${pluralize(n, 'hour')} ago`
  } else if (elapsed < msPerMonth) {
    let n = Math.round(elapsed/msPerDay)
    return `${n} ${pluralize(n, 'day')} ago`
  } else if (elapsed < msPerYear) {
    let n = Math.round(elapsed/msPerMonth)
    return `${n} ${pluralize(n, 'month')} ago`
  } else {
    let n = Math.round(elapsed/msPerYear )
    return `${n} ${pluralize(n, 'year')} ago`
  }
}
