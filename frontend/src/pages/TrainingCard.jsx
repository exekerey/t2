export default function TrainingCard({ training }) {

  const startDate = training.date_start
    ? new Date(training.date_start).toLocaleDateString()
    : "TBD";

  const endDate = training.date_end
    ? new Date(training.date_end).toLocaleDateString()
    : "";

  return (
    <div className="trainingCard">

      <div className="trainingHeader">
        <h3>{training.title}</h3>
        <span className="trainingType">{training.type}</span>
      </div>

      <div className="trainingBody">

        <div className="trainingRow">
          <span className="label">Trainer</span>
          <span>{training.trainer_name || "Unknown"}</span>
        </div>

        <div className="trainingRow">
          <span className="label">Location</span>
          <span>{training.location || "Online"}</span>
        </div>

        <div className="trainingRow">
          <span className="label">Date</span>
          <span>
            {startDate}
            {endDate && ` — ${endDate}`}
          </span>
        </div>

      </div>

      <div className="trainingFooter">
        <button className="primaryBtn">Подробнее</button>
      </div>

    </div>
  );
}