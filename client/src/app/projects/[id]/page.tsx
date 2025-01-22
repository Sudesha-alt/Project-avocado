import React from 'react'

type Props = {
    params: { id: string };
}

const Project = ({params}: Props) => {
  
  const { id } = params
  
    return (
    <div>page</div>
  )
}

export default Project;