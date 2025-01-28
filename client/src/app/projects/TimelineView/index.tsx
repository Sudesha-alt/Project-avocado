import { useAppSelector } from '@/app/redux';
import { useGetTasksQuery } from '@/state/api';
import React, { useMemo, useState } from 'react';
import { DisplayOption, ViewMode } from 'gantt-task-react';

type Props = {
    id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const {
            data: tasks,
            error,
            isLoading
        } = useGetTasksQuery({ projectId: Number(id) });

     const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: 'en-US'
     });

      const ganttTask = useMemo(() => {
        return (
            tasks?.map((task) => ({
             start: new Date(task.startDate as string),
             end: new Date(task.dueDate as string),
                name: task.title,
                id: `Task-${task.id}`,
                type: "task" as "TaskType",
                progress: task.points ? (task.points / 10) * 100 : 0,
                isDisabled: false
            })) || []
        )
    }, [tasks]);

    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode
        }));
    };

    if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 xl:px-6">
        
    </div>
  )
}

export default Timeline;