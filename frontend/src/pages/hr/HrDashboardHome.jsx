export default function HrDashboardHome() {
  return (
    <>
      <div className="stats">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="card statCard" />
        ))}
      </div>

      <div className="grid2">
        <section>
          <div className="sectionHeader">
            <h2>Последние заявки</h2>
            <button className="linkBtn">Все заявки</button>
          </div>
          <div className="card bigCard" />
        </section>

        <section>
          <div className="sectionHeader">
            <h2>Активность</h2>
          </div>
          <div className="card bigCard2" />
        </section>
      </div>

      <section className="contracts">
        <div className="sectionHeader">
          <h2>Договоры - освоение бюджета</h2>
          <button className="linkBtn">Все договоры</button>
        </div>

        <div className="grid2Bottom">
          <div className="card midCard2" />
        </div>
      </section>
    </>
  );
}