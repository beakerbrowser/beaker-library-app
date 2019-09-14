import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons2.css.js'
import tooltipCSS from '/vendor/beaker-app-stdlib/css/tooltip.css.js'
import viewHeaderCSS from '../view-header.css.js'

const cssStr = css`
${buttonsCSS}
${tooltipCSS}
${viewHeaderCSS}

:host {
  display: block;
  margin: 10px 10px 50px 190px;
}

@media (min-width: 1300px) {
  beaker-status-feed {
    padding-right: 180px;
  }
}

beaker-status-feed {
  width: 540px;
  margin: 15px auto 50px;
}
`
export default cssStr