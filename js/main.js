import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import * as QP from './lib/query-params.js'
import _debounce from '/vendor/lodash.debounce.js'
import './com/nav.js'
import './com/side-filters.js'
import './com/filters.js'
import './views/pins.js'
import './views/bookmarks.js'
import './views/statuses.js'
import './views/dats.js'
import './views/people.js'
import mainCSS from '../css/main.css.js'

export class LibraryApp extends LitElement {
  static get properties () {
    return {
      items: {type: Array}
    }
  }

  static get styles () {
    return mainCSS
  }

  constructor () {
    super()

    this.user = null
    this.currentView = QP.getParam('view', 'pins')
    this.currentWritableFilter = QP.getParam('writable', '')
    this.items = []

    this.load()

    window.addEventListener('focus', _debounce(() => {
      // load latest when we're opened, to make sure we stay in sync
      this.load()
    }, 500))
  }

  async load () {
    if (!this.user) {
      this.user = await beaker.users.getCurrent()
    }
    await this.requestUpdate()
    try {
      await this.shadowRoot.querySelector('[the-current-view]').load()
    } catch (e) {
      console.debug(e)
    }
  }

  // rendering
  // =

  render () {    
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <library-nav
        .user=${this.user}
        currentView=${this.currentView}
        @change-view=${this.onChangeView}
      ></library-nav>
      ${''/*<div id="content-header">
        <library-filters
          query=${this.currentQuery}
          writable=${this.currentWritableFilter}
          @clear-query=${this.onClearQuery}
          @clear-writable=${this.onClearWritableFilter}
        ></library-filters>
        </div>*/}
      <div id="content">
        ${this.renderView()}
      </div>
    `
  }

  renderView () {
    switch (this.currentView) {
      case 'pins':
        return html`<pins-view the-current-view></pins-view>`
      case 'bookmarks':
        return html`
          <bookmarks-view
            the-current-view
            .user=${this.user}
            currentView=${this.currentView}
          ></bookmarks-view>
        `
      case 'status-updates':
        return html`
          <statuses-view
            the-current-view
            .user=${this.user}
          ></statuses-view>
        `
      case 'people':
        return html`
          <people-view
            the-current-view
            .user=${this.user}
            currentView=${this.currentView}
          ></people-view>
        `
      case 'websites':
      case 'archives':
      case 'trash':
        return html`
          <dats-view
            the-current-view
            .user=${this.user}
            currentView=${this.currentView}
          ></dats-view>
        `
      default:
        return html`<div class="empty"><div><span class="fas fa-toolbox"></span></div>Under Construction</div>`
    }
  }

//   <library-side-filters
//   current=${this.currentWritableFilter}
//   @change=${this.onChangeWritableFilter}
// ></library-side-filters>

  // events
  // =

  onChangeCategory (e) {
    this.currentCategory = e.detail.category
    QP.setParams({category: this.currentCategory})
    this.load()
  }

  onChangeView (e) {
    this.currentView = e.detail.view
    QP.setParams({view: this.currentView})
    this.load()
  }

  onClearType (e) {
    this.currentView = undefined
    QP.setParams({type: this.currentView})
    this.load()
  }

  onChangeWritableFilter (e) {
    this.currentWritableFilter = e.detail.writable
    QP.setParams({writable: this.currentWritableFilter})
    this.load()
  }

  onClearWritableFilter (e) {
    this.currentWritableFilter = ''
    QP.setParams({writable: this.currentWritableFilter})
    this.load()
  }
}

customElements.define('library-app', LibraryApp)