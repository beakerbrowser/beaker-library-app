import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { repeat } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/repeat.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import { profiles } from '../../tmp-beaker.js'
import { graph } from '../../tmp-unwalled-garden.js'
import profileFollowgraphCSS from '../../../css/com/addressbook/listing.css.js'
import '/vendor/beaker-app-stdlib/js/com/profile-info-card.js'

const LOAD_LIMIT = 50

class AddressbookListing extends LitElement {
  static get properties () {
    return {
      users: {type: Array},
      category: {type: String},
      site: {type: String},
      searchQuery: {attribute: 'search-query'}
    }
  }

  constructor () {
    super()
    this.users = null
  }

  // data management
  // =

  async load () {
    var self = await profiles.getCurrentUser()
    var users
    if (this.category === 'followers') {
      users = await graph.listFollowers(this.site ? this.site : self.url)
    } else {
      users = await graph.listFollows(this.site ? this.site : self.url)
    }
    if (!this.site) users = [self].concat(users)
    await Promise.all(users.map(async (user) => {
      var [isFollowed, isFollowingYou, followers] = await Promise.all([
        graph.isAFollowingB(self.url, user.url),
        graph.isAFollowingB(user.url, self.url),
        graph.listFollowers(user.url, {filters: {followedBy: self.url}})
      ])
      user.isYou = user.url === self.url
      user.isFollowed = isFollowed
      user.isFollowingYou = isFollowingYou
      user.followers = followers.filter(f => f.url !== self.url).slice(0, 6)
    }))
    this.users = users
  }

  // rendering
  // =

  render () {
    if (!this.users) {
      return html`
        <div class="empty">Loading...</div>
      `
    }
    if (this.users.length === 0) {
      return html`
        <div class="empty">This user ${this.showFollowers ? 'has no known followers' : 'is not following anybody'}.</div>
      `
    }
    var users = this.users
    if (this.searchQuery) {
      users = this.users.filter(user => {
        if (user.title && user.title.toLowerCase().includes(this.searchQuery)) {
          return true
        } else if (user.description && user.description.toLowerCase().includes(this.searchQuery)) {
          return true
        } else if (user.url && user.url.toLowerCase().includes(this.searchQuery)) {
          return true
        }
      })
    }
    const keyFn = p => p.url + p.isFollowed // include .isFollowed to force a render on change
    return html`
      ${repeat(users, keyFn, user => html`
        <div>
          <beaker-profile-info-card
            .user=${user}
            show-controls
            fontawesome-src="/vendor/beaker-app-stdlib/css/fontawesome.css"
            @follow=${this.onFollow}
            @unfollow=${this.onUnfollow}
            @edit-profile=${this.onEditProfile}
          ></beaker-profile-info-card>
        </div>`)}
    `
  }

  // events
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'site' || (name === 'category' && newval)) {
      // trigger a load when we change categories
      this.load()
    }
  }

  async onFollow (e) {
    await graph.follow(e.detail.url)
    toast.create(`Followed ${e.detail.title}`, '', 1e3)
    this.users.find(f => f.url === e.detail.url).isFollowed = true
    this.requestUpdate()
  }

  async onUnfollow (e) {
    await graph.unfollow(e.detail.url)
    toast.create(`Unfollowed ${e.detail.title}`, '', 1e3)
    this.users.find(f => f.url === e.detail.url).isFollowed = false
    await this.requestUpdate()
  }

  async onEditProfile (e) {
    window.location = 'beaker://settings/'
  }
}
AddressbookListing.styles = profileFollowgraphCSS
customElements.define('library-addressbook-listing', AddressbookListing)