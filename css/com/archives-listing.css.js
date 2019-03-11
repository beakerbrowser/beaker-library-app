import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'

const cssStr = css`
${commonCSS}

:host {
  user-select: none;
}

.row {
  height: auto;
  padding: 20px 20px;
}

.row .col:not(.title) {
  color: rgba(0,0,0,.5);
}

.favicon {
  width: 20px;
  height: 20px;
}

.title-line,
.description-line {
  margin-bottom: 6px;
}

.title-line {
  font-size: 15px;
  font-weight: 500;
}

.title-line a {
  color: var(--blue);
}

.title-line a:hover {
  text-decoration: underline;
}

.description-line {
  font-size: 14px;
  color: rgba(0,0,0,.7);
}

.meta-line {
  font-size: 13px;
  color: rgba(0,0,0,.7);
}

.meta-line span {
  display: inline-block;
  margin-right: 20px;
}

.meta-line i {
  font-size: 11px;
}
`
export default cssStr