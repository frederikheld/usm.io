window.onload = function () {
    const cards = document.querySelectorAll('.card')

    function createModal () {
        const body = document.querySelector('body')

        const modal = document.createElement('div')
        modal.classList.add('modal')
        body.appendChild(modal)

        modal.addEventListener('click', hideModal)

        const modalCard = document.createElement('div')
        modalCard.classList.add('modal-card')
        modal.appendChild(modalCard)

        return modal
    }
    const modal = createModal()

    function showModal () {
        hideModal()

        // empty modal card:
        const modalCard = modal.querySelector('.modal-card')
        while (modalCard.firstChild) {
            modalCard.removeChild(modalCard.firstChild)
        }

        // fill modal card:
        const title = this.querySelector('h1')
        if (title) {
            const titleClone = title.cloneNode(true)
            modalCard.appendChild(titleClone)
        }

        const description = this.querySelector('.description')
        if (description) {
            const descriptionClone = description.cloneNode(true)
            modalCard.appendChild(descriptionClone)
        }

        const button = this.querySelector('.open-package')
        if (button) {
            const buttonClone = button.cloneNode(true)
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
