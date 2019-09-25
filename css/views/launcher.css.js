import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons2.css.js'
import viewHeaderCSS from '../view-header.css.js'
import emptyCSS from '../empty.css.js'

const cssStr = css`
${commonCSS}
${buttonsCSS}
${viewHeaderCSS}
${emptyCSS}

:host {
  display: block;
  margin: 0px 10px 50px 190px;
}

.header {
  height: 47px;
}

.pins {
  display: grid;
  padding: 15px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 15px;
  width: 100%;
  user-select: none;
}

.pin {
  cursor: pointer;
  position: relative;
  border-radius: 3px;
  color: inherit;
  border-radius: 3px;
  border: 1px solid #ccc;
  background: #fff;
  overflow: hidden;
  user-select: none;
}

.pin:hover {
  border-color: #bbb;
  box-shadow: 0 2px 3px rgba(0,0,0,.05);
  text-decoration: none;
}

.pin .favicon {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  z-index: 1;
  border-radius: 4px;
  width: 34px;
  height: 34px;
}

.pin .details {
  padding: 120px 12px 10px;
}

.pin .details > * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pin .title {
  font-size: 13px;
  line-height: 20px;
}

.pin .href {
  color: gray;
  font-size: 11px;
}

`
export default cssStr