import {html} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import bytes from '/vendor/beaker-app-stdlib/vendor/bytes/index.js'
import {pluralize} from '/vendor/beaker-app-stdlib/js/strings.js'
import {Table} from '/vendor/beaker-app-stdlib/js/com/table.js'
import * as contextMenu from '/vendor/beaker-app-stdlib/js/com/context-menu.js'
import {writeToClipboard} from '/vendor/beaker-app-stdlib/js/clipboard.js'
import tableCSS from '/vendor/beaker-app-stdlib/css/com/table.css.js'
import archivesListingCSS from '../../css/com/archives-listing.css.js'

class ArchivesListing extends Table {
  static get properties() {
    return { 
      rows: {type: Array},
      selectedRows: {type: Object},
      searchQuery: {attribute: 'search-query', reflect: true}
    }
  }

  constructor () {
    super()

    this.selectedRows = {}
    this.archives = DEBUG_ARCHIVES
    this.sortColumn = 'title'
    this.searchQuery = ''
    this.sort()
  }

  get columns () {
    return [
      {id: 'favicon', width: 30, renderer: 'renderRowFavicon'},
      {id: 'title', label: 'Title', flex: 3, renderer: 'renderRowTitle'},
      {id: 'owner', label: 'Owner', flex: 1, renderer: 'renderRowOwner'},
      {id: 'peers', label: 'Peers', flex: 1, renderer: 'renderPeers'},
      {id: 'last-updated', label: 'Last updated', flex: 1, renderer: 'renderRowLastUpdated'},
      {id: 'size', label: 'Size', flex: 1, renderer: 'renderRowSize'},
      {id: 'buttons', label: '', width: 65, renderer: 'renderRowButtons'}
    ]
  }

  get rows () {
    if (this.searchQuery) {
      return this.archives.filter(a => {
        if (a.title && a.title.toLowerCase().includes(this.searchQuery)) {
          return a
        } else if (a.description && a.description.toLowerCase().includes(this.searchQuery)) {
          return a
        } else if (a.url && a.url.toLowerCase().includes(this.searchQuery)) {
          return a
        }
      })
    }
    return this.archives
  }

  set rows (v) {
    // noop
  }

  get fontAwesomeCSSUrl () {
    return '/vendor/beaker-app-stdlib/css/fontawesome.css'
  }

  get selectedKeys () {
    return Object.entries(this.selectedRows).filter(([key, b]) => b).map(([key]) => key)
  }

  isRowSelected (row) {
    return this.selectedRows[row.key]
  }

  getRowHref (row) {
    return row.url
  }

  sort () {
    var direction = this.sortDirection === 'asc' ? -1 : 1
    this.archives.sort((a, b) => {
      var v = 0
      switch (this.sortColumn) {
        case 'size': v = a.size - b.size; break
        case 'peers': v = a.peers - b.peers; break
        case 'recently-accessed': v = a.lastAccessTime - b.lastAccessTime; break
        case 'published': v = Number(a.isPublished) - Number(b.isPublished); break
        case 'owner': v = getOwner(b).localeCompare(getOwner(a)); break
      }
      if (v === 0) v = (b.title || '').localeCompare(a.title || '') // use title to tie-break
      return v * direction
    })
    this.requestUpdate()
  }

  async showContextMenu (x, y, row, opts) {
    var items = [
      {icon: 'fa fa-external-link-alt', label: 'Open in new tab', click: () => window.open(row.url)},
      {icon: 'fa fa-link', label: 'Copy URL', click: () => writeToClipboard(row.url)},
      {icon: 'code', label: 'View source', click: () => window.open(`beaker://editor/${row.url}`)}
    ]
    if (row.userSettings.isSaved) {
      items.push({icon: 'fas fa-trash', label: 'Move to trash', click: () => this.emit('move-to-trash', {key: row.key})})
    } else {
      items.push({icon: 'fa fa-undo', label: 'Restore from trash', click: () => this.emit('restore-from-trash', {key: row.key})})
      items.push({icon: 'fa fa-times-circle', label: 'Delete permanently', click: () => this.emit('delete-permanently', {key: row.key})})
    }
    await contextMenu.create(Object.assign({x, y, items, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'}, opts))
  }

  // rendering
  // =

  renderRowFavicon (row) {
    return html`<img class="favicon" src="beaker-favicon:32,${row.url}">`
  }

  renderRowTitle (row) {
    return row.title || html`<em>Untitled</em>`
  }

  renderRowOwner (row) {
    return getOwner(row)
  }

  renderPeers (row) {
    return row.peers || '--'
  }

  renderRowLastUpdated (row) {
    // TODO switch to Intl.RelativeTimeFormat when Beaker reaches Chrome 71
    return row.mtime ? timeDifference(row.mtime) : '--'
  }

  renderRowSize (row) {
    return bytes(row.size)
  }

  renderRowButtons (row) {
    return html`
      <div>
        <button class="btn transparent trash-btn" @click=${e => this.emit('move-to-trash', {key: row.key})}><i class="fas fa-trash"></i></button>
        <button class="btn transparent context-btn" @click=${e => this.onClickRowMenu(e, row)}><i class="fa fa-ellipsis-v"></i></button>
        <span class="select-check" @click=${e => this.onSelectRow(e, row)}><i class="fa fa-check-circle"></i></span>
      </div>
    `
  }

  // events
  // =

  emit (evt, detail) {
    this.dispatchEvent(new CustomEvent(evt, {detail}))
  }

  onSelectRow (e, row) {
    e.preventDefault()
    e.stopPropagation()

    this.selectedRows[row.key] = !this.selectedRows[row.key]
    this.requestUpdate()
    this.dispatchEvent(new Event('selection-changed'))
  }

  onClickRowMenu (e, row) {
    e.preventDefault()
    e.stopPropagation()
    
    // position off the clicked element
    var rect = e.currentTarget.getClientRects()[0]
    var x = rect.right + 4
    var y = getTop(e.currentTarget) + e.currentTarget.offsetHeight
    this.showContextMenu(x, y, row, {withTriangle: true, right: true})
  }

  onContextmenuRow (e, row) {
    e.preventDefault()
    this.showContextMenu(e.clientX, e.clientY, row)
  }
}
ArchivesListing.styles = [tableCSS, archivesListingCSS]
customElements.define('library-archives-listing', ArchivesListing)

// helpers
// =

function getOwner (archive) {
  return archive.isOwner ? 'me' : ''
}

// get the offsetTop relative to the document
function getTop (el) {
  let top = 0
  do {
    top += el.offsetTop
  } while ((el = el.offsetParent))
  return top
}

// simple timediff fn till Intl.RelativeTimeFormat lands
// https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time-eg-2-seconds-ago-one-week-ago-etc-best
const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;
const now = Date.now()
function timeDifference (ts) {
  var elapsed = now - ts
  if (elapsed < msPerMinute) {
    let n = Math.round(elapsed/1000)
    return `${n} ${pluralize(n, 'second')} ago`
  } else if (elapsed < msPerHour) {
    let n = Math.round(elapsed/msPerMinute)
    return `${n} ${pluralize(n, 'minute')} ago`
  } else if (elapsed < msPerDay ) {
    let n = Math.round(elapsed/msPerHour )
    return `${n} ${pluralize(n, 'hour')} ago`
  } else if (elapsed < msPerMonth) {
    let n = Math.round(elapsed/msPerDay)
    return `${n} ${pluralize(n, 'day')} ago`
  } else if (elapsed < msPerYear) {
    let n = Math.round(elapsed/msPerMonth)
    return `${n} ${pluralize(n, 'month')} ago`
  } else {
    let n = Math.round(elapsed/msPerYear )
    return `${n} ${pluralize(n, 'year')} ago`
  }
}

const DEBUG_ARCHIVES = [
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "602dc80c3a89461d06e8a67c5ac27ef13085f42a60573a93504fa2b4746f7865",
    "lastAccessTime": 1550075027436,
    "lastLibraryAccessTime": 0,
    "mtime": 1550072612619,
    "peerHistory": [],
    "peers": 0,
    "size": 54,
    "title": "",
    "type": [],
    "url": "dat://602dc80c3a89461d06e8a67c5ac27ef13085f42a60573a93504fa2b4746f7865",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "/Users/paulfrazee/work/beaker-start-app",
      "networked": true,
      "previewMode": true
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "e1c19fad6334e0897e9b95e633c2eee3a13003e097d9347cbfdd184d3a144975",
    "lastAccessTime": 1550153514367,
    "lastLibraryAccessTime": 0,
    "mtime": 1550153515378,
    "peerHistory": [],
    "peers": 0,
    "size": 54,
    "title": "",
    "type": [],
    "url": "dat://e1c19fad6334e0897e9b95e633c2eee3a13003e097d9347cbfdd184d3a144975",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "/Users/paulfrazee/work/beaker-library-app",
      "networked": true,
      "previewMode": true
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "89f93b2ff1a4763cb3e570289bc66df47a539e451ea6a55bdff03c473303df38",
    "lastAccessTime": 1550075037441,
    "lastLibraryAccessTime": 1549141501958,
    "mtime": 1549141505189,
    "peerHistory": [],
    "peers": 0,
    "size": 79,
    "title": "quick test",
    "type": [],
    "url": "dat://89f93b2ff1a4763cb3e570289bc66df47a539e451ea6a55bdff03c473303df38",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": null,
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "0b5e301d34312241b43ea78f60adf4a01397a36a48da96a73d48bc5f0e486b72",
    "lastAccessTime": 1550074997415,
    "lastLibraryAccessTime": 1548881294343,
    "mtime": 1548881299046,
    "peerHistory": [],
    "peers": 0,
    "size": 81,
    "title": "User profile",
    "type": [],
    "url": "dat://0b5e301d34312241b43ea78f60adf4a01397a36a48da96a73d48bc5f0e486b72",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "cad70ca0c4bfa517decb2149e4b3106faa6f5e7d972f2e60f392ce7921e557ae",
    "lastAccessTime": 1550075052457,
    "lastLibraryAccessTime": 1549317506149,
    "mtime": 1549320738137,
    "peerHistory": [],
    "peers": 0,
    "size": 241,
    "title": "My cool project",
    "type": [],
    "url": "dat://cad70ca0c4bfa517decb2149e4b3106faa6f5e7d972f2e60f392ce7921e557ae",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "/Users/paulfrazee/Sites/my-cool-project",
      "networked": true,
      "previewMode": true
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "e769325b85b34d188eddae3d184127ee5e88bd99042f90a21d5fcaf1464e5e26",
    "lastAccessTime": 1550075062466,
    "lastLibraryAccessTime": 0,
    "mtime": 1550010625463,
    "peerHistory": [],
    "peers": 0,
    "size": 265,
    "title": "",
    "type": [],
    "url": "dat://e769325b85b34d188eddae3d184127ee5e88bd99042f90a21d5fcaf1464e5e26",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    },
    "checked": false
  },
  {
    "description": "The description",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "b956bc6aced75ec7b4d7f1c86395dd3c5b74bfe9146d70fe3997cb66d5da0cc0",
    "lastAccessTime": 1550075042443,
    "lastLibraryAccessTime": 0,
    "mtime": 1549409805282,
    "peerHistory": [],
    "peers": 0,
    "size": 5544,
    "title": "Test site",
    "type": [],
    "url": "dat://b956bc6aced75ec7b4d7f1c86395dd3c5b74bfe9146d70fe3997cb66d5da0cc0",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    },
    "checked": false
  },
  {
    "description": "Very cool",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "be3749c9ba0e628278cb78203ab1d3d3fa238a153683c87bdd97069fb2235477",
    "lastAccessTime": 1550075047455,
    "lastLibraryAccessTime": 0,
    "mtime": 1549482834006,
    "peerHistory": [],
    "peers": 0,
    "size": 5553,
    "title": "My test site",
    "type": [],
    "url": "dat://be3749c9ba0e628278cb78203ab1d3d3fa238a153683c87bdd97069fb2235477",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "da93123e1cfe70defa304f33a0de598f0c01e9bb6c1d0457fd2e7d37ee520ab1",
    "lastAccessTime": 1550075057463,
    "lastLibraryAccessTime": 0,
    "mtime": 1549486937805,
    "peerHistory": [],
    "peers": 0,
    "size": 5577,
    "title": "Quick site test",
    "type": [],
    "url": "dat://da93123e1cfe70defa304f33a0de598f0c01e9bb6c1d0457fd2e7d37ee520ab1",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "Uses only markdown!",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "57d04d1dcc583d94bd9a17ce55fd5ebddbf73b44a04c4d7b29c815b14ec12b39",
    "lastAccessTime": 1550075022437,
    "lastLibraryAccessTime": 0,
    "mtime": 1549656250027,
    "peerHistory": [],
    "peers": 0,
    "size": 5720,
    "title": "Quick example site",
    "type": [],
    "url": "dat://57d04d1dcc583d94bd9a17ce55fd5ebddbf73b44a04c4d7b29c815b14ec12b39",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": true
    }
  },
  {
    "description": "It's really the best",
    "isOwner": true,
    "isPublished": true,
    "isSwarmed": true,
    "key": "18ab915acc9ecf92bc85ed6591eb5dd08766b6ba5b0cdcbbb4863d2f8a568a78",
    "lastAccessTime": 1550075002422,
    "lastLibraryAccessTime": 1549557141726,
    "mtime": 1549654848157,
    "peerHistory": [],
    "peers": 0,
    "size": 11125,
    "title": "Paul's heckin cool site!",
    "type": [
      "unwalled.garden/media/article",
      "web-page"
    ],
    "url": "dat://18ab915acc9ecf92bc85ed6591eb5dd08766b6ba5b0cdcbbb4863d2f8a568a78",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": true
    }
  },
  {
    "description": "Testing out the editor",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "02dbae99016bc4f082cdc8b4425bd9a84e094e64838bbbdf867a59d60e3403a2",
    "lastAccessTime": 1550074992416,
    "lastLibraryAccessTime": 0,
    "mtime": 1549664701813,
    "peerHistory": [],
    "peers": 0,
    "size": 11243,
    "title": "Quick markdown site",
    "type": [],
    "url": "dat://02dbae99016bc4f082cdc8b4425bd9a84e094e64838bbbdf867a59d60e3403a2",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "00b50b3764c96fe405e5606a2dfd86e240cc16102d716f126647379a62faedcd",
    "lastAccessTime": 1550074987415,
    "lastLibraryAccessTime": 0,
    "mtime": 1549482396472,
    "peerHistory": [],
    "peers": 0,
    "size": 22484,
    "title": "My test site",
    "type": [],
    "url": "dat://00b50b3764c96fe405e5606a2dfd86e240cc16102d716f126647379a62faedcd",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "219b8f166a6e852cbaa35c1e895e14227b3882890360c0ba5cc4398195c1d95c",
    "lastAccessTime": 1550075007422,
    "lastLibraryAccessTime": 0,
    "mtime": 1549482743317,
    "peerHistory": [],
    "peers": 0,
    "size": 22496,
    "title": "Setup test",
    "type": [],
    "url": "dat://219b8f166a6e852cbaa35c1e895e14227b3882890360c0ba5cc4398195c1d95c",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "4a4530cd83dcb7ac5391eb3ee5e5de420ac23b1e286c2b194116de6d66c15d76",
    "lastAccessTime": 1550075012448,
    "lastLibraryAccessTime": 1549907256348,
    "mtime": 1549907269728,
    "peerHistory": [],
    "peers": 0,
    "size": 316285,
    "title": "",
    "type": [],
    "url": "dat://4a4530cd83dcb7ac5391eb3ee5e5de420ac23b1e286c2b194116de6d66c15d76",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "4e49001c62c9d8f2c8c60b4f6d8585f644d02f0bad2767fafca7d5b4bd9a8dc0",
    "lastAccessTime": 1550075017431,
    "lastLibraryAccessTime": 1550009759148,
    "mtime": 1549911940266,
    "peerHistory": [],
    "peers": 0,
    "size": 371663,
    "title": "Untitled",
    "type": [],
    "url": "dat://4e49001c62c9d8f2c8c60b4f6d8585f644d02f0bad2767fafca7d5b4bd9a8dc0",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": null,
      "networked": true,
      "previewMode": false
    }
  },
  {
    "description": "A cool hackerman",
    "isOwner": true,
    "isPublished": false,
    "isSwarmed": true,
    "key": "60e41f7226f6a8138de980b4add3413b4f93912582cec48cfca1927b51a5e0b1",
    "lastAccessTime": 1550075032453,
    "lastLibraryAccessTime": 1549141223908,
    "mtime": 1549741615131,
    "peerHistory": [],
    "peers": 0,
    "size": 1363414,
    "title": "Paul Frazee",
    "type": [
      "unwalled.garden/user",
      "user"
    ],
    "url": "dat://60e41f7226f6a8138de980b4add3413b4f93912582cec48cfca1927b51a5e0b1",
    "userSettings": {
      "autoDownload": true,
      "autoUpload": true,
      "expiresAt": null,
      "hidden": false,
      "isSaved": true,
      "localSyncPath": "",
      "networked": true,
      "previewMode": false
    }
  }
]