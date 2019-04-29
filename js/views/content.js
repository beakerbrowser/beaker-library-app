import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '/vendor/beaker-app-stdlib/js/com/library/files/explorer.js'
import '/vendor/beaker-app-stdlib/js/com/library/socialgraph/explorer.js'
import '/vendor/beaker-app-stdlib/js/com/library/posts/explorer.js'
import '/vendor/beaker-app-stdlib/js/com/library/bookmarks/explorer.js'
import '/vendor/beaker-app-stdlib/js/com/library/reactions/explorer.js'

class ContentView extends LitElement {
  static get properties() {
    return {
      category: {type: String},
      user: {type: Object}
    }
  }

  constructor () {
    super()
  }

  // rendering
  // =

  render () {
    if (this[`render${this.category}`]) {
      return this[`render${this.category}`]()
    }
  }

  renderfiles () {
    if (!this.user) return html`<div></div>`
    return html`
      <beaker-library-files-explorer
        url="${this.user.url}"
      ></beaker-library-files-explorer>
    `
  }

  rendersocialgraph () {
    return html`
      <beaker-library-socialgraph-explorer
      ></beaker-library-socialgraph-explorer>
    `    
  }

  renderposts () {
    return html`
      <beaker-library-posts-explorer
      ></beaker-library-posts-explorer>
    `    
  }

  renderbookmarks () {
    return html`
      <beaker-library-bookmarks-explorer
      ></beaker-library-bookmarks-explorer>
    `    
  }

  renderreactions () {
    return html`
      <beaker-library-reactions-explorer
      ></beaker-library-reactions-explorer>
    `    
  }
}

customElements.define('library-view-content', ContentView)
