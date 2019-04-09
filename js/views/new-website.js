import {LitElement, html} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import newFormCSS from '../../css/views/new-website.css.js'

class NewWebsite extends LitElement {
  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <h1>Create a new website</h1>
      <p>
        A website can contain
        <a class="link" href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started" target="_blank">html</a>,
        <a class="link" href="https://www.markdownguide.org/cheat-sheet" target="_blank">markdown</a>,
        files, and more.
      </p>
      <hr>
      <form @submit=${this.onSubmit}>
        <div>
          <label for="input-title" class="required">Title</label>
          <input id="input-title" type="text" name="title" autofocus required>
          <label for="input-description" class="optional">Description (optional)</label>
          <input id="input-description" type="text" name="description">
        </div>

        <div>
          <button type="submit" class="btn primary thick">Create website</button>
        </div>
      </form>
    `
  }

  async onSubmit (e) {
    e.preventDefault()
    var archive = await DatArchive.create({
      title: e.currentTarget.title.value,
      description: e.currentTarget.description.value,
      prompt: false
    })
    await archive.writeFile('index.html', DEFAULT_INDEX_HTML)
    window.location = `beaker://editor/${archive.url}`
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