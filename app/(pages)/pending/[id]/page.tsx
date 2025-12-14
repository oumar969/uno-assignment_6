import Pending from "@/app/components/Pending";

export default async function PendingPage({ params }: { params: { id: string } }) {
    const {id} = await params

  return <Pending gameId={id}></Pending>
}
