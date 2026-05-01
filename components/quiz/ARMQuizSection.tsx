import { ARMQuiz } from './ARMQuiz'

export default function ARMQuizSection() {
  return (
    <section
      id="arm-quiz"
      aria-label="ARM Routing Quiz"
      className="bg-[var(--bg-surface)] py-24 px-6"
    >
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Intro copy — left column */}
        <div className="md:w-[40%] flex flex-col justify-center">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">
            ARM ROUTING QUIZ
          </p>
          <h2 className="mb-4 font-[family-name:var(--font-clash)] font-bold text-[28px] leading-tight text-[var(--color-parchment)]">
            Where does your business stand?
          </h2>
          <p className="text-[13px] leading-[1.7] text-[rgba(245,240,232,0.5)]">
            4 questions. 90 seconds. We route you to the exact ARM that solves your specific
            problem — and show you how the other 9 compound it.
          </p>
        </div>

        {/* Quiz widget — right column */}
        <div className="md:w-[60%]">
          <ARMQuiz />
        </div>
      </div>
    </section>
  )
}
