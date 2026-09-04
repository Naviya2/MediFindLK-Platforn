// Scrolls back to the hero search field and focuses it. Used by CTAs further
// down the landing page.
export function focusHeroSearch(event) {
  if (event) event.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const input = document.getElementById('medInput')
  if (input) {
    // Wait for the smooth scroll to settle before focusing.
    window.setTimeout(() => input.focus(), 400)
  }
}
