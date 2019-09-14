/* globals beaker */
import { html, css } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { BasePopup } from '/vendor/beaker-app-stdlib/js/com/popups/base.js'
import popupsCSS from '/vendor/beaker-app-stdlib/css/com/popups.css.js'
import { writeToClipboard } from '/vendor/beaker-app-stdlib/js/clipboard.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import { toNiceUrl } from '/vendor/beaker-app-stdlib/js/strings.js'
const profiles = navigator.importSystemAPI('unwalled-garden-profiles')

// exported api
// =

export class AddPinPopup extends BasePopup {
  static get properties () {
    return {
      suggestions: {type: Object}
    }
  }

  static get styles () {
    return [popupsCSS, css`
    .popup-inner {
      width: 1000px;
    }

    .popup-inner .body {
      padding: 0;
    }

    .filter-control {
      padding: 8px 10px;
      background: rgb(250, 250, 250);
      border-bottom: 1px solid rgb(238, 238, 238);
    }

    .filter-control input {
      height: 26px;
      margin: 0;
      width: 100%;
    }

    .suggestions {
      overflow-y: auto;
      max-height: calc(100vh - 300px);
      padding-top: 20px;
      margin-top: 0 !important;
    }

    .empty {
      color: rgba(0, 0, 0, 0.5);
      padding: 0 20px 20px;
    }

    .group {
      padding: 0 0 20px;
    }

    .group-title {
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 10px;
      padding-bottom: 5px;
      padding-left: 20px;
      letter-spacing: -0.5px;
    }

    .group-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding-right: 20px;
    }

    .suggestion {
      display: flex;
      align-items: center;
      padding: 10px;
      overflow: hidden;
      user-select: none;
    }

    .suggestion .thumb {
      flex: 0 0 80px;
      width: 80px;
      height: 64px;
      object-fit: scale-down;
      background: #fff;
      margin: 0 20px 0 10px;
      border: 1px solid #aaa;
      border-radius: 3px;
    }

    .suggestion .details {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .suggestion .title,
    .suggestion .url {
      display: block;
      white-space: nowrap;
      line-height: 1.7;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .suggestion .title {
      font-size: 14px;
      font-weight: 500;
    }

    .suggestion .url {
      font-size: 12px;
      color: var(--blue);
    }

    .suggestion:hover {
      background: #eee;
    }
    `]
  }

  constructor () {
    super()
    this.user = null
    this.suggestions = {}
    this.query = ''
    this.isURLFocused = false

    this.initialLoad()
  }

  // management
  //

  static async create () {
    return BasePopup.create(AddPinPopup)
  }

  static destroy () {
    return BasePopup.destroy('add-pin-popup')
  }

  async initialLoad () {
    this.user = await profiles.me()
    await this.loadSuggestions()
  }

  async loadSuggestions () {
    this.suggestions = await beaker.crawler.listSuggestions(this.user.url, this.query)
    console.log(this.query, this.suggestions)
  }

  // rendering
  // =

  renderTitle () {
    return 'Pin to start page'
  }

  renderBody () {
    var hasResults = !this.query || (Object.values(this.suggestions).filter(arr => arr.length > 0).length > 0)
    return html`  
      <div class="filter-control">
        <input type="text" id="search-input" name="url" placeholder="Search" @input=${this.onFocusSearch} @keyup=${e => delay(this.onChangeQuery.bind(this), e)} />
      </div>
      <div class="suggestions ${this.query ? 'query-results' : 'defaults'}">
        ${hasResults ? '' : html`<div class="empty">No results</div>`}
        ${this.renderSuggestionGroup('bookmarks', 'My Bookmarks')}
        ${this.renderSuggestionGroup('websites', 'Websites')}
        ${this.renderSuggestionGroup('people', 'People')}
        ${this.renderSuggestionGroup('modules', 'Modules')}
        ${this.renderSuggestionGroup('themes', 'Themes')}
        ${this.renderSuggestionGroup('templates', 'Templates')}
        ${this.renderSuggestionGroup('history', 'My Browsing History')}
      </div>
    `
  }

  renderSuggestionGroup (key, label) {
    var group = this.suggestions[key]
    if (!group || !group.length) return ''
    return html`
      <div class="group">
        <div class="group-title">${label}</div>
        <div class="group-items">${group.map(g => this.renderSuggestion(g))}</div>
      </div>`
  }
  
  renderSuggestion (row) {
    const title = row.title || 'Untitled'
    return html`
      <a href=${row.url} class="suggestion" title=${title} @click=${this.onClick} @contextmenu=${this.onContextMenu}>
        <img class="thumb" src="asset:thumb:${row.url}"/>
        <span class="details">
          <span class="title">${title}</span>
          <span class="url">${toNiceUrl(row.url)}</span>
        </span>
      </a>
    `
  }

  firstUpdated () {
    this.shadowRoot.querySelector('input').focus()
  }
  
  // events
  // =

  onFocusSearch () {
    if (!this.isURLFocused) {
      this.isURLFocused = true
    }
  }
  
  async onChangeQuery (e) {
    this.query = this.shadowRoot.querySelector('input').value
    this.loadSuggestions()
  }

  async onClick (e) {
    e.preventDefault()
    const detail = {
      href: e.currentTarget.getAttribute('href'),
      title: e.currentTarget.getAttribute('title')
    }
    this.dispatchEvent(new CustomEvent('resolve', {detail}))
  }
    
  onContextMenu (e) {
    e.preventDefault()
    var url = e.currentTarget.getAttribute('href')
    const items = [
      {icon: 'fa fa-external-link-alt', label: 'Open Link in New Tab', click: () => window.open(url)},
      {icon: 'fa fa-link', label: 'Copy Link Address', click: () => writeToClipboard(url)}
    ]
    contextMenu.create({x: e.clientX, y: e.clientY, items, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }
}
customElements.define('add-pin-popup', AddPinPopup)


// helpers
// =

function trunc (str, n) {
  if (str && str.length > n) {
    str = str.slice(0, n - 3) + '...'
  }
  return str
}

function delay (cb, param) {
  window.clearTimeout(cb)
  setTimeout(cb, 150, param)
}
