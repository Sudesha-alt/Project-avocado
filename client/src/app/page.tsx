import Image from "next/image";
import Project from "@/app/projects/[id]/page";


export default function Home() {
  return (
    <div>
      <Project params={{id: "1"}} />
    </div>
  );
}
