import { Suspense } from "react";
import PropertiesContent from "./PropertiesContent";
import LoadingSpinner from "../components/generalcomponents/loadingSpinner";

export default function PropertiesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PropertiesContent />
    </Suspense>
  );
}
