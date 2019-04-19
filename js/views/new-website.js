import {LitElement, html} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import * as toast from '/vendor/beaker-app-stdlib/js/com/toast.js'
import * as QP from '../lib/query-params.js'
import newFormCSS from '../../css/views/new-website.css.js'

const TEMPLATES = {
  wiki: '9d9bc457f39c987cb775e638d1623d894860947509a4143d035305d4d468587b'
}
const TEMPLATE_URL_MODIFIERS = {
  wiki: url => url + '?edit'
}

class NewWebsite extends LitElement {
  constructor () {
    super()
    this.template = QP.getParam('template')
  }

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <h1>Create a new website</h1>
      <p>
        The website will be hosted from your computer using the <a class="link" href="https://datproject.org" target="_blank">dat peer-to-peer protocol</a>.
      </p>

      <hr>

      <form @submit=${this.onSubmit}>
        <div>
          <p>
            <label for="input-template" class="optional">Template</label>
            <select id="input-template" name="template">
              ${this.renderTemplateOption('wiki', 'Wiki site')}
              ${this.renderTemplateOption('', 'Empty website')}
            </select>
          </p>
          <label for="input-title" class="required">Title</label>
          <input id="input-title" type="text" name="title" autofocus required>
          <label for="input-description" class="optional">Description (optional)</label>
          <input id="input-description" type="text" name="description">
        </div>

        <hr>

        <div>
          <button type="submit" class="btn primary thick">Create website</button>
        </div>
      </form>
    `
  }

  afterUpdated () {
    this.shadowRoot.querySelector('input').focus()
  }

  renderTemplateOption (value, label) {
    return html`<option value=${value} ?selected=${this.template === value}>${label}</option>`
  }

  async onSubmit (e) {
    e.preventDefault()

    var template = e.currentTarget.template.value
    var title = e.currentTarget.title.value
    var description = e.currentTarget.description.value

    if (template in TEMPLATES) {
      toast.create('Loading...', '', 10e3)
      setTimeout(() => toast.create('Still loading...', '', 10e3), 10e3)
      setTimeout(() => toast.create('Still loading, must be having trouble downloading the template...', '', 10e3), 20e3)
      setTimeout(() => toast.create('Okay wow...', '', 10e3), 30e3)
      setTimeout(() => toast.create('Still loading, is your Internet connected?...', '', 10e3), 40e3)
      setTimeout(() => toast.create('Lets give it 10 more seconds...', '', 10e3), 50e3)
      try {
        let newSite = await DatArchive.fork(TEMPLATES[template], {title, description, prompt: false})
        window.location = (template in TEMPLATE_URL_MODIFIERS) ? TEMPLATE_URL_MODIFIERS[template](newSite.url) : newSite.url
      } catch (e) {
        console.error(e)
        if (e.name === 'TimeoutError') {
          toast.create('Beaker was unable to download the template for your new site. Please check your Internet connection and try again!', 'error')
        } else {
          toast.create('Unexpected error: ' + e.message, 'error')
        }
      }
    } else {
      let newSite = await DatArchive.create({title, description, prompt: false})
      await newSite.writeFile('index.html', DEFAULT_INDEX_HTML)
      window.location = `beaker://editor/${newSite.url}`
    }
  }
}
NewWebsite.styles = newFormCSS

customElements.define('library-view-new-website', NewWebsite)

const DEFAULT_INDEX_HTML = `<!doctype html>
<html>
  <head>
    <title></title>
    <meta charset="utf-8">
  </head>
  <body>
    <!-- enter your content here -->
  </body>
</html>`