import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import colorsCSS from '/vendor/beaker-app-stdlib/css/colors.css.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons2.css.js'
import tooltipCSS from '/vendor/beaker-app-stdlib/css/tooltip.css.js'
import emptyCSS from '../empty.css.js'
import labelCSS from '../label.css.js'
import viewHeaderCSS from '../view-header.css.js'

const cssStr = css`
${colorsCSS}
${buttonsCSS}
${tooltipCSS}
${emptyCSS}
${labelCSS}
${viewHeaderCSS}

:host {
  display: block;
  margin: 10px 10px 50px 190px;
}

@media (min-width: 1300px) {
  .empty {
    position: relative;
    left: -90px;
  }
}

a {
  color: var(--blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.item {
  display: flex;
  align-items: center;
  margin: 25px;
  max-width: 600px;
  user-select: none;
}

.item .thumb {
  margin-right: 20px;
}

.item .thumb img {
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 2px rgba(0,0,0,.15);
}

.item .details {

}

.item .title {
  font-size: 18px;
  margin-bottom: 4px;
}

.item .description {
  font-size: 14px;
  margin-bottom: 4px;
}

.item .bottom-line {
  margin-bottom: 4px;
}

.item .bottom-line button {
  font-size: 9px;
  padding: 4px 6px;
}

.item .followers {
  font-size: 11px;
  color: gray;
}

`
export default cssStr