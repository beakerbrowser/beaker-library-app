import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { repeat } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/repeat.js'
import { writeToClipboard } from '/vendor/beaker-app-stdlib/js/clipboard.js'
import { toNiceUrl, ucfirst } from '/vendor/beaker-app-stdlib/js/strings.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import datsViewCSS from '../../css/views/dats.css.js'
import * as QP from '../lib/query-params.js'
import { oneof } from '../lib/validation.js'
import libTools from '/vendor/library-tools/index.build.js'
import '../com/subview-tabs.js'
import '../hover-menu.js'
const UwG = {
  library: navigator.importSystemAPI('unwalled-garden-library')
}

const SUBVIEWS = [
  {id: 'library', label: 'Library'},
  {id: 'network', label: 'Network'}
]

const SORT_OPTIONS = {
  mtime: 'Recently updated',
  title: 'Alphabetical'
}

class DatsView extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      items: {type: Array},
      currentView: {type: String},
      currentSubview: {type: String},
      currentQuery: {type: String},
      currentSort: {type: String},
    }
  }

  static get styles () {
    return datsViewCSS
  }

  get userUrl () {
    return this.user ? this.user.url : ''
  }

  constructor () {
    super()
    this.currentSubview = oneof(QP.getParam('subview'), 'library', ['library', 'network'])
    this.currentSort = oneof(QP.getParam('sort'), 'mtime', ['mtime', 'title'])
    this.currentQuery = ''
    this.items = []
  }

  async load () {
    // fetch listing
    var items
    if (this.currentView === 'trash') {
      items = await beaker.archives.listTrash()
    } else {
      items = await UwG.library.list({
        types: libTools.categoryToType(this.currentView),
        isSaved: this.currentSubview === 'library' ? true : undefined,
        visibility: this.currentSubview === 'library' ? undefined : 'public',
        sortBy: this.currentSort
      })
    }

    // manually filter for 'archives' view
    if (this.currentView === 'archives') {
      items = items.filter(item => !libTools.typeToCategory(item.meta.type))
    }

    this.items = items
    console.log('loaded', this.items)
  }

  showMenu (item, x, y, isContextMenu) {
    let url = `dat://${item.key}`
    var items = [
      {icon: 'fas fa-fw fa-external-link-alt', label: 'Open in new tab', click: () => beaker.browser.openUrl(url, {setActive: true}) },
      {icon: 'fas fa-fw fa-link', label: 'Copy URL', click: () => {
        writeToClipboard(url)
        toast.create('Copied to your clipboard')
      }},
      '-',
      {icon: 'fas fa-fw fa-code-branch', label: 'Fork this site', click: async () => {
        await DatArchive.fork(url)
        this.load()
      }}
    ]
    if (url !== this.userUrl) {
      items.push('-')
      if (item.isSaved) {
        items.push({icon: 'fas fa-trash', label: 'Move to trash', click: async () => {
          await UwG.library.configure(item.key, {isSaved: false})
          toast.create('Moved to trash')
          this.load()
        }})
      } else {
        items.push({icon: 'fas fa-undo', label: 'Restore from trash', click: async () => {
          await UwG.library.configure(item.key, {isSaved: true})
          toast.create('Restored')
          this.load()
        }})
      }
    }
  
    contextMenu.create({
      x,
      y,
      right: !isContextMenu,
      withTriangle: !isContextMenu,
      roomy: !isContextMenu,
      noBorders: true,
      fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css',
      style: `padding: 4px 0`,
      items 
    })
  }

  // rendering
  // =

  render () {
    document.title = ucfirst(this.currentView)
    let items = this.items
    
    // apply query filter
    if (this.currentQuery) {
      let q = this.currentQuery.toLowerCase()
      items = items.filter(item => (
        (item.meta.title || '').toLowerCase().includes(q)
        || (item.meta.description || '').toLowerCase().includes(q)
        || (item.key || '').toLowerCase().includes(q)
      ))
    }

    const isViewingTrash = this.currentView === 'trash'
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="header">
        ${isViewingTrash 
          ? html`<button @click=${this.onEmptyTrash}><span class="fas fa-fw fa-trash"></span> Empty trash</button>`
          : html`
            <subview-tabs
              .items=${SUBVIEWS}
              current=${this.currentSubview}
              @change=${this.onChangeSubview}
            ></subview-tabs>
          `}
        <div class="spacer"></div>
        ${['library', 'network'].includes(this.currentSubview) ? html`
          <hover-menu
            right
            icon="fas fa-sort-amount-down"
            .options=${SORT_OPTIONS}
            current=${SORT_OPTIONS[this.currentSort]}
            @change=${this.onChangeSort}
          ></hover-menu>
        ` : ''}
        <div class="search-container">
          <input @keyup=${this.onKeyupQuery} placeholder="Search" class="search" value=${this.currentQuery} />
          <i class="fa fa-search"></i>
        </div>
      </div>
      ${!items.length
        ? html`<div class="empty"><div><span class="${isViewingTrash ? 'fas fa-trash' : 'far fa-sad-tear'}"></span></div>No ${this.currentView} found.</div>`
        : ''}
      <div class="listing">
        ${repeat(items, item => this.renderItem(item))}
      </div>
    `
  }

  renderItem (item) {
    return html`
      <a class="item" href=${`dat://`+item.key} @contextmenu=${e => this.onContextMenuDat(e, item)}>
        <img src="asset:thumb:dat://${item.key}?cache_buster=${Date.now()}">
        <div class="details">
          <div class="title">${item.meta.title}</div>
          <div class="author">by ${item.author ? item.author.title : 'You'}</div>
          <div class="bottom-line">
            <span>${this.renderVisibility(item.visibility)}</span>
            ${item.meta.isOwner ? html`<span class="label">Owner</span>` : ''}
          </div>
        </div>
      </a>
    `
  }

  renderVisibility (visibility) {
    var icon = ''
    switch (visibility) {
      case 'public': icon = 'fa-globe-americas'; break
      case 'private': icon = 'fa-lock'; break
      case 'unlisted': icon = 'fa-eye'; break
    }
    return html`<span class="visibility ${visibility}"><span class="fa-fw fas ${icon}"></span> ${ucfirst(visibility)}</span>`
  }

  // events
  // =

  onChangeSubview (e) {
    this.currentSubview = e.detail.id
    QP.setParams({subview: this.currentSubview})
    this.load()
  }

  onChangeSort (e) {
    this.currentSort = e.detail.id
    QP.setParams({sort: this.currentSort})
    this.load()
  }

  onKeyupQuery (e) {
    this.currentQuery = e.currentTarget.value
  }

  onContextMenuDat (e, item) {
    e.preventDefault()
    e.stopPropagation()

    this.showMenu(item, e.clientX, e.clientY, true)
  }

  onClickItemMenu (e, item) {
    e.preventDefault()
    e.stopPropagation()

    var rect = e.currentTarget.getClientRects()[0]
    this.showMenu(item, rect.right + 4, rect.bottom + 8, false)
  }

  async onEmptyTrash () {
    if (!confirm('Empty your trash? This will delete the dats from you computer.')) {
      return
    }
    await beaker.archives.collectTrash()
    this.load()
  }
}
customElements.define('dats-view', DatsView)