import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Zap, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react'
import { priceHistoryData } from '../../../data/kireiData'

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
)

const TABS = [
  { key: '30days',   label: '30 DAYS' },
  { key: '90days',   label: '90 DAYS' },
  { key: '6months',  label: '6 MONTHS' },
]

function StatPill({ label, value, trend }) {
  const TrendIcon = trend === 'down' ? TrendingDown : trend === 'up' ? TrendingUp : Minus
  const color = trend === 'down' ? 'text-green-600' : trend === 'up' ? 'text-red-500' : 'text-gray-400'
  return (
    <div className="flex flex-col items-center gap-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 min-w-[110px]">
      <div className={`flex items-center gap-1 ${color}`}>
        <TrendIcon size={13} />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <span className="text-base font-black text-gray-800">{value}</span>
    </div>
  )
}

export default function PriceHistory({ selectedProduct }) {
  const [activeTab, setActiveTab] = useState('30days')
  const d = priceHistoryData
  const tabData = d[activeTab]

  const currentVsAvg = {
    '30days':  d.thirtyDayAvg,
    '90days':  d.ninetyDayAvg,
    '6months': d.sixMonthAvg,
  }
  const avg = currentVsAvg[activeTab]
  const diff = Math.round(((d.currentPrice - avg) / avg) * 100)
  const isBelow = diff < 0

  const chartData = {
    labels: tabData.labels,
    datasets: [
      {
        label: 'Price (৳)',
        data: tabData.data,
        borderColor: '#D4527A',
        backgroundColor: 'rgba(212,82,122,0.08)',
        borderWidth: 2.5,
        pointRadius: tabData.data.length > 15 ? 0 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#D4527A',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average (৳)',
        data: Array(tabData.data.length).fill(avg),
        borderColor: '#94A3B8',
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E3A8A',
        titleColor: '#BAE6FD',
        bodyColor: '#fff',
        borderColor: '#4F46E5',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: ctx => ` ৳${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#9CA3AF',
          font: { size: 10 },
          maxTicksLimit: 8,
        },
        border: { display: false },
      },
      y: {
        grid: { color: '#F3F4F6', drawBorder: false },
        ticks: {
          color: '#9CA3AF',
          font: { size: 10 },
          callback: v => `৳${v.toLocaleString()}`,
        },
        border: { display: false },
      },
    },
  }

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white text-xs font-bold
              px-3 py-1 rounded-full mb-3 shadow">
              <Zap size={12} className="fill-cyan-300 text-cyan-300" />
              OFFERMATRIX INTELLIGENCE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Price History
            </h2>
            <p className="text-sm text-gray-500 mt-1">{d.product}</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${activeTab === t.key
                    ? 'bg-white text-[#D4527A] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-1">
          <StatPill label="Current Price"   value={`৳${d.currentPrice.toLocaleString()}`}    trend="neutral" />
          <StatPill label={`${activeTab === '30days' ? '30-Day' : activeTab === '90days' ? '90-Day' : '6-Month'} Avg`}
            value={`৳${avg.toLocaleString()}`} trend="neutral" />
          <StatPill label="All-Time High"   value={`৳${d.allTimeHigh.toLocaleString()}`}     trend="up" />
          <StatPill label="All-Time Low"    value={`৳${d.allTimeLow.toLocaleString()}`}      trend="down" />
        </div>

        {/* Insight banner */}
        <div className={`flex items-start gap-3 rounded-xl px-4 py-3 mb-6 border
          ${isBelow
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <Info size={16} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">
            {isBelow
              ? `✅ Current price is ${Math.abs(diff)}% below the ${activeTab === '30days' ? '30-day' : activeTab === '90days' ? '90-day' : '6-month'} average — this is a good time to buy.`
              : `⚠️ Current price is ${diff}% above the ${activeTab === '30days' ? '30-day' : activeTab === '90days' ? '90-day' : '6-month'} average — consider waiting for a drop.`}
          </p>
        </div>

        {/* Chart */}
        <div className="bg-[#FAFAFA] rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-[#D4527A]">
              <span className="w-5 h-0.5 bg-[#D4527A] inline-block rounded" /> Price
            </span>
            <span className="flex items-center gap-1.5 font-medium text-gray-400">
              <span className="w-5 border-t-2 border-dashed border-gray-400 inline-block" /> Average
            </span>
          </div>
          <div style={{ height: 280 }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Bottom context */}
        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <Zap size={11} className="text-[#1E3A8A]" />
          Historical prices sourced and verified by OfferMatrix. Updated daily.
        </p>
      </div>
    </section>
  )
}
