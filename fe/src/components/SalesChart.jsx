import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
const chartData = {
  labels: chartLabels,
  datasets: [
    {
      label: 'Food',
      data: [18000, 27000, 42000, 82000, 97000, 48000, 18000, 43000, 48000, 19000],
      backgroundColor: '#4E73DF',
      borderRadius: 4,
      barThickness: 12,
    },
    {
      label: 'Beverage',
      data: [145000, 95000, 245000, 148000, 195000, 147000, 98000, 142000, 250000, 146000],
      backgroundColor: '#858796',
      borderRadius: 4,
      barThickness: 12,
    },
    {
      label: 'Dessert',
      data: [12000, 14000, 11000, 15000, 13000, 16000, 12000, 14000, 11000, 15000].map(() => Math.floor(Math.random() * 20000)),
      backgroundColor: '#DDDFEB',
      borderRadius: 4,
      barThickness: 12,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
      }
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
        }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value >= 1000 ? (value / 1000) + 'k' : value;
        },
        font: {
          family: "'Inter', sans-serif",
        }
      },
      border: {
        dash: [4, 4],
      }
    },
  },
};

const MainChart = () => {
  return (
    <Card className="shadow-sm border-0 mt-4">
      <Card.Body className="p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <Card.Title as="h4" className="fw-bold mb-2 mb-md-0">Total Omzet</Card.Title>
            <div className="d-flex flex-wrap gap-2">
                <Form.Control type="date" placeholder="Start date" style={{width: '150px'}}/>
                <Form.Control type="date" placeholder="Finish date" style={{width: '150px'}}/>
                <Form.Select style={{width: '180px'}}>
                    <option>Pilih Kategori</option>
                    <option value="1">Food</option>
                    <option value="2">Beverage</option>
                    <option value="3">Dessert</option>
                </Form.Select>
            </div>
        </div>
        <div style={{ height: '350px' }}>
          <Bar options={chartOptions} data={chartData} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default MainChart;