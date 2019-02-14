import {LitElement, html, css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

class FooterHint extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <i class="fa fa-info-circle"></i>
      Your Library contains websites and archives you've created,
      along with websites that you're seeding.
    `
  }
}

FooterHint.styles = css`
:host {
  display: block;
  max-width: 450px;
  margin: 20px auto;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
}
`

customElements.define('library-footer-hint', FooterHint)