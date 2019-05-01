import { LitElement, css, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { ucfirst } from '/vendor/beaker-app-stdlib/js/strings.js'
import { changeFavicon } from '/vendor/beaker-app-stdlib/js/dom.js'
import * as QP from './lib/query-params.js'
import { profiles } from './tmp-beaker.js'
import './com/app-nav.js'
import '/vendor/beaker-app-stdlib/js/com/library/dats/explorer.js'
import './views/database.js'
import './views/files.js'
import './views/new-website.js'

class Library extends LitElement {
  static get properties() {
    return {
      view: {type: String},
      category: {type: String},
      dat: {type: String},
      path: {type: String},
      user: {type: Object},
      ownerFilter: {type: Object}
    }
  }

  constructor () {
    super()
    this.view = QP.getParam('view', 'dats')
    this.category = QP.getParam('category', '')
    this.dat = QP.getParam('dat', '')
    this.path = QP.getParam('path', '')
    this.ownerFilter = QP.getParam('ownerFilter', '')
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
    let title = false
    if (this.view === 'dats') {
      title = ucfirst(this.category)
      changeFavicon(`/img/${this.category}.png`)
    } else if (this.view === 'files') {
      title = (this.path || '').split('/').filter(Boolean).pop()
      changeFavicon(`/img/files.png`)
    } else if (this.view === 'database') {
      let c = this.category || 'bookmarks'
      title = ucfirst(c)
      changeFavicon(`/img/${c}.png`)
    }
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
      case 'database':
        return html`
          <library-view-database
            .user=${this.user}
            category=${this.category}
            owner-filter=${this.ownerFilter}
          ></library-view-database>
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
          <beaker-library-dats-explorer
            .user=${this.user}
            category="${this.category}"
            owner-filter=${this.ownerFilter}
          ></beaker-library-dats-explorer>
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
    this.ownerFilter = e.detail.ownerFilter || ''
    QP.setParams({
      view: this.view,
      category: this.category,
      dat: this.dat,
      path: this.path,
      ownerFilter: this.ownerFilter
    }, true)
    this.setTitle()
  }

  onSetCategory (e) {
    this.category = e.detail.category
    QP.setParams({category: this.category})
  }

  onPopState (e) {
    this.view = QP.getParam('view')
    this.category = QP.getParam('category')
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
  background: #f0f0f3;
  border-right: 1px solid #d4d7dc;
  height: 100vh;
  overflow-y: auto;
}

main {
  background: #fff;
}
`

customElements.define('library-app', Library)
