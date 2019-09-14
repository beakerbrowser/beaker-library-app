import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import colorsCSS from '/vendor/beaker-app-stdlib/css/colors.css.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons2.css.js'

const cssStr = css`
${colorsCSS}
${buttonsCSS}

:host {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 180px;
  overflow-y: auto;
  padding: 10px 0 30px;
  box-sizing: border-box;
  z-index: 2;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  background: #fafafa;
  border-right: 1px solid #ccc;
}

.btn-group {
  margin: 0 10px 8px;
}

.btn-group :first-child {
  flex: 1;
}

.dropdown-item {
  padding: 7px 15px;
}

a.item {
  position: relative;
  padding: 8px 15px;
  margin-bottom: 2px;
  color: #34495e;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;
}

a.item:hover {
  background: #eee;
}

a.item.current {
  background: #eee;
}

a.item.todo {
  opacity: 0.5;
}

a.item > .fa-fw {
  margin-right: 5px;
}

a.item .avatar {
  position: relative;
  top: -1px;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
}

.fa-external-link-alt {
  position: relative;
  top: -1px;
  font-size: 8px;
  color: rgba(0,0,0,.5);
  margin-left: 2px;
}

h5 {
  padding: 5px 15px 8px;
  margin: 0;
}

.spacer {
  flex: 1;
}

hr {
  border: 0;
  border-top: 1px solid #ddd;
  width: 154px;
  margin: 10px;
}

`
export default cssStr