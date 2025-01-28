import { useState } from "react"
import { ChatBubbleLeftIcon, DocumentTextIcon, ChartBarIcon } from "@heroicons/react/24/outline"

const sidebarItems = [
  { name: "Chatbot", icon: ChatBubbleLeftIcon },
  { name: "Report", icon: ChartBarIcon },
  { name: "Prescription", icon: DocumentTextIcon },
]

interface SidebarProps {
  onOpenChange: (isOpen: boolean) => void
}

export function Sidebar({ onOpenChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange(open)
  }

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => handleOpenChange(true)}
      onMouseLeave={() => handleOpenChange(false)}
    >
      <div className="p-4">
        <h2 className={`text-xl font-bold mb-4 ${isOpen ? "block" : "hidden"}`}>Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                <item.icon className="h-6 w-6" />
                <span className={isOpen ? "block" : "hidden"}>{item.name}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

