// get css styles
function getStyle(elem) {
    return getComputedStyle(elem)
}

function getSliderOffset(container) {
    let items = container.children
    if (!items.length) {
        return 0
    }

    let item = items[0]
    let itemWidth = parseInt(getStyle(item).width)
    let visibleCount = Math.trunc(container.clientWidth / itemWidth)
    let gap = Math.trunc((container.scrollWidth - items.length * itemWidth) / (items.length - 1))

    return (itemWidth + gap) * visibleCount
}

function shuffleSlides(container) {
    for (let i = container.children.length; i >= 0; i--) {
        container.appendChild(container.children[Math.random() * i | 0]);
    }
}

function wrapElements(elements, appendTo, containerClass, clone) {
    let wrapper = document.createElement('div')
    wrapper.classList.add(containerClass)
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        if (clone) {
            element = element.cloneNode(true)
        }

        wrapper.append(element)
    }
    appendTo.append(wrapper)

    return wrapper
}

function copyToStart(source, destination) {
    destination.prepend(source.cloneNode(true))
}

function copyToEnd(source, destination) {
    destination.append(source.cloneNode(true))
}

function getPagesCount(container) {
    return Math.ceil(container.scrollWidth / getSliderOffset(container))
}

let isShifting = false

function setOffset(container, offset, page, useAnimation) {
    if (useAnimation) {
        isShifting = true
    }

    for (let row of container.children) {
        if (useAnimation) {
            row.classList.add('favorite-carousel__row_transition')
        }
        row.style.left = `${-offset * page}px`
    }
}

function getSlides(slides, count, except = [], shuffle = false) {
    let shuffled = shuffle ? slides.sort(() => Math.random() - 0.5) : slides
    let result = []

    for (let slide of shuffled) {
        if (result.length === count) {
            return result
        }
        if (except.includes(slide)) {
            continue
        }
        result.push(slide)
    }

    if (result.length < count) {
        result = result.concat(getSlides(slides, count - result.length))
    }

    return result
}


function init(container, row, count) {
    let slider = document.querySelector('.favorite-carousel__slider')
    slider.innerHTML = ''
    let slides = Array.from(container.querySelectorAll(':scope > *'))
    let slidesPerRow = Math.ceil(slides.length / row)
    let usedInRow = []

    // split items by rows and groups
    for (let i = 0, j = 0; i < row; i++, j += slidesPerRow) {
        let slidesRow = getSlides(slides, count * 2, usedInRow)
        usedInRow = usedInRow.concat(slidesRow.slice(0, 3))
        let row = wrapElements(slidesRow, slider, 'favorite-carousel__row', true)

        let rowItems = Array.from(row.querySelectorAll(':scope > *'))
        for (let k = 0; k < rowItems.length; k += count) {
            let slidesGroup = rowItems.slice(k, k + count)
            wrapElements(slidesGroup, row, 'favorite-carousel__group')
        }

        let first = row.querySelector(':scope > *:first-child')
        let last = row.querySelector(':scope > *:last-child')

        copyToEnd(first, row)
        copyToStart(last, row)
    }

    let leftArrow = document.querySelector('.favorite-carousel__arrow_left')
    let rightArrow = document.querySelector('.favorite-carousel__arrow_right')
    let rows = document.querySelectorAll('.favorite-carousel__row')
    let currentPage = 1
    let lastPage = getPagesCount(rows[0]) - 1

    for (let i = 0; i < rows.length; i++) {
        rows[i].ontransitionend = (event) => {
            event.target.classList.remove('favorite-carousel__row_transition')

            if (i === 0) {
                if (currentPage === 0) {
                    currentPage = lastPage - 1
                    updateOffset()
                } else if (currentPage === lastPage) {
                    currentPage = 1
                    updateOffset()
                }
                isShifting = false
            }
        }
    }

    function randomizeGroups(groups) {
        let usedInRow = []
        for (let group of groups) {
            let chosenSlides = getSlides(slides, count, usedInRow, true)
            usedInRow = usedInRow.concat(chosenSlides)
            group.innerHTML = ''
            for (let chosenSlide of chosenSlides) {
                group.append(chosenSlide.cloneNode(true))
            }
        }
    }

    function updateOffset(useAnimation) {
        setOffset(slider, getSliderOffset(rows[0]), currentPage, useAnimation)
    }

    updateOffset()

    leftArrow.onclick = () => {
        if (isShifting) {
            return
        }

        let groups = document.querySelectorAll(`.favorite-carousel__group:nth-child(${currentPage})`)
        randomizeGroups(groups)
        if (currentPage === 1) {
            let endGroups = document.querySelectorAll(`.favorite-carousel__group:nth-child(${lastPage})`)
            for (let i = 0; i < groups.length; i++) {
                endGroups[i].innerHTML = groups[i].innerHTML
            }
        }
        currentPage--
        updateOffset(true)
    }

    rightArrow.onclick = () => {
        if (isShifting) {
            return
        }

        let groups = document.querySelectorAll(`.favorite-carousel__group:nth-child(${currentPage+2})`)
        randomizeGroups(groups)
        if (currentPage+1 === lastPage) {
            let firstGroups = document.querySelectorAll(`.favorite-carousel__group:nth-child(2)`)
            for (let i = 0; i < groups.length; i++) {
                firstGroups[i].innerHTML = groups[i].innerHTML
            }
        }
        currentPage++
        updateOffset(true)
    }
}

// init
let container = document.querySelector('.favorite-carousel__items')
shuffleSlides(container)
init(
    container,
    window.innerWidth < 640 ? 4 : 2,
    window.innerWidth >= 1000 ? 3 : window.innerWidth < 640 ? 1 : 2
)

// reinitialization
let blocked = false
window.addEventListener('resize', () => {
    if (!blocked) {
        blocked = true
        setTimeout(() => {
            init(
                container,
                window.innerWidth < 640 ? 4 : 2,
                window.innerWidth >= 1000 ? 3 : window.innerWidth < 640 ? 1 : 2
            )
            blocked = false
        }, 100)
    }
})