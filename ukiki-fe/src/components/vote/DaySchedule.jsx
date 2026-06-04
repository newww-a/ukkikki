
const DaySchedule = ({ daySchedule, formatDateTime }) => {
  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-2xl font-bold">
        {daySchedule.dayNumber}일차 일정
      </h3>
      <div className="space-y-4">
        {daySchedule.schedules.map((schedule, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-50">
            <h4 className="mb-1 text-xl font-semibold">
              {schedule.scheduleName}
            </h4>
            <p className="text-sm text-gray-600">
              시작: {formatDateTime(schedule.startTime)}
            </p>
            <p className="text-sm text-gray-600">
              종료: {formatDateTime(schedule.endTime)}
            </p>
            {schedule.imageUrl && (
              <img
                src={schedule.imageUrl}
                alt={schedule.scheduleName}
                className="object-cover w-full h-40 mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaySchedule;
