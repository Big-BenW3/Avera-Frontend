import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <div>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Route not found</h1>
        <p className="not-found-body">
          {`// This path doesn't resolve to a known resource.`}
          <br />
          {`// Check the URL or navigate back to your workspace.`}
        </p>
        <Link href="/" className="btn btn-primary btn-large">
          <ArrowLeft size={14} /> Back to workspace
        </Link>
      </div>
    </div>
  );
}
