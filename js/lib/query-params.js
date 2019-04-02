export function setParams (kv) {
  var url = (new URL(window.location))
  for (var k in kv) {
    if (kv[k]) {
      url.searchParams.set(k, kv[k])
    } else {
      url.searchParams.delete(k)
    }
  }
  window.history.pushState({}, null, url)
}

export function getParam (k, fallback = '') {
  return (new URL(window.location)).searchParams.get(k) || fallback
}