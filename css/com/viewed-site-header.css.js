import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import commonCSS from '/vendor/beaker-app-stdlib/css/common.css.js'

const cssStr = css`
${commonCSS}

:host {
  display: flex;
  margin: 20px 0 0;
}

:host > div {
  flex: 1;
}

.profile {
  text-align: center;
}

.controls {
  text-align: right;
}

.profile .thumb img {
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

h5 {
  margin: 10px 5px;
  color: #666;
}

.follows-you {
  display: inline-block;
  padding: 4px 12px 5px;
  border-radius: 4px;
  background: #d2dbe4;
  color: rgb(59, 62, 66);
  font-weight: 500;
}
`
export default cssStr