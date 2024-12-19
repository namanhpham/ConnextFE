'use client'
import { Card, Row, Col } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { getTotalOnlineUsers, getTotalUserPerMonth, getTotalUsers } from '@/app/api/admin/adminApiService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Number of user per month in 2024',
      font: {
        size: 16
      }
    }
  }
};

interface DashboardStats {
  onlineUsers: number;
  totalUsers: number;
  usersPerMonth: number[];
}

interface MonthlyData {
  month: string;
  count: string;
  year: string;
}

const transformedUserPerMonthData = (data: MonthlyData[]) => {
  const usersPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < data.length; i++) {
    const month = Number.parseInt(data[i].month) - 1
    usersPerMonth[month] = Number.parseInt(data[i].count);
  }
  return usersPerMonth
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>  ({
    onlineUsers: 0,
    totalUsers: 0,
    usersPerMonth: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [onlineUsers, totalUsers, monthlyData] = await Promise.all([
        getTotalOnlineUsers(),
        getTotalUsers(),
        getTotalUserPerMonth(),
      ]);

      setStats({
        onlineUsers,
        totalUsers,
        usersPerMonth: transformedUserPerMonthData(monthlyData),
      });
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Users',
        data: stats.usersPerMonth,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <h3 className='text-xl'>Online Users</h3>
            <p className='text-xl'>{stats.onlineUsers}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <h3 className='text-xl'>Total Users</h3>
            <p className='text-xl'>{stats.totalUsers}</p>
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Line options={options} data={chartData} />
      </Card>
    </div>
  );
};

export default DashboardPage;
