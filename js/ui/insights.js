export function createInsightsCarousel(insights) {
  const slide = document.querySelector('#insightSlide');
  const dots = document.querySelector('#insightDots');
  let activeIndex = 0;

  function render() {
    const insight = insights[activeIndex];
    slide.innerHTML = `
      <div><p class="insight-question"><span>Q${activeIndex + 1}.</span> ${insight.question}</p><p class="insight-answer">${insight.answer}</p></div>
      <blockquote class="insight-quote">${insight.quote}</blockquote>
    `;
    dots.innerHTML = insights.map((_, index) => `
      <button class="insight-dot ${index === activeIndex ? 'active' : ''}" data-insight="${index}" aria-label="Show insight ${index + 1}"></button>
    `).join('');
  }

  function change(direction) {
    activeIndex = (activeIndex + direction + insights.length) % insights.length;
    render();
  }

  document.querySelector('#previousInsight').addEventListener('click', () => change(-1));
  document.querySelector('#nextInsight').addEventListener('click', () => change(1));
  dots.addEventListener('click', (event) => {
    const dot = event.target.closest('[data-insight]');
    if (!dot) return;
    activeIndex = Number(dot.dataset.insight);
    render();
  });

  render();
  return { change };
}
