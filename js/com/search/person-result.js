import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import { unsafeHTML } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-html/directives/unsafe-html.js'
import personResultCSS from '../../../css/com/search/person-result.css.js'
import { highlightSearchResult } from '/vendor/beaker-app-stdlib/js/strings.js'

class SearchPersonResult extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      item: {type: Object},
      highlightNonce: {type: String}
    }
  }

  static get styles () {
    return personResultCSS
  }

  constructor () {
    super()
    this.user = undefined
    this.item = undefined
    this.highlightNonce = undefined
  }

  // rendering
  // =

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <a href=${this.item.href}><img src="asset:thumb:${this.item.href}"></a>
      <div class="details">
        <div class="title"><a href=${this.item.href}>${unsafeHTML(highlightSearchResult(this.item.record.title, this.highlightNonce))}</a></div>
        <div class="description">${unsafeHTML(highlightSearchResult(this.item.record.description, this.highlightNonce))}</div>
      </div>
    `
  }

  // events
  // =

}
customElements.define('search-person-result', SearchPersonResult)