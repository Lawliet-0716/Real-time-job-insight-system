import JobDetailView from "../../../components/jobs/JobDetailView";

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  return <JobDetailView id={id} />;
}
