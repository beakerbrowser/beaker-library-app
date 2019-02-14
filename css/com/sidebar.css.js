import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

const cssStr = css`
:host {
  display: block;
}
.brand {
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-bottom: 15px;
}
.brand img {
  width: 32px;
  height: 32px;
  margin-right: 5px;
}
.nav a {
  display: block;
  padding: 5px 10px;
  cursor: pointer;
  color: rgba(51, 51, 51, 0.9);
}
.nav a:hover {
  color: var(--color-link);
}
.nav a.active {
  font-weight: bold;
}
`
export default cssStr