import {LitElement, html, css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import {classMap} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/class-map.js'
import sidebarCSS from '../../css/com/sidebar.css.js'

class Sidebar extends LitElement {
  static get properties () {
    return {
      currentCategory: {attribute: 'current-category', reflect: true}
    }
  }

  render() {
    return html`
      <div class="brand">
        <img src="/img/icon.png">
        <span>Your Library</span>
      </div>
      <div class="nav">
        ${this.renderNavItem('all', 'All')}
        ${this.renderNavItem('owned', 'Created by you')}
        ${this.renderNavItem('trash', 'Trash')}
      </div>
    `
  }

  renderNavItem (id, label) {
    const cls = classMap({active: this.currentCategory === id})
    return html`<a class="${cls}" @click=${e => this.onClickNavItem(e, id)}>${label}</a>`
  }

  onClickNavItem (e, id) {
    this.dispatchEvent(new CustomEvent('set-category', {detail: {category: id}}))
  }
}
Sidebar.styles = sidebarCSS

customElements.define('library-sidebar', Sidebar)