import { LitElement, html, css } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '/vendor/beaker-app-stdlib/js/com/library/socialgraph/explorer.js'
import '/vendor/beaker-app-stdlib/js/com/library/posts/explorer.js'
import '/vendor/beaker-app-stdlib/js/com/library/bookmarks/explorer.js'
import '/vendor/beaker-app-stdlib/js/com/library/reactions/explorer.js'

class DatabaseView extends LitElement {
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
    var category = this.category || 'bookmarks'
    if (this[`render${category}`]) {
      return this[`render${category}`]()
    }
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

customElements.define('library-view-database', DatabaseView)
