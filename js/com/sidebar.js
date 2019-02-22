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
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="brand">
        <img src="/img/icon.png">
        <span>Your Library</span>
      </div>
      <div class="nav">
        ${this.renderNavItem('all', 'fas fa-fw fa-asterisk', 'All')}
        ${this.renderNavItem('following', 'fas fa-fw fa-rss', 'Following')}
        ${this.renderNavItem('owned', 'fas fa-fw fa-pencil-alt', 'Created by you')}
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

customElements.define('library-sidebar', Sidebar)