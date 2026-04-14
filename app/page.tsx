export default function HomePage() {
  return (
    <>
      <section id="hero" className="min-h-screen bg-[var(--bg-base)]" aria-label="Hero" />
      <section id="arm-quiz" className="bg-[var(--bg-surface)] py-24" aria-label="ARM Routing Quiz" />
      <section id="arm-grid" className="bg-[var(--color-charcoal)] py-24" aria-label="Portfolio" />
      <section id="kraken-method" className="bg-[var(--bg-base)] py-24" aria-label="The Kraken Method" />
      <section id="entity-cards" className="bg-[var(--bg-surface)] py-24" aria-label="Entities" />
      <section id="mission" className="bg-[var(--bg-base)] py-24" aria-label="Mission" />
      <section id="ipa-strip" className="py-16" aria-label="Partner Recruitment" />
      <section id="events" className="bg-[var(--bg-base)] py-16" aria-label="Events" />
      <footer id="footer" className="bg-[var(--bg-footer)] py-16" aria-label="Site footer" />
    </>
  )
}
