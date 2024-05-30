export default function EditService({ params }: { params: { id: string } }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>Edit Service: {params.id}</div>
        </main>
    );
}