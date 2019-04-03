import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'
import searchInputCSS from '/vendor/beaker-app-stdlib/css/com/search-input.css.js'

const cssStr = css`
${commonCSS}
${searchInputCSS}

:host {
  display: flex;
  padding: 10px 0 12px;
}

.search-container {
  position: relative;
  flex: 1;
  margin-right: 8px;
}

input.search {
  height: 35px;
  font-size: 14px;
  background: #eee;
  border: 0;
}

.actions {
  display: flex;
  align-items: center;
}

.actions > * {
  margin-left: 5px;
}
`
export default cssStr