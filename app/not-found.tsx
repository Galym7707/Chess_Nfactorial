export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-primary">404</p>
      <h1 className="mt-5 font-display text-4xl font-semibold md:text-6xl">Эта линия не существует</h1>
      <p className="mt-4 text-muted-foreground">Позиция вне доски. Вернитесь на главную или выберите режим игры.</p>
    </section>
  );
}