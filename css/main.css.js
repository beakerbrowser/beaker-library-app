import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import colorsCSS from '/vendor/beaker-app-stdlib/css/colors.css.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons2.css.js'
import tooltipCSS from '/vendor/beaker-app-stdlib/css/tooltip.css.js'
import emptyCSS from './empty.css.js'

const cssStr = css`
${colorsCSS}
${buttonsCSS}
${tooltipCSS}
${emptyCSS}

:host {
  display: block;
}

#content-header {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0px;
  left: 180px;
  right: 20px;
  background: #fff;
  padding: 10px 0 15px;
  border-bottom: 1px solid #ddd;
}

#content-header > * {
  margin-right: 10px;
}
`
export default cssStr