import {LitElement, html, css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import {classMap} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/class-map.js'
import sidebarCSS from '../../../css/com/sidebar.css.js'

class Sidebar extends LitElement {
  static get properties () {
    return {
      category: {reflect: true}
    }
  }

  render() {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="nav">
        ${this.renderNavItem('following', 'fas fa-fw fa-rss', 'Following')}
      </div>
    `
  }

  renderNavItem (id, icon, label) {
    const cls = classMap({active: this.category === id})
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

customElements.define('library-addressbook-sidebar', Sidebar)