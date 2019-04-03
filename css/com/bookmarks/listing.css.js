import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'
import tooltipCSS from '/vendor/beaker-app-stdlib/css/tooltip.css.js'

const cssStr = css`
${commonCSS}
${tooltipCSS}

:host {
  display: block;
  user-select: none;
  width: 810px;
}

.favicon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  position: relative;
  top: -1px;
  margin-right: 2px;
}

.row {
  padding: 14px;
  background: transparent;
  border: 0;
  height: auto;
  min-height: 50px;
}

.row:hover {
  background: #fff;
}

.col.pinned {
  overflow: visible; /* for tooltips */
  margin-right: 0;
}

.pin-btn {
  cursor: pointer;
  display: inline-block;
  padding: 6px 9px;
  border-radius: 2px;
  font-size: 12px;
  color: rgba(0,0,0,.5);
}

.pin-btn span {
  color: transparent;
  -webkit-text-stroke: 1px #bbb;
}

.pin-btn:hover {
  background: rgba(0, 0, 0, 0.075);
}

.pin-btn:hover span,
.pin-btn.pressed span {
  color: inherit;
  -webkit-text-stroke: 0;
}

.row .buttons .btn {
  visibility: hidden;
  color: rgba(0,0,0,.5);
}

.row:hover .buttons .btn {
  visibility: visible;
  color: rgba(0,0,0,.5);
}

.col.info > div + div {
  margin-top: 6px;
}

.title-line,
.description-line {
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-line,
.tags-line {
  color: gray;
  font-size: 12px;
}

.title-line {
  font-size: 15px;
  font-weight: 500;
}

.description-line {
  font-size: 14px;
  color: rgba(0,0,0,.7);
  white-space: normal;
}

.url-line {
  color: green;
}

.tags-line span {
  margin-left: 5px;
}
`
export default cssStr