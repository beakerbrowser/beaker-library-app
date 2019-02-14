import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'

const cssStr = css`
${commonCSS}

:host {
  user-select: none;
}

.row {
  position: relative; /* to position the select-check */
}

.row .col:not(.title) {
  color: rgba(0,0,0,.5);
}

.favicon {
  width: 20px;
  height: 20px;
}

.trash-btn {
  visibility: hidden;
}
.row:hover .trash-btn {
  visibility: visible;
}

.select-check {
  opacity: 0;
  position: absolute;
  top: 4px;
  right: -38px;
  padding: 10px;
  font-size: 1.15rem;
  color: #ccc;
}

.row:hover .select-check,
.row.selected .select-check {
  opacity: 1;
}

.row.selected .select-check {
  color: #41b855;
}
`
export default cssStr