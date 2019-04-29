import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import '/vendor/beaker-app-stdlib/js/com/library/files/explorer.js'

class FilesView extends LitElement {
  static get properties() {
    return {
      dat: {type: String},
      path: {type: String},
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
      <beaker-library-files-explorer
        dat="${this.dat}"
        path="${this.path}"
      ></beaker-library-files-explorer>
    `
  }
}

customElements.define('library-view-files', FilesView)
