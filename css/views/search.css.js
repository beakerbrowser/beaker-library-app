import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import colorsCSS from '/vendor/beaker-app-stdlib/css/colors.css.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons2.css.js'
import tooltipCSS from '/vendor/beaker-app-stdlib/css/tooltip.css.js'
import viewHeaderCSS from '../view-header.css.js'

const cssStr = css`
${colorsCSS}
${buttonsCSS}
${tooltipCSS}
${viewHeaderCSS}

:host {
  display: block;
  margin: 0px 10px 50px 190px;
}

a {
  color: var(--blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.header-title {
  padding: 0 10px;
  font-size: 14px;
}

.listing {
  margin: 6px 0px;
}

.empty {
  background: #f5f5f5;
  max-width: 500px;
  border-radius: 4px;
  color: #555;
  font-weight: 300;
  font-size: 15px;
  line-height: 2;
  padding: 20px;
  margin: 10px 0;
  box-sizing: border-box;
}

.search-engines {
  max-width: 500px;
  border: 0;
}

.search-engines .label {
  padding: 6px 8px;
  font-size: 11px;
}

.search-engines .list {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  background: #fff;
}

.search-engines .list a {
  flex: 0 0 60px;
  text-align: center;
  border-right: 1px solid #ddd;
  padding: 8px 0;
  cursor: pointer;
}

.search-engines .list a:hover {
  background: #eee;
}

.search-engines .list a img {
  width: 24px;
  height: 24px;
}
`
export default cssStr