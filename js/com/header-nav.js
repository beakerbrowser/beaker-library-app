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
      {id: 'websites', label: `Websites`}
    ]
  }
}
HeaderNav.styles = [tabsNavCSS, headerNavCSS]
customElements.define('header-nav', HeaderNav)
