import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import colorsCSS from '/vendor/beaker-app-stdlib/css/colors.css.js'

const cssStr = css`
${colorsCSS}

:host {
  display: inline-block;
  background: #eee;
  padding: 6px 10px;
  border-radius: 16px;
  cursor: pointer;
}
`
export default cssStr