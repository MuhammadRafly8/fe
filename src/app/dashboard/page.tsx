'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ChartData
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // Sample data for charts
  const barChartData: ChartData<'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Completed',
        data: [12, 8, 15, 25, 12, 20, 10],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Pending',
        data: [8, 12, 5, 18, 25, 15, 22],
        backgroundColor: 'rgba(251, 191, 136, 0.8)',
      }
    ],
  };
  
  const lineChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Task Progress',
        data: [30, 20, 25, 40, 50, 35, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar and Header */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-md fixed">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center w-full">
              <Image 
                src="/aislogo.png" 
                alt="AIS Logo" 
                width={120} 
                height={120} 
                className="flex-shrink-0"
              />

            </div>
          </div>
          
          <nav className="mt-6">
            <Link href="/dashboard" className="flex items-center px-4 py-3 bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Dashboard
            </Link>
            
            <Link href="/projects" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Projects
            </Link>
            
            <Link href="/tasks" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Task
              <span className="ml-auto bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs">3</span>
            </Link>
            
            <Link href="/users" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Users
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 w-full">
          {/* Content */}
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">Your teams progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Task Status Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-medium">Task Status</h3>
                  <button className="text-sm text-gray-500">Show more details</button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-orange-50 p-3 rounded-md text-center">
                    <div className="text-xl font-semibold">12</div>
                    <div className="text-sm text-gray-600">To do</div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md text-center">
                    <div className="text-xl font-semibold">23</div>
                    <div className="text-sm text-gray-600">In progress</div>
                  </div>
                  
                  <div className="bg-indigo-50 p-3 rounded-md text-center">
                    <div className="text-xl font-semibold">64</div>
                    <div className="text-sm text-gray-600">Done</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Last 7 days</div>
                  <button className="text-sm text-blue-500 font-medium">PROGRESS REPORT</button>
                </div>
              </div>
              
              {/* Upcoming Tasks Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">40</div>
                      <div className="text-sm text-gray-600">Upcoming Task</div>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm font-medium">
                    ↑ 42.5%
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                  <div>Completed Task: <span className="font-medium">30</span></div>
                  <div>On Progress: <span className="font-medium">20</span></div>
                </div>
                
                <div className="h-48">
                  <Bar data={barChartData} options={chartOptions} height={200} />
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">Last 7 days</div>
                  <button className="text-sm text-blue-500 font-medium">LEADS REPORT</button>
                </div>
              </div>
              
              {/* Weekly Tasks Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold">30</div>
                    <div className="text-sm text-gray-600">Task this week</div>
                  </div>
                  <div className="text-green-500 text-sm font-medium">
                    12% ↑
                  </div>
                </div>
                
                <div className="h-48">
                  <Line data={lineChartData} options={chartOptions} height={200} />
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">Last 7 days</div>
                  <button className="text-sm text-blue-500 font-medium">USERS REPORT</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}