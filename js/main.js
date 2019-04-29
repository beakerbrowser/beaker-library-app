import { LitElement, css, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import * as QP from './lib/query-params.js'
import { profiles } from './tmp-beaker.js'
import './com/app-nav.js'
import './views/content.js'
import './views/files.js'
import './views/dats.js'
import './views/new-website.js'

const DEFAULT_CATEGORIES = {
  addressbook: 'following',
  bookmarks: 'your',
  websites: 'your'
}

const VIEW_TITLES = {
  addressbook: 'Address book',
  bookmarks: 'Bookmarks',
  websites: 'Websites',
}

class Library extends LitElement {
  static get properties() {
    return {
      view: {type: String},
      category: {type: String},
      dat: {type: String},
      path: {type: String},
      user: {type: Object}
    }
  }

  constructor () {
    super()
    this.view = QP.getParam('view', 'dats')
    this.category = QP.getParam('category', '')
    this.dat = QP.getParam('dat', '')
    this.path = QP.getParam('path', '')
    window.addEventListener('popstate', this.onPopState.bind(this))
    this.setTitle()

    this.load()
    if (this.dat) {
      this.resolveSite()
    }
  }

  async load () {
    this.user = await profiles.getCurrentUser()
  }

  setTitle () {
    let title = VIEW_TITLES[this.view]
    document.title = title ? `${title} | Library` : 'Library'
  }

  async resolveSite () {
    if (this.dat.startsWith('dat://')) {
      var url = new URL(this.dat)
      // if not a raw url, resolve and update
      if (url.hostname.length !== '64') {
        this.dat = `dat://${await DatArchive.resolveName(this.dat)}`
        QP.setParams({dat: this.dat})
      }
    }
  }

  // rendering
  // =

  render () {
    return html`
      <nav>
        <h1 class="brand">
          <img src="asset:favicon:beaker://library">
          Library
        </h1>
        <app-nav
          .user=${this.user}
          view=${this.view}
          category=${this.category}
          dat=${this.dat}
          @change-location=${this.onChangeLocation}
        ></app-nav>
      </nav>
      <main @change-location=${this.onChangeLocation}>
        ${this.renderView()}
      </main>
    `
  }

  renderView () {
    switch (this.view) {
      case 'content':
        return html`
          <library-view-content
            .user=${this.user}
            category=${this.category}
            ></library-view-content>
        `
      case 'files':
        return html`
          <library-view-files
            .user=${this.user}
            dat=${this.dat}
            path=${this.path}
            ></library-view-files>
        `
      case 'new-website':
        return html`
          <library-view-new-website></library-view-new-website>
        `
      case 'dats':
      default:
        return html`
          <library-view-dats
            .user=${this.user}
            category=${this.category}
            ></library-view-dats>
        `
    }
  }

  // events
  // =

  onChangeLocation (e) {
    this.view = e.detail.view || ''
    this.category = e.detail.category || ''
    this.dat = e.detail.dat || ''
    this.path = e.detail.path || ''
    QP.setParams({
      view: this.view,
      category: this.category,
      dat: this.dat,
      path: this.path
    }, true)
    this.setTitle()
  }

  onSetCategory (e) {
    this.category = e.detail.category
    QP.setParams({category: this.category})
  }

  onPopState (e) {
    this.view = QP.getParam('view')
    this.category = QP.getParam('category') || DEFAULT_CATEGORIES[this.view]
    this.dat = QP.getParam('dat')
    this.path = QP.getParam('path')
  }
}
Library.styles = css`
:host {
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 200px calc(100vw - 200px);
}

nav {
  background: #eeeeef;
  border-right: 1px solid #d4d7dc;
  height: 100vh;
  overflow-y: auto;
}

main {
  background: #fff;
}

nav .brand {
  display: flex;
  align-items: center;
  color: #555;
  font-weight: 500;
  font-size: 16px;
}

nav .brand img {
  width: 26px;
  height: 26px;
  margin: 0 8px 0 13px;
}

`

customElements.define('library-app', Library)
