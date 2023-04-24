let dots = document.querySelectorAll('.hr-scroll__dot')
let sums = document.querySelectorAll('.sum-pick__item')
let inputAmount = document.querySelector('#input_amount')

function selectElems (index) {
    removeSelection()
    dots[index].classList.add('hr-scroll__dot_selected')
    sums[index].classList.add('sum-pick__item_selected')
}
function removeSelection () {
    let selectedDot = document.querySelector('.hr-scroll__dot_selected')
    let selectedSum = document.querySelector('.sum-pick__item_selected')
    
    if (selectedDot) {
        selectedDot.classList.remove('hr-scroll__dot_selected')
        selectedSum.classList.remove('sum-pick__item_selected')
    }
    
}
for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener('click', (event) => {
        selectElems(i)
        inputAmount.value = sums[i].textContent
    })
}

inputAmount.addEventListener('input', () => {
    let hasAmount = false
    for (let i = 0; i < sums.length; i++) {
        if (sums[i].textContent === inputAmount.value ) {
            hasAmount = true
            selectElems(i)
        }
    }
    if (!hasAmount) {
        removeSelection()
    }
})

