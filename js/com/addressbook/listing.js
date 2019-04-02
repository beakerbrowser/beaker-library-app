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
      profiles: {type: Array},
      category: {type: String}
    }
  }

  constructor () {
    super()
    this.profiles = null
  }

  // data management
  // =

  async load () {
    let self = await profiles.getCurrentUser()
    if (this.category === 'followers') {
      this.profiles = await graph.listFollowers(self.url)
    } else {
      this.profiles = await graph.listFollows(self.url)
    }
    await Promise.all(this.profiles.map(async (profile) => {
      var [isFollowed, isFollowingYou, followers] = await Promise.all([
        graph.isAFollowingB(self.url, profile.url),
        graph.isAFollowingB(profile.url, self.url),
        graph.listFollowers(profile.url, {filters: {followedBy: self.url}})
      ])
      profile.isYou = profile.url === this.userUrl
      profile.isFollowed = isFollowed
      profile.isFollowingYou = isFollowingYou
      profile.followers = followers.filter(f => f.url !== self.url).slice(0, 6)
    }))
  }

  // rendering
  // =

  render () {
    if (!this.profiles) {
      return html`
        <div class="empty">Loading...</div>
      `
    }
    if (this.profiles.length === 0) {
      return html`
        <div class="empty">This user ${this.showFollowers ? 'has no known followers' : 'is not following anybody'}.</div>
      `
    }
    const keyFn = p => p.url + p.isFollowed // include .isFollowed to force a render on change
    return html`
      ${repeat(this.profiles, keyFn, profile => html`
        <beaker-profile-info-card
          .user=${profile}
          show-controls
          view-profile-base-url="/profile/"
          fontawesome-src="/vendor/beaker-app-stdlib/css/fontawesome.css"
          @follow=${this.onFollow}
          @unfollow=${this.onUnfollow}
        ></beaker-profile-info-card>
      `)}
    `
  }

  // events
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'category' && newval) {
      // trigger a load when we change categories
      this.load()
    }
  }

  async onFollow (e) {
    await graph.follow(e.detail.url)
    toast.create(`Followed ${e.detail.title}`, '', 1e3)
    this.profiles.find(f => f.url === e.detail.url).isFollowed = true
    this.requestUpdate()
  }

  async onUnfollow (e) {
    await graph.unfollow(e.detail.url)
    toast.create(`Unfollowed ${e.detail.title}`, '', 1e3)
    this.profiles.find(f => f.url === e.detail.url).isFollowed = false
    await this.requestUpdate()
  }
}
AddressbookListing.styles = profileFollowgraphCSS
customElements.define('library-addressbook-listing', AddressbookListing)