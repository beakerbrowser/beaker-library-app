import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'
import searchInputCSS from '/vendor/beaker-app-stdlib/css/com/search-input.css.js'

const cssStr = css`
${commonCSS}
${searchInputCSS}

:host {
  display: flex;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  flex: 1;
}

.actions {
  margin: 2px 0 0 30px;
}
`
export default cssStr