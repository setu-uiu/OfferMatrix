import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Zap, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const TABS = [
  { key: '30days',  label: '30 DAYS'  },
  { key: '90days',  label: '90 DAYS'  },
  { key: '6months', label: '6 MONTHS' },
]

/**
 * Shared OfferMatrix PriceHistory chart.
 *
 * Props:
 *   data: {
 *     product:       string
 *     currentPrice:  number
 *     thirtyDayAvg:  number
 *     ninetyDayAvg:  number
 *     sixMonthAvg:   number
 *     allTimeHigh:   number
 *     allTimeLow:    number
 *     '30days':  { labels: string[], data: number[] }
 *     '90days':  { labels: string[], data: number[] }
 *     '6months': { labels: string[], data: number[] }
 *   }
 *   lineColor: optional hex (default OM pink #F02D7D)
 */

function StatPill({ label, value, trend }) {
  const Icon  = trend === 'down' ? TrendingDown : trend === 'up' ? TrendingUp : Minus
  const color = trend === 'down' ? 'text-green-600' : trend === 'up' ? 'text-red-500' : 'text-gray-400'
  return (
    <div className="flex flex-col items-center gap-1 bg-white rounded-xl px-4 py-3
      shadow-sm border border-gray-100 min-w-[110px]">
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon size={12} />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <span className="text-base font-black text-gray-800">{value}</span>
    </div>
  )
}

export default function PriceHistory({ data, lineColor = '#F02D7D' }) {
  const [activeTab, setActiveTab] = useState('30days')
  if (!data) return null

  const tabData = data[activeTab]
  const avgMap  = {
    '30days':  data.thirtyDayAvg,
    '90days':  data.ninetyDayAvg,
    '6months': data.sixMonthAvg,
  }
  const avg    = avgMap[activeTab]
  const diff   = Math.round(((data.currentPrice - avg) / avg) * 100)
  const isBelow = diff < 0
  const tabLabel = activeTab === '30days' ? '30-day' : activeTab === '90days' ? '90-day' : '6-month'

  const chartData = {
    labels: tabData.labels,
    datasets: [
      {
        label: 'Price (৳)',
        data: tabData.data,
        borderColor: lineColor,
        backgroundColor: lineColor + '12',
        borderWidth: 2.5,
        pointRadius: tabData.data.length > 15 ? 0 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: lineColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average (৳)',
        data: Array(tabData.data.length).fill(avg),
        borderColor: '#CBD5E1',
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
        backgroundColor: '#1A1A2E',
        titleColor: '#E2E8F0',
        bodyColor: '#fff',
        borderColor: lineColor,
        borderWidth: 1,
        padding: 10,
        callbacks: { label: ctx => ` ৳${ctx.parsed.y.toLocaleString()}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF', font: { size: 10 }, maxTicksLimit: 8 },
        border: { display: false },
      },
      y: {
        grid: { color: '#F3F4F6' },
        ticks: { color: '#9CA3AF', font: { size: 10 }, callback: v => `৳${v.toLocaleString()}` },
        border: { display: false },
      },
    },
  }

  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold
              px-3 py-1.5 rounded-full mb-3 shadow">
              <Zap size={11} className="text-[#F02D7D] fill-[#F02D7D]" />
              OFFERMATRIX INTELLIGENCE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Price History</h2>
            <p className="text-sm text-gray-500 mt-1">{data.product}</p>
          </div>
          {/* Tab switcher */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${activeTab === t.key
                    ? 'bg-[#1A1A2E] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-1">
          <StatPill label="Current Price"  value={`৳${data.currentPrice.toLocaleString()}`} trend="neutral" />
          <StatPill label={`${tabLabel} Avg`} value={`৳${avg.toLocaleString()}`}            trend="neutral" />
          <StatPill label="All-Time High"  value={`৳${data.allTimeHigh.toLocaleString()}`}  trend="up" />
          <StatPill label="All-Time Low"   value={`৳${data.allTimeLow.toLocaleString()}`}   trend="down" />
        </div>

        {/* Insight */}
        <div className={`flex items-start gap-3 rounded-xl px-4 py-3 mb-6 border
          ${isBelow ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <Info size={15} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">
            {isBelow
              ? `✅ Current price is ${Math.abs(diff)}% below the ${tabLabel} average — good time to buy.`
              : `⚠️ Current price is ${diff}% above the ${tabLabel} average — consider waiting for a drop.`}
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: lineColor }}>
              <span className="w-5 h-0.5 rounded inline-block" style={{ backgroundColor: lineColor }} />
              Price
            </span>
            <span className="flex items-center gap-1.5 font-medium text-gray-400">
              <span className="w-5 border-t-2 border-dashed border-gray-300 inline-block" />
              Average
            </span>
          </div>
          <div style={{ height: 'clamp(180px, 40vw, 260px)' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <Zap size={10} className="text-[#1A1A2E]" />
          Historical prices sourced and verified by OfferMatrix. Updated daily.
        </p>
      </div>
    </section>
  )
}
