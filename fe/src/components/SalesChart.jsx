import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import api from '../api';
import moment from 'moment';
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
  const dateNow = moment().format('YYYY-MM-DD');
  const last7day = moment().subtract(6, "days").format("YYYY-MM-DD");
  // console.log('date now', last7day);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(last7day);
  const [endDate, setEndDate] = useState(dateNow);

  useEffect(() => {
    fetchChartData();
  }, [endDate]);

  const fetchChartData = async () => {
    const data = {
     'startDate' : startDate,
      'endDate' : endDate
    }
    try {
      const response = await api.post('/admin/statistics-summary/daily-chart', data);
      const data_res = response.data.data;
      const result_foods = data_res.results.filter((value) => value.label == 'foods');
      const result_beverages = data_res.results.filter((value) => value.label == 'beverages');
      const result_desserts = data_res.results.filter((value) => value.label == 'desserts');
      setChartData({
        labels: data_res.dates || [],
        datasets: [
          {
            label: 'Foods',
            data: result_foods[0]?.data || [],
            backgroundColor: '#0E43AF',
            borderRadius: 4,
            barThickness: 12,
          },
          {
            label: 'Beverages',
            data: result_beverages[0]?.data || [],
            backgroundColor: '#3572EF',
            borderRadius: 4,
            barThickness: 12,
          },
          {
            label: 'Desserts',
            data: result_desserts[0]?.data || [],
            backgroundColor: '#C2D4FA',
            borderRadius: 4,
            barThickness: 12,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-0 mt-4">
        <Card.Body className="p-4 text-center">
          <div>Loading...</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 mt-4">
      <Card.Body className="p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <Card.Title as="h5" className="fw-bold mb-2 mb-md-0">Total Omzet</Card.Title>
            <div className="d-flex flex-wrap gap-2">
                <Form.Control 
                  type="date" 
                  placeholder="Start date" 
                  style={{width: '240px'}}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Form.Control 
                  type="date" 
                  placeholder="Finish date" 
                  style={{width: '240px'}}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                {/* <Form.Select style={{width: '180px'}}>
                    <option>Pilih Kategori</option>
                    <option value="1">Food</option>
                    <option value="2">Beverage</option>
                    <option value="3">Dessert</option>
                </Form.Select> */}
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