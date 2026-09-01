import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

export default function StubPage({ title, description, icon: Icon, color = 'text-blue-600', bg = 'bg-blue-50' }) {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className={`w-20 h-20 rounded-2xl ${bg} flex items-center justify-center`}>
        {Icon ? <Icon size={36} className={color} /> : <Construction size={36} className="text-gray-400" />}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 max-w-sm">{description || 'This section is coming soon. Stay tuned!'}</p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft size={15} />
        Back to Home
      </Link>
    </main>
  )
}
