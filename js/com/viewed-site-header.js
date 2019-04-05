import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import viewdSiteHeaderCSS from '../../css/com/viewed-site-header.css.js'
import { profiles } from '../tmp-beaker.js'
import { graph } from '../tmp-unwalled-garden.js'
import { toNiceDomain } from '/vendor/beaker-app-stdlib/js/strings.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'

class ViewedSiteHeader extends LitElement {
  static get properties () {
    return {
      url: {type: String},
      site: {type: Object}
    }
  }

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'url') this.load()
  }

  async load () {
    var user = await profiles.getCurrentUser()
    var site = await profiles.index(this.url)
    var [isFollowed, isFollowingYou] = await Promise.all([
      graph.isAFollowingB(user.url, site.url),
      graph.isAFollowingB(site.url, user.url)
    ])
    site.isYou = site.url === user.url
    site.isFollowed = isFollowed
    site.isFollowingYou = isFollowingYou
    this.site = site
  }

  // rendering
  // =

  render() {
    if (!this.site) {
      return html`<div></div>`
    }
    var label
    if (this.site.isYou) {
      label = html`<p><span class="follows-you">This is you</span></p>`
    }
    if (this.site.isFollowingYou) {
      label = html`<p><span class="follows-you">Follows you</span></p>`
    }
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div><a class="link" href="/"><i class="fas fa-caret-left"></i> Your library</a></div>
      <div class="profile">
        <div class="thumb"><img src="${this.site.url}/thumb"></div>
        <h1>${this.site.title}</h1>
        <p class="url"><a href="${this.site.url}">dat://${toNiceDomain(this.site.url, 6)}/</a></p>
        <p class="bio">${this.site.description}</p>
        ${label}
      </div>
      <div class="controls">
        ${this.renderControls()}
      </div>
    `
  }

  renderControls () {
    if (this.site.isYou) {
      return html`
        <div class="controls">
          <button class="btn" @click=${this.onEditProfile}>Edit profile</button><br>
        </div>
      `
    }
    return html`
      <div class="controls">
        ${this.site.isFollowed
          ? html`
            <beaker-hoverable @click=${this.onUnfollow}>
              <button class="btn" slot="default" style="width: 100px"><span class="fa fa-check"></span> Following</button>
              <button class="btn warning" slot="hover" style="width: 100px"><span class="fa fa-times"></span> Unfollow</button>
            </beaker-hoverable>`
          : html`
            <button class="btn" @click=${this.onFollow}>
              <span class="fa fa-rss"></span> Follow
            </button>`}
      </div>
    `
  }

  // events
  // =

  async onFollow (e) {
    await graph.follow(this.url)
    toast.create(`Followed ${this.site.title}`, '', 1e3)
    this.site.isFollowed = true
    this.requestUpdate()
  }

  async onUnfollow (e) {
    await graph.unfollow(this.url)
    toast.create(`Unfollowed ${this.site.title}`, '', 1e3)
    this.site.isFollowed = false
    await this.requestUpdate()
  }

  async onEditProfile (e) {
    window.location = 'beaker://settings/'
  }
}
ViewedSiteHeader.styles = viewdSiteHeaderCSS

customElements.define('viewed-site-header', ViewedSiteHeader)