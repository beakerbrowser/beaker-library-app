import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import colorsCSS from '/vendor/beaker-app-stdlib/css/colors.css.js'

const cssStr = css`
${colorsCSS}

.dropdown {
  display: inline-block;
  position: relative;
  color: var(--color-text);
  padding: 6px 6px;
  cursor: pointer;
}

.dropdown:hover {
  background: #f5f5f5;
}

.dropdown-menu {
  position: absolute;
  top: 24px;
  background: #fff;
  width: 180px;
  padding: 6px 0;
  border: 1px solid #bbb;
  border-radius: 2px;
  box-shadow: 0 2px 3px rgba(0,0,0,.1);
  z-index: 1;
}

:host([right]) .dropdown-menu {
  right: 0;
}

.item {
  display: block;
  padding: 8px 10px;
  color: var(--color-text);
}

.item:hover {
  background: #f5f5f5;
}

hr {
  border: 0;
  border-top: 1px solid #ddd;
}
`
export default cssStr