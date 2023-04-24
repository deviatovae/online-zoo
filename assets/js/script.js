//__________________burger-menu__________________//
let burger = document.querySelector('.burger-menu__icon')
let header = document.querySelector('.header')

if (header) {
    header.addEventListener('click',  (event) => {
        if (event.target === header) {
            header.classList.remove('header_opened')
        } else if (event.target === burger) {
            header.classList.toggle('header_opened')
        }
    })
}

//___________________________pop-up______________________________________//
function initPopup() {
    let popUp = document.querySelector('.pop-up')
    let popUpContent = document.querySelector('.pop-up__content')
    let popUpCross = document.querySelector('.pop-up__close-btn')
    let testimonialItems = document.querySelectorAll('.testimonials-item')

    if (!popUp) {
        return
    }

    for (let item of testimonialItems) {
        console.log(222)
        item.addEventListener('click',  (event) => {
            if (window.innerWidth <= 999) {
                popUp.style.display = 'block'
                popUpContent.innerHTML = event.currentTarget.outerHTML
                setTimeout(() => {
                    popUp.style.opacity = '1'
                }, 1)
            }
        })
    }

    popUp.addEventListener('click',  (event) => {
        if (event.target === popUp || event.target === popUpCross) {
            popUp.style.opacity = '0'
            setTimeout(() => {
                popUp.style.display = 'none'
            }, 200)
        }
    })
}
initPopup()
//___________________________range-scroll______________________________________//
function initRangeScroll() {
    let input = document.querySelector('.testimonials-scroll__bar')
    let container = document.querySelector('.list-testimonials')
    let item = document.querySelector('.testimonials-item')

    if (!container) {
        return
    }

    container.style.left = '0'

    function updateOffset(rangeValue) {
        if (window.innerWidth >= 1000) {
            let width = getComputedStyle(item).width
            let offset = +width.substring(0, width.length - 2) + 30
            container.style.left = rangeValue * -offset + 'px';
        } else {
            container.style.left = '0';
        }
    }

    input.addEventListener('input', function (event) {
        updateOffset(event.target.value)
    })

    window.addEventListener('resize', function () {
        updateOffset(input.value)
    })
}
initRangeScroll()
