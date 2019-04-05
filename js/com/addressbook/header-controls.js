import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { graph } from '../../tmp-unwalled-garden.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import headerControlsCSS from '../../../css/com/header-controls.css.js'

class AddressbookHeaderControls extends LitElement {
  static get properties() {
    return {
      site: {type: String}
    }
  }

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="search-container">
        <input placeholder="Find a person" type="text" class="search" @keyup=${this.onKeyupSearch}>
        <i class="fa fa-search"></i>
      </div>
      ${this.site ? '' : html`
        <div class="actions">
          <div class="dropdown toggleable-container">
            <button class="btn primary thick toggleable" @click=${this.onClickAdd}>
              <span class="fas fa-rss"></span> Add follow
            </button>
          </div>
        </div>
      `}
    `
  }

  async onClickAdd (e) {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // get url
      var url = prompt('Enter the address of the person you want to follow')

      // validate the URL
      try {
        if (!url.includes('://') && url.includes('.')) {
          url = `dat://${url}/`
        } else if (/^[0-9a-f]{64}/.test(url)) {
          url = `dat://${url}`
        }
        let urlp = new URL(url)
      } catch (e) {
        toast.create('Invalid address - must be a valid URL', 'error')
        return
      }

      // save
      await graph.follow(url)
      toast.create('Follow added')
      this.dispatchEvent(new Event('follow-added'))
    } catch (e) {
      toast.create(e.message || e.toString(), 'error')
      console.log(e)
    }
  }

  onKeyupSearch (e) {
    this.dispatchEvent(new CustomEvent('query-changed', {detail: {query: e.currentTarget.value}}))
  }
}
AddressbookHeaderControls.styles = headerControlsCSS

customElements.define('library-addressbook-header-controls', AddressbookHeaderControls)