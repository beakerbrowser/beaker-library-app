import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { repeat } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/repeat.js'
import { ifDefined } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/if-defined.js'
import peopleViewCSS from '../../css/views/people.css.js'
import * as QP from '../lib/query-params.js'
import { oneof } from '../lib/validation.js'
import { pluralize } from '/vendor/beaker-app-stdlib/js/strings.js'
import _uniqBy from '/vendor/lodash.uniqby.js'
import '../com/subview-tabs.js'
import '../hover-menu.js'
const UwG = {
  follows: navigator.importSystemAPI('unwalled-garden-follows')
}

const SUBVIEWS = [
  {id: 'library', label: 'Library'},
  {id: 'network', label: 'Network'}
]

const SORT_OPTIONS = {
  followers: 'Most followed',
  title: 'Alphabetical'
}

class PeopleView extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      items: {type: Array},
      currentView: {type: String},
      currentSubview: {type: String},
      currentQuery: {type: String},
      currentSort: {type: String},
    }
  }

  static get styles () {
    return peopleViewCSS
  }

  get userUrl () {
    return this.user ? this.user.url : ''
  }

  constructor () {
    super()
    this.currentSubview = oneof(QP.getParam('subview'), 'library', ['library', 'network', 'feed'])
    this.currentSort = oneof(QP.getParam('sort'), 'followers', ['followers', 'title'])
    this.currentQuery = ''
    this.items = []
  }

  async load () {
    // fetch listing
    var followedUsers = (await UwG.follows.list({authors: this.user.url})).map(({topic}) => topic)
    var networkAuthors = [this.user.url].concat(followedUsers.map(f => f.url))
    var items
    if (this.currentSubview === 'network') {
      var foafUsers = (await UwG.follows.list({authors: networkAuthors})).map(({topic}) => topic)
      items = [Object.assign({}, this.user)].concat(followedUsers).concat(foafUsers)
    } else {
      items = [Object.assign({}, this.user)].concat(followedUsers)
    }
    items = _uniqBy(items, 'url')
    await Promise.all(items.map(async (item) => {
      item.followers = (await UwG.follows.list({topics: item.url, authors: networkAuthors})).map(({author}) => author)
      item.isLocalUser = this.user.url === item.url
      item.isLocalUserFollowing = !!item.followers.find(f => f.url === this.user.url)
    }))

    // apply sort
    if (this.currentSort === 'followers') {
      items.sort((a, b) => b.followers.length - a.followers.length)
    } else {
      items.sort((a, b) => (a.title||'Anonymous').localeCompare(b.title||'Anonymous'))
    }

    this.items = items
    console.log('loaded', this.items)
  }

  // rendering
  // =

  render () {
    document.title = 'People'
    let items = this.items
    
    // apply query filter
    if (this.currentQuery) {
      let q = this.currentQuery.toLowerCase()
      items = items.filter(item => (
        (item.title || '').toLowerCase().includes(q)
        || (item.description || '').toLowerCase().includes(q)
        || (item.url || '').toLowerCase().includes(q)
      ))
    }

    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="header">
        <subview-tabs
          .items=${SUBVIEWS}
          current=${this.currentSubview}
          @change=${this.onChangeSubview}
        ></subview-tabs>
        <div class="spacer"></div>
        <hover-menu
          right
          icon="fas fa-sort-amount-down"
          .options=${SORT_OPTIONS}
          current=${SORT_OPTIONS[this.currentSort]}
          @change=${this.onChangeSort}
        ></hover-menu>
        <div class="search-container">
          <input @keyup=${this.onKeyupQuery} placeholder="Search" class="search" value=${this.currentQuery} />
          <i class="fa fa-search"></i>
        </div>
      </div>
      ${!items.length
        ? html`<div class="empty"><div><span class="far fa-sad-tear"></span></div>No people found.</div>`
        : ''}
      <div class="listing">
        ${repeat(items, item => this.renderItem(item))}
      </div>
    `
  }

  renderItem (item) {
    const numFollowers = item.followers.length
    const followerNames = item.followers.length ? item.followers.map(f => f.title || 'Anonymous').join(', ') : undefined
    return html`
      <div class="item">
        <a class="thumb" href=${item.url}>
          <img src="asset:thumb:${item.url}?cache_buster=${Date.now()}">
        </a>
        <div class="details">
          <div class="title"><a href=${item.url}>${item.title}</a></div>
          <div class="description">

            ${item.isLocalUser
                ? html`<span class="label">This is me</span>`
                : item.isOwner ? html`<span class="label">My user</span>` : ''}
            ${item.description}
          </div>
          <div class="bottom-line">
            ${!item.isLocalUser ? html`
              <button @click=${e => this.onToggleFollow(e, item)}>
                <span class="fas fa-fw fa-${item.isLocalUserFollowing ? 'check' : 'rss'}"></span>
                ${item.isLocalUserFollowing ? 'Following' : 'Follow'}
              </button>
            ` : ''}
            <span class="followers">
              <span class="far fa-fw fa-user"></span>
              Followed by
              <a data-tooltip=${ifDefined(followerNames)}>${numFollowers} ${pluralize(numFollowers, 'user')} in my network</a>
            </span>
          </div>
        </div>
      </div>
    `
  }

  // events
  // =

  onChangeSubview (e) {
    this.currentSubview = e.detail.id
    QP.setParams({subview: this.currentSubview})
    this.load()
  }

  onChangeSort (e) {
    this.currentSort = e.detail.id
    QP.setParams({sort: this.currentSort})
    this.load()
  }

  onKeyupQuery (e) {
    this.currentQuery = e.currentTarget.value
  }

  async onToggleFollow (e, item) {
    if (item.isLocalUserFollowing) {
      await UwG.follows.remove(item.url)
    } else {
      await UwG.follows.add(item.url)
    }
    this.load()
  }
}
customElements.define('people-view', PeopleView)