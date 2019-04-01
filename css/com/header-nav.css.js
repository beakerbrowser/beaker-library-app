import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

const cssStr = css`
:host {
  margin-top: 5px;
  border-bottom: 1px solid #ccc;
}

a {
  padding: 15px 20px;
  font-size: 14px;
  color: #555;
  border-bottom-width: 3px;
}

a.active {
  font-weight: 500;
  color: #333;
}
`
export default cssStr