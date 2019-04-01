import {LitElement, html, css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import {classMap} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/class-map.js'
import sidebarCSS from '../../../css/com/sidebar.css.js'

class Sidebar extends LitElement {
  static get properties () {
    return {
      currentCategory: {attribute: 'current-category', reflect: true}
    }
  }

  render() {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="nav">
        ${this.renderNavItem('owned', 'fas fa-fw fa-hdd', 'Your websites')}
        ${this.renderNavItem('seeding', 'fas fa-fw fa-share-alt', 'Seeding')}
        <hr>
        ${this.renderNavItem('trash', 'fas fa-fw fa-trash', 'Trash')}
      </div>
    `
  }

  renderNavItem (id, icon, label) {
    const cls = classMap({active: this.currentCategory === id})
    return html`
      <a class="${cls}" @click=${e => this.onClickNavItem(e, id)}>
        <i class="${icon}"></i>
        ${label}
      </a>`
  }

  onClickNavItem (e, id) {
    this.dispatchEvent(new CustomEvent('set-category', {detail: {category: id}}))
  }
}
Sidebar.styles = sidebarCSS

customElements.define('library-websites-sidebar', Sidebar)