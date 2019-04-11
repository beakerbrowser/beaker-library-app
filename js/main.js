import { LitElement, css, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import * as QP from './lib/query-params.js'
import { profiles } from './tmp-beaker.js'
import '/vendor/beaker-app-stdlib/js/com/top-right-controls.js'
import './com/header-nav.js'
import './com/viewed-site-header.js'
import './views/addressbook.js'
import './views/bookmarks.js'
import './views/websites.js'
import './views/new-website.js'

const DEFAULT_CATEGORIES = {
  addressbook: 'following',
  bookmarks: 'your',
  websites: 'your'
}

class Library extends LitElement {
  static get properties() {
    return {
      view: {type: String},
      category: {type: String},
      site: {type: String},
      user: {type: Object}
    }
  }

  constructor () {
    super()
    this.view = QP.getParam('view', 'addressbook')
    this.category = QP.getParam('category', DEFAULT_CATEGORIES[this.view])
    this.site = QP.getParam('site', '')
    window.addEventListener('popstate', this.onPopState.bind(this))

    this.load()
    if (this.site) {
      this.resolveSite()
    }
  }

  async load () {
    this.user = await profiles.getCurrentUser()
  }

  async resolveSite () {
    if (this.site.startsWith('dat://')) {
      var url = new URL(this.site)
      // if not a raw url, resolve and update
      if (url.hostname.length !== '64') {
        this.site = `dat://${await DatArchive.resolveName(this.site)}`
        QP.setParams({site: this.site})
      }
    }
  }

  // rendering
  // =

  render () {
    return html`
      <beaker-top-right-controls .user=${this.user}></beaker-top-right-controls>
      <main>
        ${this.site ? html`<viewed-site-header url="${this.site}"></viewed-site-header>` : ''}
        <header-nav
          current-tab=${this.view}
          site=${this.site}
          @change-tab=${this.onSetView}
        ></header-nav>
        ${this.renderView()}
      </main>
    `
  }

  renderView () {
    switch (this.view) {
      case 'bookmarks':
        return html`
          <library-view-bookmarks
            category="${this.category}"
            site="${this.site}"
          ></library-view-bookmarks>
        `
      case 'addressbook':
        return html`
          <library-view-addressbook
            category="${this.category}"
            site="${this.site}"
          ></library-view-addressbook>
        `
      case 'new-website':
        return html`
          <library-view-new-website></library-view-new-website>
        `
      default:
      case 'websites':
        return html`
          <library-view-websites
            category="${['trash', 'seeding'].includes(this.view) ? this.view : 'your'}"
            site="${this.site}"
          ></library-view-websites>
        `
    }
  }

  // events
  // =

  onSetView (e) {
    this.view = e.detail.tab
    this.category = DEFAULT_CATEGORIES[this.view]
    QP.setParams({view: this.view, category: false})
  }

  onSetCategory (e) {
    this.category = e.detail.category
    QP.setParams({category: this.category})
  }

  onPopState (e) {
    this.view = QP.getParam('view')
    this.category = QP.getParam('category') || DEFAULT_CATEGORIES[this.view]
    this.user = QP.getParam('user')
  }
}
Library.styles = css`
:host {
  display: flex;
  width: 810px;
  margin: 0 auto 100px;
}

nav {
  flex: 0 0 200px;
  padding: 0 15px;
}

main {
  flex: 0 0 810px;
}

nav .content {
  padding: 20px 0;
  position: sticky;
  top: 0px;
}

`

customElements.define('library-app', Library)
