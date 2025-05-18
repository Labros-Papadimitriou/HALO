export default {
    mounted(el: HTMLElement, binding: any) {
      el.__clickOutsideHandler__ = (event: MouseEvent) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el.__clickOutsideHandler__)
    },
    unmounted(el: HTMLElement) {
      document.removeEventListener('click', el.__clickOutsideHandler__)
      delete el.__clickOutsideHandler__
    }
  }
  