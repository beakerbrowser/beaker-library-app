import { TabsNav } from '/vendor/beaker-app-stdlib/js/com/tabs-nav.js'
import tabsNavCSS from '/vendor/beaker-app-stdlib/css/com/tabs-nav.css.js'
import headerNavCSS from '../../css/com/header-nav.css.js'

class HeaderNav extends TabsNav {
  get tabs () {
    return [
      {id: 'websites', label: `Websites`},
      {id: 'bookmarks', label: `Bookmarks`},
      {id: 'addressbook', label: `Address book`}
    ]
  }
}
HeaderNav.styles = [tabsNavCSS, headerNavCSS]
customElements.define('header-nav', HeaderNav)
