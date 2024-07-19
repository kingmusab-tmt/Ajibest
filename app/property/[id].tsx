"use client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/navigation";
import { Property } from "@/types/propertytypes";
import PropertyDetail from "../components/propertydetails";
import { useSession, signIn } from "next-auth/react";
// import { Session } from "next-auth";

interface PropertyPageProps {
  property: Property;
}

const PropertyPage: React.FC<PropertyPageProps> = ({ property }) => {
  const router = useRouter();
  const session = useSession();

  const addToFavorites = async () => {
    if (session) {
      const res = await fetch("/api/users/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId: property._id }),
      });

      if (res.ok) {
        alert("Property added to favorites!");
      } else {
        alert("Failed to add property to favorites.");
      }
    } else {
      alert("You must be logged in to add favorites.");
    }
  };

  const handleActionClick = () => {
    if (property.listingPurpose === "For Renting") {
      alert("Proceed to rent this property!");
    } else {
      alert("Proceed to buy this property!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PropertyDetail
        property={property}
        onAddToFavorites={addToFavorites}
        onActionClick={handleActionClick}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`/api/property/${id}`);
  const data = await res.json();

  if (!data.success) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      property: data.data,
    },
  };
};

export default PropertyPage;
