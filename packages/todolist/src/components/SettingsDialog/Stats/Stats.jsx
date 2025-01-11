import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function parseIsoDate(dateString) {
  const [date, time] = dateString.split(", ");
  const [day, month, year] = date.split("/");
  const isoString = `${year}-${month}-${day}T${time}`;
  return isoString;
}

function Stats({ columns }) {
  const { t, ready } = useTranslation();
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day")); // Renamed state

  if (!ready) return <div>{t("shared.loading")}</div>;

  const labels = [];
  const addedCounts = [];
  const completedCounts = [];

  const endDate = dayjs(); // Defaulting to today as the end date

  columns.forEach((list) => {
    list.tasks.forEach((task) => {
      const addedDate = dayjs(parseIsoDate(task.timestamp));

      if (
        addedDate.isValid() &&
        addedDate.isBetween(
          startDate.startOf("day"),
          endDate.endOf("day"),
          null,
          "[]"
        )
      ) {
        const addedDateString = addedDate.format("YYYY-MM-DD");
        if (!labels.includes(addedDateString)) {
          labels.push(addedDateString);
          addedCounts[labels.indexOf(addedDateString)] = 0;
          completedCounts[labels.indexOf(addedDateString)] = 0;
        }
        addedCounts[labels.indexOf(addedDateString)] += 1;
      }

      if (task.completed && task.completedDate) {
        const completedDate = dayjs(parseIsoDate(task.completedDate));

        if (
          completedDate.isValid() &&
          completedDate.isBetween(
            startDate.startOf("day"),
            endDate.endOf("day"),
            null,
            "[]"
          )
        ) {
          const completedDateString = completedDate.format("YYYY-MM-DD");
          if (!labels.includes(completedDateString)) {
            labels.push(completedDateString);
            addedCounts[labels.indexOf(completedDateString)] = 0;
            completedCounts[labels.indexOf(completedDateString)] = 0;
          }
          completedCounts[labels.indexOf(completedDateString)] += 1;
        }
      }
    });
  });

  const sortedLabels = [...labels].sort();
  const sortedAddedCounts = sortedLabels.map(
    (date) => addedCounts[labels.indexOf(date)] || 0
  );
  const sortedCompletedCounts = sortedLabels.map(
    (date) => completedCounts[labels.indexOf(date)] || 0
  );

  const data = {
    labels: sortedLabels,
    datasets: [
      {
        label: t("settingsDialog.statsChart.datasets.added"),
        data: sortedAddedCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: t("settingsDialog.statsChart.datasets.completed"),
        data: sortedCompletedCounts,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: t("settingsDialog.statsChart.chartTitle"),
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <DatePicker
          label={t("settingsDialog.statsChart.startDateLabel")}
          value={startDate}
          onChange={(newValue) => setStartDate(newValue || dayjs())}
          inputFormat="DD/MM/YYYY"
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Bar data={data} options={options} />
      </Box>
    </>
  );
}

export default Stats;

Stats.propTypes = {
  columns: PropTypes.array,
};
