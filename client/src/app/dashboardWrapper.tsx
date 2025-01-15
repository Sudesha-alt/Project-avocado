import React from 'react'

const dashboardWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        sidebar
        <main className="flex flex-col bg-gray-50 dark:bg-dark-bg">
            navbar
            {children}
        </main>
    </div>
  )
}
export default dashboardWrapper
