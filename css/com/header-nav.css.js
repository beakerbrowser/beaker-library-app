import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

const cssStr = css`
:host {
  margin: 15px 0 5px;
  border-bottom: 1px solid #ccc;
}

a {
  padding: 15px 20px;
  font-size: 14px;
  color: #777;
  border-bottom-width: 3px;
  margin-right: 10px;
}

a.active {
  font-weight: 500;
  color: #333;
}
`
export default cssStr