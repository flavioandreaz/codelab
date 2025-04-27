import { getCourse } from "@/actions/courses";
import { LessonDetails } from "@/components/pages/courses/course-page/lesson-details";
import { TopDetails } from "@/components/pages/courses/course-page/top-details";
import { notFound } from "next/navigation";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  const { course } = await getCourse(slug);

  if (!course) return notFound();

  // TODO: verificar se o usuário possui o curso
  // TODO: validar se é um modulo existente
  // TODO: validar se é uma aula existente

  return (
    <div className="w-full h-screen overflow-hidden grid grid-cols-[1fr_auto]">
      <div className="w-full h-full overflow-y-auto">
        <TopDetails course={course} />

        <LessonDetails lesson={course.modules[0].lessons[0]} />
      </div>

      {/* ModulesList */}
    </div>
  );
}
