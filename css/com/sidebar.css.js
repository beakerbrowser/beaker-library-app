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
.nav {
  font-size: 14px;
}
.nav a {
  display: block;
  padding: 7px 10px;
  cursor: pointer;
  color: rgba(51, 51, 51, 0.9);
}
.nav a:hover {
  color: var(--color-link);
}
.nav a.active {
  font-weight: bold;
  background: #eee;
  border-radius: 4px;
}
hr {
  border: 0;
  border-bottom: 1px solid #ccc;
}
.fa-fw {
  margin-right: 3px;
  margin-left: -3px;
}
`
export default cssStr