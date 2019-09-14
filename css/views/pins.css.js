import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'

const cssStr = css`
${commonCSS}

:host {
  display: block;
  margin: 0 0 0 180px;
}

.pins {
  display: grid;
  padding: 15px;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 2px;
  width: 100%;
  user-select: none;
}

.pin {
  background: #fff;
  text-align: center;
  height: 120px;
  border-radius: 16px;
}

.pin:hover {
  background: rgb(245, 247, 249);
}

.pin.drag-hover {
  outline: 3px dashed var(--border-color);
}

.pin .thumb-container {
  display: inline-block;
  margin-top: 26px;
  background: rgb(245, 247, 249);
  border-radius: 50%;
}

.pin:hover .thumb-container {
  background: rgb(228, 232, 236);
}

.pin .thumb {
  display: block;
  width: 20px;
  height: 20px;
  margin: 10px;
  object-fit: scale-down;
}

.pin .title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #34495e;
  font-size: 12px;
  max-width: 100px;
  margin: auto;
  margin-top: 10px;
}

.explorer-pin {
  border: 0;
  background: none;
}

.explorer-pin i {
  color: rgb(222, 228, 232);
}

.pin.explorer-pin i {
  font-size: 27px;
  margin-top: 44px;
}
`
export default cssStr