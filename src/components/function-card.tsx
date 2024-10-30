import Link from 'next/link'

interface FunctionCardProps {
  title: string
  description: string
  href: string
}

export function FunctionCard({ title, description, href }: FunctionCardProps) {
  return (
    <Link href={href} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
} 