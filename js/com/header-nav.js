import { html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { TabsNav } from '/vendor/beaker-app-stdlib/js/com/tabs-nav.js'
import tabsNavCSS from '/vendor/beaker-app-stdlib/css/com/tabs-nav.css.js'
import headerNavCSS from '../../css/com/header-nav.css.js'

class HeaderNav extends TabsNav {
  static get properties() {
    return {
      site: {type: String}
    }
  }

  get tabs () {
    if (this.site) {
      return [
        {id: 'addressbook', label: `Address book`},
        {id: 'bookmarks', label: `Bookmarks`}
      ]
    }
    return [
      {id: 'addressbook', label: `Address book`},
      {id: 'bookmarks', label: `Bookmarks`},
      {id: 'websites', label: `Websites`},
      {spacer: true},
      {id: 'seeding', label: html`<i class="fas fa-share-alt"></i>`},
      {id: 'trash', label: html`<i class="fas fa-trash"></i>`}
    ]
  }

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      ${super.render()}
    `
  }
}
HeaderNav.styles = [tabsNavCSS, headerNavCSS]
customElements.define('header-nav', HeaderNav)
