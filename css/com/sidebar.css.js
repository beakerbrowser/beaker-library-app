import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

const cssStr = css`
:host {
  display: block;
}

.profile img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 10px;
}

.profile h1,
.profile p {
  margin: 10px 0;
}

.profile a {
  text-decoration: none;
  color: var(--blue);
  font-weight: 500;
}

.profile a:hover {
  text-decoration: underline;
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