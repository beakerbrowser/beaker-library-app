import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { classMap } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/class-map.js'
import { emit } from '/vendor/beaker-app-stdlib/js/dom.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import libTools from '/vendor/library-tools/index.build.js'
import navCSS from '../../../css/com/nav.css.js'

class LibraryNav extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      currentView: {type: String}
    }
  }

  static get styles () {
    return navCSS
  }

  constructor () {
    super()
  }
  // rendering
  // =

  render () {
    const item = (id, icon, label, todo = false) => {
      const cls = classMap({
        item: true,
        current: id === this.currentView,
        todo
      })
      return html`
        <a class=${cls} @click=${e => this.onClick(e, id)}}>
          <span class="fa-fw ${icon || 'no-icon'}"></span>
          <span class="label">${label}</span>
        </a>
      `
    }
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="btn-group">
        <button class="primary" style="padding-right: 22px" @click=${this.onClickNew}>
          <span class="fas fa-fw fa-plus"></span> Create New...
        </button>
      </div>
      <h5>Start</h5>
      ${item('pins', 'fas fa-rocket', 'Launcher')}
      ${item('bookmarks', 'far fa-star', 'Bookmarks')}
      <br>
      <h5>News</h5>
      ${item('status-updates', 'far fa-comment-alt', 'Social feed')}
      ${''/*item('blog-posts', 'far fa-newspaper', 'Blog posts', true)*/}
      <br>
      <h5>Library</h5>
      ${''/*item('music', 'fas fa-music', 'Music', true)}
      ${item('photos', 'fas fa-image', 'Photos', true)}
      ${item('podcasts', 'fas fa-microphone-alt', 'Podcasts', true)}
  ${item('videos', 'fas fa-film', 'Videos', true)*/}
      ${item('people', libTools.getFAIcon('people'), 'People')}
      ${item('websites', libTools.getFAIcon('websites'), 'Websites')}
      ${item('archives', libTools.getFAIcon('archives'), 'Archives')}
      <br>
      <h5>System</h5>
      <a class="item" href=${this.user ? this.user.url : ''} target="_blank">
        <img class="avatar" src="asset:thumb:${this.user ? this.user.url : ''}?cache_buster=${Date.now()}">
        <span class="label">${this.user ? this.user.title : ''}</span>
        <span class="fas fa-fw fa-external-link-alt"></span>
      </a>
      ${item('cloud-peers', 'fas fa-cloud', 'Cloud Peers', true)}
      ${item('settings', 'fas fa-cog', 'Settings', true)}
      ${item('trash', 'fas fa-trash', 'Trash')}
    `
  }

  // events
  // =

  onClick (e, view) {
    e.preventDefault()
    emit(this, 'change-view', {bubbles: true, detail: {view}})
  }

  async onClickNew () {
    var archive = await DatArchive.create()
    toast.create('Website created')
    beaker.browser.openUrl(archive.url, {setActive: true, isSidebarActive: true, sidebarPanel: 'site'})
    emit(this, 'change-view', {bubbles: true, detail: {view: 'websites'}})
  }
}
customElements.define('library-nav', LibraryNav)