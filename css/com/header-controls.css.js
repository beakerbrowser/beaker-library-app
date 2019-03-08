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
  margin-right: 30px;
}

.actions {
  margin-top: 2px;
}
`
export default cssStr