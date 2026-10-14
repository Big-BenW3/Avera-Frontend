import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <div>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">This page does not exist.</h1>
        <p className="not-found-body">
          The page you are looking for might have been moved, or it never existed in the first place.
        </p>
        <Link href="/" className="btn btn-primary btn-large">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
    </div>
  );
}
