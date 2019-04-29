import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '/vendor/beaker-app-stdlib/js/com/library/dats/explorer.js'

class DatsView extends LitElement {
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
    return html`
      <beaker-library-dats-explorer
        category="${this.category}"
      ></beaker-library-dats-explorer>
    `
  }
}

customElements.define('library-view-dats', DatsView)
