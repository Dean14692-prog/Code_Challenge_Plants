import React, { useEffect, useState } from "react";
import PlantList from "./PlantList";
import NewPlantForm from "./NewPlantForm";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchPlants = async () => {
      try {
        const response = await fetch("http://localhost:6001/plants", {
          signal: abortController.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch plants");
        const data = await response.json();
        if (isMounted) {
          setPlants(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    fetchPlants();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  function handleAddPlant(newPlant) {
    const plantWithId = {
      ...newPlant,
      id: Date.now(),
      name: newPlant.name || "Unnamed Plant",
      price: newPlant.price || "0.00",
    };
    setPlants([...plants, plantWithId]);
  }

  function handleToggleStock(id) {
    setPlants((prev) =>
      prev.map((plant) =>
        plant.id === id ? { ...plant, soldOut: !plant.soldOut } : plant
      )
    );
  }

  const filteredPlants = plants.filter((plant) =>
    plant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading plants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <PlantList plants={filteredPlants} onToggleStock={handleToggleStock} />
    </main>
  );
}

export default PlantPage;
