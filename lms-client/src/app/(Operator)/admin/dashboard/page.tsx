'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as echarts from 'echarts';
import axiosInstance from '@/lib/axiosInstance'; // Adjust this path based on your project structure

function AdminDashboard() {
    // Refs for ECharts chart containers
    const borrowReturnChartRef = useRef(null);
    const mostBorrowedChartRef = useRef(null);
    const activityPieChartRef = useRef(null);
    const topActiveUsersChartRef = useRef(null); // Ref for Top Active Users Chart

    // State variables to store data fetched from the backend APIs
    const [borrowReturnData, setBorrowReturnData] = useState([]);
    const [overdueCount, setOverdueCount] = useState(null);
    const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
    const [topActiveUsers, setTopActiveUsers] = useState([]); // State for Top Active Users

    // State variables for managing loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for date range filters for the trends chart
    const [startDate, setStartDate] = useState(() => '2025-07-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

    // Memoized function to fetch all dashboard data
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Show loading animation on all chart containers
            [
                borrowReturnChartRef,
                mostBorrowedChartRef,
                activityPieChartRef,
                topActiveUsersChartRef
            ].forEach(ref => {
                if (ref.current) echarts.getInstanceByDom(ref.current)?.showLoading();
            });

            // --- Fetch Data from Backend Endpoints ---
            const trendsResponse = await axiosInstance.get(`/reports/borrowing-returning-trends`, {
                params: { startDate, endDate }
            });
            setBorrowReturnData(trendsResponse.data);

            const overdueResponse = await axiosInstance.get(`/reports/overdue-count`);
            setOverdueCount(overdueResponse.data.overdueCount);

            const mostBorrowedResponse = await axiosInstance.get(`/reports/most-borrowed-books`, {
                params: { limit: 10 }
            });
            setMostBorrowedBooks(mostBorrowedResponse.data);

            const activeUsersResponse = await axiosInstance.get(`/reports/top-active-users`, {
                params: { limit: 10 }
            });
            setTopActiveUsers(activeUsersResponse.data);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError(err.response?.data?.message || err.message || "Failed to load dashboard data. Please try again.");
            setBorrowReturnData([]);
            setOverdueCount(null);
            setMostBorrowedBooks([]);
            setTopActiveUsers([]);
        } finally {
            setLoading(false);
            // Hide loading animation on all chart containers
            [
                borrowReturnChartRef,
                mostBorrowedChartRef,
                activityPieChartRef,
                topActiveUsersChartRef
            ].forEach(ref => {
                if (ref.current) echarts.getInstanceByDom(ref.current)?.hideLoading();
            });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- ECharts Initialization and Rendering Logic for Each Chart ---

    // 1. Borrowing & Returning Trends (Line Chart)
    useEffect(() => {
        let borrowReturnChartInstance = null;
        if (borrowReturnChartRef.current) {
            borrowReturnChartInstance = echarts.init(borrowReturnChartRef.current);

            if (borrowReturnData.length > 0) {
                const dates = borrowReturnData.map(d => d.date);
                const borrowedCounts = borrowReturnData.map(d => d.borrowedCount);
                const returnedCounts = borrowReturnData.map(d => d.returnedCount);

                const option = {
                    title: { text: 'Borrowing & Returning Trends', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['Borrowed', 'Returned'], bottom: 0 },
                    xAxis: {
                        type: 'category',
                        data: dates,
                        axisLabel: { rotate: 45, interval: Math.ceil(dates.length / 15) }
                    },
                    yAxis: { type: 'value', name: 'Count', min: 0 },
                    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                    series: [
                        { name: 'Borrowed', type: 'line', smooth: true, data: borrowedCounts, itemStyle: { color: '#80adbc' } },
                        { name: 'Returned', type: 'line', smooth: true, data: returnedCounts, itemStyle: { color: '#88B04B' } }
                    ]
                };
                borrowReturnChartInstance.setOption(option);
            } else if (!loading && !error) {
                borrowReturnChartInstance.setOption({
                    graphic: { elements: [{ type: 'text', left: 'center', top: 'center', style: { text: 'No data available for this period.', fill: '#888', font: '14px sans-serif' } }] }
                });
            }
        }
        const resizeChart = () => borrowReturnChartInstance?.resize();
        window.addEventListener('resize', resizeChart);
        return () => { window.removeEventListener('resize', resizeChart); borrowReturnChartInstance?.dispose(); };
    }, [borrowReturnData, loading, error]);

    // 2. Most Borrowed Books (Horizontal Bar Chart)
    useEffect(() => {
        let mostBorrowedChartInstance = null;
        if (mostBorrowedChartRef.current) {
            mostBorrowedChartInstance = echarts.init(mostBorrowedChartRef.current);

            if (mostBorrowedBooks.length > 0) {
                const bookTitles = mostBorrowedBooks.map(d => d.bookTitle).reverse();
                const borrowCounts = mostBorrowedBooks.map(d => d.borrowCount).reverse();

                const option = {
                    title: { text: 'Top 10 Most Borrowed Books', left: 'center' },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    xAxis: { type: 'value', name: 'Borrow Count', min: 0 },
                    yAxis: {
                        type: 'category',
                        data: bookTitles,
                        axisLabel: { rotate: 0 }
                    },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    series: [
                        {
                            name: 'Borrowed Count',
                            type: 'bar',
                            data: borrowCounts,
                            itemStyle: { color: '#4CAF50' }
                        }
                    ]
                };
                mostBorrowedChartInstance.setOption(option);
            } else if (!loading && !error) {
                mostBorrowedChartInstance.setOption({
                    graphic: { elements: [{ type: 'text', left: 'center', top: 'center', style: { text: 'No data available for top books.', fill: '#888', font: '14px sans-serif' } }] }
                });
            }
        }
        const resizeChart = () => mostBorrowedChartInstance?.resize();
        window.addEventListener('resize', resizeChart);
        return () => { window.removeEventListener('resize', resizeChart); mostBorrowedChartInstance?.dispose(); };
    }, [mostBorrowedBooks, loading, error]);

    // 3. Borrows, Returns, Overdue (Pie Chart)
    useEffect(() => {
        let activityPieChartInstance = null;
        if (activityPieChartRef.current) {
            activityPieChartInstance = echarts.init(activityPieChartRef.current);

            const totalBorrowed = borrowReturnData.reduce((sum, item) => sum + item.borrowedCount, 0);
            const totalReturned = borrowReturnData.reduce((sum, item) => sum + item.returnedCount, 0);
            const currentOverdue = overdueCount !== null ? overdueCount : 0;

            const pieChartData = [
                { value: totalBorrowed, name: 'Total Borrows' },
                { value: totalReturned, name: 'Total Returns' },
                { value: currentOverdue, name: 'Current Overdue' }
            ];

            const hasData = pieChartData.some(item => item.value > 0);

            if (hasData) {
                const option = {
                    title: { text: 'Borrowing, Returning & Overdue Distribution', left: 'center' },
                    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                    legend: { orient: 'vertical', left: 'left', data: pieChartData.map(d => d.name) },
                    series: [
                        {
                            name: 'Activity',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '60%'],
                            data: pieChartData,
                            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
                            itemStyle: {
                                color: function(params) {
                                    const colorList = ['#6a89cc', '#2ecc71', '#e74c3c'];
                                    return colorList[params.dataIndex];
                                }
                            },
                            label: { formatter: '{b}: {c} ({d}%)' },
                            labelLine: { show: true }
                        }
                    ]
                };
                activityPieChartInstance.setOption(option);
            } else if (!loading && !error) {
                activityPieChartInstance.setOption({
                    graphic: { elements: [{ type: 'text', left: 'center', top: 'center', style: { text: 'No activity data available.', fill: '#888', font: '14px sans-serif' } }] }
                });
            }
        }
        const resizeChart = () => activityPieChartInstance?.resize();
        window.addEventListener('resize', resizeChart);
        return () => { window.removeEventListener('resize', resizeChart); activityPieChartInstance?.dispose(); };
    }, [borrowReturnData, overdueCount, loading, error]);

    // 4. Top 10 Most Active Users (Vertical Bar Chart - with thinner bars)
    useEffect(() => {
        let topActiveUsersChartInstance = null;
        if (topActiveUsersChartRef.current) {
            topActiveUsersChartInstance = echarts.init(topActiveUsersChartRef.current);

            if (topActiveUsers.length > 0) {
                const userNames = topActiveUsers.map(d => d.userName);
                const activityCounts = topActiveUsers.map(d => d.activityCount);

                const option = {
                    title: { text: 'Top 10 Most Active Users', left: 'center' },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    xAxis: {
                        type: 'category',
                        data: userNames,
                        axisLabel: {
                            rotate: 45, // Rotate labels to prevent overlap
                            interval: 0
                        },
                        name: 'User'
                    },
                    yAxis: {
                        type: 'value',
                        name: 'Activity Count',
                        min: 0
                    },
                    grid: { left: '3%', right: '4%', bottom: '20%', containLabel: true },
                    series: [
                        {
                            name: 'Activity Count',
                            type: 'bar',
                            data: activityCounts,
                            barWidth: '25%', // You can adjust this value (e.g., '50%' or a fixed pixel like 20)
                            itemStyle: { color: '#F39C12' }
                        }
                    ]
                };
                topActiveUsersChartInstance.setOption(option);
            } else if (!loading && !error) {
                topActiveUsersChartInstance.setOption({
                    graphic: { elements: [{ type: 'text', left: 'center', top: 'center', style: { text: 'No active user data available.', fill: '#888', font: '14px sans-serif' } }] }
                });
            }
        }

        const resizeChart = () => {
            topActiveUsersChartInstance?.resize();
        };
        window.addEventListener('resize', resizeChart);

        return () => {
            window.removeEventListener('resize', resizeChart);
            topActiveUsersChartInstance?.dispose();
        };
    }, [topActiveUsers, loading, error]);


    return (
        <div className="min-h-screen  w-screen p-5 bg-gray-50 font-sans text-gray-800">
            <h2 className="text-center text-blue-600 mb-8 text-4xl font-semibold">
                Library Admin Dashboard
            </h2>

            {/* Date Range Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8 bg-white p-6 rounded-lg shadow-lg">
                <label htmlFor="startDate" className="font-medium text-gray-700">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <label htmlFor="endDate" className="font-medium text-gray-700">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md text-base cursor-pointer
                               hover:bg-blue-700 transition-all duration-200 ease-in-out
                               disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                    {loading ? 'Loading...' : 'Apply Filter'}
                </button>
            </div>

            {/* Display error messages if any */}
            {error && (
                <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded-md mb-5 text-center">
                    {error}
                </div>
            )}
            {/* Display general loading message */}
            {loading && !error && (
                <div className="bg-blue-100 text-blue-700 border border-blue-400 p-3 rounded-md mb-5 text-center">
                    Loading dashboard data...
                </div>
            )}

            {/* Main Grid for Charts - 2x2 layout on medium screens and above */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Borrowing & Returning Trends Chart Card (Line Chart) */}
                <div className="bg-white rounded-lg shadow-xl p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out hover:-translate-y-1">
                    <div ref={borrowReturnChartRef} className="w-full h-[400px]"></div>
                </div>

                {/* 2. Most Borrowed Books Chart Card (Horizontal Bar Chart) */}
                <div className="bg-white rounded-lg shadow-xl p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out hover:-translate-y-1">
                    <div ref={mostBorrowedChartRef} className="w-full h-[400px]"></div>
                </div>

                {/* 3. Borrows, Returns, Overdue Distribution Chart Card (Pie Chart) */}
                <div className="bg-white rounded-lg shadow-xl p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out hover:-translate-y-1">
                    <div ref={activityPieChartRef} className="w-full h-[400px]"></div>
                </div>

                {/* 4. Top 10 Most Active Users Chart Card (Vertical Bar Chart) */}
                <div className="bg-white rounded-lg shadow-xl p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out hover:-translate-y-1">
                    <div ref={topActiveUsersChartRef} className="w-full h-[400px]"></div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;