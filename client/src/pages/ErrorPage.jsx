import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  let title = 'Oops!';
  let message = 'Sorry, this page does not exist.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data || error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{message}</p>
      <Link
        to="/"
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm transition-transform duration-150 hover:scale-105 hover:shadow-sm"
      >
        Go Home
      </Link>
    </div>
  );
}

export default ErrorPage;
