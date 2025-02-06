"use client"
import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { AlertCircle, 
    AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3Icon, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/app/redux';
import { useAppSelector } from '@/app/redux';
import Link from 'next/link';
import { setIsSidebarCollapsed } from '@/state';
import { useGetProjectsQuery } from '@/state/api';



const Sidebar = () => {
    const [showProjects, setShowProjects] = useState(true);
    const [showPriority, setShowPriority] = useState(true);

    
    const { data: projects }  = useGetProjectsQuery();
    const dispatch = useAppDispatch();
const isSidebarCollapsed = useAppSelector(
    (state: { global: { isSidebarCollapsed: boolean } }) => state.global.isSidebarCollapsed,
);

    const sidebarclassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 ease-in-out h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
    `;

  return (
    <div className={sidebarclassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            Convin
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark-border-gray-700">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              John Doe
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex items-center justify-between text-gray-500 px-8 py-3"
        >
          <span>Projects</span>
          {showProjects ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </button>

        {showProjects && (
          <>
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <SidebarLink
                  key={project.id}
                  icon={Briefcase}
                  label={project.name}
                  href={`/projects/${project.id}`}
                />
              ))
            ) : (
              <p className="px-8 py-3 text-gray-500">No projects available</p>
            )}
          </>
        )}

        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex items-center justify-between text-gray-500 px-8 py-3"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3Icon}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

const SidebarLink = ({
    href,
    icon: Icon,
    label,
}: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname === "/" && href === "/dashboard");
    

return (
  <Link href={href} className="w-full">
    <div className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""} 
    justify-start px-8 py-3
    `}>
        {isActive && (
             <div className="absolute left-0 top-0 h-full w-[5px] bg-blue-200" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
            {label}
        </span>
    </div>
  </Link>
)
}


export default Sidebar;