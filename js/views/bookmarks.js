import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { repeat } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/repeat.js'
import { timeDifference } from '/vendor/beaker-app-stdlib/js/time.js'
import { writeToClipboard } from '/vendor/beaker-app-stdlib/js/clipboard.js'
import { toNiceUrl, ucfirst } from '/vendor/beaker-app-stdlib/js/strings.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import bookmarksViewCSS from '../../css/views/bookmarks.css.js'
import * as QP from '../lib/query-params.js'
import { oneof } from '../lib/validation.js'
import '../com/subview-tabs.js'
import '../hover-menu.js'
const UwG = {
  bookmarks: navigator.importSystemAPI('unwalled-garden-bookmarks'),
  follows: navigator.importSystemAPI('unwalled-garden-follows')
}

const SUBVIEWS = [
  {id: 'library', label: 'Library'},
  {id: 'network', label: 'Network'}
]

const SORT_OPTIONS = {
  createdAt: 'Latest',
  title: 'Alphabetical'
}

class BookmarksView extends LitElement {
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
    return bookmarksViewCSS
  }

  get userUrl () {
    return this.user ? this.user.url : ''
  }

  constructor () {
    super()
    this.currentSubview = oneof(QP.getParam('subview'), 'library', ['library', 'network'])
    this.currentSort = oneof(QP.getParam('sort'), 'createdAt', ['createdAt', 'title'])
    this.currentQuery = ''
    this.items = []
  }

  async load () {
    var authors = undefined
    if (this.currentSubview === 'network') {
      authors = (await UwG.follows.list({authors: this.userUrl})).map(({topic}) => topic.url)
    } else {
      authors = [
        this.userUrl,
        (await navigator.filesystem.getRoot()).url
      ]
    }
    var items = await UwG.bookmarks.list({
      authors,
      isOwner: this.currentSubview === 'library' ? true : undefined,
      sortBy: this.currentSort,
      reverse: this.currentSort === 'createdAt'
    })
    this.items = items
    console.log('loaded', this.currentSort, this.items)
  }

  // rendering
  // =

  render () {
    document.title = 'Bookmarks'
    let items = this.items
    
    // apply query filter
    if (this.currentQuery) {
      let q = this.currentQuery.toLowerCase()
      items = items.filter(item => (
        (item.title || '').toLowerCase().includes(q)
        || (item.description || '').toLowerCase().includes(q)
        || (item.href || '').toLowerCase().includes(q)
        || (item.tags.join(' ') || '').toLowerCase().includes(q)
      ))
    }

    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="header">
        <subview-tabs
          .items=${SUBVIEWS}
          current=${this.currentSubview}
          @change=${this.onChangeSubview}
        ></subview-tabs>
        <div class="spacer"></div>
        ${['library', 'network'].includes(this.currentSubview) ? html`
          <hover-menu
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
        ? html`<div class="empty"><div><span class="far fa-sad-tear"></span></div>No bookmarks found.</div>`
        : ''}
      <div class="listing">
        ${repeat(items, item => this.renderItem(item))}
      </div>
    `
  }

  renderItem (item) {
    return html`
      <a class="bookmark" href=${item.href}>
        <span class="favicon"><img src="asset:favicon:${item.href}"></span>
        <span class="title">${item.title}</span>
        <span class="href">${item.href}</span>
        <span class="description">${item.description}</span>
        <span class="tags">${item.tags.join(', ')}</span>
        <span class="visibility">
          <span class="fas fa-fw fa-${item.visibility === 'public' ? 'globe-americas' : 'lock'}"></span>
        </span>
        ${item.visibility === 'public' ? html`
          <span
            class="author"
            data-tooltip=${item.author.title || 'Anonymous'}
            @click=${e => this.onClickAuthor(e, item)}
          >
            <img src="asset:thumb:${item.author.url}">
          </span>
        ` : ''}
      </a>
    `
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

  onClickAuthor (e, item) {
    e.preventDefault()
    e.stopPropagation()
    window.open(item.author.url)
  }
}
customElements.define('bookmarks-view', BookmarksView)