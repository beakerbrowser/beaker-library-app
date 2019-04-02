import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import sidebarCSS from '../../css/com/sidebar.css.js'
import { profiles } from '../tmp-beaker.js'
import { toNiceDomain } from '/vendor/beaker-app-stdlib/js/strings.js'

class Sidebar extends LitElement {
  static get properties () {
    return {
      user: {type: Object}
    }
  }

  constructor () {
    super()
    this.load()
  }

  async load () {
    this.user = await profiles.getCurrentUser()
  }

  render() {
    if (!this.user) {
      return html`<div></div>`
    }
    return html`
      <div class="profile">
        <img src="${this.user.url}/thumb">
        <h1>${this.user.title}</h1>
        <p class="url"><a href="${this.user.url}">dat://${toNiceDomain(this.user.url, 6)}/</a></p>
        <p class="bio">${this.user.description}</p>
      </div>
    `
  }
}
Sidebar.styles = sidebarCSS

customElements.define('library-sidebar', Sidebar)