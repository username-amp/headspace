import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: {
        type: string;
        count: number;
    }[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
    // Aggregate data by type
    const aggregatedData = data.reduce(
        (acc, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + curr.count;
            return acc;
        },
        {} as Record<string, number>,
    );

    const chartData = {
        labels: Object.keys(aggregatedData),
        datasets: [
            {
                label: 'Activity Count',
                data: Object.values(aggregatedData),
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};
