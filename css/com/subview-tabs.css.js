import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import colorsCSS from '/vendor/beaker-app-stdlib/css/colors.css.js'

const cssStr = css`
${colorsCSS}

:host {
  display: flex;
}

a {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 3px;
  margin-right: 5px;
}

a:hover {
  background: #eee;
}

a.current {
  background: #eee;
}
`
export default cssStr