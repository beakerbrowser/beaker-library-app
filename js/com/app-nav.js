import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { repeat } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/repeat.js'
import { classMap } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/class-map.js'
import * as DatExplorer from '/vendor/beaker-app-stdlib/js/com/library/dats/explorer.js'
import appNavCSS from '../../css/com/app-nav.css.js'

function datCategory (id) {
  return {
    view: 'dats',
    category: id,
    label: html`<i class="fa-fw ${DatExplorer.getCategoryIcon(id)}"></i> ${DatExplorer.getCategoryLabel(id)}`
  }
}

class AppNav extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      view: {type: String},
      category: {type: String},
      dat: {type: String}
    }
  }

  get tabs () {
    return [
      html`<h5>Websites</h5>`,
      datCategory('applications'),
      // datCategory('musicAlbums'),
      // datCategory('photoAlbums'),
      // datCategory('podcasts'),
      datCategory('websites'),
      // datCategory('wikis'),
      html`<h5>Personal Data</h5>`,
      {view: 'content', category: 'bookmarks', label: html`<i class="far fa-fw fa-star"></i> Bookmarks`},
      {view: 'content', category: 'posts', label: html`<i class="far fa-fw fa-comment-alt"></i> Posts`},
      {view: 'content', category: 'reactions', label: html`<i class="far fa-fw fa-smile"></i> Reactions`},
      {view: 'content', category: 'socialgraph', label: html`<i class="far fa-fw fa-address-book"></i> Social graph`},
      html`<h5>Developer tools</h5>`,
      datCategory('modules'),
      datCategory('templates'),
      html`<h5>System</h5>`,
      datCategory('users'),
      datCategory('trash')
    ]
  }

  isTabActive (tab) {
    for (let k of ['view', 'category', 'dat']) {
      if ((!this[k] && !tab[k]) || (this[k] === tab[k])) {
        continue
      }
      return false
    }
    return true
  }

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      ${repeat(this.tabs, tab => this.renderTab(tab))}
    `
  }

  renderTab (tab) {
    if (tab.spacer) return html`<span style="flex: 1"></span>`
    if (tab.type === 'html') return tab

    var {label, onClick} = tab
    const cls = classMap({active: this.isTabActive(tab)})
    return html`<a class="${cls}" @click=${onClick ? onClick : e => this.onClickTab(e, tab)}>${label}</a>`
  }

  onClickTab (e, tab) {
    this.dispatchEvent(new CustomEvent('change-location', {detail: tab}))
  }
}
AppNav.styles = [appNavCSS]
customElements.define('app-nav', AppNav)
