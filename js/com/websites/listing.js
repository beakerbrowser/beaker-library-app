import { html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { library, profiles } from '../../tmp-beaker.js'
import { graph } from '../../tmp-unwalled-garden.js'
import bytes from '/vendor/beaker-app-stdlib/vendor/bytes/index.js'
import { pluralize } from '/vendor/beaker-app-stdlib/js/strings.js'
import { Table } from '/vendor/beaker-app-stdlib/js/com/table.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import { writeToClipboard } from '/vendor/beaker-app-stdlib/js/clipboard.js'
import tableCSS from '/vendor/beaker-app-stdlib/css/com/table.css.js'
import websitesListingCSS from '../../../css/com/websites/listing.css.js'
import '/vendor/beaker-app-stdlib/js/com/img-fallbacks.js'

class WebsitesListing extends Table {
  static get properties() {
    return { 
      rows: {type: Array},
      category: {type: String},
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
  }

  get columns () {
    return [
      {id: 'thumb', renderer: 'renderRowThumb'},
      {id: 'title', flex: 4, renderer: 'renderRowTitle'},
      {id: 'size', width: 70, renderer: 'renderRowSize'}
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

  get selectedUrls () {
    return Object.entries(this.selectedRows).filter(([key, b]) => b).map(([key]) => key)
  }

  isRowSelected (row) {
    return this.selectedRows[row.url]
  }

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'category' && newval) {
      // trigger a load when we change categories
      this.load()
    }
  }

  selectAll () {
    this.selectedRows = fromEntries(this.archives.map(({url}) => ([url, true]))) // create an object of {[url]: true} for each entry
    this.dispatchEvent(new Event('selection-changed'))
  }

  deselectAll () {
    this.selectedRows = {}
    this.dispatchEvent(new Event('selection-changed'))
  }

  // data management
  // =

  async load () {
    this.deselectAll()
    try {
      let user = await profiles.getCurrentUser()
      if (this.category === 'following') {
        let follows = await graph.listFollows(user.url)
        this.archives = await Promise.all(follows.map(follow => library.get(follow.url)))
      } else {
        let filters = {}
        switch (this.category) {
          case 'seeding':
            filters.owner = false
            filters.saved = true
            break
          case 'your':
            filters.owner = true
            filters.saved = true
            break
          case 'trash':
            filters.owner = true
            filters.saved = false
            break
          case 'all':
            filters.saved = true
            break
        }
        this.archives = await library.list({filters})
      }
      this.archives = this.archives.filter(a => a.url !== user.url)
      this.sort()
      console.log(this.archives)
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
      var v = (b.title || '').localeCompare(a.title || '')
      return v * direction
    })
    this.requestUpdate()
  }

  // rendering
  // =

  renderRowThumb (row) {
    return html`<img class="favicon" slot="img2" src="beaker-favicon:32,${row.url}">`
    // return html`
    //   <beaker-img-fallbacks>
    //     <img class="thumb" slot="img1" src="${row.url}/thumb">
    //     <img class="favicon" slot="img2" src="beaker-favicon:32,${row.url}">
    //   </beaker-img-fallbacks>
    // `
  }

  renderRowTitle (row) {
    return html`
      <div class="title-line"><a href="${row.url}">${row.title || html`<em>Untitled</em>`}</a></div>
      ${row.description ? html`<div class="description-line">${row.description}</div>` : ''}
      ${row.localPath ? html`<div class="local-path-line">${row.localPath}</div>` : ''}
      <div class="meta-line">
        <span>${row.isUser ? html`<strong>Your Profile Site</strong>` : 'Website'}</span>
        <span><i class="fas fa-share-alt"></i> ${row.connections}</span>
        ${row.mtime ? html`<span>Last updated ${timeDifference(row.mtime)}</span>` : ''}
      </div>
    `
  }

  renderRowSize (row) {
    return bytes(row.size)
  }

  renderRowButtons (row) {
    return html`
      <div>
        <button class="btn context-btn" @click=${e => this.onClickRowMenu(e, row)}>
          Actions <i class="fa fa-caret-down"></i>
        </button>
      </div>
    `
  }

  renderEmpty () {
    switch (this.category) {
      case 'following': return html`<div class="empty">You are not currently following any sites.</div>`
      case 'seeding': return html`<div class="empty">You are not currently seeding any sites.</div>`
      case 'your': return html`<div class="empty">You have not created any sites.</div>`
      case 'trash': return html`<div class="empty">Your trash is empty.</div>`
      case 'all': return html`<div class="empty">Your library is empty.</div>`
      default: return html`<div class="empty">No sites found.</div>`
    }
  }

  // events
  // =

  emit (origEvt, evt, detail) {
    if (origEvt) {
      origEvt.preventDefault()
      origEvt.stopPropagation()
    }
    this.dispatchEvent(new CustomEvent(evt, {detail}))
  }

  onClickRow (e, row) {
    // DISABLED
    // this behavior isnt my favorite right now
    // -prf
    return
    if (e.shiftKey) {
      this.selectedRows[row.url] = !this.selectedRows[row.url]
    } else {
      this.selectedRows = {[row.url]: true}
    }
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
    if (!row.isUser) {
      if (row.saved) {
        items.push({icon: 'fas fa-trash', label: 'Move to trash', click: () => this.emit(null, 'move-to-trash', {url: row.url})})
      } else {
        items.push({icon: 'fa fa-undo', label: 'Restore from trash', click: () => this.emit(null, 'restore-from-trash', {url: row.url})})
        items.push({icon: 'fa fa-times-circle', label: 'Delete permanently', click: () => this.emit(null, 'delete-permanently', {url: row.url})})
      }
    }
    await contextMenu.create(Object.assign({x, y, items, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'}, opts))
  }
}
WebsitesListing.styles = [tableCSS, websitesListingCSS]
customElements.define('library-websites-listing', WebsitesListing)

// helpers
// =

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

function fromEntries (iterable) {
  return [...iterable]
    .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {})
}