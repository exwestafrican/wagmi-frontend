export default function AuthSuccess({ message }: { message: string }) {
	return (
		<div className="flex flex-row min-h-screen justify-center items-center">
			{message}
		</div>
	)
}
