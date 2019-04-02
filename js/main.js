import { LitElement, css, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import './com/header-nav.js'
import './com/sidebar.js'
import './com/websites/sidebar.js'
import './com/bookmarks/sidebar.js'
import './views/websites.js'
import './views/bookmarks.js'
import './views/new-website.js'

class Library extends LitElement {
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
      this.category = urlp.searchParams.get('category') || 'your'
    }
  }

  // rendering
  // =

  render () {
    return html`
      <nav>
        <div class="content">
          <library-sidebar></library-sidebar>
          ${this.renderSidebar()}
        </div>
      </nav>
      <main>
        ${this.renderView()}
      </main>
    `
  }

  renderSidebar () {
    switch (this.view) {
      case 'websites':
        return html`
          <library-websites-sidebar
            category="${this.category}"
            @set-category=${this.onSetCategory}
          ></library-websites-sidebar>
        `
      case 'bookmarks':
        return html`
          <library-bookmarks-sidebar
            category="${this.category}"
            @set-category=${this.onSetCategory}
          ></library-bookmarks-sidebar>
        `
    }
  }

  renderView () {
    switch (this.view) {
      case 'bookmarks':
        return html`
          <header-nav
            current-tab=${this.view}
            @change-tab=${this.onSetView}
          ></header-nav>
          <library-view-bookmarks
            category="${this.category}"
          ></library-view-bookmarks>
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
    this.category = 'your'
  }

  onSetCategory (e) {
    this.category = e.detail.category
    history.replaceState({}, '', '/')
  }
}
Library.styles = css`
:host {
  display: flex;
  width: 1040px;
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
