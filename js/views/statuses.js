import { LitElement, html } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import statusesViewCSS from '../../css/views/statuses.css.js'
import * as QP from '../lib/query-params.js'
import { oneof } from '../lib/validation.js'
import { emit } from '/vendor/beaker-app-stdlib/js/dom.js'
import '/vendor/beaker-app-stdlib/js/com/status/feed.js'
import '../com/subview-tabs.js'
import '../hover-menu.js'

const SUBVIEWS = [
  {id: 'feed', label: 'Feed'}
]

class StatusesView extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      currentSubview: {type: String}
    }
  }

  static get styles () {
    return statusesViewCSS
  }


  constructor () {
    super()
    this.currentSubview = oneof(QP.getParam('subview'), 'feed', ['feed'])
    this.user = null
  }

  async load () {
    this.shadowRoot.querySelector('beaker-status-feed').load()
  }

  // rendering
  // =

  render () {
    document.title = 'Status Updates'
    
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="header">
        <subview-tabs
          .items=${SUBVIEWS}
          current=${this.currentSubview}
          @change=${this.onChangeSubview}
        ></subview-tabs>
      </div>
      <beaker-status-feed .user=${this.user}></beaker-status-feed>
    `
  }

  // events
  // =

  onChangeSubview (e) {
    this.currentSubview = e.detail.id
    QP.setParams({subview: this.currentSubview})
    this.load()
  }
}
customElements.define('statuses-view', StatusesView)
