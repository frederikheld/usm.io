window.onload = function () {
    let cards = document.querySelectorAll('.card')
    let modal

    function createModal () {
        let body = document.querySelector('body')

        let modal = document.createElement('div')
        modal.classList.add('modal')
        body.appendChild(modal)

        modal.addEventListener('click', hideModal)

        let modalCard = document.createElement('div')
        modalCard.classList.add('modal-card')
        modal.appendChild(modalCard)

        return modal
    }
    modal = createModal()

    function showModal () {
        hideModal()

        // empty modal card:
        let modalCard = modal.querySelector('.modal-card')
        while (modalCard.firstChild) {
            modalCard.removeChild(modalCard.firstChild)
        }

        // fill modal card:
        let title = this.querySelector('h1')
        if (title) {
            let titleClone = title.cloneNode(true)
            modalCard.appendChild(titleClone)
        }

        let description = this.querySelector('.description')
        if (description) {
            let descriptionClone = description.cloneNode(true)
            modalCard.appendChild(descriptionClone)
        }

        let button = this.querySelector('.open-package')
        if (button) {
            let buttonClone = button.cloneNode(true)
            modalCard.appendChild(buttonClone)
        }

        modalCard.style.backgroundColor = window.getComputedStyle(this).backgroundColor

        // highlight active card:
        this.classList.add('card-is-selected')

        // show modal:
        modal.classList.add('show-modal')
    }

    function hideModal () {
        modal.classList.remove('show-modal')
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.remove('card-is-selected')
        }
    }

    function attachEventListeners (cards) {
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', showModal)
        }
    }
    attachEventListeners(cards)
}
