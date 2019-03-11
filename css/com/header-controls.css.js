import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'
import searchInputCSS from '/vendor/beaker-app-stdlib/css/com/search-input.css.js'

const cssStr = css`
${commonCSS}
${searchInputCSS}

:host {
  display: flex;
  padding: 10px 0 20px;
  background: #f7f7f7;
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