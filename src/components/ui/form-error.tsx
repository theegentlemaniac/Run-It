export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <p role="alert" className="rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}
