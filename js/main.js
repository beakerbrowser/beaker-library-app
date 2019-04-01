import { LitElement, css, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { library } from './tmp-beaker.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import './com/header-nav.js'
import './com/sidebar.js'
import './com/websites/sidebar.js'
import './views/websites.js'
import './views/new-website.js'

class Archives extends LitElement {
  static get properties() {
    return {
      view: {type: String},
      category: {type: String}
    }
  }

  constructor () {
    super()
    this.view = ''
    this.category = ''

    let urlp = new URL(window.location)
    if (urlp.searchParams.has('new')) {
      this.view = 'new'
    } else {
      this.view = 'websites'
      this.category = urlp.searchParams.get('category') || 'owned'
    }
  }

  // rendering
  // =

  render () {
    return html`
      <nav>
        <div class="content">
          <library-sidebar></library-sidebar>
          <library-websites-sidebar
            current-category="${this.category}"
            @set-category=${this.onSetCategory}
          ></library-websites-sidebar>
        </div>
      </nav>
      <main>
        ${this.renderView()}
      </main>
    `
  }

  renderView () {
    switch (this.view) {
      case 'bookmarks':
        return html`
          <header-nav
            current-tab=${this.view}
            @change-tab=${this.onSetView}
          ></header-nav>
        `
      case 'addressbook':
        return html`
          <header-nav
            current-tab=${this.view}
            @change-tab=${this.onSetView}
          ></header-nav>
        `
      case 'new':
        return html`
          <library-view-new-website></library-view-new-website>
        `
      default:
      case 'websites':
        return html`
          <header-nav
            current-tab=${this.view}
            @change-tab=${this.onSetView}
          ></header-nav>
          <library-view-websites
            category="${this.category}"
          ></library-view-websites>
        `
    }
  }

  // events
  // =

  onSetView (e) {
    this.view = e.detail.tab
  }

  onSetCategory (e) {
    this.view = 'websites'
    this.category = e.detail.category
    history.replaceState({}, '', '/')
  }
}
Archives.styles = css`
:host {
  display: flex;
  max-width: 1040px;
  margin: 0 0 100px;
}

nav {
  width: 200px;
  padding: 0 15px;
}

main {
  flex: 1;
}

nav .content {
  padding: 20px 0;
  position: sticky;
  top: 0px;
}

`

customElements.define('library-archives', Archives)
