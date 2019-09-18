import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'
import viewHeaderCSS from '../view-header.css.js'

const cssStr = css`
${commonCSS}
${viewHeaderCSS}

:host {
  display: block;
  margin: 10px 10px 50px 190px;
}

.header {
  height: 47px;
}

.pins {
  display: grid;
  padding: 15px;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  grid-gap: 15px;
  width: 100%;
  user-select: none;
}

.pin {
  cursor: pointer;
  border-radius: 3px;
  color: inherit;
  border-radius: 3px;
  border: 1px solid #ccc;
  overflow: hidden;
  user-select: none;
}

.pin:hover {
  border-color: #bbb;
  box-shadow: 0 2px 3px rgba(0,0,0,.05);
  text-decoration: none;
}

.pin img {
  display: block;
  background: #fff;
  width: 100%;
  height: 170px;
  object-fit: scale-down;
  border-bottom: 1px solid #eee;
}

.pin .details {
  padding: 10px 12px;
}

.pin .details > * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pin .title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.pin .href {
  color: gray;
  font-size: 11px;
}

.explorer-pin {
  border: 0;
  background: #fafafa;
  text-align: center;
}

.explorer-pin i {
  color: rgb(222, 228, 232);
}

.pin.explorer-pin i {
  font-size: 27px;
  margin-top: 80px;
  margin-bottom: 80px;
}
`
export default cssStr