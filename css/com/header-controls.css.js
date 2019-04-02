import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'
import searchInputCSS from '/vendor/beaker-app-stdlib/css/com/search-input.css.js'

const cssStr = css`
${commonCSS}
${searchInputCSS}

:host {
  display: flex;
  padding: 10px 0 12px;
  background: #f7f7f7;
}

.search-container {
  position: relative;
  flex: 1;
  margin-right: 8px;
}

input.search {
  height: 35px;
  font-size: 14px;
}

.actions {
  display: flex;
  align-items: center;
}

.actions > * {
  margin-left: 5px;
}

.btn {
  border-color: #ccc;
}
`
export default cssStr