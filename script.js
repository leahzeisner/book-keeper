// DOM Elements
const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteNameEl = document.getElementById('website-name')
const websiteUrlEl = document.getElementById('website-url')
const bookmarksContainer = document.getElementById('bookmarks-container')

let bookmarks = {}



// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal')
    websiteNameEl.focus()
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = ''

    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id]

        // Item
        const item = document.createElement('div')
        item.classList.add('item')

        // Close Icon
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('title', 'Delete Bookmark')
        closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`)

        // Favicon / Link Container
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')

        // Favicon
        const favicon = document.createElement('img')
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt', 'Favicon')

        // Link
        const link = document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', '_blank')
        link.textContent = name

        // Append to Bookmarks Container
        linkInfo.append(favicon, link)
        item.append(closeIcon, linkInfo)
        bookmarksContainer.appendChild(item)
    })
}

// Fetch Bookmarks from localstorage if available
function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    } else {
        bookmarks = {}
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    buildBookmarks()
}

// Delete a Bookmark
function deleteBookmark(id) {
    if (bookmarks[id]) {
        delete bookmarks[id]
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault()
    const nameValue = websiteNameEl.value
    let urlValue = websiteUrlEl.value

    if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
        urlValue = `https://${urlValue}`
    }

    if (!validate(nameValue, urlValue)) {
        return false
    }

    const bookmark = {
        name: nameValue,
        url: urlValue
    }
    bookmarks[urlValue] = bookmark
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset()
    websiteNameEl.focus()
}

// Validate Form
function validate(name, url) {
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression)

    if (!url.match(regex)) {
        alert('Please provide a valid web address!')
        return false
    }
    return true
}



// Event Listeners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'))
window.addEventListener('click', (e) => {
    // close modal by clicking anywhere outside the modal 
    e.target === modal ?  modal.classList.remove('show-modal') : false
})
bookmarkForm.addEventListener('submit', storeBookmark)



// On Load
fetchBookmarks()